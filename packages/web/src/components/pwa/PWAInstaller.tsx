"use client";

import { useEffect } from "react";

export default function PWAInstaller() {
	useEffect(() => {
		console.log("PWAInstaller: Checking service worker support");

		if ("serviceWorker" in navigator) {
			console.log("PWAInstaller: Service worker supported, registering...");
			navigator.serviceWorker
				.register("/sw.js")
				.then((registration) => {
					console.log("PWAInstaller: SW registered successfully", registration);
				})
				.catch((registrationError) => {
					console.error(
						"PWAInstaller: SW registration failed",
						registrationError,
					);
				});
		} else {
			console.log("PWAInstaller: Service worker not supported");
		}
	}, []);

	return null;
}
