import type { PlasmoMessaging } from "@plasmohq/messaging";
import type {
	SwitchTabRequestBody,
	SwitchTabResponseBody,
} from "~types/background/messages/switch-tab";

const handler: PlasmoMessaging.MessageHandler<
	SwitchTabRequestBody,
	SwitchTabResponseBody
> = async (req, res) => {
	try {
		const { tabId } = req.body;

		if (!tabId) {
			res.send({ success: false, error: "Tab ID is required" });
			return;
		}

		// Switch to the specified tab
		await chrome.tabs.update(tabId, { active: true });

		// Get the tab to also focus its window
		const tab = await chrome.tabs.get(tabId);
		if (tab.windowId) {
			await chrome.windows.update(tab.windowId, { focused: true });
		}

		res.send({ success: true });
	} catch (error) {
		console.error("Error switching to tab:", error);
		res.send({
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

export default handler;
