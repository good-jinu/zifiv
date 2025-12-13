"use client";

import type { ContentItem } from "@zifiv/feeds";
import { Calendar, Eye, Tag } from "lucide-react";
import { useEffect, useState } from "react";

// Content Renderer Component
export const ContentRenderer = ({
	content,
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
		<div className="h-full w-full overflow-hidden flex flex-col">
			{/* Content */}
			<div className="flex-1">
				<iframe
					src={content.contentUrl}
					title={content.title}
					className="w-full h-full border-0"
					sandbox="allow-scripts" // Most restrictive sandbox
				/>
			</div>

			{/* Bottom Section with Title and Info */}
			<div className="bg-background text-foreground py-1 px-4">
				<h1 className="text-lg font-bold mb-2">{content.title}</h1>

				<div className="flex items-center gap-4 text-sm opacity-90">
					<div className="flex items-center gap-1">
						<Calendar className="size-3" />
						<span>{formatDate(content.createdAt)}</span>
					</div>
					<div className="flex items-center gap-1">
						<Eye className="size-3" />
						<span>{content.viewCount.toLocaleString()} views</span>
					</div>
				</div>

				{/* Tags */}
				{content.tags && content.tags.length > 0 && (
					<div className="flex items-center gap-2 flex-wrap">
						<Tag className="text-foreground/70 size-3" />
						{content.tags.map((tag) => (
							<span
								key={tag}
								className="px-2 py-1 bg-secondary bg-opacity-20 text-foreground rounded-full text-xs font-medium"
							>
								#{tag}
							</span>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
