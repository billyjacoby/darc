import type { PlasmoMessaging } from "@plasmohq/messaging";
import type {
	Bookmark,
	BookmarksRequestBody,
	BookmarksResponseBody,
} from "~types/background/messages/bookmarks";

// Title matches read as what the user meant more than URL matches do
const scoreBookmark = (bookmark: Bookmark, query: string) => {
	const title = bookmark.title.toLowerCase();
	if (title.startsWith(query)) return 3;
	if (title.includes(query)) return 2;
	if (bookmark.url.toLowerCase().includes(query)) return 1;
	return 0;
};

const handler: PlasmoMessaging.MessageHandler<
	BookmarksRequestBody,
	BookmarksResponseBody
> = async (req, res) => {
	const query = req.body?.query.trim().toLowerCase() ?? "";
	const limit = req.body?.limit ?? 5;

	if (!query) {
		res.send({ bookmarks: [] });
		return;
	}

	const nodes = await chrome.bookmarks.search(query).catch(() => []);

	const bookmarks = nodes
		// Folders have no URL, and bookmarklets can't be opened as tabs
		.filter((node) => node.url && !node.url.startsWith("javascript:"))
		.map((node) => ({
			id: node.id,
			title: node.title || node.url || "",
			url: node.url ?? "",
		}))
		.map((bookmark) => ({ bookmark, score: scoreBookmark(bookmark, query) }))
		.sort((a, b) => b.score - a.score)
		.slice(0, limit)
		.map(({ bookmark }) => bookmark);

	res.send({ bookmarks });
};

export default handler;
