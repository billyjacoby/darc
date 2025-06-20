import type { Action } from "kbar";

// Helper function to safely get hostname from URL
const getHostname = (url: string) => {
	try {
		return new URL(url).hostname;
	} catch {
		return url;
	}
};

export const createHistoryActions = (
	history?: chrome.history.HistoryItem[],
	refreshAction?: () => void,
): Action[] => {
	const parentAction: Action = {
		id: "browser-history",
		name: "Browser History",
		shortcut: ["h"],
		keywords: "history browse recent",
		section: "Browse",
		icon: "🕒",
		subtitle: `Browse recent history (${Math.min(history?.length || 0, 20)} items)`,
	};

	const refreshDataAction: Action = {
		id: "refresh-data",
		name: "Refresh History",
		shortcut: ["r"],
		keywords: "refresh reload history",
		section: "Actions",
		icon: "🔄",
		perform: refreshAction,
	};

	const historyItems: Action[] = history?.length
		? history.slice(0, 20).map((item) => ({
				id: `history-${item.id}`,
				name: item.title || "Untitled",
				subtitle: `${getHostname(item.url || "")} • ${
					item.lastVisitTime
						? new Date(item.lastVisitTime).toLocaleString()
						: "Unknown time"
				}`,
				keywords: `${item.title || ""} ${item.url || ""}`,
				parent: "browser-history",
				icon: "🕒",
				perform: () => {
					if (item.url) {
						window.open(item.url, "_blank");
					}
				},
			}))
		: [];

	return [parentAction, refreshDataAction, ...historyItems];
};
