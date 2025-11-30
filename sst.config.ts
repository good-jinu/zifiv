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

		new sst.aws.Nextjs("zifivWeb", {
			domain: {
				name: process.env.WEB_DOMAIN ?? "",
			},
			path: "packages/web",
			link: [contentsTable],
		});
	},
});
