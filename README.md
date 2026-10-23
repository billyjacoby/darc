# dArc - Browser Command Palette

dArc brings a keyboard-first command palette to your browser. Press one shortcut on any page and search everything in your browser from a single box.

## What dArc Currently Supports

### 🎯 Core Features

- **Command Palette Anywhere**: Opens with `Cmd+Shift+P` (`Ctrl+Shift+P` on Windows/Linux), rebindable to any shortcut (e.g. `Cmd+T`), or with the toolbar button
  - On regular pages it appears as an overlay on the page
  - On browser pages where extensions can't run (settings, the web store) it opens in a small window of its own
- **New Tab Page**: Replaces the new tab page with a blank page that has the palette open
- **Keyboard-First Navigation**: Arrow keys and Enter, with `Tab` or `→` to accept an address completion
- **Focus Protection**: While the palette is open, the page's own keyboard shortcuts can't take focus from it

### 📑 Tabs, History & Bookmarks

- **Tab Switching**: Search open tabs by title and URL and switch to them
- **History Search**: Search the last week of browsing history
- **Bookmark Search**: Search bookmark titles and URLs

### 🔗 Addresses & Search

- **Address Completion**: Completes addresses as you type (shown as faded text), using your most visited sites, your history, and a list of popular sites
- **Local Addresses**: `localhost:3000`, `app.localhost`, and IP addresses open over `http://` without typing it, and ports are remembered
- **Direct Navigation**: Any address, including `brave://` and `chrome://` pages
- **Web Search**: Search Google for any text

### ⚙️ Browser Actions

- **Browser Settings**: Jump to any settings page (privacy, cookies, extensions, shortcuts, flags, ...), or type `settings <words>` to search settings
- **Copy Link**: Copy the current page's URL

### 🎨 Preferences

- **Settings Page**: Adjustable font size, with more settings to come
- **Themes**: Light and dark
- **Draggable Palette**: Drag it anywhere on screen; it snaps back to center when dragged near it

### 🔒 Privacy

Everything runs locally: no servers, no analytics. Store builds are added to a page only when you open the palette there, so they don't need access to every site. See [PRIVACY.md](PRIVACY.md).

## Short-Term Goals

- [ ] **Enhanced Search Engine Support**: Add Bing and DuckDuckGo options alongside Google
- [ ] **DuckDuckGo Operator Support**: Add support for DuckDuckGo's ! search syntax
- [ ] **UI Polish**: Complete the clean, minimal aesthetic improvements
- [ ] **Firefox Support**: Port the APIs that differ (script injection, the palette window, browser pages)
- [ ] **Performance Optimization**: Minimize extension impact on browser performance

## 🔮 Future Enhancements

- [ ] **User Customization**: Allow users to customize shortcuts and behavior
- [x] **Bookmark Integration**: Search and navigate bookmarks
- [ ] **Additional Command Types**: Extend beyond navigation (page actions, developer tools, etc.)
- [ ] **Extension Shortcuts**: Quick access to other installed extensions

## Getting Started

### Prerequisites

- Node.js
- pnpm (recommended) or npm
- Chrome or another Chromium-based browser (Brave, Arc, Edge, ...)

### Installation & Setup

1. **Clone the repository**

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables** (optional)
   Copy `.env.example` to `.env`. Both variables are optional:

   ```bash
   # Silence console output in every build
   PLASMO_PUBLIC_DISABLE_LOGS=true
   ```

   To keep the unpacked extension's ID stable across reloads and machines, put your manifest key in `.env.development` (dev builds only; store builds must not include a key):

   ```bash
   CRX_KEY=your-base64-public-key
   ```

4. **Start development server**

   ```bash
   pnpm dev
   ```

5. **Load the extension**
   - Navigate to `chrome://extensions/` (or `brave://extensions/`)
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `build/chrome-mv3-dev` directory
   - Optionally rebind the shortcut at `chrome://extensions/shortcuts`

   Dev builds load the palette into every page up front. To try the store behavior instead (added to a page only when opened), run `pnpm build` and load `build/chrome-mv3-prod`.

### Usage

1. **Open Command Palette**: Press your shortcut or click the toolbar button
2. **Navigate**: Use arrow keys to move between options
3. **Select**: Press Enter to execute the selected action
4. **Search**: Start typing to search tabs, history, bookmarks, settings, or open an address
5. **Settings**: Right-click the toolbar button → Options

## Publishing

```bash
pnpm package
```

Produces `build/chrome-mv3-prod.zip` for the Chrome Web Store and Edge Add-ons. Listing copy, permission justifications, and the asset checklist are in [store/LISTING.md](store/LISTING.md).

## Technical Stack

- **Framework**: [Plasmo](https://docs.plasmo.com/) - Modern browser extension framework
- **Styling**: Tailwind CSS with CSS variables for theming
- **Command Interface**: [KBar](https://kbar.vercel.app/) - Command palette library
- **State Management**: TanStack Query for server state
- **Storage**: Plasmo Storage API for extension settings
- **Build Tool**: Plasmo with TypeScript compilation
- **Code Quality**: Biome for linting and formatting

## Browser Permissions

- `tabs` - To list, switch to, and open tabs
- `history` - To search browsing history and suggest addresses
- `bookmarks` - To search bookmarks
- `topSites` - To rank address suggestions
- `storage` - To save settings
- `activeTab` + `scripting` - To add the palette to the current page when you open it
- `favicon` - To show site icons from the browser's own cache

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`pnpm lint` && `pnpm type-check`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request
