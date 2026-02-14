import type { SpecialPageConfig, UpdateSpecialPageInput } from "./special-page";
import { SpecialPageRepository } from "./special-page-repository";

export class SpecialPageService {
	private readonly repository: SpecialPageRepository;

	constructor() {
		this.repository = new SpecialPageRepository();
	}

	async getSpecialPage(pageId: string): Promise<SpecialPageConfig | null> {
		return this.repository.get(pageId);
	}

	async updateSpecialPage(
		input: UpdateSpecialPageInput,
	): Promise<SpecialPageConfig> {
		return this.repository.update(input);
	}

	async uploadFile(
		key: string,
		body: Buffer | Uint8Array | Blob | string,
		contentType: string,
	): Promise<string> {
		return this.repository.uploadFile(key, body, contentType);
	}
}
