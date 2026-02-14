import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Zifiv Admin",
	description: "Zifiv Admin Dashboard",
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
			<body className={"antialiased bg-gray-50 text-gray-900"}>
				<div className="min-h-screen">{children}</div>
			</body>
		</html>
	);
}
