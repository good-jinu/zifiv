"use client";

import { FastContent, type FetchCallback } from "@fastcontents/react";
import type { ContentItem } from "@zifiv/feeds";
import { useRef } from "react";
import { fetchPublishedContents } from "../../components/feed/actions";
import { ContentRenderer } from "../../components/feed/ContentRenderer";
import { NavigationControls } from "../../components/feed/NavigationControls";

export default function Home() {
	// Map to store nextCursors for each offset to enable efficient cursor-based fetching
	const cursorsRef = useRef<Record<number, string>>({});

	// Fetch callback that integrates with ContentService via server action
	const fetchCallback: FetchCallback<ContentItem> = async ({
		offset,
		limit,
	}: {
		offset: number;
		limit: number;
	}) => {
		const cursor = cursorsRef.current[offset];
		const result = await fetchPublishedContents({ limit, offset, cursor });

		// If we got a nextCursor, store it for the next offset
		if (result.nextCursor) {
			cursorsRef.current[offset + limit] = result.nextCursor;
		}

		return result;
	};

	return (
		<div className="h-screen max-h-screen w-full max-w-2xl m-auto overflow-hidden">
			<FastContent
				fetchCallback={fetchCallback}
				renderer={ContentRenderer}
				renderControls={NavigationControls}
				initialBatchSize={3}
				batchSize={2}
				fallback={
					<div className="h-full flex items-center justify-center">
						<div className="text-center">
							<div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
							<p className="text-gray-600 text-lg">Loading content...</p>
						</div>
					</div>
				}
			/>
		</div>
	);
}
