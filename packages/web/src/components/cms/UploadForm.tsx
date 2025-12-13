"use client";

import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	InputGroup,
	InputGroupInput,
	InputGroupTextarea,
} from "@/components/ui/input-group";

type ActionResult = {
	success: boolean;
	message: string;
};

type CreateContentAction = (formData: FormData) => Promise<ActionResult>;

interface Content {
	contentId: string;
	title: string;
	htmlContent?: string;
	tags?: string[];
}

interface UploadFormProps {
	createContentAction: CreateContentAction;
	existingContent?: Content | null;
	isEditing?: boolean;
}

export function UploadForm({
	createContentAction,
	existingContent,
	isEditing = false,
}: UploadFormProps) {
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
			if (!isEditing) {
				(event.target as HTMLFormElement).reset(); // Reset form on success only when creating
			}
		} else {
			setErrorMessage(result.message);
		}

		setIsPending(false);
	};

	return (
		<div className="max-w-2xl w-full">
			<h1 className="text-2xl font-bold mb-6 text-center text-foreground">
				{isEditing ? "Edit Content" : "Create New Content"}
			</h1>
			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label
						htmlFor="title"
						className="block text-sm font-medium text-foreground/70 mb-2"
					>
						Title
					</label>
					<InputGroup>
						<InputGroupInput
							type="text"
							name="title"
							id="title"
							required
							disabled={isPending}
							placeholder="Enter the title"
							defaultValue={existingContent?.title || ""}
						/>
					</InputGroup>
				</div>
				<div>
					<label
						htmlFor="tags"
						className="block text-sm font-medium text-foreground/70 mb-2"
					>
						Tags
					</label>
					<InputGroup>
						<InputGroupInput
							type="text"
							name="tags"
							id="tags"
							disabled={isPending}
							placeholder="Enter tags separated by commas (e.g., tech, tutorial, javascript)"
							defaultValue={existingContent?.tags?.join(", ") || ""}
						/>
					</InputGroup>
				</div>
				<div>
					<label
						htmlFor="htmlContent"
						className="block text-sm font-medium text-foreground/70 mb-2"
					>
						HTML Content
					</label>
					<InputGroup>
						<InputGroupTextarea
							name="htmlContent"
							id="htmlContent"
							required
							rows={15}
							disabled={isPending}
							placeholder="Enter the full HTML body"
							defaultValue={existingContent?.htmlContent || ""}
						/>
					</InputGroup>
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
					<Button
						type="submit"
						disabled={isPending}
						className="w-full"
						size="lg"
					>
						{isPending
							? isEditing
								? "Updating..."
								: "Creating..."
							: isEditing
								? "Update Content"
								: "Create Content"}
					</Button>
				</div>
			</form>
		</div>
	);
}
