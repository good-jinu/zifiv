import { TutorialPlayer } from "@/components/TutorialPlayer";
import { getTutorialConfigAction } from "@/lib/actions/special-page";

export const dynamic = "force-dynamic";

export default async function TutorialPage() {
	const config = await getTutorialConfigAction();

	return <TutorialPlayer config={config} />;
}
