import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWAInstallBanner from "@/components/pwa/PWAInstallBanner";
import PWAInstaller from "@/components/pwa/PWAInstaller";
import PWAMeta from "@/components/pwa/PWAMeta";

export const metadata: Metadata = {
	title: "Zifiv",
	description: "Short form in html",
	manifest: "/manifest.json",
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: "Zifiv",
	},
};

export const viewport: Viewport = {
	themeColor: "#000000",
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<PWAMeta />
			</head>
			<body className={"antialiased bg-background"}>
				<PWAInstaller />
				<PWAInstallBanner />
				<div className="min-h-screen">{children}</div>
			</body>
		</html>
	);
}
