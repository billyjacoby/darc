import { sendToBackground } from "@plasmohq/messaging";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type {
	DomainSuggestionsRequestBody,
	DomainSuggestionsResponseBody,
} from "~types/background/messages/domain-suggestions";
import { normalizeDomainQuery } from "~utils/domain";

export function useDomainSuggestions(input: string) {
	const query = normalizeDomainQuery(input);

	const result = useQuery({
		queryKey: ["domain-suggestions", query],
		queryFn: async () => {
			const response = await sendToBackground<
				DomainSuggestionsRequestBody,
				DomainSuggestionsResponseBody
			>({
				name: "domain-suggestions",
				body: { query },
			});

			return response.suggestions ?? [];
		},
		enabled: query.length > 0,
		staleTime: 30_000,
		// Keep the last suggestions while the next keystroke's request is in flight
		placeholderData: keepPreviousData,
	});

	// Placeholder data belongs to an older query, so drop entries that no longer match
	const suggestions = query
		? (result.data ?? []).filter((suggestion) =>
				suggestion.domain.startsWith(query),
			)
		: [];

	return { ...result, suggestions };
}
