/// <reference path="../.sst/platform/config.d.ts" />

/**
 * Web Application Infrastructure
 * Handles Next.js application deployment and configuration
 */

export function createWebApp(
	contentsTable: sst.aws.Dynamo,
	contentsBucket: aws.s3.BucketV2,
) {
	return new sst.aws.Nextjs("zifivWeb", {
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
}
