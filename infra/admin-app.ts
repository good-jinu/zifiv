/// <reference path="../.sst/platform/config.d.ts" />

/**
 * Admin Application Infrastructure
 * Handles Next.js admin application deployment
 */

export function createAdminApp(
	contentsTable: sst.aws.Dynamo,
	specialPagesTable: sst.aws.Dynamo,
	contentsBucket: aws.s3.BucketV2,
) {
	const next = new sst.aws.Nextjs("zifivAdmin", {
		domain: {
			name: process.env.ADMIN_DOMAIN ?? "admin.zifiv.com",
		},
		environment: {
			APP_AWS_REGION: process.env.APP_AWS_REGION ?? "us-east-1",
			CONTENTS_DOMAIN: process.env.CONTENTS_DOMAIN ?? "",
			CONTENTS_BUCKET_NAME: contentsBucket.bucket,
		},
		path: "packages/admin-web",
		link: [contentsTable, specialPagesTable, contentsBucket],
	});

	new aws.iam.RolePolicy("NextjsAdminContentsPutPolicy", {
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
