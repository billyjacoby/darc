import type { KBarOptions } from "kbar";

export const SHORTCUT_EVENTS = {
	OPEN_PALETTE: {
		command: "open_palette",
		description: "Open command palette",
		type: "OPEN_PALETTE",
	},
} as const;

// Standalone palette window, used where the in-page palette can't run
export const PALETTE_WINDOW = {
	PATH: "tabs/palette.html",
	WIDTH: 800,
	// Resized to fit its content once rendered
	INITIAL_HEIGHT: 360,
} as const;

export const NEW_TAB_PATH = "newtab.html";

export const KBAR_OPTIONS: KBarOptions = {
	disableScrollbarManagement: true,
	disableDocumentLock: true,
	enableHistory: true,
	animations: {
		enterMs: 200,
		exitMs: 100,
	},
	// Disable default keyboard shortcuts
	toggleShortcut: "ignoreme",
};
