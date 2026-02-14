import { TutorialPlayer } from "@/components/TutorialPlayer";
import { getTutorialConfigAction } from "@/lib/actions/special-page";

export const dynamic = "force-dynamic";

export default async function TutorialPage({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;
	const config = await getTutorialConfigAction();

	// TODO: Pass lang to player for localized subtitles if needed
	console.log(`Tutorial rendered for language: ${lang}`);
	return <TutorialPlayer config={config} />;
}
