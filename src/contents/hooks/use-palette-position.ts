import { Storage } from "@plasmohq/storage";
import { useCallback, useEffect, useState } from "react";

export interface PalettePosition {
	x: number;
	y: number;
}

const getDefaultPosition = (): PalettePosition => ({
	x: Math.max(0, window.innerWidth / 2 - 400), // Center horizontally (400px is half of max-width 800px)
	y: Math.max(0, window.innerHeight * 0.14), // Default 14vh from top
});

const storage = new Storage();

// Snap threshold in pixels - how close to center before snapping
const SNAP_THRESHOLD = 50;

export function usePalettePosition() {
	const [position, setPosition] = useState<PalettePosition>(
		getDefaultPosition(),
	);
	const [isDragging, setIsDragging] = useState(false);
	const [isSnapping, setIsSnapping] = useState(false);

	useEffect(() => {
		// Load position from storage on mount
		storage.get("palette-position").then((savedPosition) => {
			if (savedPosition) {
				try {
					const parsedPosition =
						typeof savedPosition === "string"
							? JSON.parse(savedPosition)
							: savedPosition;
					setPosition(parsedPosition as PalettePosition);
				} catch (error) {
					console.error("Failed to parse saved position:", error);
				}
			}
		});
	}, []);

	const updatePosition = useCallback(async (newPosition: PalettePosition) => {
		// Calculate center position
		const centerX = window.innerWidth / 2 - 400; // 400px is half of max-width 800px
		const centerY = window.innerHeight * 0.14; // Default 14vh from top

		// Check if position is close to center and snap if within threshold
		const distanceFromCenterX = Math.abs(newPosition.x - centerX);
		const distanceFromCenterY = Math.abs(newPosition.y - centerY);

		let finalPosition = { ...newPosition };
		let shouldSnap = false;

		// Snap to center if close enough
		if (
			distanceFromCenterX < SNAP_THRESHOLD &&
			distanceFromCenterY < SNAP_THRESHOLD
		) {
			finalPosition = {
				x: centerX,
				y: centerY,
			};
			shouldSnap = true;
		}

		// Ensure position stays within viewport bounds
		const boundedPosition = {
			x: Math.max(0, Math.min(finalPosition.x, window.innerWidth - 800)), // 800px is max-width
			y: Math.max(0, Math.min(finalPosition.y, window.innerHeight - 100)), // Leave some space at bottom
		};

		// If we're snapping, trigger animation
		if (shouldSnap) {
			setIsSnapping(true);
			// Clear snapping state after animation completes
			setTimeout(() => setIsSnapping(false), 300);
		}

		setPosition(boundedPosition);
		await storage.set("palette-position", boundedPosition);
	}, []);

	const resetPosition = useCallback(async () => {
		const resetPos = getDefaultPosition();
		setIsSnapping(true);
		setPosition(resetPos);
		await storage.set("palette-position", resetPos);
		// Clear snapping state after animation completes
		setTimeout(() => setIsSnapping(false), 300);
	}, []);

	return {
		position,
		updatePosition,
		resetPosition,
		isDragging,
		setIsDragging,
		isSnapping,
	};
}
