import { Storage } from "@plasmohq/storage";
import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

let themeListeners: ((theme: Theme) => void)[] = [];

// Create a proxy to watch for changes to the global theme
const globalThemeState = {
	theme: "dark" as Theme,
};

const globalTheme = new Proxy(globalThemeState, {
	set(target, property, value) {
		if (property === "theme" && target.theme !== value) {
			target.theme = value;
			// Notify all listeners when theme changes
			themeListeners.forEach((listener) => listener(value));
		} else {
			target[property] = value;
		}
		return true;
	},
});

const storage = new Storage();

// Function to add a listener for theme changes
export function addThemeListener(callback: (theme: Theme) => void) {
	themeListeners.push(callback);
	return () => {
		themeListeners = themeListeners.filter((listener) => listener !== callback);
	};
}

export function useTheme() {
	const [theme, setTheme] = useState<Theme>(globalTheme.theme);

	useEffect(() => {
		// Load theme from storage on mount
		storage.get("theme").then((savedTheme: Theme) => {
			if (savedTheme) {
				setTheme(savedTheme);
				globalTheme.theme = savedTheme; // This will trigger the proxy
			}
		});
	}, []);

	const toggleTheme = useCallback(async () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		await storage.set("theme", newTheme);
		globalTheme.theme = newTheme; // This will trigger the proxy
	}, [theme]);

	console.log("🪵 | useTheme | theme:", theme);

	return { theme, toggleTheme };
}

// Custom hook to listen to theme changes
export function useThemeListener(callback: (theme: Theme) => void) {
	useEffect(() => {
		const unsubscribe = addThemeListener(callback);
		return unsubscribe;
	}, [callback]);
}
