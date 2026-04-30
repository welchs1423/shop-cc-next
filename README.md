# shop-cc-next

Shopping mall consultant back-office system migrated from Java/Xplatform to Vue 3.

## Tech Stack

- **Vue 3** — Composition API, `<script setup>`
- **Vite** — build tool and dev server
- **Vue Router 4** — URL history management
- **Pinia** — global state management

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── assets/         # Global CSS
├── components/
│   └── layout/
│       ├── AppSidebar.vue    # Left navigation sidebar
│       └── AppTabBar.vue     # MDI tab bar
├── router/
│   └── index.js              # Vue Router configuration
├── stores/
│   └── mdi.js                # Pinia store for MDI tab state
├── views/
│   ├── OrderInquiry.vue      # Order inquiry screen
│   └── ClaimManagement.vue   # Claim management screen
├── App.vue                   # Root layout with keep-alive MDI rendering
└── main.js                   # App entry point
```

## Architecture: MDI (Multi-Document Interface)

Menu clicks do not trigger full page transitions. Instead, each menu item opens a tab in the top tab bar within the main content area. Component state (search fields, results, scroll position) is preserved when switching between tabs, thanks to `<keep-alive>` wrapping the active dynamic component.

- **`useMdiStore`** — manages the list of open tabs and the currently active tab name
- **`<keep-alive>`** — caches component instances by name, preventing state reset on tab switch
- **Vue Router** — reflects the active tab's path in the browser URL for bookmarkability

## Changelog

### v0.1.0 — 2026-04-30

- Initial project setup with Vite + Vue 3 + Vue Router + Pinia
- Implemented MDI layout: left sidebar (LNB) + top tab bar + content area
- Added LNB menu items: **Order Inquiry**, **Claim Management**
- Integrated `<keep-alive>` with dynamic components for state-preserving tab switching
- Vue Router wired to reflect active tab path in browser URL
- Built `OrderInquiry` view with keyword/status search and mock result table
- Built `ClaimManagement` view with keyword/type search and mock result table
