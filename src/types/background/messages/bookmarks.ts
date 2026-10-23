export interface BookmarksRequestBody {
	query: string;
	limit?: number;
}

export interface Bookmark {
	id: string;
	title: string;
	url: string;
}

export interface BookmarksResponseBody {
	bookmarks: Bookmark[];
}
