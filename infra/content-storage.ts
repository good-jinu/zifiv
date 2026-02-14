/// <reference path="../.sst/platform/config.d.ts" />

/**
 * Content Storage Infrastructure
 * Handles DynamoDB table, S3 bucket, and CloudFront CDN for content delivery
 */

export function createContentStorage() {
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

	// S3 Bucket for content storage
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

	return { contentsTable, contentsBucket };
}

export function createContentCDN(
	contentsBucket: aws.s3.BucketV2,
	certificateValidation: aws.acm.CertificateValidation,
) {
	const oac = new aws.cloudfront.OriginAccessControl("CdnOAC", {
		name: `CDN-OAC-${$app.stage}`,
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
			acmCertificateArn: certificateValidation.certificateArn,
			sslSupportMethod: "sni-only",
			minimumProtocolVersion: "TLSv1.2_2021",
		},
	});

	// S3 Bucket Policy to allow CloudFront access
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

	return distribution;
}
