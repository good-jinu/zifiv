import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
	DynamoDBDocumentClient,
	GetCommand,
	UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";
import type { SpecialPageConfig, UpdateSpecialPageInput } from "./special-page";

const ddbClient = new DynamoDBClient({
	region: process.env.APP_AWS_REGION,
});
const docClient = DynamoDBDocumentClient.from(ddbClient);
const s3Client = new S3Client({
	region: process.env.APP_AWS_REGION,
});

interface SstResource {
	SpecialPagesTable: {
		name: string;
	};
}

export class SpecialPageRepository {
	private readonly tableName: string;
	private readonly bucketName: string;
	private readonly contentsDomain: string;

	constructor() {
		this.tableName = (
			Resource as unknown as SstResource
		).SpecialPagesTable.name;
		this.bucketName = process.env.CONTENTS_BUCKET_NAME ?? "";
		this.contentsDomain = process.env.CONTENTS_DOMAIN ?? "";
	}

	async get(pageId: string): Promise<SpecialPageConfig | null> {
		const result = await docClient.send(
			new GetCommand({
				TableName: this.tableName,
				Key: { pageId },
			}),
		);
		return (result.Item as SpecialPageConfig) || null;
	}

	async update(input: UpdateSpecialPageInput): Promise<SpecialPageConfig> {
		const updateExpressions: string[] = [];
		const expressionAttributeNames: Record<string, string> = {};
		const expressionAttributeValues: Record<string, unknown> = {};

		if (input.backgroundImageUrl !== undefined) {
			updateExpressions.push("#bg = :bg");
			expressionAttributeNames["#bg"] = "backgroundImageUrl";
			expressionAttributeValues[":bg"] = input.backgroundImageUrl;
		}
		if (input.narratorAudioUrl !== undefined) {
			updateExpressions.push("#audio = :audio");
			expressionAttributeNames["#audio"] = "narratorAudioUrl";
			expressionAttributeValues[":audio"] = input.narratorAudioUrl;
		}
		if (input.subtitleText !== undefined) {
			updateExpressions.push("#sub = :sub");
			expressionAttributeNames["#sub"] = "subtitleText";
			expressionAttributeValues[":sub"] = input.subtitleText;
		}
		if (input.firstMissionId !== undefined) {
			updateExpressions.push("#mission = :mission");
			expressionAttributeNames["#mission"] = "firstMissionId";
			expressionAttributeValues[":mission"] = input.firstMissionId;
		}

		updateExpressions.push("#updatedAt = :updatedAt");
		expressionAttributeNames["#updatedAt"] = "updatedAt";
		expressionAttributeValues[":updatedAt"] = new Date().toISOString();

		const result = await docClient.send(
			new UpdateCommand({
				TableName: this.tableName,
				Key: { pageId: input.pageId },
				UpdateExpression: `SET ${updateExpressions.join(", ")}`,
				ExpressionAttributeNames: expressionAttributeNames,
				ExpressionAttributeValues: expressionAttributeValues,
				ReturnValues: "ALL_NEW",
			}),
		);

		return result.Attributes as SpecialPageConfig;
	}

	async uploadFile(
		key: string,
		body: Buffer | Uint8Array | Blob | string,
		contentType: string,
	): Promise<string> {
		await s3Client.send(
			new PutObjectCommand({
				Bucket: this.bucketName,
				Key: key,
				Body: body,
				ContentType: contentType,
			}),
		);
		return `https://${this.contentsDomain}/${key}`;
	}
}
