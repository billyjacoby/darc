export interface SwitchTabRequestBody {
	tabId: number;
}

export interface SwitchTabResponseBody {
	success: boolean;
	error?: string;
}
