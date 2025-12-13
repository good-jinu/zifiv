import { UploadForm } from "../../components/upload/UploadForm";
import { createContentAction } from "../../lib/actions/createContent";

export default function UploadPage() {
	const contentAction = async (formData: FormData) => {
		"use server";
		return await createContentAction(formData);
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<UploadForm createContentAction={contentAction} />
		</div>
	);
}
