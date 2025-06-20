import { Storage } from "@plasmohq/storage";
import { useCallback, useEffect, useState } from "react";

const storage = new Storage();
export type Theme = "light" | "dark";

export function useTheme() {
	const [theme, setTheme] = useState<Theme>("dark");

	useEffect(() => {
		// Load theme from storage on mount
		storage.get("theme").then((savedTheme: Theme) => {
			if (savedTheme) {
				setTheme(savedTheme);
			}
		});
	}, []);

	const toggleTheme = useCallback(async () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		await storage.set("theme", newTheme);
	}, [theme]);

	return { theme, toggleTheme };
}
