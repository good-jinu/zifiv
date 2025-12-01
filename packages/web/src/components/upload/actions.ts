"use server";
import { ContentService } from "@zifiv/feeds";
import { revalidatePath } from "next/cache";
import "server-only";

export async function createContentAction(formData: FormData) {
	const title = formData.get("title") as string;
	const htmlContent = formData.get("htmlContent") as string;

	if (!title || !htmlContent) {
		return { success: false, message: "Title and content are required." };
	}

	try {
		const contentService = new ContentService();
		await contentService.createContent({
			title,
			htmlContent,
			authorId: "anonymous", // Hardcoded authorId
			status: "published",
		});

		revalidatePath("/"); // Revalidate the home page

		return { success: true, message: "Content created successfully!" };
	} catch (error) {
		console.error("Error creating content:", error);
		return {
			success: false,
			message: "Failed to create content. Please try again.",
		};
	}
}
