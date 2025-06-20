import { SHORTCUT_EVENTS } from "../constants";

console.log("Background script loaded!");

chrome.commands.onCommand.addListener((command) => {
	const eventTime = new Date().toISOString();
	chrome.storage.local.set({
		lastCommand: command,
		lastCommandTime: eventTime,
	});

	const event = Object.values(SHORTCUT_EVENTS).find(
		(event) => event.command === command,
	);

	if (event) {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs[0]?.id) {
				chrome.tabs.sendMessage(
					tabs[0].id,
					{
						type: event.type,
						triggeredAt: eventTime,
					},
					(response) => {
						chrome.storage.local.set({
							lastMessageResponse: response,
							responseTime: new Date().toISOString(),
						});
					},
				);
			}
		});
	}
});
