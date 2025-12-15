export default function PWAMeta() {
	return (
		<>
			<link rel="apple-touch-icon" href="/icon-192x192.png" />
			<link
				rel="icon"
				type="image/png"
				sizes="192x192"
				href="/icon-192x192.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="512x512"
				href="/icon-512x512.png"
			/>
			<meta name="apple-mobile-web-app-capable" content="yes" />
			<meta name="apple-mobile-web-app-status-bar-style" content="default" />
			<meta name="apple-mobile-web-app-title" content="Zifiv" />
			<meta name="mobile-web-app-capable" content="yes" />
			<meta name="msapplication-TileColor" content="#000000" />
			<meta name="msapplication-tap-highlight" content="no" />
		</>
	);
}
