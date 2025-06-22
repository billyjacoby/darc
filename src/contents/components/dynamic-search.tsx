import { KBarSearch, useRegisterActions } from "kbar";
import { useState } from "react";
import { useActions } from "../hooks/use-actions";

export function DynamicSearch() {
	const [query, setQuery] = useState("");
	const { createDynamicActions } = useActions();

	// Register dynamic actions based on current query
	const dynamicActions = createDynamicActions(query);
	useRegisterActions(dynamicActions, [dynamicActions]);

	return (
		<div className="flex flex-row items-center p-3 gap-2">
			<div className="w-4 h-4 rounded-full bg-red-500" />
			<KBarSearch
				className="text-base w-full box-border outline-none border-none m-0 bg-popover text-popover-foreground border-b border-border/10"
				placeholder="Search or enter a URL..."
				onChange={(e) => setQuery(e.target.value)}
			/>
		</div>
	);
}
