import type { Action } from "kbar";
import {
	Bookmark,
	Download,
	FlaskConical,
	Gift,
	History,
	Keyboard,
	type LucideIcon,
	Puzzle,
	Settings,
	Shield,
	Wallet,
} from "lucide-react";
import { BROWSER_NAME, isBrave, toDisplayUrl } from "~utils/browser";
import { openUrl } from "~utils/open-url";

interface BrowserPage {
	url: string;
	name: string;
	keywords: string;
	icon?: LucideIcon;
}

const BROWSER_PAGES: BrowserPage[] = [
	{ url: "chrome://settings", name: "Settings", keywords: "preferences" },
	{
		url: "chrome://settings/privacy",
		name: "Privacy and security",
		keywords: "permissions tracking",
	},
	{
		url: "chrome://settings/clearBrowserData",
		name: "Clear browsing data",
		keywords: "cache cookies history delete",
	},
	{
		url: "chrome://settings/cookies",
		name: "Cookies",
		keywords: "third-party site data",
	},
	{
		url: "chrome://settings/content",
		name: "Site settings",
		keywords:
			"permissions camera microphone location notifications javascript popups",
	},
	{
		url: "chrome://settings/security",
		name: "Security",
		keywords: "safe browsing https dns",
	},
	{
		url: "chrome://settings/appearance",
		name: "Appearance",
		keywords: "theme dark mode font zoom toolbar bookmarks bar",
	},
	{
		url: "chrome://settings/search",
		name: "Search engine",
		keywords: "default google duckduckgo",
	},
	{
		url: "chrome://settings/searchEngines",
		name: "Manage search engines",
		keywords: "site search shortcuts",
	},
	{
		url: "chrome://settings/onStartup",
		name: "On startup",
		keywords: "restore tabs homepage",
	},
	{
		url: "chrome://settings/languages",
		name: "Languages",
		keywords: "spell check translate",
	},
	{
		url: "chrome://settings/downloads",
		name: "Download location",
		keywords: "save folder ask where",
	},
	{
		url: "chrome://settings/autofill",
		name: "Autofill",
		keywords: "addresses payment cards forms",
	},
	{
		url: "chrome://settings/passwords",
		name: "Passwords",
		keywords: "password manager logins",
	},
	{
		url: "chrome://settings/accessibility",
		name: "Accessibility",
		keywords: "captions focus highlight",
	},
	{
		url: "chrome://settings/system",
		name: "System",
		keywords: "hardware acceleration proxy background memory",
	},
	{
		url: "chrome://settings/reset",
		name: "Reset settings",
		keywords: "restore defaults",
	},
	{
		url: "chrome://settings/help",
		name: `About ${BROWSER_NAME}`,
		keywords: "version update",
	},
	{
		url: "chrome://extensions",
		name: "Extensions",
		keywords: "addons manage",
		icon: Puzzle,
	},
	{
		url: "chrome://extensions/shortcuts",
		name: "Extension keyboard shortcuts",
		keywords: "hotkeys commands keybindings",
		icon: Keyboard,
	},
	{
		url: "chrome://history",
		name: "History page",
		keywords: "browsing visited",
		icon: History,
	},
	{
		url: "chrome://downloads",
		name: "Downloads",
		keywords: "downloaded files",
		icon: Download,
	},
	{
		url: "chrome://bookmarks",
		name: "Bookmarks",
		keywords: "bookmark manager favorites",
		icon: Bookmark,
	},
	{
		url: "chrome://flags",
		name: "Flags",
		keywords: "experiments experimental features",
		icon: FlaskConical,
	},
];

const BRAVE_PAGES: BrowserPage[] = [
	{
		url: "chrome://settings/shields",
		name: "Shields",
		keywords: "ad block trackers fingerprinting",
		icon: Shield,
	},
	{
		url: "chrome://rewards",
		name: "Rewards",
		keywords: "bat tips creators",
		icon: Gift,
	},
	{
		url: "chrome://wallet",
		name: "Wallet",
		keywords: "crypto web3",
		icon: Wallet,
	},
];

export const createBrowserActions = (): Action[] =>
	[...BROWSER_PAGES, ...(isBrave ? BRAVE_PAGES : [])].map(
		({ url, name, keywords, icon: Icon = Settings }) => ({
			id: `browser-page-${url}`,
			name,
			subtitle: toDisplayUrl(url),
			keywords: `${keywords} ${BROWSER_NAME} settings`,
			section: `${BROWSER_NAME} Settings`,
			icon: <Icon />,
			perform: () => openUrl(url),
		}),
	);
