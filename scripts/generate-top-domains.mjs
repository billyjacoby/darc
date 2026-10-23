// Generates src/data/top-domains.json: popular sites used for URL autocomplete.
//
// Ordering comes from the Tranco list (https://tranco-list.eu), but Tranco ranks
// by DNS/traffic signals and is full of CDN and infrastructure domains nobody
// types (gstatic.com, akamaiedge.net, ...). To keep only real, browsable sites,
// a domain is kept only when the Chrome UX Report top-origins list shows people
// actually load it as a page.
//
// Usage: node scripts/generate-top-domains.mjs [count]

import { writeFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";

const COUNT = Number(process.argv[2]) || 2000;
// Only trust CrUX origins in its top buckets
const MAX_CRUX_RANK = 100_000;
const OUTPUT = new URL("../src/data/top-domains.json", import.meta.url);

const CRUX_URL =
	"https://raw.githubusercontent.com/zakird/crux-top-lists/main/data/global/current.csv.gz";

// Keep adult sites out of ghost-text completions
const BLOCKED_PATTERN =
	/porn|xxx|sex|xvideo|xnxx|xhamster|hentai|onlyfans|chaturbate|stripchat|camsoda|bongacams|livejasmin|redtube|youporn|tube8|spankbang|eporner|javhd|nhentai|rule34|brazzers|fap|nsfw|milf|erotic|escort|jizz|nude|^xh|xham|jav(?!a)|\.cam$|hotxv|mat6tube|taktube|arabx|hdhub4u|xvv1deos/i;

const fetchOk = async (url) => {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to fetch ${url}: ${response.status}`);
	}
	return response;
};

const getCruxHostnames = async () => {
	const response = await fetchOk(CRUX_URL);
	const csv = gunzipSync(Buffer.from(await response.arrayBuffer())).toString();
	const hostnames = new Set();

	for (const line of csv.split("\n").slice(1)) {
		const [origin, rank] = line.split(",");
		if (!origin || Number(rank) > MAX_CRUX_RANK) continue;
		hostnames.add(new URL(origin).hostname.replace(/^www\./, ""));
	}

	return hostnames;
};

const getTrancoDomains = async () => {
	const id = (
		await (await fetchOk("https://tranco-list.eu/top-1m-id")).text()
	).trim();
	const csv = await (
		await fetchOk(`https://tranco-list.eu/download/${id}/1000000`)
	).text();

	return csv
		.split("\n")
		.map((line) => line.split(",")[1]?.trim())
		.filter(Boolean);
};

const [cruxHostnames, trancoDomains] = await Promise.all([
	getCruxHostnames(),
	getTrancoDomains(),
]);

const domains = trancoDomains
	.filter(
		(domain) => cruxHostnames.has(domain) && !BLOCKED_PATTERN.test(domain),
	)
	.slice(0, COUNT);

await writeFile(OUTPUT, `${JSON.stringify(domains, null, "\t")}\n`);
console.log(`Wrote ${domains.length} domains to ${OUTPUT.pathname}`);
