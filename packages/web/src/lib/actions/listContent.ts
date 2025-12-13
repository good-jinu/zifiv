"use server";
import { ContentService } from "@zifiv/feeds";
import "server-only";

export async function listContentAction(limit: number = 50) {
	try {
		const contentService = new ContentService();
		const result = await contentService.getAllContents(limit);

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
