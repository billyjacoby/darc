import type { Action } from "kbar";

// Helper function to safely get hostname from URL
const getHostname = (url?: string) => {
	if (!url) return "";
	try {
		return new URL(url).hostname;
	} catch {
		return url;
	}
};

export const createHistoryActions = (
	history?: chrome.history.HistoryItem[],
	refresh?: () => void,
): Action[] => {
	const actions: Action[] = [];

	// Add refresh action for debugging/development
	if (refresh) {
		actions.push({
			id: "refresh-history",
			name: "Refresh History",
			shortcut: ["r", "h"],
			keywords: "refresh reload history data",
			section: "Actions",
			icon: "🔄",
			perform: refresh,
		});
	}

	if (history?.length) {
		const historyActions: Action[] = history.slice(0, 20).map((item) => ({
			id: `history-${item.id}`,
			name: item.title || "Untitled Page",
			subtitle: `${getHostname(item.url)} • ${
				item.lastVisitTime
					? new Date(item.lastVisitTime).toLocaleDateString()
					: "Unknown date"
			}`,
			keywords: `${item.title || ""} ${item.url || ""} ${getHostname(item.url)} history`,
			section: "History",
			icon: "🕒",
			priority: 50, // Lower priority than recent tabs
			perform: () => {
				if (item.url) {
					window.open(item.url, "_blank");
				}
			},
		}));

		actions.push(...historyActions);
	}

	return actions;
};
