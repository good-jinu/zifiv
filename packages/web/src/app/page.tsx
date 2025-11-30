"use client";

import { FastContent, type FetchCallback } from "@fastcontents/react";
import { type ContentItem, ContentService } from "@zifiv/feeds";
import { Calendar, ChevronDown, ChevronUp, Eye, Tag } from "lucide-react";
import { useEffect, useState } from "react";

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

	// Content Renderer Component
	const ContentRenderer = ({
		content,
		index,
	}: {
		content: ContentItem;
		index: number;
	}) => {
		const [viewIncremented, setViewIncremented] = useState(false);

		useEffect(() => {
			// Increment view count when content is displayed
			if (!viewIncremented) {
				// In real app: await contentService.incrementViewCount(content.contentId);
				setViewIncremented(true);
			}
		}, [viewIncremented]);

		const formatDate = (dateString: string) => {
			return new Date(dateString).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			});
		};

		return (
			<div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
				<div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
					{/* Header */}
					<div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
						<h1 className="text-3xl font-bold mb-2">{content.title}</h1>
						<div className="flex items-center gap-4 text-sm opacity-90">
							<div className="flex items-center gap-1">
								<Calendar size={16} />
								<span>{formatDate(content.createdAt)}</span>
							</div>
							<div className="flex items-center gap-1">
								<Eye size={16} />
								<span>{content.viewCount.toLocaleString()} views</span>
							</div>
						</div>
					</div>

					{/* Content */}
					<div className="p-8">
						<div
							className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
							// biome-ignore lint/security/noDangerouslySetInnerHtml: temporary
							dangerouslySetInnerHTML={{ __html: content.htmlContent }}
						/>
					</div>

					{/* Tags */}
					{content.tags && content.tags.length > 0 && (
						<div className="px-8 pb-6">
							<div className="flex items-center gap-2 flex-wrap">
								<Tag size={16} className="text-gray-400" />
								{content.tags.map((tag) => (
									<span
										key={tag}
										className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
									>
										#{tag}
									</span>
								))}
							</div>
						</div>
					)}

					{/* Counter */}
					<div className="px-8 pb-6 text-center text-sm text-gray-500">
						Content {index + 1}
					</div>
				</div>
			</div>
		);
	};

	// Navigation Controls
	const NavigationControls = ({
		hasPrev,
		hasNext,
		onPrev,
		onNext,
		isLoading,
	}: {
		hasPrev: boolean;
		hasNext: boolean;
		onPrev: () => void;
		onNext: () => void;
		isLoading: boolean;
	}) => {
		useEffect(() => {
			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === "ArrowUp" && hasPrev && !isLoading) onPrev();
				if (e.key === "ArrowDown" && hasNext && !isLoading) onNext();
			};

			window.addEventListener("keydown", handleKeyDown);
			return () => window.removeEventListener("keydown", handleKeyDown);
		}, [hasPrev, hasNext, onPrev, onNext, isLoading]);

		return (
			<div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
				<button
					type="button"
					onClick={onPrev}
					disabled={!hasPrev || isLoading}
					className="bg-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
					title="Previous (Arrow Up)"
				>
					<ChevronUp size={24} className="text-purple-600" />
				</button>

				{isLoading && (
					<div className="bg-white rounded-full p-4 shadow-lg">
						<div className="animate-spin h-6 w-6 border-3 border-purple-600 border-t-transparent rounded-full" />
					</div>
				)}

				<button
					type="button"
					onClick={onNext}
					disabled={!hasNext || isLoading}
					className="bg-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
					title="Next (Arrow Down)"
				>
					<ChevronDown size={24} className="text-purple-600" />
				</button>
			</div>
		);
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
