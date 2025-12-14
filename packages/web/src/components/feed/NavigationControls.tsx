"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../ui/button";

// Navigation Controls
export const NavigationControls = ({
	hasPrev,
	hasNext,
	onPrev,
	onNext,
	isLoading,
}: {
	hasPrev: boolean;
	hasNext: boolean;
	onPrev: () => void;
	onNext: () => void;
	isLoading: boolean;
}) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowUp" && hasPrev && !isLoading) onPrev();
			if (e.key === "ArrowDown" && hasNext && !isLoading) onNext();
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [hasPrev, hasNext, onPrev, onNext, isLoading]);

	return (
		<div className="absolute bottom-1 right-3 flex flex-col gap-1">
			<Button
				size="icon"
				onClick={onPrev}
				disabled={!hasPrev || isLoading}
				className="rounded-full"
				title="Previous (Arrow Up)"
			>
				<ChevronUp className="size-4" />
			</Button>

			<Button
				size="icon"
				onClick={onNext}
				disabled={!hasNext || isLoading}
				className="rounded-full"
				title="Next (Arrow Down)"
			>
				<ChevronDown className="size-4" />
			</Button>
		</div>
	);
};
