"use client";

import type { SpecialPageConfig } from "@zifiv/feeds";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

interface TutorialPlayerProps {
	config: SpecialPageConfig | null;
}

export function TutorialPlayer({ config }: TutorialPlayerProps) {
	const [started, setStarted] = useState(false);
	const audioRef = useRef<HTMLAudioElement>(null);
	const router = useRouter();

	const handleStart = () => {
		setStarted(true);
		if (audioRef.current) {
			audioRef.current.play().catch((e) => {
				console.error("Audio playback failed:", e);
			});
		}
	};

	const handleEnded = () => {
		if (config?.firstMissionId) {
			router.push(`/contents/${config.firstMissionId}`);
		} else {
			console.warn("No first mission configured");
			// Maybe redirect to home or show a message?
			router.push("/");
		}
	};

	if (!config) {
		return (
			<div className="flex items-center justify-center h-screen bg-gray-900 text-white">
				<p>Tutorial configuration not found.</p>
			</div>
		);
	}

	return (
		<div
			className="fixed inset-0 flex items-center justify-center bg-black bg-cover bg-center"
			style={{
				backgroundImage: config.backgroundImageUrl
					? `url(${config.backgroundImageUrl})`
					: undefined,
			}}
		>
			{/* Overlay for better text readability */}
			<div className="absolute inset-0 bg-black/30" />

			<div className="relative z-10">
				{!started && (
					<button
						type="button"
						onClick={handleStart}
						className="px-8 py-4 bg-white text-black text-2xl font-bold rounded-full shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-105"
					>
						Start
					</button>
				)}

				{started && config.subtitleText && (
					<div className="absolute bottom-10 left-0 right-0 p-8 text-center w-full max-w-4xl mx-auto">
						<div className="bg-black/60 p-6 rounded-xl backdrop-blur-sm">
							<p className="text-white text-2xl font-medium drop-shadow-md leading-relaxed">
								{config.subtitleText}
							</p>
						</div>
					</div>
				)}
			</div>

			{config.narratorAudioUrl && (
				// biome-ignore lint/a11y/useMediaCaption: Subtitles are rendered separately
				<audio
					ref={audioRef}
					src={config.narratorAudioUrl}
					onEnded={handleEnded}
					className="hidden"
				/>
			)}
		</div>
	);
}
