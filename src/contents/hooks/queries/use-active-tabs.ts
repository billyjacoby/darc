import { sendToBackground } from "@plasmohq/messaging";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type {
	ActiveTabsRequestBody,
	ActiveTabsResponseBody,
} from "~types/background/messages/active-tabs";

const activeTabsQueryOptions = queryOptions<
	ActiveTabsResponseBody["activeTabs"]
>({
	queryKey: ["active-tabs"],
	queryFn: async () => {
		const response = await sendToBackground<
			ActiveTabsRequestBody,
			ActiveTabsResponseBody
		>({
			name: "active-tabs",
			extensionId: "gcclkjhnfceflehjekhgjpkpfmeclnhb",
		});

		if (!response.activeTabs) {
			throw new Error("No active tabs found");
		}

		console.log("🪵 | queryFn: | response:", response);
		return response.activeTabs;
	},
});

export function useActiveTabs() {
	return useQuery(activeTabsQueryOptions);
}
