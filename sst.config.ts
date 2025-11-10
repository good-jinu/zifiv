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
		new sst.aws.Nextjs("zifivWeb", {
			domain: {
				name: process.env.WEB_DOMAIN ?? "",
			},
			path: "packages/web",
		});
	},
});
