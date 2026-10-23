export type DomainSuggestionSource = "top-sites" | "history" | "popular";

export type DomainSuggestion = {
	// Hostname without a leading "www.", e.g. "github.com"
	domain: string;
	url: string;
	source: DomainSuggestionSource;
};

export type DomainSuggestionsRequestBody = {
	query: string;
	limit?: number;
};

export type DomainSuggestionsResponseBody = {
	suggestions: DomainSuggestion[];
};
