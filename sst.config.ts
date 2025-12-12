/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: "zifiv",
			removal: input?.stage === "production" ? "retain" : "remove",
			protect: ["production"].includes(input?.stage),
			home: "aws",
		};
	},
	async run() {
		// DynamoDB Table for Short Form Contents
		const contentsTable = new sst.aws.Dynamo("ContentsTable", {
			fields: {
				contentId: "string",
				createdAt: "string",
				authorId: "string",
				status: "string",
			},
			primaryIndex: { hashKey: "contentId" },
			globalIndexes: {
				AuthorIndex: {
					hashKey: "authorId",
					rangeKey: "createdAt",
					projection: "all",
				},
				StatusIndex: {
					hashKey: "status",
					rangeKey: "createdAt",
					projection: "all",
				},
			},
		});

		const contentsBucket = new aws.s3.BucketV2("ContentsBucket", {
			forceDestroy: true,
		});

		new aws.s3.BucketPublicAccessBlock("MyAssetsBlock", {
			bucket: contentsBucket.bucket,
			blockPublicAcls: true,
			blockPublicPolicy: true,
			ignorePublicAcls: true,
			restrictPublicBuckets: true,
		});

		// 0. Create a specific provider for us-east-1 (Required for CloudFront Certs)
		const usEast1 = new aws.Provider("us-east-1", {
			region: "us-east-1",
		});

		// 1. Look up the Route 53 Hosted Zone
		const hostedZone = await aws.route53.getZone({
			name: process.env.ROOT_DOMAIN,
		});

		// 2. Create SSL Certificate in us-east-1
		const certificate = new aws.acm.Certificate(
			"MyCertificate",
			{
				domainName: process.env.CONTENTS_DOMAIN ?? "",
				validationMethod: "DNS",
			},
			{ provider: usEast1 },
		);

		// 3. Create DNS Record for Certificate Validation
		const validationRecord = new aws.route53.Record("ValidationRecord", {
			name: certificate.domainValidationOptions[0].resourceRecordName,
			records: [certificate.domainValidationOptions[0].resourceRecordValue],
			ttl: 60,
			type: certificate.domainValidationOptions[0].resourceRecordType,
			zoneId: hostedZone.id,
		});

		// 4. Wait for Certificate Validation
		const certificateValidation = new aws.acm.CertificateValidation(
			"CertificateValidation",
			{
				certificateArn: certificate.arn,
				validationRecordFqdns: [validationRecord.fqdn],
			},
			{ provider: usEast1 },
		);

		const oac = new aws.cloudfront.OriginAccessControl("CdnOAC", {
			name: "CDN OAC",
			description: "CDN OAC for Contents Bucket",
			originAccessControlOriginType: "s3",
			signingBehavior: "always",
			signingProtocol: "sigv4",
		});

		const distribution = new aws.cloudfront.Distribution("ContentsCdn", {
			enabled: true,
			isIpv6Enabled: true,
			aliases: [process.env.CONTENTS_DOMAIN ?? ""],
			origins: [
				{
					domainName: contentsBucket.bucketDomainName,
					originId: "S3-ContentsBucket",
					originAccessControlId: oac.id,
				},
			],
			defaultCacheBehavior: {
				targetOriginId: "S3-ContentsBucket",
				viewerProtocolPolicy: "redirect-to-https",
				allowedMethods: ["GET", "HEAD", "OPTIONS"],
				cachedMethods: ["GET", "HEAD"],
				forwardedValues: {
					queryString: false,
					cookies: {
						forward: "none",
					},
					headers: [],
				},
			},
			restrictions: {
				geoRestriction: { restrictionType: "none" },
			},
			viewerCertificate: {
				// Use the validated certificate ARN
				acmCertificateArn: certificateValidation.certificateArn,
				sslSupportMethod: "sni-only",
				minimumProtocolVersion: "TLSv1.2_2021",
			},
		});

		// 5. Update S3 Bucket Policy to allow CloudFront
		new aws.s3.BucketPolicy("MyBucketPolicy", {
			bucket: contentsBucket.bucket,
			policy: $util
				.all([contentsBucket.arn, distribution.arn])
				.apply(([bucketArn, distArn]) =>
					JSON.stringify({
						Version: "2012-10-17",
						Statement: [
							{
								Sid: "AllowCloudFrontServicePrincipal",
								Effect: "Allow",
								Principal: {
									Service: "cloudfront.amazonaws.com",
								},
								Action: "s3:GetObject",
								Resource: `${bucketArn}/*`,
								Condition: {
									StringEquals: {
										"AWS:SourceArn": distArn,
									},
								},
							},
						],
					}),
				),
		});

		new aws.route53.Record("CdnAliasRecord", {
			zoneId: hostedZone.id,
			name: process.env.CONTENTS_DOMAIN ?? "",
			type: "A",
			aliases: [
				{
					name: distribution.domainName,
					zoneId: distribution.hostedZoneId,
					evaluateTargetHealth: true,
				},
			],
		});

		new sst.aws.Nextjs("zifivWeb", {
			domain: {
				name: process.env.WEB_DOMAIN ?? "",
			},
			environment: {
				APP_AWS_REGION: process.env.APP_AWS_REGION ?? "us-east-1",
				CONTENTS_DOMAIN: process.env.CONTENTS_DOMAIN ?? "",
				CONTENTS_BUCKET_NAME: contentsBucket.bucket,
			},
			path: "packages/web",
			link: [contentsTable, contentsBucket],
		});
	},
});
