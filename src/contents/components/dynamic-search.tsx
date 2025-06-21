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
		<KBarSearch
			className="p-3 text-base w-full box-border outline-none border-none m-0 bg-popover text-popover-foreground border-b border-border/10"
			placeholder="Type a command or search..."
			onChange={(e) => setQuery(e.target.value)}
		/>
	);
}
