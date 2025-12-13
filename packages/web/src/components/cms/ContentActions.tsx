"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteContentAction } from "@/lib/actions/deleteContent";

interface ContentActionsProps {
	contentId: string;
}

export function ContentActions({ contentId }: ContentActionsProps) {
	const [isDeleting, setIsDeleting] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const handleDelete = async () => {
		if (!showConfirm) {
			setShowConfirm(true);
			return;
		}

		setIsDeleting(true);
		try {
			const result = await deleteContentAction(contentId);
			if (result.success) {
				// The page will refresh due to revalidatePath in the action
				window.location.reload();
			} else {
				alert(result.message);
			}
		} catch (error) {
			console.error("Error deleting content:", error);
			alert("Failed to delete content. Please try again.");
		} finally {
			setIsDeleting(false);
			setShowConfirm(false);
		}
	};

	const handleCancelDelete = () => {
		setShowConfirm(false);
	};

	if (showConfirm) {
		return (
			<div className="flex gap-2">
				<Button
					variant="destructive"
					size="sm"
					onClick={handleDelete}
					disabled={isDeleting}
				>
					{isDeleting ? "Deleting..." : "Confirm"}
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={handleCancelDelete}
					disabled={isDeleting}
				>
					Cancel
				</Button>
			</div>
		);
	}

	return (
		<div className="flex gap-2">
			<Link href={`/cms/upload?contentId=${contentId}`}>
				<Button variant="outline" size="sm">
					Edit
				</Button>
			</Link>
			<Button
				variant="destructive"
				size="sm"
				onClick={handleDelete}
				disabled={isDeleting}
			>
				Delete
			</Button>
		</div>
	);
}
