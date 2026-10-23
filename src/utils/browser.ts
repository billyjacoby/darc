// Brave exposes navigator.brave in every page, content scripts included
export const isBrave = "brave" in navigator;

export const BROWSER_NAME = isBrave ? "Brave" : "Browser";

// Brave rewrites chrome:// to brave:// itself, but extension APIs only
// reliably accept the chrome:// form
export const toInternalUrl = (url: string) =>
	url.replace(/^brave:\/\//i, "chrome://");

// What the browser shows in its address bar for an internal page
export const toDisplayUrl = (url: string) =>
	isBrave ? url.replace(/^chrome:\/\//, "brave://") : url;
