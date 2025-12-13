/// <reference path="../.sst/platform/config.d.ts" />

/**
 * Web Application Infrastructure
 * Handles Next.js application deployment and configuration
 */

export function createWebApp(
	contentsTable: sst.aws.Dynamo,
	contentsBucket: aws.s3.BucketV2,
) {
	const next = new sst.aws.Nextjs("zifivWeb", {
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

	new aws.iam.RolePolicy("NextjsContentsPutPolicy", {
		role: next.nodes.server?.nodes.role.name ?? "",
		policy: {
			Version: "2012-10-17",
			Statement: [
				{
					Effect: "Allow",
					Action: ["s3:PutObject", "s3:PutObjectAcl"],
					Resource: $interpolate`${contentsBucket.arn}/*`,
				},
			],
		},
	});

	return next;
}
