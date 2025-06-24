import type { Action } from "kbar";
import { Move } from "lucide-react";

export const createPositionActions = (resetPosition: () => void): Action[] => [
	{
		id: "reset-position",
		name: "Reset Command Palette Position",
		subtitle: "Move the palette back to center",
		shortcut: [],
		keywords: "reset position center move drag palette",
		section: "Settings",
		priority: 50,
		icon: <Move />,
		perform: resetPosition,
	},
];
