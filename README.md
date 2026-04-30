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

### 2026-04-30

#### v0.2.0 — Features

- **Data Grid & Inline Editing (Order Inquiry)**: Replaced the basic HTML table in `OrderInquiry.vue` with **AG-Grid Community Edition v35** (`ag-grid-vue3`) for enterprise-grade large-dataset rendering.
  - **10-column grid**: Order ID (pinned left), Customer, Phone, Order Date, Product, Amount (₩), Shipping Address, Carrier, Tracking No., Order Status.
  - **1,000 mock records**: Deterministic mock data generated at runtime; AG-Grid's built-in row virtualization renders all 1,000 rows with no perceptible delay.
  - **Inline editing**: The "Order Status" column is editable via a custom Vue 3 cell editor component (`StatusCellEditor.vue`). Clicking the cell opens a native `<select>` dropdown directly in the grid cell; pressing Escape or choosing a value commits the change without leaving the row.
  - **Pinia integration**: The status dropdown options are sourced from `useCommonCodeStore().orderStatusCodes`, keeping the grid in sync with the global common code cache loaded at app startup.
  - **Column features**: Sorting and column filtering enabled on key columns; columns are resizable and the Amount column uses locale-formatted currency display (`₩`).



#### v0.1.3 — Bug Fixes

- **MDI Routing Edge Case Bug Fix (Back navigation)**: Resolved a UI desync bug where using the browser's back button to navigate to a previously closed tab would update the URL and content area correctly, but fail to re-create the tab in the tab bar UI.
  - **Root cause**: The `watch(() => route.name, ...)` in `App.vue` only called `activateTab()` when the incoming route name already existed in `mdiStore.tabs`. If the tab had been closed, it was absent from the list and the watch did nothing, leaving the tab bar out of sync with the URL.
  - **Fix (`App.vue`)**: Extended the watch with a two-branch check. If `route.name` is found in the open tab list, `activateTab()` is called as before. If it is not found (i.e., the tab was previously closed), `openTab()` is called instead, reconstructing the tab from `route.meta.title` and `route.path`. This restores the tab bar entry and sets it as the active tab, keeping the UI fully in sync with the browser history.

#### v0.1.2 — Bug Fixes

- **MDI Routing & Rendering Bug Fix**: Resolved tab switching bug where the browser URL updated correctly but the rendered view remained stuck on the previously active tab.
  - `App.vue`: Replaced Pinia-driven `<component :is>` rendering with Vue Router's `<router-view v-slot="{ Component, route }">` pattern. Added `:key="route.fullPath"` on the dynamic `<component>` inside `<keep-alive>` to guarantee Vue destroys and re-creates (or restores from cache) the correct component instance on every route change.
  - `App.vue`: Added a `watch` on `route.name` to bidirectionally sync `mdiStore.activeTabName` from the router. This ensures the tab bar highlights the correct tab even when the URL changes from an external source (e.g., browser back/forward button).
  - `AppTabBar.vue`: Removed stale `router.push('/home')` fallback in `closeTab` — no `/home` route exists, and the welcome screen is now driven purely by Pinia state (`mdiStore.activeTab`).

#### v0.1.1 — Features

- **Common Code Global State Management**: Implemented Pinia store (`useCommonCodeStore`) to manage delivery company codes and order status codes. Added mock API functions to fetch codes on app initialization.
- **Search Filter Integration**: Updated `OrderInquiry` and `ClaimManagement` views to load search filter options (Select Box) from the common code store instead of hardcoded values.

#### v0.1.1 — Bug Fixes

- **Router component mapping**: Added missing `component` properties to route records using dynamic import syntax (`() => import('@/views/...')`). Fixed Vue Router warning: "Record with path is either missing a component(s) or children property."
- **Keep-alive multiple root nodes**: Wrapped all sibling elements in view templates with a single root `<div>` container to comply with Vue 3's `<keep-alive>` requirement. Fixed "parentComponent.ctx.deactivate is not a function" error.
- **Removed unused route**: Eliminated unused `/home` route and set default redirect to `/order-inquiry`.

#### v0.1.0 — Initial Setup

- Initial project setup with Vite + Vue 3 + Vue Router + Pinia
- Implemented MDI layout: left sidebar (LNB) + top tab bar + content area
- Added LNB menu items: **Order Inquiry**, **Claim Management**
- Integrated `<keep-alive>` with dynamic components for state-preserving tab switching
- Vue Router wired to reflect active tab path in browser URL
- Built `OrderInquiry` view with keyword/status search and mock result table
- Built `ClaimManagement` view with keyword/type search and mock result table
