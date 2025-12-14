"use server";
import { ContentService } from "@zifiv/feeds";
import "server-only";

export async function listContentAction(
	limit: number = 20,
	lastKey?: { contentId: string },
) {
	try {
		const contentService = new ContentService();
		const result = await contentService.getAllContents(limit, lastKey);

		return {
			success: true,
			data: result.items,
			lastKey: result.lastKey,
		};
	} catch (error) {
		console.error("Error fetching content list:", error);
		return {
			success: false,
			message: "Failed to fetch content list.",
			data: [],
		};
	}
}
