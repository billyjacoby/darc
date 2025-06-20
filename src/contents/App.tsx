import { Storage } from "@plasmohq/storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import cssText from "data-text:~/style.css";
import { KBarProvider, useKBar } from "kbar";
import type { PlasmoCSConfig } from "plasmo";
import { useEffect, useState } from "react";
import { SHORTCUT_EVENTS } from "~constants";
import { CommandPalette } from "./components/command-palette";
import { useActions } from "./hooks/use-actions";
import { useActiveTabs } from "./hooks/use-active-tabs";
import { useHistory } from "./hooks/use-history";

export const config: PlasmoCSConfig = {
	matches: ["<all_urls>"],
};

// Inject styles for both shadow DOM and portal content
export const getStyle = () => {
	// Create style for shadow DOM
	const style = document.createElement("style");
	style.textContent = cssText;

	const div = document.createElement("div");
	div.id = "extension-kbar-thing";
	document.body.appendChild(div);

	// // Create style for portal content
	const portalStyle = document.createElement("style");
	portalStyle.textContent = cssText;
	document.head.appendChild(portalStyle);

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
	const { mutate: searchHistory, data: history } = useHistory();
	const { data: activeTabs } = useActiveTabs();
	console.log("🪵 | App | activeTabs:", activeTabs);
	const { query, disabled } = useKBar((state) => ({
		disabled: state.disabled,
	}));

	console.log("🪵 | const{query,disabled}=useKBar | disabled:", disabled);
	useActions({ tabs: activeTabs, history, refreshAction: () => {} });

	useEffect(() => {
		searchHistory("");
	}, [searchHistory]);

	useEffect(() => {
		// Listen for messages from the background script
		const handleMessage = (
			message: any,
			_sender: chrome.runtime.MessageSender,
			_sendResponse: (response?: any) => void,
		) => {
			if (message.type === SHORTCUT_EVENTS.OPEN_PALETTE.type) {
				console.log("Toggle sidebar message received at:", message.triggeredAt);

				query.toggle();
			}
		};

		// Add the message listener
		chrome.runtime.onMessage.addListener(handleMessage);

		// Cleanup function to remove the listener
		return () => {
			chrome.runtime.onMessage.removeListener(handleMessage);
		};
	}, [query]);

	return <CommandPalette />;
}

const AppWithProviders = () => {
	const [queryClient] = useState(new QueryClient());
	return (
		<QueryClientProvider client={queryClient}>
			<KBarProvider
				options={{
					disableScrollbarManagement: true,
					disableDocumentLock: true,
					// Disable default keyboard shortcuts
					callbacks: {
						onOpen: () => {
							console.log("onOpen");
						},
						onClose: () => {
							console.log("onClose");
						},
					},
					enableHistory: true,
					animations: {
						enterMs: 200,
						exitMs: 100,
					},
					toggleShortcut: "ignoreme",
				}}
			>
				<App />
			</KBarProvider>
		</QueryClientProvider>
	);
};

export default AppWithProviders;
