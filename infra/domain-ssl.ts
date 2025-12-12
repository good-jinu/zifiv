/// <reference path="../.sst/platform/config.d.ts" />

/**
 * Domain and SSL Infrastructure
 * Handles Route 53, SSL certificates, and DNS configuration
 */

export function createUsEast1Provider() {
	return new aws.Provider("us-east-1", {
		region: "us-east-1",
	});
}

export async function setupDomainAndSSL(usEast1Provider: aws.Provider) {
	// Get hosted zone
	const hostedZone = await aws.route53.getZone({
		name: process.env.ROOT_DOMAIN,
	});

	// Create SSL certificate in us-east-1
	const certificate = new aws.acm.Certificate(
		"MyCertificate",
		{
			domainName: process.env.CONTENTS_DOMAIN ?? "",
			validationMethod: "DNS",
		},
		{ provider: usEast1Provider },
	);

	// Create DNS record for certificate validation
	const validationRecord = new aws.route53.Record("ValidationRecord", {
		name: certificate.domainValidationOptions[0].resourceRecordName,
		records: [certificate.domainValidationOptions[0].resourceRecordValue],
		ttl: 60,
		type: certificate.domainValidationOptions[0].resourceRecordType,
		zoneId: hostedZone.id,
	});

	// Wait for certificate validation
	const certificateValidation = new aws.acm.CertificateValidation(
		"CertificateValidation",
		{
			certificateArn: certificate.arn,
			validationRecordFqdns: [validationRecord.fqdn],
		},
		{ provider: usEast1Provider },
	);

	return { hostedZone, certificate, certificateValidation };
}

export function createDnsRecord(
	hostedZone: aws.route53.GetZoneResult,
	distribution: aws.cloudfront.Distribution,
) {
	return new aws.route53.Record("CdnAliasRecord", {
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
}
