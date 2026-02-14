"use server";

import { SpecialPageService } from "@zifiv/feeds";

const TUTORIAL_PAGE_ID = "tutorial";

export async function getTutorialConfigAction() {
	try {
		const service = new SpecialPageService();
		return await service.getSpecialPage(TUTORIAL_PAGE_ID);
	} catch (error) {
		console.error("Failed to get tutorial config:", error);
		return null;
	}
}
