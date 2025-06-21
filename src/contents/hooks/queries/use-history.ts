import { sendToBackground } from "@plasmohq/messaging";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type {
	HistoryRequestBody,
	HistoryResponseBody,
} from "~types/background/messages/history";

const getUseHistoryQueryOptions = (query?: HistoryRequestBody) =>
	queryOptions<HistoryResponseBody["history"]>({
		queryKey: ["history", Object.values(query || {})],
		queryFn: async () => {
			const response = await sendToBackground({
				name: "history",
				body: query,
			});

			if (!response.history) {
				throw new Error("No history found");
			}

			return response.history;
		},
	});

export function useHistory() {
	return useQuery(getUseHistoryQueryOptions());
}
