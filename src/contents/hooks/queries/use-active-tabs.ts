import { sendToBackground } from "@plasmohq/messaging";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type {
	ActiveTabsRequestBody,
	ActiveTabsResponseBody,
} from "~types/background/messages/active-tabs";

if (!process.env.PLASMO_PUBLIC_CHROME_EXTENSION_ID) {
	throw new Error("PLASMO_PUBLIC_CHROME_EXTENSION_ID is not set");
}

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
			extensionId: process.env.PLASMO_PUBLIC_CHROME_EXTENSION_ID,
		});

		if (!response.activeTabs) {
			throw new Error("No active tabs found");
		}

		return response.activeTabs;
	},
});

export function useActiveTabs() {
	return useQuery(activeTabsQueryOptions);
}
