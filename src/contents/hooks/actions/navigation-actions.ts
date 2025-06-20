import type { Action } from "kbar";

export const createNavigationActions = (): Action[] => [
	// {
	// 	id: "home",
	// 	name: "Home",
	// 	shortcut: ["g", "h"],
	// 	keywords: "home",
	// 	section: "Navigation",
	// 	subtitle: "Go to home page",
	// 	perform: () => {
	// 		window.location.href = "/";
	// 	},
	// },
	// {
	// 	id: "new-tab",
	// 	name: "New Tab",
	// 	shortcut: ["n"],
	// 	keywords: "new tab create",
	// 	section: "Actions",
	// 	icon: "➕",
	// 	perform: async () => {
	// 		try {
	// 			await chrome.runtime.sendMessage({
	// 				type: "CREATE_TAB",
	// 				url: undefined,
	// 			});
	// 		} catch (error) {
	// 			console.error("Error creating new tab:", error);
	// 		}
	// 	},
	// },
];
