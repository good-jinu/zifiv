"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ContentActions } from "./ContentActions";

interface ContentItem {
	contentId: string;
	title: string;
	status: "draft" | "published" | "archived";
	authorId: string;
	tags?: string[];
	viewCount: number;
	createdAt: string;
	updatedAt: string;
}

interface ContentTableProps {
	contents: ContentItem[];
}

export function ContentTable({ contents }: ContentTableProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");

	// Filter contents based on search term and status
	const filteredContents = contents.filter((content) => {
		const matchesSearch =
			content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			content.authorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
			content.tags?.some((tag) =>
				tag.toLowerCase().includes(searchTerm.toLowerCase()),
			);

		const matchesStatus =
			statusFilter === "all" || content.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	if (contents.length === 0) {
		return (
			<div className="bg-white rounded-lg shadow">
				<div className="text-center py-12">
					<h2 className="text-xl font-semibold text-gray-600 mb-2">
						No Content Found
					</h2>
					<p className="text-gray-500 mb-4">
						Get started by creating your first piece of content.
					</p>
					<Link href="/cms/upload">
						<Button>Create Content</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg shadow">
			{/* Filters */}
			<div className="p-4 border-b border-gray-200">
				<div className="flex gap-4 items-center">
					<div className="flex-1">
						<input
							type="text"
							placeholder="Search by title, author, or tags..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
					<div>
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						>
							<option value="all">All Status</option>
							<option value="published">Published</option>
							<option value="draft">Draft</option>
							<option value="archived">Archived</option>
						</select>
					</div>
				</div>
			</div>

			{/* Table */}
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Title</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Author</TableHead>
						<TableHead>Tags</TableHead>
						<TableHead>Views</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Updated</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredContents.length === 0 ? (
						<TableRow>
							<TableCell colSpan={8} className="text-center py-8 text-gray-500">
								No content matches your search criteria.
							</TableCell>
						</TableRow>
					) : (
						filteredContents.map((content) => (
							<TableRow key={content.contentId}>
								<TableCell className="font-medium">
									<div className="max-w-xs truncate" title={content.title}>
										{content.title}
									</div>
								</TableCell>
								<TableCell>
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
											content.status === "published"
												? "bg-green-100 text-green-800"
												: content.status === "draft"
													? "bg-yellow-100 text-yellow-800"
													: "bg-gray-100 text-gray-800"
										}`}
									>
										{content.status}
									</span>
								</TableCell>
								<TableCell>{content.authorId}</TableCell>
								<TableCell>
									<div className="max-w-xs">
										{content.tags && content.tags.length > 0 ? (
											<div className="flex flex-wrap gap-1">
												{content.tags.slice(0, 2).map((tag) => (
													<span
														key={tag}
														className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-800"
													>
														{tag}
													</span>
												))}
												{content.tags.length > 2 && (
													<span className="text-xs text-gray-500">
														+{content.tags.length - 2} more
													</span>
												)}
											</div>
										) : (
											<span className="text-gray-400 text-sm">No tags</span>
										)}
									</div>
								</TableCell>
								<TableCell>{content.viewCount}</TableCell>
								<TableCell>
									<div className="text-sm text-gray-600">
										{new Date(content.createdAt).toLocaleDateString()}
									</div>
								</TableCell>
								<TableCell>
									<div className="text-sm text-gray-600">
										{new Date(content.updatedAt).toLocaleDateString()}
									</div>
								</TableCell>
								<TableCell className="text-right">
									<ContentActions contentId={content.contentId} />
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>

			{/* Footer */}
			<div className="p-4 border-t border-gray-200 text-center text-sm text-gray-500">
				Showing {filteredContents.length} of {contents.length} content items
			</div>
		</div>
	);
}
