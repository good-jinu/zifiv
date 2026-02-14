"use client";

import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallBanner() {
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [showBanner, setShowBanner] = useState(false);
	const [isInstalled, setIsInstalled] = useState(false);

	useEffect(() => {
		// Check if app is already installed
		const checkInstalled = () => {
			if (
				window.matchMedia("(display-mode: standalone)").matches ||
				// biome-ignore lint/suspicious/noExplicitAny: allow any type
				(window.navigator as any).standalone === true
			) {
				setIsInstalled(true);
				return;
			}
		};

		checkInstalled();

		// Listen for the beforeinstallprompt event
		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e as BeforeInstallPromptEvent);

			// Check if user has previously dismissed the banner
			const dismissed = localStorage.getItem("pwa-banner-dismissed");

			if (!dismissed && !isInstalled) {
				setShowBanner(true);
			}
		};

		// Listen for app installed event
		const handleAppInstalled = () => {
			setIsInstalled(true);
			setShowBanner(false);
			setDeferredPrompt(null);
			localStorage.removeItem("pwa-banner-dismissed");
		};

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		window.addEventListener("appinstalled", handleAppInstalled);

		// Fallback: Show banner after 3 seconds if no beforeinstallprompt event
		const fallbackTimer = setTimeout(() => {
			if (!deferredPrompt && !isInstalled) {
				const dismissed = localStorage.getItem("pwa-banner-dismissed");
				if (!dismissed) {
					setShowBanner(true);
				}
			}
		}, 3000);

		return () => {
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt,
			);
			window.removeEventListener("appinstalled", handleAppInstalled);
			clearTimeout(fallbackTimer);
		};
	}, [isInstalled, deferredPrompt]);

	const handleInstallClick = async () => {
		if (!deferredPrompt) {
			// Fallback for browsers that don't support beforeinstallprompt
			alert(
				"To install this app:\n\n• Chrome/Edge: Look for 'Install' in the address bar\n• Safari: Tap Share → Add to Home Screen\n• Firefox: Tap Menu → Install",
			);
			return;
		}

		try {
			await deferredPrompt.prompt();

			setDeferredPrompt(null);
			setShowBanner(false);
		} catch (error) {
			console.error("Error during install prompt:", error);
		}
	};

	const handleDismiss = () => {
		setShowBanner(false);
		localStorage.setItem("pwa-banner-dismissed", "true");
	};

	if (!showBanner || isInstalled) {
		return null;
	}

	return (
		<div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg z-100">
			<div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
				<div className="flex items-center space-x-3">
					<Download className="h-5 w-5 flex-shrink-0" />
					<div className="flex-1 min-w-0">
						<p className="text-sm font-medium">Install Zifiv App</p>
						<p className="text-xs opacity-90">
							Get the full experience with our mobile app
						</p>
					</div>
				</div>

				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						className="text-primary"
						onClick={handleInstallClick}
					>
						Install
					</Button>
					<Button
						size="icon"
						onClick={handleDismiss}
						className="rounded-full"
						aria-label="Dismiss banner"
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
