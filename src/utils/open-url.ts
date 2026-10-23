import { sendToBackground } from "@plasmohq/messaging";
import type {
	OpenUrlRequestBody,
	OpenUrlResponseBody,
} from "~types/background/messages/open-url";

// Opens a URL in a new tab via the background, which works from both the
// in-page palette and the standalone palette window
export const openUrl = async (url: string) => {
	const response = await sendToBackground<
		OpenUrlRequestBody,
		OpenUrlResponseBody
	>({
		name: "open-url",
		body: { url },
	});

	if (!response.success) {
		console.error("Failed to open URL:", response.error);
	}
};
