export interface ContentItem {
	contentId: string; // Partition Key
	createdAt: string; // Sort Key (ISO timestamp)
	authorId: string;
	title: string;
	contentUrl: string;
	tags?: string[];
	status: "draft" | "published" | "archived";
	viewCount: number;
	updatedAt: string;
}

export interface CreateContentInput {
	authorId: string;
	title: string;
	htmlContent: string;
	tags?: string[];
	status?: "draft" | "published";
}

export interface UpdateContentInput {
	contentId: string;
	title?: string;
	htmlContent?: string;
	tags?: string[];
	status?: "draft" | "published" | "archived";
}
