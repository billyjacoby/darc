import type { PlasmoMessaging } from "@plasmohq/messaging";
import type {
	ActiveTabsRequestBody,
	ActiveTabsResponseBody,
} from "~types/background/messages/active-tabs";

const handler: PlasmoMessaging.MessageHandler<
	ActiveTabsRequestBody,
	ActiveTabsResponseBody
> = async (_req, res) => {
	// Get all tabs and sort by last accessed time (most recent first)
	const allTabs = await chrome.tabs.query({});

	// Sort tabs by active status and recency, then limit to 4
	const sortedTabs = allTabs
		.sort((a, b) => {
			// Prioritize active tab first
			if (a.active && !b.active) return -1;
			if (!a.active && b.active) return 1;

			// Then sort by id (higher id = more recently opened)
			return (b.id || 0) - (a.id || 0);
		})
		.slice(0, 4); // Limit to 4 most recent tabs

	res.send({
		activeTabs: sortedTabs,
	});
};

export default handler;
