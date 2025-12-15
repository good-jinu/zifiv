import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	// Enable iframe embedding from same origin
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "Content-Security-Policy",
						value: [
							"default-src 'self'",
							"script-src 'self' 'unsafe-inline' 'unsafe-eval'",
							"style-src 'self' 'unsafe-inline'",
							"img-src 'self' data: https: blob:",
							`frame-src 'self' https://${process.env.CONTENTS_DOMAIN}`,
							"font-src 'self' data:",
							"media-src 'self' blob:",
						].join("; "),
					},
					{
						key: "X-Frame-Options",
						value: "SAMEORIGIN",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "Referrer-Policy",
						value: "no-referrer",
					},
				],
			},
			{
				source: "/sw.js",
				headers: [
					{
						key: "Content-Type",
						value: "application/javascript; charset=utf-8",
					},
					{
						key: "Cache-Control",
						value: "no-cache, no-store, must-revalidate",
					},
					{
						key: "Content-Security-Policy",
						value: "default-src 'self'; script-src 'self'",
					},
				],
			},
		];
	},

	// Optimize for production
	reactStrictMode: true,
};

export default nextConfig;
