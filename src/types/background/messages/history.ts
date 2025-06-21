export type HistoryRequestBody =
	| {
			search?: string;
			maxResults?: number;
	  }
	| undefined;

export type HistoryResponseBody = {
	history: chrome.history.HistoryItem[];
};
