import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
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
import type { ContentItem, UpdateContentInput } from "./content";

const ddbClient = new DynamoDBClient({
	region: process.env.APP_AWS_REGION,
});
const docClient = DynamoDBDocumentClient.from(ddbClient);
const s3Client = new S3Client({
	region: process.env.APP_AWS_REGION,
});

interface SstResource {
	ContentsTable: {
		name: string;
	};
}

export class ContentRepository {
	private readonly tableName: string;
	private readonly bucketName: string;

	constructor() {
		this.tableName = (Resource as unknown as SstResource).ContentsTable.name;
		this.bucketName = process.env.CONTENTS_BUCKET_NAME ?? "";
	}

	async create(content: ContentItem): Promise<ContentItem> {
		await docClient.send(
			new PutCommand({
				TableName: this.tableName,
				Item: content,
			}),
		);
		return content;
	}

	async get(contentId: string): Promise<ContentItem | null> {
		const result = await docClient.send(
			new GetCommand({
				TableName: this.tableName,
				Key: { contentId },
			}),
		);
		return (result.Item as ContentItem) || null;
	}

	async update(input: UpdateContentInput): Promise<ContentItem> {
		const updateExpressions: string[] = [];
		const expressionAttributeNames: Record<string, string> = {};
		const expressionAttributeValues: Record<string, unknown> = {};

		if (input.title !== undefined) {
			updateExpressions.push("#title = :title");
			expressionAttributeNames["#title"] = "title";
			expressionAttributeValues[":title"] = input.title;
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

	async delete(contentId: string): Promise<void> {
		await docClient.send(
			new DeleteCommand({
				TableName: this.tableName,
				Key: { contentId },
			}),
		);
	}

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

	async getByAuthor(
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
				ScanIndexForward: false,
			}),
		);
		return (result.Items as ContentItem[]) || [];
	}

	async getPublished(limit: number = 20): Promise<ContentItem[]> {
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

	async getAll(
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
				ConsistentRead: true,
			}),
		);
		return {
			items: (result.Items as ContentItem[]) || [],
			lastKey: result.LastEvaluatedKey as { contentId: string } | undefined,
		};
	}

	async uploadHtmlContent(
		contentId: string,
		htmlContent: string,
	): Promise<void> {
		await s3Client.send(
			new PutObjectCommand({
				Bucket: this.bucketName,
				Key: `${contentId}.html`,
				Body: htmlContent,
				ContentType: "text/html",
			}),
		);
	}
}
