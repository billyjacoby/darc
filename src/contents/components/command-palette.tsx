import { useStorage } from "@plasmohq/storage/hook";
import {
	KBarAnimator,
	KBarPortal,
	KBarPositioner,
	useKBar,
	VisualState,
} from "kbar";
import { useEffect, useRef } from "react";
import { FONT_SIZE, SETTINGS_KEYS } from "~settings";
import { usePalettePosition } from "../hooks/use-palette-position";
import { useTheme } from "../hooks/use-theme";
import { DynamicSearch } from "./dynamic-search";
import { Results } from "./render-results";

// Events kept from reaching the host page while the palette is open
const ISOLATED_EVENTS = [
	"keydown",
	"keyup",
	"keypress",
	"focusin",
	"focusout",
	"paste",
];

export function CommandPalette({
	containerRef,
}: {
	containerRef: React.RefObject<HTMLDivElement>;
}) {
	const { theme } = useTheme();
	const [fontSize] = useStorage<number>(
		SETTINGS_KEYS.FONT_SIZE,
		FONT_SIZE.DEFAULT,
	);
	const { query, isOpen } = useKBar((state) => ({
		isOpen: state.visualState !== VisualState.hidden,
	}));
	const { position, updatePosition, isDragging, setIsDragging, isSnapping } =
		usePalettePosition();

	// Events from inside the shadow DOM are retargeted to its host, so page
	// hotkeys (e.g. GitHub's "s" for search) see keystrokes in the palette as
	// typing outside any input and steal focus. Stop them at the shadow root,
	// which runs after React's handlers and kbar's window capture listener.
	useEffect(() => {
		const root = containerRef.current?.getRootNode();
		if (!isOpen || !(root instanceof ShadowRoot)) return;

		const isolate = (event: Event) => {
			event.stopPropagation();
			// kbar closes on Escape from a window bubble listener, which this blocks
			if (
				event instanceof KeyboardEvent &&
				event.type === "keydown" &&
				event.key === "Escape"
			) {
				query.setVisualState(VisualState.animatingOut);
			}
		};

		for (const type of ISOLATED_EVENTS) root.addEventListener(type, isolate);
		return () => {
			for (const type of ISOLATED_EVENTS) {
				root.removeEventListener(type, isolate);
			}
		};
	}, [isOpen, containerRef, query]);
	const dragRef = useRef<{
		startX: number;
		startY: number;
		offsetX: number;
		offsetY: number;
	} | null>(null);

	useEffect(() => {
		console.log("theme", theme);
	}, [theme]);

	const handleMouseDown = (e: React.MouseEvent) => {
		// Only start dragging on left click
		if (e.button !== 0) return;

		// Don't start dragging if clicking on interactive elements (input, button, etc.)
		const target = e.target as HTMLElement;
		if (
			target.tagName === "INPUT" ||
			target.tagName === "BUTTON" ||
			target.closest('input, button, [role="button"]')
		) {
			return;
		}

		const containerRect = e.currentTarget.getBoundingClientRect();
		dragRef.current = {
			startX: e.clientX,
			startY: e.clientY,
			offsetX: e.clientX - containerRect.left,
			offsetY: e.clientY - containerRect.top,
		};

		setIsDragging(true);

		const handleMouseMove = (e: MouseEvent) => {
			if (!dragRef.current) return;

			const newX = e.clientX - dragRef.current.offsetX;
			const newY = e.clientY - dragRef.current.offsetY;

			updatePosition({ x: newX, y: newY });
		};

		const handleMouseUp = () => {
			setIsDragging(false);
			dragRef.current = null;
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	return (
		<>
			<KBarPortal container={containerRef.current}>
				<div
					className={`plasmo-portal ${theme}`}
					style={{ "--darc-font-size": `${fontSize}px` } as React.CSSProperties}
				>
					<KBarPositioner
						className="fixed inset-0 z-[9999]"
						style={{
							backdropFilter: "blur(4px)",
							backgroundColor: "rgba(0,0,0,0.2)",
						}}
					>
						<div
							className={`absolute ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
							style={{
								left: `${position.x}px`,
								top: `${position.y}px`,
								width: "min(800px, calc(100vw - 32px))",
								transition: isSnapping
									? "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
									: "none",
							}}
							onMouseDown={handleMouseDown}
							role="dialog"
							aria-label="Command palette - drag to move"
						>
							<KBarAnimator className="w-full bg-popover text-popover-foreground rounded-2xl overflow-hidden border-2 border-foreground/50">
								<DynamicSearch />
								<Results />
							</KBarAnimator>
						</div>
					</KBarPositioner>
				</div>
			</KBarPortal>
		</>
	);
}
