import { useRegisterActions } from "kbar";
import { useMemo } from "react";
import { createHistoryActions } from "./actions/history-actions";
import { createNavigationActions } from "./actions/navigation-actions";
import { createTabActions } from "./actions/tab-actions";

export const useActions = ({
	tabs,
	history,
	refreshAction,
}: {
	tabs?: chrome.tabs.Tab[];
	history?: chrome.history.HistoryItem[];
	refreshAction: () => void;
}) => {
	const actions = useMemo(() => {
		// const themeActions = createThemeActions(theme, toggleTheme);
		const navigationActions = createNavigationActions();
		const historyActions = createHistoryActions(history, refreshAction);
		const tabActions = createTabActions(tabs);

		return [
			// ...themeActions,
			...navigationActions,
			...historyActions,
			...tabActions,
		];
	}, [
		tabs,
		history,
		refreshAction,
		// theme,
		// toggleTheme
	]);

	useRegisterActions(actions, [actions]);
	return actions;
};
