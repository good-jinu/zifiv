"use server";
import { ContentService } from "@zifiv/feeds";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import "server-only";

export async function deleteContentAction(contentId: string) {
	const session = await auth();
	if (!session?.user?.isAdmin) {
		return { success: false, message: "Unauthorized. Admins only." };
	}

	if (!contentId) {
		return { success: false, message: "Content ID is required." };
	}

	try {
		const contentService = new ContentService();
		const existingContent = await contentService.getContent(contentId);

		if (!existingContent) {
			return { success: false, message: "Content not found." };
		}

		await contentService.deleteContent(contentId);

		revalidatePath("/"); // Revalidate the home page
		revalidatePath("/admin/list"); // Revalidate the CMS list page

		return { success: true, message: "Content deleted successfully!" };
	} catch (error) {
		console.error("Error deleting content:", error);
		return {
			success: false,
			message: "Failed to delete content. Please try again.",
		};
	}
}
