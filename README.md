# Darc - Chrome Extension Command Palette

Darc is a powerful Chrome extension that brings a familiar command palette to your browser, enabling quick navigation and enhanced productivity through keyboard shortcuts.

## What Darc Currently Supports

### 🎯 Core Features

- **Command Palette Interface**: Clean, minimal UI with smooth animations activated by `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
- **Keyboard-First Navigation**: Full keyboard support with arrow keys and enter for selection

### 📑 Tab Management

- **Recent Tab Display**: Shows 4 most recently active tabs when palette opens
- **Quick Tab Switching**: Switch between open tabs with keyboard or click
- **Tab Search**: Search across all open tabs by title and URL
- **Smart Tab Filtering**: Excludes currently active tab from results

### 📚 Browsing History Integration

- **History Search**: Search through browsing history as you type
- **Intelligent Results**: Display matching history items by relevance
- **Quick Access**: Open history items in current or new tab
- **Visual Context**: Shows hostname and last visit date for each result

### 🔗 URL & Web Search

- **Smart URL Detection**: Automatically detects when input resembles a URL
- **Direct Navigation**: Navigate directly to entered URLs
- **Web Search Integration**: Search the web using Google for any text input
- **Dynamic Actions**: URL and search options appear contextually based on input

### 🎨 User Experience

- **Responsive Design**: Works across different window sizes
- **Visual Feedback**: Clear indication of selected items with favicons
- **Smooth Animations**: 200ms enter, 100ms exit animations
- **Focus Management**: Auto-focuses search input when opened

## Short-Term Goals

- [ ] **Enhanced Search Engine Support**: Add Bing and DuckDuckGo options alongside Google
- [ ] **DuckDuckGo Operator Support**: Add support for DuckDuckGo's ! search syntax
- [ ] **UI Polish**: Complete the clean, minimal aesthetic improvements
- [ ] **Cross-Browser Compatibility**: Ensure full compatibility with all Chromium-based browsers
- [ ] **Performance Optimization**: Minimize extension impact on browser performance

## 🔮 Future Enhancements

- [ ] **User Customization**: Allow users to customize shortcuts and behavior
- [ ] **Bookmark Integration**: Search and navigate bookmarks
- [ ] **Additional Command Types**: Extend beyond navigation (page actions, developer tools, etc.)
- [ ] **Extension Shortcuts**: Quick access to other installed extensions

## Getting Started

### Prerequisites

- Node.js
- pnpm (recommended) or npm
- Chrome or Chromium-based browser

### Installation & Setup

1. **Clone the repository**

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```bash
   # Required for the extension to work
   PLASMO_PUBLIC_CHROME_EXTENSION_ID=your-extension-id-here
   CRX_KEY=your-crx-key-here
   ```

4. **Start development server**

   ```bash
   pnpm dev
   ```

5. **Load the extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `build/chrome-mv3-dev` directory
   - The extension should now be loaded and ready to use!

### Usage

1. **Open Command Palette**: Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. **Navigate**: Use arrow keys to move between options
3. **Select**: Press Enter to execute the selected action
4. **Search**: Start typing to search tabs, history, or URLs
5. **Toggle Theme**: Press `t` while the palette is open to switch themes

## Technical Stack

- **Framework**: [Plasmo](https://docs.plasmo.com/) - Modern browser extension framework
- **Styling**: Tailwind CSS with CSS variables for theming
- **Command Interface**: [KBar](https://kbar.vercel.app/) - Command palette library
- **State Management**: TanStack Query for server state
- **Storage**: Plasmo Storage API for extension settings
- **Build Tool**: Plasmo with TypeScript compilation
- **Code Quality**: Biome for linting and formatting

## Browser Permissions

The extension requires the following permissions:

- `tabs` - To list and switch between browser tabs
- `history` - To search browsing history
- `storage` - To save user preferences and settings
- `commands` - To register keyboard shortcuts
- `host_permissions` - To work across all websites

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`pnpm lint` && `pnpm type-check`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request
