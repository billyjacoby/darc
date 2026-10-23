import "~utils/disable-logs";
import "~style.css";

import { useEffect, useState } from "react";
import { NEW_TAB_PATH, SHORTCUT_EVENTS } from "~constants";
import { AppWithProviders } from "~contents/App";
import { useTheme } from "~contents/hooks/use-theme";

// Browsers keep keyboard focus in the address bar on a new tab page override,
// so typing would never reach the palette. Reloading the page by its own URL
// (rather than as the new tab page) gives the page focus instead.
const FOCUSED_PARAM = "focused";

function NewTab() {
	const { theme } = useTheme();
	const [shortcut, setShortcut] = useState<string>();
	const isFocused = new URLSearchParams(location.search).has(FOCUSED_PARAM);

	useEffect(() => {
		document.title = "New Tab";
		if (isFocused) return;

		chrome.tabs.getCurrent((tab) => {
			if (!tab?.id) return;
			chrome.tabs.update(tab.id, {
				url: chrome.runtime.getURL(`${NEW_TAB_PATH}?${FOCUSED_PARAM}`),
			});
		});
	}, [isFocused]);

	useEffect(() => {
		chrome.commands.getAll((commands) => {
			setShortcut(
				commands.find(
					(command) => command.name === SHORTCUT_EVENTS.OPEN_PALETTE.command,
				)?.shortcut,
			);
		});
	}, []);

	return (
		<div
			className={`plasmo-portal ${theme} min-h-screen flex items-center justify-center bg-background text-muted-foreground font-sans`}
		>
			{shortcut && (
				<p className="text-sm">Press {shortcut} to open the command palette</p>
			)}
			{isFocused && <AppWithProviders openOnMount />}
		</div>
	);
}

export default NewTab;
