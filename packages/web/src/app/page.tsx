"use client";

import { FastContent, type FetchCallback } from "@fastcontents/react";
import type { ContentItem } from "@zifiv/feeds";
import { fetchPublishedContents } from "../components/feed/actions";
import { ContentRenderer } from "../components/feed/ContentRenderer";
import { NavigationControls } from "../components/feed/NavigationControls";

export default function Home() {
	// Fetch callback that integrates with ContentService via server action
	const fetchCallback: FetchCallback<ContentItem> = async ({
		offset,
		limit,
	}) => {
		return await fetchPublishedContents(limit, offset);
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
