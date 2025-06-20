import type { Action } from "kbar";

// Helper function to safely get hostname from URL
const getHostname = (url: string) => {
	try {
		return new URL(url).hostname;
	} catch {
		return url;
	}
};

export const createTabActions = (tabs?: chrome.tabs.Tab[]): Action[] => {
	const parentAction: Action = {
		id: "active-tabs",
		name: "Active Tabs",
		shortcut: ["t"],
		keywords: "tabs open active switch",
		section: "Browse",
		icon: "🗂️",
		subtitle: `Browse ${tabs?.length} open tabs`,
	};

	const tabItems: Action[] = tabs?.map((tab) => ({
		id: `tab-${tab.id}`,
		name: tab.title,
		subtitle: getHostname(tab.url),
		keywords: `${tab.title} ${tab.url}`,
		parent: "active-tabs",
		icon: tab.favIconUrl ? "🗂️" : "🗂️", // Simplified for now
		perform: async () => {
			try {
				await chrome.runtime.sendMessage({
					type: "SWITCH_TO_TAB",
					tabId: tab.id,
				});
			} catch (error) {
				console.error("Error switching to tab:", error);
			}
		},
	}));

	if (!tabItems || !tabItems.length) {
		return [];
	}

	return [parentAction, ...tabItems];
};
