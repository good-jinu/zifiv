"use server";

import type { ContentItem } from "@zifiv/feeds";
import { contentService } from "@/components/feed/service";

export async function fetchPublishedContents({
	limit,
	offset = 0,
	cursor,
}: {
	limit: number;
	offset?: number;
	cursor?: string;
}): Promise<{
	items: ContentItem[];
	hasMore: boolean;
	nextCursor?: string;
}> {
	// If cursor is provided, we can fetch efficiently
	if (cursor) {
		const result = await contentService.getPublishedContents(limit, cursor);
		return {
			items: result.items,
			hasMore: !!result.nextCursor,
			nextCursor: result.nextCursor,
		};
	}

	// Inefficient fallback: fetch all up to the current offset + limit
	// This maintains compatibility with the offset-based frontend logic
	const result = await contentService.getPublishedContents(limit + offset);

	const paginatedContents = result.items.slice(offset, offset + limit);
	const hasMore = !!result.nextCursor || result.items.length > offset + limit;

	return {
		items: paginatedContents,
		hasMore,
		nextCursor:
			result.items.length === limit + offset ? result.nextCursor : undefined,
	};
}

export async function incrementViewCount(contentId: string) {
	try {
		await contentService.incrementViewCount(contentId);
	} catch (error) {
		console.error(`Failed to increment view count for ${contentId}`, error);
	}
}
