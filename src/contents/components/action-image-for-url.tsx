import { Globe } from "lucide-react";

export const ActionImageForUrl = ({ url }: { url: string }) => {
	const iconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(url)}&size=512`;

	if (!url) {
		return <Globe />;
	}

	return (
		<img src={iconUrl} alt="Action" style={{ height: "20px", width: "20px" }} />
	);
};
