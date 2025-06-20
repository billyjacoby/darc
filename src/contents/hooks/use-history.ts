import { sendToBackground } from "@plasmohq/messaging";
import { useMutation } from "@tanstack/react-query";

export function useHistory() {
	return useMutation({
		mutationFn: async (query: string) => {
			const response = await sendToBackground({
				name: "history",
				body: {
					query,
				},
				extensionId: "pehnpfleoniifpdnlgbejimkpmgpkokg",
			});

			if (!response.history) {
				throw new Error("No history found");
			}

			return response.history;
		},
	});
}
