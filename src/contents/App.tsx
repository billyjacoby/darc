import { Storage } from "@plasmohq/storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import cssText from "data-text:~/style.css";
import { KBarProvider, useKBar } from "kbar";
import type { PlasmoCSConfig } from "plasmo";
import { useEffect, useRef, useState } from "react";
import { SHORTCUT_EVENTS } from "~constants";
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

function App() {
	const { query } = useKBar((state) => ({
		disabled: state.disabled,
	}));

	// Initialize actions (the hook handles registration internally)
	useActions();

	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Listen for messages from the background script
		const handleMessage = (
			message: any,
			_sender: chrome.runtime.MessageSender,
			_sendResponse: (response?: any) => void,
		) => {
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

const AppWithProviders = () => {
	const [queryClient] = useState(new QueryClient());
	return (
		<QueryClientProvider client={queryClient}>
			<KBarProvider
				options={{
					disableScrollbarManagement: true,
					disableDocumentLock: true,
					enableHistory: true,
					animations: {
						enterMs: 200,
						exitMs: 100,
					},
					// Disable default keyboard shortcuts
					toggleShortcut: "ignoreme",
				}}
			>
				<App />
			</KBarProvider>
		</QueryClientProvider>
	);
};

export default AppWithProviders;
