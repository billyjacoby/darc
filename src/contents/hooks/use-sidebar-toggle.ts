import { useEffect, useState } from "react";

export const useSidebarToggle = () => {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		document.body.classList.toggle("plasmo-google-sidebar-show", isOpen);
	}, [isOpen]);

	useEffect(() => {
		// Listen for messages from the background script
		const messageListener = (
			message: { type: string },
			sender,
			sendResponse,
		) => {
			if (message.type === "TOGGLE_SIDEBAR") {
				setIsOpen((prev) => !prev);
				sendResponse({ success: true, newState: !isOpen });
			}
			return true; // Keep the message channel open for the async response
		};

		chrome.runtime.onMessage.addListener(messageListener);

		// Cleanup listener on unmount
		return () => {
			chrome.runtime.onMessage.removeListener(messageListener);
		};
	}, [isOpen]);

	return {
		isOpen,
		setIsOpen,
	};
};
