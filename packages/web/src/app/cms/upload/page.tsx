import { UploadForm } from "../../../components/cms/UploadForm";
import { createContentAction } from "../../../lib/actions/createContent";
import { getContentAction } from "../../../lib/actions/getContent";
import { updateContentAction } from "../../../lib/actions/updateContent";

interface UploadPageProps {
	searchParams: { contentId?: string };
}

export default async function UploadPage({ searchParams }: UploadPageProps) {
	const { contentId } = searchParams;
	const isEditing = !!contentId;

	// If editing, fetch the existing content
	let existingContent = null;
	let contentNotFound = false;

	if (isEditing) {
		try {
			existingContent = await getContentAction(contentId);
			if (!existingContent) {
				contentNotFound = true;
			}
		} catch (error) {
			console.error("Error fetching content:", error);
			contentNotFound = true;
		}
	}

	// If content not found, show error message
	if (isEditing && contentNotFound) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
				<div className="max-w-2xl w-full text-center">
					<h1 className="text-2xl font-bold mb-4 text-red-600">
						Content Not Found
					</h1>
					<p className="text-gray-600 mb-4">
						The content with ID "{contentId}" could not be found.
					</p>
					<a
						href="/cms/upload"
						className="text-blue-600 hover:text-blue-800 underline"
					>
						Create new content instead
					</a>
				</div>
			</div>
		);
	}

	const contentAction = async (formData: FormData) => {
		"use server";
		if (isEditing && contentId) {
			return await updateContentAction(contentId, formData);
		}
		return await createContentAction(formData);
	};

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
						<span className="text-gray-800">CMS</span>
						<span className="mx-2">/</span>
						<span className="text-gray-800">
							{isEditing ? `Edit Content (${contentId})` : "Upload"}
						</span>
					</div>
				</nav>

				<div className="flex items-center justify-center">
					<UploadForm
						createContentAction={contentAction}
						existingContent={existingContent}
						isEditing={isEditing}
					/>
				</div>
			</div>
		</div>
	);
}
