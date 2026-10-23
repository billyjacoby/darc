import "~utils/disable-logs";
import { NEW_TAB_PATH, PALETTE_WINDOW, SHORTCUT_EVENTS } from "../constants";

// How long to wait for an injected content script to start listening
const INJECT_RETRY_MS = 50;
const INJECT_MAX_RETRIES = 20;

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
		const response = await chrome.tabs.sendMessage(tabId, {
			type,
			triggeredAt: new Date().toISOString(),
		});
		chrome.storage.local.set({
			lastMessageResponse: response,
			responseTime: new Date().toISOString(),
		});
		return true;
	} catch {
		// No content script listening in this tab
		return false;
	}
};

// Tabs opened before the extension (re)loaded have no live content script, so
// add one now. activeTab, granted by the keyboard shortcut, permits this on
// any web page.
const injectAndToggle = async (tab: chrome.tabs.Tab, type: string) => {
	// A tab that's still loading gets its content script soon, and injecting
	// now as well would leave two palettes in the page
	if (!tab.id || tab.status !== "complete") return false;

	const files =
		chrome.runtime
			.getManifest()
			.content_scripts?.flatMap((script) => script.js ?? []) ?? [];

	try {
		await chrome.scripting.executeScript({ target: { tabId: tab.id }, files });
	} catch {
		// Browser pages, the web store, etc. can't be scripted
		return false;
	}

	for (let attempt = 0; attempt < INJECT_MAX_RETRIES; attempt++) {
		if (await sendToggleMessage(tab.id, type)) return true;
		await new Promise((resolve) => setTimeout(resolve, INJECT_RETRY_MS));
	}
	return false;
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

chrome.commands.onCommand.addListener((command) => {
	chrome.storage.local.set({
		lastCommand: command,
		lastCommandTime: new Date().toISOString(),
	});

	const event = Object.values(SHORTCUT_EVENTS).find(
		(event) => event.command === command,
	);

	if (event?.type === SHORTCUT_EVENTS.OPEN_PALETTE.type) {
		togglePalette(event.type);
	}
});
