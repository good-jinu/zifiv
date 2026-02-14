"use server";
import { auth } from "@/auth";
import { ContentService } from "@zifiv/feeds";
import { revalidatePath } from "next/cache";
import "server-only";

export async function createContentAction(formData: FormData) {
	const session = await auth();
	if (!session?.user?.id) {
		return { success: false, message: "Unauthorized. Please sign in." };
	}

	const title = formData.get("title") as string;
	const htmlContent = formData.get("htmlContent") as string;
	const tagsInput = formData.get("tags") as string;
	const status = formData.get("status") as "draft" | "published";

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
		await contentService.createContent({
			title,
			htmlContent,
			authorId: session.user.id,
			status: status || "draft",
			tags,
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
