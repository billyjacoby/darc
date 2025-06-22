import type { Action } from "kbar";
import { useRegisterActions } from "kbar";
import { Search } from "lucide-react";
import { useMemo } from "react";
import { createHistoryActions } from "./actions/history-actions";
import { createTabActions } from "./actions/tab-actions";
import { useActiveTabs } from "./queries/use-active-tabs";
import { useHistory } from "./queries/use-history";

// Helper function to detect if input resembles a URL
const isUrlLike = (input: string): boolean => {
	if (!input) return false;

	// Check for common URL patterns
	const urlPatterns = [
		/^https?:\/\//i, // starts with http:// or https://
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
	section: "Navigation",
	icon: "🌐",
	priority: 200, // High priority for URL actions
	perform: () => {
		const url = input.startsWith("http") ? input : `https://${input}`;
		window.open(url, "_blank");
	},
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
		window.open(searchUrl, "_blank");
	},
});

export const useActions = () => {
	const { data: history, refetch: refetchHistory } = useHistory();
	const { data: tabs } = useActiveTabs();

	const actions = useMemo(() => {
		const historyActions = createHistoryActions(history, refetchHistory);
		const tabActions = createTabActions(tabs);

		return [...tabActions, ...historyActions];
	}, [tabs, history, refetchHistory]);

	useRegisterActions(actions, [actions]);

	// Return actions along with helper functions for dynamic actions
	return {
		actions,
		createDynamicActions: (input: string): Action[] => {
			const dynamicActions: Action[] = [];

			if (input && input.length > 2) {
				if (isUrlLike(input)) {
					dynamicActions.push(createUrlAction(input));
				}

				// Always show search option for non-empty input
				dynamicActions.push(createSearchAction(input));
			}

			return dynamicActions;
		},
	};
};
