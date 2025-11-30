"use client";

import { type FormEvent, useState } from "react";

type ActionResult = {
	success: boolean;
	message: string;
};

type CreateContentAction = (formData: FormData) => Promise<ActionResult>;

interface UploadFormProps {
	createContentAction: CreateContentAction;
}

export function UploadForm({ createContentAction }: UploadFormProps) {
	const [isPending, setIsPending] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsPending(true);
		setErrorMessage(null);
		setSuccessMessage(null);

		const formData = new FormData(event.currentTarget);
		const result = await createContentAction(formData);

		if (result.success) {
			setSuccessMessage(result.message);
			(event.target as HTMLFormElement).reset(); // Reset form on success
		} else {
			setErrorMessage(result.message);
		}

		setIsPending(false);
	};

	return (
		<div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
			<h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
				Create New Content
			</h1>
			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label
						htmlFor="title"
						className="block text-sm font-medium text-gray-700"
					>
						Title
					</label>
					<input
						type="text"
						name="title"
						id="title"
						required
						disabled={isPending}
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm disabled:bg-gray-50"
						placeholder="Enter the title"
					/>
				</div>
				<div>
					<label
						htmlFor="htmlContent"
						className="block text-sm font-medium text-gray-700"
					>
						HTML Content
					</label>
					<textarea
						name="htmlContent"
						id="htmlContent"
						required
						rows={15}
						disabled={isPending}
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm disabled:bg-gray-50"
						placeholder="Enter the full HTML body"
					/>
				</div>

				{successMessage && (
					<div className="p-4 bg-green-100 text-green-800 rounded-md">
						{successMessage}
					</div>
				)}

				{errorMessage && (
					<div className="p-4 bg-red-100 text-red-800 rounded-md">
						{errorMessage}
					</div>
				)}

				<div>
					<button
						type="submit"
						disabled={isPending}
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-300"
					>
						{isPending ? "Creating..." : "Create Content"}
					</button>
				</div>
			</form>
		</div>
	);
}
