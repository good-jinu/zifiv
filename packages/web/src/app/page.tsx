"use client";

import { FastContent, type FetchCallback } from "@fastcontents/react";
import { type ContentItem, ContentService } from "@zifiv/feeds";
import { ContentRenderer } from "../components/feed/ContentRenderer";
import { NavigationControls } from "../components/feed/NavigationControls";

const contentService = new ContentService();

export default function Home() {
	// Fetch callback that integrates with ContentService
	const fetchCallback: FetchCallback<ContentItem> = async ({
		offset,
		limit,
	}) => {
		// In real implementation, you'd paginate through DynamoDB
		const contents = await contentService.getPublishedContents(limit);

		// Simulate pagination by slicing based on offset
		const paginatedContents = contents.slice(offset, offset + limit);

		return {
			items: paginatedContents,
			hasMore: offset + paginatedContents.length < contents.length,
		};
	};

	return (
		<FastContent
			fetchCallback={fetchCallback}
			renderer={ContentRenderer}
			renderControls={NavigationControls}
			initialBatchSize={3}
			batchSize={2}
			fallback={
				<div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
					<div className="text-center">
						<div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4" />
						<p className="text-gray-600 text-lg">Loading content...</p>
					</div>
				</div>
			}
		/>
	);
}
