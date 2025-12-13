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
	const contents = await contentService.getPublishedContents(
		limit + offset + 1,
	);
	const paginatedContents = contents.slice(offset, offset + limit);

	return {
		items: paginatedContents,
		hasMore: offset + paginatedContents.length < contents.length,
	};
}
