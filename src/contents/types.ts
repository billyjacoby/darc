export interface TabInfo {
	id: number;
	title: string;
	url: string;
	favIconUrl?: string;
}

export interface MessageResponse {
	tabs?: TabInfo[];
	history?: chrome.history.HistoryItem[];
}

export interface ChromeMessage {
	type: string;
	tabId?: number;
	url?: string;
}
