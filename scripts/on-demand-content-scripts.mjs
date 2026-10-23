// Store builds load the palette into a page only when it's opened (via
// activeTab + scripting) instead of on every site, which avoids asking for
// access to all websites. Plasmo always declares content scripts, so this
// removes them from the built manifest and writes their files to
// content-scripts.json (CONTENT_SCRIPTS_FILE in src/constants.ts) for the
// background to inject.
//
// Usage: node scripts/on-demand-content-scripts.mjs <build dir>

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const CONTENT_SCRIPTS_FILE = "content-scripts.json";

const buildDir = process.argv[2];
if (!buildDir) {
	console.error(
		"Usage: node scripts/on-demand-content-scripts.mjs <build dir>",
	);
	process.exit(1);
}

const manifestPath = join(buildDir, "manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

// Safe to re-run: once stripped, the existing list is left as is
if (manifest.content_scripts?.length) {
	const files = manifest.content_scripts.flatMap((script) => script.js ?? []);
	await writeFile(join(buildDir, CONTENT_SCRIPTS_FILE), JSON.stringify(files));

	delete manifest.content_scripts;
	await writeFile(manifestPath, JSON.stringify(manifest));

	console.log(`Moved ${files.length} content script(s) to on-demand injection`);
}
