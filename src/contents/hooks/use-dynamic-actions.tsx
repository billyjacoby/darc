import type { Action } from "kbar";
import { Search, Settings } from "lucide-react";
import { useMemo } from "react";
import { ActionImageForUrl } from "~contents/components/action-image-for-url";
import type { Bookmark } from "~types/background/messages/bookmarks";
import type {
	DomainSuggestion,
	DomainSuggestionSource,
} from "~types/background/messages/domain-suggestions";
import { BROWSER_NAME, toDisplayUrl, toInternalUrl } from "~utils/browser";
import { LOCAL_ADDRESS_PATTERN, normalizeDomainQuery } from "~utils/domain";
import { openUrl } from "~utils/open-url";
import { useBookmarks } from "./queries/use-bookmarks";
import { useDomainSuggestions } from "./queries/use-domain-suggestions";

// Max domain suggestions listed in the results (the palette shows 4 rows total)
const MAX_LISTED_SUGGESTIONS = 2;

// Shared object so kbar ranks the whole section above fuzzy-matched sections
// and the top suggestion (the ghost-text completion) is what Enter opens
const NAVIGATION_SECTION = { name: "Navigation", priority: 1000 };

// Max bookmarks listed, ranked just below navigation
const MAX_LISTED_BOOKMARKS = 2;
const BOOKMARKS_SECTION = { name: "Bookmarks", priority: 500 };

const SOURCE_LABELS: Record<DomainSuggestionSource, string> = {
	"top-sites": "Frequently visited",
	history: "From your history",
	popular: "Popular site",
};

// Anything that already names its scheme, e.g. https://, brave://, file://
const SCHEME_PATTERN = /^[a-z][a-z\d+.-]*:\/\//i;

// "settings <query>" searches the browser's settings pages
const SETTINGS_SEARCH_PATTERN = /^settings?\s+(.+)$/i;

const isLocalAddress = (input: string) =>
	LOCAL_ADDRESS_PATTERN.test(input.trim());

// Local addresses rarely serve HTTPS, so they default to http://
const toUrl = (input: string) => {
	const trimmed = input.trim();
	if (SCHEME_PATTERN.test(trimmed)) return toInternalUrl(trimmed);
	return `${isLocalAddress(trimmed) ? "http" : "https"}://${trimmed}`;
};

// Helper function to detect if input resembles a URL
const isUrlLike = (input: string): boolean => {
	if (!input) return false;
	if (isLocalAddress(input)) return true;

	// Check for common URL patterns
	const urlPatterns = [
		SCHEME_PATTERN, // starts with a scheme, e.g. https:// or brave://
		/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/i, // domain.tld format
		/\.[a-zA-Z]{2,}$/i, // ends with .tld
	];

	return urlPatterns.some((pattern) => pattern.test(input.trim()));
};

// Helper function to create URL navigation action
const createUrlAction = (input: string): Action => ({
	id: "navigate-to-url",
	name: `Go to ${input}`,
	subtitle: "Navigate to this URL",
	keywords: `${input} url navigate go`,
	section: NAVIGATION_SECTION,
	icon: "🌐",
	priority: 200, // High priority for URL actions
	perform: () => openUrl(toUrl(input)),
});

const createSettingsSearchAction = (input: string, query: string): Action => ({
	id: "settings-search",
	name: `Search ${BROWSER_NAME} settings for "${query}"`,
	subtitle: "Open settings filtered to this search",
	// kbar fuzzy-filters registered actions against the input, so include it verbatim
	keywords: input,
	section: NAVIGATION_SECTION,
	icon: <Settings />,
	priority: 400, // Typing the "settings" prefix is an explicit ask
	perform: () =>
		openUrl(`chrome://settings/?search=${encodeURIComponent(query)}`),
});

const createSuggestionAction = (
	input: string,
	suggestion: DomainSuggestion,
	index: number,
): Action => ({
	id: `domain-suggestion-${suggestion.domain}`,
	name: suggestion.domain,
	subtitle: SOURCE_LABELS[suggestion.source],
	// kbar fuzzy-filters registered actions against the input, so include it verbatim
	keywords: `${input},${suggestion.domain}`,
	section: NAVIGATION_SECTION,
	icon: <ActionImageForUrl url={suggestion.url} />,
	priority: 300 - index, // Above the plain "Go to" action
	perform: () => {
		openUrl(suggestion.url);
	},
});

const getHostname = (url: string) => {
	try {
		return new URL(url).hostname || toDisplayUrl(url);
	} catch {
		return url;
	}
};

const createBookmarkAction = (
	input: string,
	bookmark: Bookmark,
	index: number,
): Action => ({
	id: `bookmark-${bookmark.id}`,
	name: bookmark.title,
	subtitle: getHostname(bookmark.url),
	// kbar fuzzy-filters registered actions against the input, so include it verbatim
	keywords: `${input},${bookmark.title},${bookmark.url}`,
	section: BOOKMARKS_SECTION,
	icon: <ActionImageForUrl url={bookmark.url} />,
	priority: 100 - index,
	perform: () => openUrl(bookmark.url),
});

// Helper function to create web search action
const createSearchAction = (input: string): Action => ({
	id: "web-search",
	name: `Search for "${input}"`,
	subtitle: "Search the web using Google",
	keywords: `${input} search google web`,
	section: "Search",
	icon: <Search />,
	priority: 190, // High priority but lower than URL
	perform: () => {
		const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(input)}`;
		openUrl(searchUrl);
	},
});

/**
 * Actions derived from the current search input, plus the inline completion
 * (the untyped remainder of the top domain suggestion) for ghost text.
 */
export const useDynamicActions = (input: string) => {
	const { suggestions } = useDomainSuggestions(input);
	const { bookmarks } = useBookmarks(input);

	return useMemo(() => {
		const actions: Action[] = [];
		const topSuggestion = suggestions[0];

		// Only complete when the typed text is a literal prefix of the domain,
		// so the ghost text reads as a continuation of what's in the input
		const typed = input.toLowerCase();
		const completion =
			topSuggestion?.domain.startsWith(typed) && topSuggestion.domain !== typed
				? topSuggestion.domain.slice(typed.length)
				: "";

		actions.push(
			...suggestions
				.slice(0, MAX_LISTED_SUGGESTIONS)
				.map((suggestion, index) =>
					createSuggestionAction(input, suggestion, index),
				),
		);

		actions.push(
			...bookmarks
				.slice(0, MAX_LISTED_BOOKMARKS)
				.map((bookmark, index) => createBookmarkAction(input, bookmark, index)),
		);

		const settingsQuery = input.match(SETTINGS_SEARCH_PATTERN)?.[1].trim();
		if (settingsQuery) {
			actions.push(createSettingsSearchAction(input, settingsQuery));
		}

		if (input && input.length > 2) {
			const isSuggested = suggestions.some(
				(suggestion) => suggestion.domain === normalizeDomainQuery(input),
			);
			if (isUrlLike(input) && !isSuggested) {
				actions.push(createUrlAction(input));
			}

			// Always show search option for non-empty input
			actions.push(createSearchAction(input));
		}

		return { actions, completion };
	}, [input, suggestions, bookmarks]);
};
