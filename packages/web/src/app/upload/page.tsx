import { createContentAction } from "../../components/upload/actions";
import { UploadForm } from "../../components/upload/UploadForm";

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
