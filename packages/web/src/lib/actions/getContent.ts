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
		const content = await contentService.getContent(contentId);

		if (!content) {
			throw new Error("Content not found");
		}

		// Fetch HTML content from S3
		let htmlContent = "";
		try {
			const bucketName = process.env.CONTENTS_BUCKET_NAME;
			if (bucketName) {
				const response = await s3Client.send(
					new GetObjectCommand({
						Bucket: bucketName,
						Key: `${contentId}.html`,
					}),
				);

				if (response.Body) {
					htmlContent = await response.Body.transformToString();
				}
			}
		} catch (s3Error) {
			console.warn("Could not fetch HTML content from S3:", s3Error);
			// Continue without HTML content - it's not critical for editing metadata
		}

		return {
			...content,
			htmlContent,
		};
	} catch (error) {
		console.error("Error fetching content:", error);
		throw error;
	}
}
