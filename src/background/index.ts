import "~utils/disable-logs";
import {
	CONTENT_SCRIPTS_FILE,
	NEW_TAB_PATH,
	PALETTE_WINDOW,
	SHORTCUT_EVENTS,
} from "../constants";

// How long to wait for an injected content script to start listening
const INJECT_RETRY_MS = 50;
const INJECT_MAX_RETRIES = 20;

// Dev builds declare content scripts, so every page gets the palette up front.
// Store builds don't (see scripts/on-demand-content-scripts.mjs) and list
// the files to inject when the palette is first opened in a tab instead.
const declaredContentScripts =
	chrome.runtime
		.getManifest()
		.content_scripts?.flatMap((script) => script.js ?? []) ?? [];

const getContentScriptFiles = async (): Promise<string[]> => {
	if (declaredContentScripts.length) return declaredContentScripts;
	const response = await fetch(chrome.runtime.getURL(CONTENT_SCRIPTS_FILE));
	return response.json();
};

// Tabs being injected into, so a quick second press doesn't inject twice
const injectingTabIds = new Set<number>();

const paletteWindowUrl = () => chrome.runtime.getURL(PALETTE_WINDOW.PATH);

const findPaletteWindow = async () => {
	const windows = await chrome.windows.getAll({
		populate: true,
		windowTypes: ["popup"],
	});
	return windows.find((window) =>
		window.tabs?.some((tab) => tab.url?.startsWith(paletteWindowUrl())),
	);
};

const sendToggleMessage = async (tabId: number, type: string) => {
	try {
		await chrome.tabs.sendMessage(tabId, { type });
		return true;
	} catch {
		// No content script listening in this tab
		return false;
	}
};

// Add the palette to a tab that has no live content script: every tab in
// store builds, or tabs opened before the extension (re)loaded in dev.
// activeTab, granted by the shortcut or toolbar button, permits this on any
// web page.
const injectAndToggle = async (tab: chrome.tabs.Tab, type: string) => {
	if (!tab.id) return false;
	const tabId = tab.id;
	if (injectingTabIds.has(tabId)) return true;

	// With declared content scripts, a tab that's still loading gets one soon,
	// and injecting now as well would leave two palettes in the page
	if (declaredContentScripts.length && tab.status !== "complete") return false;

	injectingTabIds.add(tabId);
	try {
		const files = await getContentScriptFiles();
		await chrome.scripting.executeScript({ target: { tabId }, files });

		for (let attempt = 0; attempt < INJECT_MAX_RETRIES; attempt++) {
			if (await sendToggleMessage(tabId, type)) return true;
			await new Promise((resolve) => setTimeout(resolve, INJECT_RETRY_MS));
		}
		return false;
	} catch {
		// Browser pages, the web store, etc. can't be scripted
		return false;
	} finally {
		injectingTabIds.delete(tabId);
	}
};

// Our new tab page is an extension page, which content script messages
// don't reach, so broadcast and let the page match its own tab id
const toggleNewTabPalette = async (tab: chrome.tabs.Tab, type: string) => {
	if (!tab.url?.startsWith(chrome.runtime.getURL(NEW_TAB_PATH))) return false;

	try {
		await chrome.runtime.sendMessage({ type, tabId: tab.id });
		return true;
	} catch {
		return false;
	}
};

// Content scripts can't run on browser pages or the web store, so the
// palette opens in its own window centered over the browser instead
const openPaletteWindow = async () => {
	const browserWindow = await chrome.windows
		.getLastFocused({ windowTypes: ["normal"] })
		.catch(() => undefined);

	const width = Math.min(
		PALETTE_WINDOW.WIDTH,
		(browserWindow?.width ?? PALETTE_WINDOW.WIDTH + 32) - 32,
	);

	await chrome.windows.create({
		url: paletteWindowUrl(),
		type: "popup",
		focused: true,
		width,
		height: PALETTE_WINDOW.INITIAL_HEIGHT,
		...(browserWindow?.width !== undefined && {
			left: Math.round(
				(browserWindow.left ?? 0) + (browserWindow.width - width) / 2,
			),
			top: Math.round(
				(browserWindow.top ?? 0) + (browserWindow.height ?? 0) * 0.14,
			),
		}),
	});
};

const togglePalette = async (type: string) => {
	const paletteWindow = await findPaletteWindow();
	if (paletteWindow?.id) {
		await chrome.windows.remove(paletteWindow.id);
		return;
	}

	const [tab] = await chrome.tabs.query({
		active: true,
		lastFocusedWindow: true,
	});

	if (tab?.id) {
		if (await toggleNewTabPalette(tab, type)) return;
		if (await sendToggleMessage(tab.id, type)) return;
		if (await injectAndToggle(tab, type)) return;
	}

	await openPaletteWindow();
};

// The toolbar button does the same as the shortcut
chrome.action.onClicked.addListener(() => {
	togglePalette(SHORTCUT_EVENTS.OPEN_PALETTE.type);
});

chrome.commands.onCommand.addListener((command) => {
	const event = Object.values(SHORTCUT_EVENTS).find(
		(event) => event.command === command,
	);

	if (event?.type === SHORTCUT_EVENTS.OPEN_PALETTE.type) {
		togglePalette(event.type);
	}
});
