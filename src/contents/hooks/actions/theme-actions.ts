import type { Action } from "kbar";
import type { Theme } from "../use-theme";

export const createThemeActions = (
	theme: Theme,
	toggleTheme: () => void,
): Action[] => [
	{
		id: "theme",
		name: "Toggle Theme",
		shortcut: ["t"],
		keywords: "theme dark light toggle appearance",
		section: "Preferences",
		icon: theme === "dark" ? "🌙" : "☀️",
		subtitle: `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
		perform: toggleTheme,
	},
];
