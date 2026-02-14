"use client";

import type { SpecialPageConfig } from "@zifiv/feeds";
import { useState } from "react";
import { updateTutorialConfigAction } from "@/lib/actions/special-page";

interface TutorialFormProps {
	initialConfig: SpecialPageConfig | null;
}

export function TutorialForm({ initialConfig }: TutorialFormProps) {
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const handleSubmit = async (formData: FormData) => {
		setLoading(true);
		setMessage(null);
		try {
			const result = await updateTutorialConfigAction(formData);
			if (result?.success) {
				setMessage({
					type: "success",
					text: "Tutorial configuration updated!",
				});
			} else {
				setMessage({ type: "error", text: "Failed to update configuration." });
			}
		} catch (_error) {
			setMessage({ type: "error", text: "An error occurred." });
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			action={handleSubmit}
			className="space-y-6 bg-white p-6 rounded shadow max-w-2xl mx-auto"
		>
			<h2 className="text-xl font-bold mb-4">Tutorial Settings</h2>

			{message && (
				<div
					className={`p-4 rounded ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
				>
					{message.text}
				</div>
			)}

			<div>
				<label className="block text-sm font-medium text-gray-700">
					Background Image
					<input
						type="file"
						name="backgroundImage"
						accept="image/*"
						className="mt-1 block w-full"
					/>
				</label>
				{initialConfig?.backgroundImageUrl && (
					<div className="mt-2">
						{/* biome-ignore lint/performance/noImgElement: CMS preview */}
						<img
							src={initialConfig.backgroundImageUrl}
							alt="Current Background"
							className="h-32 object-cover rounded"
						/>
						<p className="text-xs text-gray-500 mt-1">Current Image</p>
					</div>
				)}
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700">
					Narrator Audio
					<input
						type="file"
						name="narratorAudio"
						accept="audio/*"
						className="mt-1 block w-full"
					/>
				</label>
				{initialConfig?.narratorAudioUrl && (
					<div className="mt-2">
						{/* biome-ignore lint/a11y/useMediaCaption: CMS preview */}
						<audio
							controls
							src={initialConfig.narratorAudioUrl}
							className="w-full"
						/>
						<p className="text-xs text-gray-500 mt-1">Current Audio</p>
					</div>
				)}
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700">
					Subtitle Text
					<textarea
						name="subtitleText"
						defaultValue={initialConfig?.subtitleText || ""}
						rows={4}
						className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
						placeholder="Enter subtitle text here..."
					/>
				</label>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700">
					First Mission ID
					<input
						type="text"
						name="firstMissionId"
						defaultValue={initialConfig?.firstMissionId || ""}
						className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
						placeholder="Content ID of the first mission"
					/>
				</label>
			</div>

			<button
				type="submit"
				disabled={loading}
				className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
			>
				{loading ? "Saving..." : "Save Configuration"}
			</button>
		</form>
	);
}
