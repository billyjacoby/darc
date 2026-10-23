import type { Action } from "kbar";
import { Link } from "lucide-react";
import { toDisplayUrl } from "~utils/browser";
import { copyText } from "~utils/clipboard";

export const createPageActions = (
	getCurrentUrl: () => string | undefined,
): Action[] => [
	{
		id: "copy-url",
		name: "Copy Link",
		subtitle: "Copy this page's URL to the clipboard",
		keywords: "copy url link address share clipboard",
		section: "Actions",
		icon: <Link />,
		perform: () => {
			const url = getCurrentUrl();
			if (url) copyText(toDisplayUrl(url));
		},
	},
];
