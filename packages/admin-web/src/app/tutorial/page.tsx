import { TutorialForm } from "@/components/TutorialForm";
import { getTutorialConfigAction } from "@/lib/actions/special-page";

export const dynamic = "force-dynamic";

export default async function TutorialPage() {
	const config = await getTutorialConfigAction();

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="max-w-4xl mx-auto">
				{/* Breadcrumb */}
				<nav className="mb-6">
					<div className="text-sm text-gray-600">
						<a href="/" className="hover:text-gray-800">
							Home
						</a>
						<span className="mx-2">/</span>
						<span className="text-gray-800">Tutorial Config</span>
					</div>
				</nav>

				<TutorialForm initialConfig={config} />
			</div>
		</div>
	);
}
