import { useCallback, useEffect, useRef, useState } from "react";

// chrome.tabs only exists in extension pages, not content scripts
const isExtensionPage = !!chrome.tabs;

/**
 * The URL of the page the palette was opened over. In a content script that's
 * the page itself; in the palette window it's the active tab of the browser
 * window the user came from. Our own pages (e.g. the new tab page) don't count.
 *
 * Returns whether there is one, and a getter that reads it at call time so
 * in-page navigation (e.g. SPA route changes) is picked up.
 */
export function useCurrentUrl() {
	const tabUrlRef = useRef<string>();
	const [hasTabUrl, setHasTabUrl] = useState(false);

	useEffect(() => {
		if (!isExtensionPage) return;

		chrome.windows
			.getLastFocused({ windowTypes: ["normal"], populate: true })
			.then((browserWindow) => {
				const url = browserWindow.tabs?.find((tab) => tab.active)?.url;
				if (!url || url.startsWith(chrome.runtime.getURL(""))) return;
				tabUrlRef.current = url;
				setHasTabUrl(true);
			})
			.catch(() => {});
	}, []);

	const getCurrentUrl = useCallback(
		() => (isExtensionPage ? tabUrlRef.current : location.href),
		[],
	);

	return {
		hasCurrentUrl: isExtensionPage ? hasTabUrl : true,
		getCurrentUrl,
	};
}
