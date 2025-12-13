"use client";

import type { ContentItem } from "@zifiv/feeds";
import { Calendar, Eye, Tag } from "lucide-react";
import { useEffect, useState } from "react";

// Content Renderer Component
export const ContentRenderer = ({
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
		<div className="h-full w-full overflow-hidden flex flex-col">
			{/* Content */}
			<div className="flex-1">
				<iframe
					src={content.contentUrl}
					title={content.title}
					className="w-full h-full border-0"
					sandbox="" // Most restrictive sandbox
				/>
			</div>

			{/* Bottom Section with Title and Info */}
			<div className="bg-background text-foreground py-1 px-6">
				<h1 className="text-2xl font-bold mb-2">{content.title}</h1>

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

				{/* Tags */}
				{content.tags && content.tags.length > 0 && (
					<div className="flex items-center gap-2 flex-wrap mb-2">
						<Tag size={16} className="text-white opacity-70" />
						{content.tags.map((tag) => (
							<span
								key={tag}
								className="px-2 py-1 bg-white bg-opacity-20 text-white rounded-full text-xs font-medium"
							>
								#{tag}
							</span>
						))}
					</div>
				)}

				{/* Counter */}
				<div className="text-center text-xs opacity-70 mt-2">
					Content {index + 1}
				</div>
			</div>
		</div>
	);
};
