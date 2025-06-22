import { sendToBackground } from "@plasmohq/messaging";
import type { Action } from "kbar";
import { ActionImageForUrl } from "~contents/components/action-image-for-url";
import { TabSwitchShortcut } from "~contents/components/tab-switch-shortcut";
import type {
	SwitchTabRequestBody,
	SwitchTabResponseBody,
} from "~types/background/messages/switch-tab";
import type { ExtendedAction } from "~types/kbar-extend";

// Helper function to safely get hostname from URL
const getHostname = (url?: string) => {
	if (!url) return "";
	try {
		return new URL(url).hostname;
	} catch {
		return url;
	}
};

export const createTabActions = (tabs?: chrome.tabs.Tab[]): Action[] => {
	if (!tabs || !tabs.length) {
		return [];
	}

	// ? Don't show the currently active tab

	const tabActions: ExtendedAction[] = tabs
		.filter((tab) => !tab.active)
		.map((tab) => ({
			id: `tab-${tab.id}`,
			name: tab.title || "Untitled Tab",
			subtitle: getHostname(tab.url),
			keywords: `${tab.title || ""} ${tab.url || ""} tab switch`,
			section: "Recent Tabs",
			icon: <ActionImageForUrl url={tab.url || ""} />,
			shortcut: [<TabSwitchShortcut key={`shortcut-${tab.id}`} />],
			priority: 100, // Higher priority for more recent tabs
			perform: async () => {
				try {
					if (!tab.id) {
						console.error("Tab ID is missing");
						return;
					}

					const response = await sendToBackground<
						SwitchTabRequestBody,
						SwitchTabResponseBody
					>({
						name: "switch-tab",
						body: { tabId: tab.id },
					});

					if (!response.success) {
						console.error("Failed to switch tab:", response.error);
					}
				} catch (error) {
					console.error("Error switching to tab:", error);
				}
			},
		}));

	// Type assertion to satisfy kbar's Action[] return type
	return tabActions as Action[];
};
