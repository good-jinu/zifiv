import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DeleteCommand,
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
	QueryCommand,
	ScanCommand,
	UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";
import { v4 as uuidv4 } from "uuid";

// DynamoDB Client Configuration using SST Resource
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Type Definitions
export interface ContentItem {
	contentId: string; // Partition Key
	createdAt: string; // Sort Key (ISO timestamp)
	authorId: string;
	title: string;
	htmlContent: string;
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

// Content Service Class
export class ContentService {
	private readonly tableName: string;

	constructor() {
		// Use SST Resource reference
		// biome-ignore lint/suspicious/noExplicitAny: any allowed for Resource
		this.tableName = (Resource as any).ContentsTable.name;
	}

	/**
	 * Create a new content item
	 */
	async createContent(input: CreateContentInput): Promise<ContentItem> {
		const now = new Date().toISOString();
		const content: ContentItem = {
			contentId: uuidv4(),
			createdAt: now,
			authorId: input.authorId,
			title: input.title,
			htmlContent: input.htmlContent,
			tags: input.tags || [],
			status: input.status || "draft",
			viewCount: 0,
			updatedAt: now,
		};

		await docClient.send(
			new PutCommand({
				TableName: this.tableName,
				Item: content,
			}),
		);

		return content;
	}

	/**
	 * Get content by ID
	 */
	async getContent(contentId: string): Promise<ContentItem | null> {
		const result = await docClient.send(
			new GetCommand({
				TableName: this.tableName,
				Key: { contentId },
			}),
		);

		return (result.Item as ContentItem) || null;
	}

	/**
	 * Update content
	 */
	async updateContent(input: UpdateContentInput): Promise<ContentItem> {
		const updateExpressions: string[] = [];
		const expressionAttributeNames: Record<string, string> = {};
		// biome-ignore lint/suspicious/noExplicitAny: temporary
		const expressionAttributeValues: Record<string, any> = {};

		// Build dynamic update expression
		if (input.title !== undefined) {
			updateExpressions.push("#title = :title");
			expressionAttributeNames["#title"] = "title";
			expressionAttributeValues[":title"] = input.title;
		}

		if (input.htmlContent !== undefined) {
			updateExpressions.push("#htmlContent = :htmlContent");
			expressionAttributeNames["#htmlContent"] = "htmlContent";
			expressionAttributeValues[":htmlContent"] = input.htmlContent;
		}

		if (input.tags !== undefined) {
			updateExpressions.push("#tags = :tags");
			expressionAttributeNames["#tags"] = "tags";
			expressionAttributeValues[":tags"] = input.tags;
		}

		if (input.status !== undefined) {
			updateExpressions.push("#status = :status");
			expressionAttributeNames["#status"] = "status";
			expressionAttributeValues[":status"] = input.status;
		}

		// Always update the updatedAt timestamp
		updateExpressions.push("#updatedAt = :updatedAt");
		expressionAttributeNames["#updatedAt"] = "updatedAt";
		expressionAttributeValues[":updatedAt"] = new Date().toISOString();

		const result = await docClient.send(
			new UpdateCommand({
				TableName: this.tableName,
				Key: { contentId: input.contentId },
				UpdateExpression: `SET ${updateExpressions.join(", ")}`,
				ExpressionAttributeNames: expressionAttributeNames,
				ExpressionAttributeValues: expressionAttributeValues,
				ReturnValues: "ALL_NEW",
			}),
		);

		return result.Attributes as ContentItem;
	}

	/**
	 * Delete content
	 */
	async deleteContent(contentId: string): Promise<void> {
		await docClient.send(
			new DeleteCommand({
				TableName: this.tableName,
				Key: { contentId },
			}),
		);
	}

	/**
	 * Increment view count
	 */
	async incrementViewCount(contentId: string): Promise<number> {
		const result = await docClient.send(
			new UpdateCommand({
				TableName: this.tableName,
				Key: { contentId },
				UpdateExpression: "SET viewCount = viewCount + :inc",
				ExpressionAttributeValues: {
					":inc": 1,
				},
				ReturnValues: "UPDATED_NEW",
			}),
		);

		return result.Attributes?.viewCount || 0;
	}

	/**
	 * Get contents by author (uses AuthorIndex GSI)
	 */
	async getContentsByAuthor(
		authorId: string,
		limit: number = 20,
	): Promise<ContentItem[]> {
		const result = await docClient.send(
			new QueryCommand({
				TableName: this.tableName,
				IndexName: "AuthorIndex",
				KeyConditionExpression: "authorId = :authorId",
				ExpressionAttributeValues: {
					":authorId": authorId,
				},
				Limit: limit,
				ScanIndexForward: false, // Most recent first
			}),
		);

		return (result.Items as ContentItem[]) || [];
	}

	/**
	 * Get published contents (uses StatusIndex GSI)
	 */
	async getPublishedContents(limit: number = 20): Promise<ContentItem[]> {
		const result = await docClient.send(
			new QueryCommand({
				TableName: this.tableName,
				IndexName: "StatusIndex",
				KeyConditionExpression: "#status = :status",
				ExpressionAttributeNames: {
					"#status": "status",
				},
				ExpressionAttributeValues: {
					":status": "published",
				},
				Limit: limit,
				ScanIndexForward: false,
			}),
		);

		return (result.Items as ContentItem[]) || [];
	}

	/**
	 * Search contents by tag
	 */
	async searchByTag(tag: string): Promise<ContentItem[]> {
		const result = await docClient.send(
			new ScanCommand({
				TableName: this.tableName,
				FilterExpression: "contains(tags, :tag)",
				ExpressionAttributeValues: {
					":tag": tag,
				},
			}),
		);

		return (result.Items as ContentItem[]) || [];
	}

	/**
	 * Get all contents with pagination
	 */
	async getAllContents(
		limit: number = 20,
		lastKey?: { contentId: string },
	): Promise<{
		items: ContentItem[];
		lastKey?: { contentId: string };
	}> {
		const result = await docClient.send(
			new ScanCommand({
				TableName: this.tableName,
				Limit: limit,
				ExclusiveStartKey: lastKey,
			}),
		);

		return {
			items: (result.Items as ContentItem[]) || [],
			lastKey: result.LastEvaluatedKey as { contentId: string } | undefined,
		};
	}
}

export default ContentService;
