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
