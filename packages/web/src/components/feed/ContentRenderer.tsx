"use client";

import type { ContentItem } from "@zifiv/feeds";
import { Calendar, Eye, Info, Tag } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { incrementViewCount } from "@/components/feed/actions";

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
};

// Content Renderer Component
export const ContentRenderer = ({
	content,
}: {
	content: ContentItem;
	index: number;
}) => {
	useEffect(() => {
		if (content.contentId) {
			incrementViewCount(content.contentId);
		}
	}, [content.contentId, incrementViewCount]);

	return (
		<div className="h-full w-full overflow-hidden relative">
			{/* Content */}
			<iframe
				src={content.contentUrl}
				title={content.title}
				className="w-full h-full border-0"
				sandbox="allow-scripts" // Most restrictive sandbox
			/>

			{/* Floating Info Button */}
			<Drawer>
				<DrawerTrigger asChild>
					<Button
						size="icon"
						className="absolute bottom-4 left-4 shadow-lg"
						variant="secondary"
					>
						<Info className="size-4" />
					</Button>
				</DrawerTrigger>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>{content.title}</DrawerTitle>
						<DrawerDescription>
							Content information and details
						</DrawerDescription>
					</DrawerHeader>

					<div className="px-4 pb-4">
						<div className="flex items-center gap-4 text-sm opacity-90 mb-4">
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

					<DrawerFooter>
						<DrawerClose asChild>
							<Button variant="outline">Close</Button>
						</DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</div>
	);
};
