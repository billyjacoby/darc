import { sendToBackground } from "@plasmohq/messaging";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
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

	// Placeholder data belongs to an older query, so drop entries that no longer match.
	// Memoized so re-renders (e.g. arrowing through results) don't produce a new
	// array, which would re-register actions and reset kbar's active row.
	const suggestions = useMemo(
		() =>
			query
				? (result.data ?? []).filter((suggestion) =>
						suggestion.domain.startsWith(query),
					)
				: [],
		[query, result.data],
	);

	return { ...result, suggestions };
}
