import "~utils/disable-logs";
import "~style.css";

import { useStorage } from "@plasmohq/storage/hook";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { KBarProvider, useKBar, VisualState } from "kbar";
import { useEffect, useRef, useState } from "react";
import { KBAR_OPTIONS } from "~constants";
import { DynamicSearch } from "~contents/components/dynamic-search";
import { Results } from "~contents/components/render-results";
import { useActions } from "~contents/hooks/use-actions";
import { useTheme } from "~contents/hooks/use-theme";
import { FONT_SIZE, SETTINGS_KEYS } from "~settings";

/**
 * The command palette as a standalone window, opened by the background where
 * the in-page palette can't run (browser pages, the web store).
 */
function PaletteWindow() {
	const { theme } = useTheme();
	const [fontSize] = useStorage<number>(
		SETTINGS_KEYS.FONT_SIZE,
		FONT_SIZE.DEFAULT,
	);
	const { query, visualState } = useKBar((state) => ({
		visualState: state.visualState,
	}));
	const panelRef = useRef<HTMLDivElement>(null);
	const hasShown = useRef(false);

	useActions();

	// kbar starts hidden, so show it as soon as the window opens
	useEffect(() => {
		document.title = "Darc";
		query.setVisualState(VisualState.animatingIn);
	}, [query]);

	// Escape and running an action both hide kbar, so close the window with it
	useEffect(() => {
		if (visualState === VisualState.showing) hasShown.current = true;
		if (visualState === VisualState.hidden && hasShown.current) {
			window.close();
		}
	}, [visualState]);

	// Clicking back into the browser dismisses it, like the in-page overlay
	useEffect(() => {
		const handleBlur = () => window.close();
		window.addEventListener("blur", handleBlur);
		return () => window.removeEventListener("blur", handleBlur);
	}, []);

	// Fit the window to the palette as the number of results changes
	useEffect(() => {
		const panel = panelRef.current;
		if (!panel) return;

		const observer = new ResizeObserver(() => {
			const frameHeight = window.outerHeight - window.innerHeight;
			chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, {
				height: Math.ceil(panel.getBoundingClientRect().height) + frameHeight,
			});
		});
		observer.observe(panel);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			className={`plasmo-portal ${theme} min-h-screen bg-popover text-popover-foreground font-sans`}
			style={{ "--darc-font-size": `${fontSize}px` } as React.CSSProperties}
		>
			<div ref={panelRef}>
				<DynamicSearch />
				<Results />
			</div>
		</div>
	);
}

function PaletteWindowWithProviders() {
	const [queryClient] = useState(new QueryClient());
	return (
		<QueryClientProvider client={queryClient}>
			<KBarProvider options={KBAR_OPTIONS}>
				<PaletteWindow />
			</KBarProvider>
		</QueryClientProvider>
	);
}

export default PaletteWindowWithProviders;
