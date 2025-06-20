import type { PlasmoMessaging } from "@plasmohq/messaging";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
	console.log("🪵 | Active tabs handler | Request:", req.body);

	const activeTabs = await chrome.tabs.query({});

	res.send({
		activeTabs,
	});
};

export default handler;
