"use server";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ContentService } from "@zifiv/feeds";
import "server-only";

const s3Client = new S3Client({
	region: process.env.APP_AWS_REGION,
});

export async function getContentAction(contentId: string) {
	if (!contentId) {
		throw new Error("Content ID is required");
	}

	try {
		const contentService = new ContentService();
		const bucketName = process.env.CONTENTS_BUCKET_NAME;

		// Fetch metadata and HTML content in parallel
		const [content, htmlContent] = await Promise.all([
			contentService.getContent(contentId),
			(async () => {
				if (!bucketName) return "";
				try {
					const response = await s3Client.send(
						new GetObjectCommand({
							Bucket: bucketName,
							Key: `${contentId}.html`,
						}),
					);

					if (response.Body) {
						return await response.Body.transformToString();
					}
				} catch (s3Error) {
					console.warn("Could not fetch HTML content from S3:", s3Error);
				}
				return "";
			})(),
		]);

		if (!content) {
			throw new Error("Content not found");
		}

		const htmlContent = await htmlContentPromise;

		return {
			...content,
			htmlContent,
		};
	} catch (error) {
		console.error("Error fetching content:", error);
		throw error;
	}
}
