import { sendToBackground } from "@plasmohq/messaging";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type {
	BookmarksRequestBody,
	BookmarksResponseBody,
} from "~types/background/messages/bookmarks";

export function useBookmarks(input: string) {
	const query = input.trim().toLowerCase();

	const result = useQuery({
		queryKey: ["bookmarks", query],
		queryFn: async () => {
			const response = await sendToBackground<
				BookmarksRequestBody,
				BookmarksResponseBody
			>({
				name: "bookmarks",
				body: { query },
			});

			return response.bookmarks ?? [];
		},
		enabled: query.length > 0,
		staleTime: 30_000,
		// Keep the last results while the next keystroke's request is in flight
		placeholderData: keepPreviousData,
	});

	// Placeholder data belongs to an older query, so drop entries that no longer match.
	// Memoized so re-renders (e.g. arrowing through results) don't produce a new
	// array, which would re-register actions and reset kbar's active row.
	const bookmarks = useMemo(
		() =>
			query
				? (result.data ?? []).filter(
						(bookmark) =>
							bookmark.title.toLowerCase().includes(query) ||
							bookmark.url.toLowerCase().includes(query),
					)
				: [],
		[query, result.data],
	);

	return { ...result, bookmarks };
}
