# Store Listing

Copy and answers for the Chrome Web Store developer dashboard. Edge Add-ons asks for mostly the same things, and the same zip works there.

## Build the upload

```bash
pnpm package
```

This builds the store version, stops it from loading on every site (it's added to a page only when you open it there), and zips the result to `build/chrome-mv3-prod.zip`. Before uploading, check that its `manifest.json` has no `key` field.

## Listing

**Name:** dArc

**Summary** (from the manifest, 132 characters max):

> A keyboard-first command palette for your browser. Search tabs, history, bookmarks, and settings, or open any site.

**Category:** Productivity

**Description:**

> dArc puts one search bar in front of everything in your browser. Press a shortcut on any page and start typing.
>
> • Switch to an open tab
> • Find a page in your history or bookmarks
> • Type a site and press Enter. dArc completes addresses you visit often.
> • Open localhost and local network addresses without typing http://, with ports remembered
> • Jump to any browser settings page, or search settings with "settings <words>"
> • Search the web
> • Copy the current page's link
>
> It works everywhere, including browser settings pages and the new tab page. The palette can be dragged anywhere on screen and stays where you leave it. There are light and dark themes and an adjustable text size.
>
> dArc replaces the new tab page with a blank page that has the palette open.
>
> Private by design: everything happens on your device. dArc has no servers and no analytics, and doesn't collect anything.
>
> Set your shortcut at chrome://extensions/shortcuts (or brave://extensions/shortcuts).

**Privacy policy URL:** https://github.com/billyjacoby/darc/blob/main/PRIVACY.md

## Single purpose

> dArc is a command palette: a single keyboard-driven search box for navigating the browser, covering tabs, history, bookmarks, sites, and browser settings. The new tab page override shows the same palette.

## Permission justifications

| Permission | Justification |
|---|---|
| `tabs` | Lists open tabs so the user can search and switch to them, and opens results in new tabs. |
| `history` | Searches browsing history for results and for address suggestions as the user types. |
| `bookmarks` | Searches the user's bookmarks for results. |
| `topSites` | Ranks address suggestions by the sites the user visits most. |
| `storage` | Saves the extension's own settings (theme, font size, palette position). |
| `activeTab` | When the user presses the shortcut or clicks the toolbar button, lets dArc add the palette to the current page. |
| `scripting` | Adds the palette's script to the current page when the user opens it, instead of running on every site. |
| `favicon` | Shows website icons in results from the browser's own icon cache, so no addresses are sent to an outside icon service. |

**Remote code:** No. All code is included in the package.

## Data usage disclosures

**Data collected:** none. In the dashboard, tick **Web history** only if the form asks about data the extension handles. dArc reads history, tabs, and bookmarks on the device to show results, but never sends or stores them.

Certify all three:
- Not sold or transferred to third parties
- Not used or transferred for purposes unrelated to the extension's single purpose
- Not used or transferred to determine creditworthiness or for lending

## New tab page

dArc overrides the new tab page. The description above says so, which store policy requires. Browsers also ask users whether to keep the change.

## Assets

- [x] Icon: `assets/icon.png` (512×512); Plasmo generates the 128×128 store icon
- [ ] Screenshots, 1280×800 (1 to 5): the palette on a regular page, the address completion, results from history or bookmarks, the settings page
- [ ] Small promo tile, 440×280
- [ ] Optional: marquee promo tile, 1400×560

Don't use another browser's name or logo in the listing or screenshots.

## Accounts and fees

- Chrome Web Store: one-time $5 developer registration at https://chrome.google.com/webstore/devconsole
- Edge Add-ons: free, at https://partner.microsoft.com/dashboard/microsoftedge

Brave, Arc, Vivaldi, and other Chromium browsers install from the Chrome Web Store.
