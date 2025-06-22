import type { Action } from "kbar";

// Extended Action type that supports React elements in shortcuts
export type ExtendedAction = Omit<Action, "shortcut"> & {
	shortcut?: (string | React.ReactElement)[];
};
