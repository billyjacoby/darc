import { sendToBackground } from "@plasmohq/messaging";
import { useQuery } from "@tanstack/react-query";

export function useActiveTabs() {
	return useQuery<chrome.tabs.Tab[]>({
		queryKey: ["active-tabs"],
		queryFn: async () => {
			const response = await sendToBackground({
				name: "active-tabs",
				extensionId: "pehnpfleoniifpdnlgbejimkpmgpkokg",
			});

			if (!response.activeTabs) {
				throw new Error("No active tabs found");
			}

			return response.activeTabs;
		},
	});
}
