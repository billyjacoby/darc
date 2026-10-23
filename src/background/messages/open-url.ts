import type { PlasmoMessaging } from "@plasmohq/messaging";
import type {
	OpenUrlRequestBody,
	OpenUrlResponseBody,
} from "~types/background/messages/open-url";

const handler: PlasmoMessaging.MessageHandler<
	OpenUrlRequestBody,
	OpenUrlResponseBody
> = async (req, res) => {
	try {
		const { url } = req.body;

		if (!url) {
			res.send({ success: false, error: "URL is required" });
			return;
		}

		// The palette may be running in its own popup window, so target the
		// browser window the user was last in rather than the sender's
		const browserWindow = await chrome.windows
			.getLastFocused({ windowTypes: ["normal"] })
			.catch(() => undefined);

		if (!browserWindow?.id) {
			await chrome.windows.create({ url, focused: true });
			res.send({ success: true });
			return;
		}

		await chrome.tabs.create({ url, windowId: browserWindow.id });
		await chrome.windows.update(browserWindow.id, { focused: true });

		res.send({ success: true });
	} catch (error) {
		console.error("Error opening URL:", error);
		res.send({
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

export default handler;
