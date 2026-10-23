import { useRegisterActions } from "kbar";
import { useMemo } from "react";
import { createBrowserActions } from "./actions/browser-actions";
import { createHistoryActions } from "./actions/history-actions";
import { createPageActions } from "./actions/page-actions";
import { createPositionActions } from "./actions/position-actions";
import { createTabActions } from "./actions/tab-actions";
import { createThemeActions } from "./actions/theme-actions";
import { useActiveTabs } from "./queries/use-active-tabs";
import { useHistory } from "./queries/use-history";
import { useCurrentUrl } from "./use-current-url";
import { usePalettePosition } from "./use-palette-position";
import { useTheme } from "./use-theme";

// Static, so built once rather than on every render
const browserActions = createBrowserActions();

export const useActions = () => {
	const { data: history } = useHistory();
	const { data: tabs } = useActiveTabs();
	const { theme, toggleTheme } = useTheme();
	const { resetPosition } = usePalettePosition();
	const { hasCurrentUrl, getCurrentUrl } = useCurrentUrl();

	const themeActions = createThemeActions(theme, toggleTheme);
	const positionActions = createPositionActions(resetPosition);

	const actions = useMemo(() => {
		const historyActions = createHistoryActions(history);
		const tabActions = createTabActions(tabs);
		const pageActions = hasCurrentUrl ? createPageActions(getCurrentUrl) : [];

		return [
			...tabActions,
			...historyActions,
			...pageActions,
			...themeActions,
			...positionActions,
			...browserActions,
		];
	}, [
		tabs,
		history,
		hasCurrentUrl,
		getCurrentUrl,
		themeActions,
		positionActions,
	]);

	useRegisterActions(actions, [actions]);

	return { actions };
};
