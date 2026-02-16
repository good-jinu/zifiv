import { v4 as uuidv4 } from "uuid";
import type {
	ContentItem,
	CreateContentInput,
	UpdateContentInput,
} from "./content";
import { ContentRepository } from "./repository";

export class ContentService {
	private readonly repository: ContentRepository;
	private readonly contentsDomain: string;

	constructor() {
		this.repository = new ContentRepository();
		this.contentsDomain = process.env.CONTENTS_DOMAIN ?? "";
	}

	async createContent(input: CreateContentInput): Promise<ContentItem> {
		const nowDate = new Date();
		const now = nowDate.toISOString();
		const contentId = `${nowDate.getTime()}-${uuidv4()}`;
		const contentUrl = `https://${this.contentsDomain}/${contentId}.html`;

		await this.repository.uploadHtmlContent(contentId, input.htmlContent);

		const content: ContentItem = {
			contentId,
			createdAt: now,
			authorId: input.authorId,
			title: input.title,
			contentUrl,
			tags: input.tags || [],
			status: input.status || "draft",
			viewCount: 0,
			updatedAt: now,
		};

		return this.repository.create(content);
	}

	async getContent(contentId: string): Promise<ContentItem | null> {
		return this.repository.get(contentId);
	}

	async updateContent(input: UpdateContentInput): Promise<ContentItem> {
		if (input.htmlContent !== undefined) {
			await this.repository.uploadHtmlContent(
				input.contentId,
				input.htmlContent,
			);
		}
		return this.repository.update(input);
	}

	async deleteContent(contentId: string): Promise<void> {
		return this.repository.delete(contentId);
	}

	async incrementViewCount(contentId: string): Promise<number> {
		return this.repository.incrementViewCount(contentId);
	}

	async getContentsByAuthor(
		authorId: string,
		limit: number = 20,
	): Promise<ContentItem[]> {
		return this.repository.getByAuthor(authorId, limit);
	}

	async getPublishedContents(
		limit: number = 20,
		cursor?: string,
	): Promise<{
		items: ContentItem[];
		nextCursor?: string;
	}> {
		const decodedCursor = cursor
			? JSON.parse(Buffer.from(cursor, "base64").toString("utf-8"))
			: undefined;

		const { items, lastKey } = await this.repository.getPublished(
			limit,
			decodedCursor,
		);

		const nextCursor = lastKey
			? Buffer.from(JSON.stringify(lastKey)).toString("base64")
			: undefined;

		return {
			items,
			nextCursor,
		};
	}

	async searchByTag(tag: string): Promise<ContentItem[]> {
		return this.repository.searchByTag(tag);
	}

	async getAllContents(
		limit: number = 20,
		lastKey?: { contentId: string },
	): Promise<{
		items: ContentItem[];
		lastKey?: { contentId: string };
	}> {
		return this.repository.getAll(limit, lastKey);
	}
}

export default ContentService;
export type {
	ContentItem,
	CreateContentInput,
	UpdateContentInput,
} from "./content";
