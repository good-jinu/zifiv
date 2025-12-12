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
		// Dynamic import of infrastructure modules
		const {
			createContentStorage,
			createContentCDN,
			createUsEast1Provider,
			setupDomainAndSSL,
			createDnsRecord,
			createWebApp,
		} = await import("./infra");

		// Create AWS provider for us-east-1 (required for CloudFront certificates)
		const usEast1 = createUsEast1Provider();

		// Create content storage (DynamoDB + S3)
		const { contentsTable, contentsBucket } = createContentStorage();

		// Setup domain and SSL certificate
		const { hostedZone, certificateValidation } =
			await setupDomainAndSSL(usEast1);

		// Create CDN for content delivery
		const distribution = createContentCDN(
			contentsBucket,
			certificateValidation,
		);

		// Create DNS record for CDN
		createDnsRecord(hostedZone, distribution);

		// Create Next.js web application
		createWebApp(contentsTable, contentsBucket);
	},
});
