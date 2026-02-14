export interface SpecialPageConfig {
	pageId: string;
	backgroundImageUrl?: string;
	narratorAudioUrl?: string;
	subtitleText?: string;
	firstMissionId?: string;
	updatedAt?: string;
}

export interface UpdateSpecialPageInput {
	pageId: string;
	backgroundImageUrl?: string;
	narratorAudioUrl?: string;
	subtitleText?: string;
	firstMissionId?: string;
}
