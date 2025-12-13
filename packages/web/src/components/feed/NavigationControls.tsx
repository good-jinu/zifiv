"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect } from "react";

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
		<div className="absolute bottom-2 right-4 flex flex-col gap-4">
			<button
				type="button"
				onClick={onPrev}
				disabled={!hasPrev || isLoading}
				className="bg-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
				title="Previous (Arrow Up)"
			>
				<ChevronUp size={24} className="text-purple-600" />
			</button>

			{isLoading && (
				<div className="bg-white rounded-full p-4 shadow-lg">
					<div className="animate-spin h-6 w-6 border-3 border-purple-600 border-t-transparent rounded-full" />
				</div>
			)}

			<button
				type="button"
				onClick={onNext}
				disabled={!hasNext || isLoading}
				className="bg-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
				title="Next (Arrow Down)"
			>
				<ChevronDown size={24} className="text-purple-600" />
			</button>
		</div>
	);
};
