import { Globe } from "lucide-react";

// The browser's own favicon cache (the "favicon" permission), so no visited
// URLs are sent to a third-party favicon service
const faviconUrl = (url: string) =>
	chrome.runtime.getURL(
		`/_favicon/?pageUrl=${encodeURIComponent(url)}&size=32`,
	);

export const ActionImageForUrl = ({ url }: { url: string }) => {
	if (!url) {
		return <Globe />;
	}

	return (
		<img
			src={faviconUrl(url)}
			alt="Action"
			style={{ height: "20px", width: "20px" }}
		/>
	);
};
