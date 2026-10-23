import "~utils/disable-logs";
import cssText from "data-text:~/style.css";
import { Storage } from "@plasmohq/storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { KBarProvider, useKBar, VisualState } from "kbar";
import type { PlasmoCSConfig } from "plasmo";
import { useEffect, useRef, useState } from "react";
import { KBAR_OPTIONS, SHORTCUT_EVENTS } from "~constants";
import { CommandPalette } from "./components/command-palette";
import { useActions } from "./hooks/use-actions";

export const config: PlasmoCSConfig = {
	matches: ["<all_urls>"],
};

// Inject styles for both shadow DOM and portal content
export const getStyle = () => {
	// Create style for shadow DOM
	const style = document.createElement("style");
	style.textContent = cssText;

	return style;
};

// Add theme class to shadow container
export const getShadowContainerClassName = async () => {
	// Get theme from storage
	const storage = new Storage();
	const theme = (await storage.get("theme")) || "dark";
	return theme;
};

interface AppProps {
	// Show the palette as soon as it mounts (used by the new tab page)
	openOnMount?: boolean;
}

function App({ openOnMount }: AppProps) {
	const { query } = useKBar((state) => ({
		disabled: state.disabled,
	}));

	// Initialize actions (the hook handles registration internally)
	useActions();

	const containerRef = useRef<HTMLDivElement>(null);
	// Only known in extension pages; content scripts can't use chrome.tabs
	const tabIdRef = useRef<number>();

	useEffect(() => {
		chrome.tabs?.getCurrent((tab) => {
			tabIdRef.current = tab?.id;
		});
	}, []);

	useEffect(() => {
		if (openOnMount) query.setVisualState(VisualState.animatingIn);
	}, [openOnMount, query]);

	useEffect(() => {
		// Listen for messages from the background script
		const handleMessage = (
			message: { type?: string; tabId?: number },
			_sender: chrome.runtime.MessageSender,
			_sendResponse: (response?: unknown) => void,
		) => {
			// Messages broadcast to extension pages name the tab they're for
			if (message.tabId !== undefined && message.tabId !== tabIdRef.current) {
				return;
			}
			if (message.type === SHORTCUT_EVENTS.OPEN_PALETTE.type) {
				query.toggle();
			}
			_sendResponse({ success: true });
		};

		// Add the message listener
		chrome.runtime.onMessage.addListener(handleMessage);

		// Cleanup function to remove the listener
		return () => {
			chrome.runtime.onMessage.removeListener(handleMessage);
		};
	}, [query]);

	return (
		<>
			<div ref={containerRef} />
			<CommandPalette containerRef={containerRef} />
		</>
	);
}

export const AppWithProviders = (props: AppProps) => {
	const [queryClient] = useState(new QueryClient());
	return (
		<QueryClientProvider client={queryClient}>
			<KBarProvider options={KBAR_OPTIONS}>
				<App openOnMount={props.openOnMount} />
			</KBarProvider>
		</QueryClientProvider>
	);
};

export default AppWithProviders;
