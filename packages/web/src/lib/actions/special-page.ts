"use server";

import { SpecialPageService, type UpdateSpecialPageInput } from "@zifiv/feeds";
import { revalidatePath } from "next/cache";

const TUTORIAL_PAGE_ID = "tutorial";

export async function getTutorialConfigAction() {
	try {
		const service = new SpecialPageService();
		return await service.getSpecialPage(TUTORIAL_PAGE_ID);
	} catch (error) {
		console.error("Failed to get tutorial config:", error);
		return null;
	}
}

export async function updateTutorialConfigAction(formData: FormData) {
	try {
		const service = new SpecialPageService();
		const backgroundImage = formData.get("backgroundImage") as File | null;
		const narratorAudio = formData.get("narratorAudio") as File | null;
		const subtitleText = formData.get("subtitleText") as string;
		const firstMissionId = formData.get("firstMissionId") as string;

		const updates: UpdateSpecialPageInput = {
			pageId: TUTORIAL_PAGE_ID,
			subtitleText: subtitleText || undefined,
			firstMissionId: firstMissionId || undefined,
		};

		if (backgroundImage && backgroundImage.size > 0) {
			const arrayBuffer = await backgroundImage.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			const key = `tutorial/bg-${Date.now()}-${backgroundImage.name}`;
			// S3 upload returns void but service wrapper might return url?
			// Wait, I implemented uploadFile in service to return string.
			const url = await service.uploadFile(key, buffer, backgroundImage.type);
			updates.backgroundImageUrl = url;
		}

		if (narratorAudio && narratorAudio.size > 0) {
			const arrayBuffer = await narratorAudio.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			const key = `tutorial/audio-${Date.now()}-${narratorAudio.name}`;
			const url = await service.uploadFile(key, buffer, narratorAudio.type);
			updates.narratorAudioUrl = url;
		}

		await service.updateSpecialPage(updates);
		revalidatePath("/tutorial");
		revalidatePath("/cms/tutorial");
		return { success: true };
	} catch (error) {
		console.error("Failed to update tutorial config:", error);
		return { success: false, error: "Failed to update configuration" };
	}
}
