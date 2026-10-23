import type { PlasmoMessaging } from "@plasmohq/messaging";
import topDomains from "~data/top-domains.json";
import type {
	DomainSuggestion,
	DomainSuggestionSource,
	DomainSuggestionsRequestBody,
	DomainSuggestionsResponseBody,
} from "~types/background/messages/domain-suggestions";
import { isLocalHostname, normalizeDomainQuery } from "~utils/domain";

type Candidate = DomainSuggestion & { score: number };

const parseOrigin = (url?: string) => {
	if (!url) return null;
	try {
		const { protocol, hostname, host, origin } = new URL(url);
		if (protocol !== "http:" && protocol !== "https:") return null;
		// Local servers are told apart by port (localhost:3000 vs localhost:5173),
		// so keep it; elsewhere the port is noise
		const domain = isLocalHostname(hostname)
			? host
			: hostname.replace(/^www\./, "");
		return { domain, origin };
	} catch {
		return null;
	}
};

// Sites the user actually visits should outrank the static popular list,
// which only scores 0-50 based on its global rank.
const getPopularCandidates = (query: string): Candidate[] =>
	topDomains.flatMap((domain, index) =>
		domain.startsWith(query)
			? [
					{
						domain,
						url: `https://${domain}`,
						source: "popular" as const,
						score: 50 * (1 - index / topDomains.length),
					},
				]
			: [],
	);

const getTopSitesCandidates = async (query: string): Promise<Candidate[]> => {
	// Not available in every browser (e.g. Safari)
	if (!chrome.topSites?.get) return [];

	const topSites = await chrome.topSites.get();
	return topSites.flatMap((site, index) => {
		const parsed = parseOrigin(site.url);
		if (!parsed?.domain.startsWith(query)) return [];
		return [
			{
				domain: parsed.domain,
				url: parsed.origin,
				source: "top-sites" as const,
				score: 150 - index * 10,
			},
		];
	});
};

const getHistoryCandidates = async (query: string): Promise<Candidate[]> => {
	// history.search's text filter returns nothing for queries under 3
	// characters, so for short input scan recent history and match locally
	const isShortQuery = query.length < 3;
	const items = await chrome.history.search({
		// History's text search won't match a partly typed port like
		// "localhost:30", so search the host and match the port locally
		text: isShortQuery ? "" : query.replace(/:\d*$/, ""),
		startTime: 0,
		maxResults: isShortQuery ? 2000 : 500,
	});

	const byDomain = new Map<string, Candidate & { visits: number }>();
	for (const item of items) {
		const parsed = parseOrigin(item.url);
		if (!parsed?.domain.startsWith(query)) continue;

		// Typed visits are a much stronger signal of "I go here directly"
		const visits = (item.visitCount ?? 0) + (item.typedCount ?? 0) * 5;
		const existing = byDomain.get(parsed.domain);
		if (existing) {
			existing.visits += visits;
		} else {
			byDomain.set(parsed.domain, {
				domain: parsed.domain,
				url: parsed.origin,
				source: "history",
				score: 0,
				visits,
			});
		}
	}

	return [...byDomain.values()].map(({ visits, ...candidate }) => ({
		...candidate,
		score: 30 * Math.log2(1 + visits),
	}));
};

// Personal sources win the source label and URL when a domain appears in several
const SOURCE_RANK: Record<DomainSuggestionSource, number> = {
	"top-sites": 0,
	history: 1,
	popular: 2,
};

const handler: PlasmoMessaging.MessageHandler<
	DomainSuggestionsRequestBody,
	DomainSuggestionsResponseBody
> = async (req, res) => {
	const query = normalizeDomainQuery(req.body?.query ?? "");
	const limit = req.body?.limit ?? 5;

	// Only complete hostnames, not paths or search phrases
	if (!query || /[\s/]/.test(query)) {
		res.send({ suggestions: [] });
		return;
	}

	const groups = await Promise.all([
		getTopSitesCandidates(query).catch(() => []),
		getHistoryCandidates(query).catch(() => []),
		getPopularCandidates(query),
	]);

	const merged = new Map<string, Candidate>();
	for (const candidate of groups.flat()) {
		const existing = merged.get(candidate.domain);
		if (!existing) {
			merged.set(candidate.domain, { ...candidate });
			continue;
		}
		existing.score += candidate.score;
		if (SOURCE_RANK[candidate.source] < SOURCE_RANK[existing.source]) {
			existing.source = candidate.source;
			existing.url = candidate.url;
		}
	}

	const suggestions = [...merged.values()]
		.sort(
			(a, b) =>
				b.score - a.score ||
				// Prefer the shorter completion on ties, e.g. "google.com" over "google.com.hk"
				a.domain.length - b.domain.length,
		)
		.slice(0, limit)
		.map(({ score: _score, ...suggestion }) => suggestion);

	res.send({ suggestions });
};

export default handler;
