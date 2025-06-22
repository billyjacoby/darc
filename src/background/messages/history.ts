import type { PlasmoMessaging } from "@plasmohq/messaging";
import type {
	HistoryRequestBody,
	HistoryResponseBody,
} from "~types/background/messages/history";

const handler: PlasmoMessaging.MessageHandler<
	HistoryRequestBody,
	HistoryResponseBody
> = async (req, res) => {
	const { body = {} } = req;

	const oneWeekMillis = 7 * 24 * 60 * 60 * 1000;
	const oneWeekAgo = Date.now() - oneWeekMillis;

	const history = await chrome.history.search({
		text: body.search || "",
		startTime: oneWeekAgo,
		maxResults: body.maxResults || 100,
	});

	res.send({
		history,
	});
};

export default handler;
