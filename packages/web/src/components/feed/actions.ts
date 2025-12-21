"use server";

import type { ContentItem } from "@zifiv/feeds";
import { contentService } from "./service";

export async function fetchPublishedContents({
	limit,
	offset,
}: {
	limit: number;
	offset: number;
}): Promise<{
	items: ContentItem[];
	hasMore: boolean;
}> {
	// TODO: This pagination logic is inefficient. It fetches all items up to the current offset on every request.
	// This should be improved by implementing cursor-based pagination in the `getPublishedContents` method.
	const contents = await contentService.getPublishedContents(
		limit + 1 + offset,
	);
	const hasMore = contents.length > limit + offset;
	const paginatedContents = contents.slice(offset, limit + offset);

	return {
		items: paginatedContents,
		hasMore,
	};
}

export async function incrementViewCount(contentId: string) {
	try {
		await contentService.incrementViewCount(contentId);
	} catch (error) {
		console.error(`Failed to increment view count for ${contentId}`, error);
	}
}
