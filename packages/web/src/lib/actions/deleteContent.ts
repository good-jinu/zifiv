"use server";
import { ContentService } from "@zifiv/feeds";
import { revalidatePath } from "next/cache";
import "server-only";

export async function deleteContentAction(contentId: string) {
	if (!contentId) {
		return { success: false, message: "Content ID is required." };
	}

	try {
		const contentService = new ContentService();
		await contentService.deleteContent(contentId);

		revalidatePath("/"); // Revalidate the home page
		revalidatePath("/cms/list"); // Revalidate the CMS list page

		return { success: true, message: "Content deleted successfully!" };
	} catch (error) {
		console.error("Error deleting content:", error);
		return {
			success: false,
			message: "Failed to delete content. Please try again.",
		};
	}
}
