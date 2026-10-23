// Set PLASMO_PUBLIC_DISABLE_LOGS=true in .env to silence console output in
// every extension context, dev builds included. Each entry point imports this
// first so it runs before anything else can log.
const CONSOLE_METHODS = [
	"log",
	"info",
	"debug",
	"warn",
	"error",
	"trace",
	"table",
	"dir",
	"group",
	"groupCollapsed",
	"groupEnd",
	"time",
	"timeEnd",
	"timeLog",
	"count",
	"assert",
] as const;

if (process.env.PLASMO_PUBLIC_DISABLE_LOGS === "true") {
	const noop = () => {};
	for (const method of CONSOLE_METHODS) {
		console[method] = noop;
	}
}

export {};
