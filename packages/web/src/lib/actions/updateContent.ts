"use server";
import { auth } from "@/auth";
import { ContentService } from "@zifiv/feeds";
import { revalidatePath } from "next/cache";
import "server-only";

export async function updateContentAction(
	contentId: string,
	formData: FormData,
) {
	const session = await auth();
	if (!session?.user?.id) {
		return { success: false, message: "Unauthorized. Please sign in." };
	}

	const title = formData.get("title") as string;
	const htmlContent = formData.get("htmlContent") as string;
	const tagsInput = formData.get("tags") as string;
	const status = formData.get("status") as "draft" | "published" | "archived";

	if (!contentId) {
		return { success: false, message: "Content ID is required." };
	}

	if (!title || !htmlContent) {
		return { success: false, message: "Title and content are required." };
	}

	// Process tags: split by comma, trim whitespace, and filter out empty strings
	const tags = tagsInput
		? tagsInput
				.split(",")
				.map((tag) => tag.trim())
				.filter((tag) => tag.length > 0)
		: undefined;

	try {
		const contentService = new ContentService();
		const existingContent = await contentService.getContent(contentId);

		if (!existingContent) {
			return { success: false, message: "Content not found." };
		}

		if (existingContent.authorId !== session.user.id) {
			return {
				success: false,
				message: "You are not authorized to update this content.",
			};
		}

		await contentService.updateContent({
			contentId,
			title,
			htmlContent,
			tags,
			status,
		});

		revalidatePath("/"); // Revalidate the home page
		revalidatePath(`/cms/upload?contentId=${contentId}`); // Revalidate the current page

		return { success: true, message: "Content updated successfully!" };
	} catch (error) {
		console.error("Error updating content:", error);
		return {
			success: false,
			message: "Failed to update content. Please try again.",
		};
	}
}
