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
│   ├── common/
│   │   └── BaseModal.vue         # Reusable modal shell (dim + slots + close)
│   ├── grid/
│   │   └── StatusCellEditor.vue  # AG-Grid inline status editor
│   ├── layout/
│   │   ├── AppSidebar.vue        # Left navigation sidebar
│   │   └── AppTabBar.vue         # MDI tab bar
│   └── order/
│       └── OrderDetailModal.vue  # Order detail popup (uses BaseModal)
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

### 2026-05-06

#### v0.8.0 — Features

- **Reusable Modal & Order Detail Popup**: Added a generic modal shell and an order detail popup wired to AG-Grid row double-click in `OrderInquiry.vue`.
  - **`BaseModal.vue`** (`src/components/common/`): A fully reusable modal shell built with Vue `<Teleport to="body">` to avoid z-index stacking issues. Provides a semi-transparent dim overlay (click-outside closes), a centered white panel with configurable `width` prop, a sticky header with title and ✕ close button, a scrollable default body slot, and an optional `footer` slot (rendered only when provided). Emits `close` on both the X button and backdrop click.
  - **`OrderDetailModal.vue`** (`src/components/order/`): Wraps `BaseModal` and accepts a single `order` Object prop. Displays all ten order fields (Order ID, Customer, Phone, Order Date, Product, Amount, Order Status, Shipping Address, Carrier, Tracking No.) in a two-column definition grid. Amount is locale-formatted (`₩`), Order Status renders the Korean label from `useCommonCodeStore` with a color-coded badge, and Carrier is resolved to its Korean display name. Emits `close` on footer button click.
  - **`OrderInquiry.vue` integration**: Added `@row-double-clicked="onRowDoubleClicked"` to the AG-Grid component. The handler copies `event.data` into `selectedOrder` (shallow clone to prevent accidental mutation of grid data) and sets `showDetailModal` to `true`. The `OrderDetailModal` is conditionally rendered with `v-if` and receives the selected order via props; `@close` resets both reactive refs.

### 2026-05-06

#### v0.7.0 — Features

- **Claim Management Screen (AG-Grid)**: Replaced the legacy HTML-table-based `ClaimManagement.vue` with a full AG-Grid Community Edition implementation, matching the structure of `OrderInquiry.vue`.
  - **8-column grid**: Claim ID (pinned left, checkbox), Order ID, Customer, Claim Type, Status, Reason, Amount (₩), Claim Date.
  - **50 mock records**: Deterministic data generator covering all combinations of claim type (`RETURN`, `EXCHANGE`, `REFUND`) and claim status (`IN_PROGRESS`, `COMPLETED`, `PENDING`, `REJECTED`).
  - **Korean label display via `valueFormatter`**: Claim Type and Status columns call `commonCodeStore.getClaimTypeInfo()` and `getClaimStatusInfo()` respectively, so the grid renders Korean labels (반품 / 교환 / 환불 / 진행중 / 완료 / 대기중 / 거절) instead of raw codes.
  - **Checkbox multi-select & smart CSV export**: Inherited from `OrderInquiry.vue` — header checkbox for select-all, row-level checkboxes, and `exportToCsv()` with selection-aware download (`onlySelected`) and `processCellCallback` to write formatted values (Korean labels, ₩-formatted amounts) to the CSV.
  - **Three-condition search**: Keyword (Claim ID / Order ID / Customer), Claim Type dropdown, and Status dropdown. Options are loaded at runtime from `useCommonCodeStore` via `computed` properties. Reset button restores the full 50-row dataset.

#### v0.6.0 — Features

- **Smart CSV Export with Value Formatter (Order Inquiry)**: Enhanced `exportToCsv()` in `OrderInquiry.vue` with selection-aware download and human-readable cell output.
  - **Selection-aware export**: Calls `gridApi.getSelectedNodes()` before exporting. If one or more rows are checked, `onlySelected: true` is passed to `exportDataAsCsv` so only the selected rows are written to the file. If nothing is selected, the flag is omitted and all currently filtered rows are exported.
  - **Value Formatter mapping via `processCellCallback`**: For every cell, checks whether the column's `colDef` has a `valueFormatter`. If present, invokes it with the full AG-Grid parameter object (`value`, `data`, `node`, `colDef`, `column`, `api`) so the CSV contains the formatted display text rather than raw codes — e.g., `₩41,000` instead of `41000`, `CJ대한통운` instead of `CJGLS`, `배송 중` instead of `SHIPPED`.

#### v0.5.0 — Features

- **Checkbox Row Selection & CSV Export (Order Inquiry)**: Added multi-row selection via checkboxes and a one-click CSV export button to `OrderInquiry.vue`.
  - **Checkbox selection**: `checkboxSelection: true` and `headerCheckboxSelection: true` added to the Order ID column; grid `rowSelection` changed from `'single'` to `'multiple'`, enabling header-level select-all and individual row toggling.
  - **Excel Export button**: A green "Excel Export" button added to the search action bar. On click, `exportToCsv()` calls `gridApi.exportDataAsCsv()` with a dynamic filename `orders_YYYYMMDD.csv` (date resolved at click time), exporting the currently filtered/displayed rows.

#### v0.4.0 — Features

- **Inline Edit Async Save & Toast Notification (Order Inquiry)**: Implemented post-edit async save flow with user-facing toast feedback for the "Order Status" inline editor in `OrderInquiry.vue`.
  - **Cell value change detection**: Wired AG-Grid's `cellValueChanged` event (`@cell-value-changed`) to a handler that fires whenever the user commits a new status via the `StatusCellEditor` dropdown.
  - **Guard against no-op edits**: If `event.oldValue === event.newValue` (editor opened and closed without a real change), the handler exits immediately with no API call or notification.
  - **Mock async API**: `mockSaveOrderStatus()` returns a `Promise` that resolves after a 500 ms `setTimeout`, simulating a real server round-trip.
  - **Toast notification**: After the mock save resolves, `vue3-toastify` fires a success toast in the top-right corner: "주문 [ORD-XXXX]의 상태가 [새로운상태]로 변경되었습니다." The toast auto-dismisses after 3 seconds.
  - **Library choice**: Added `vue3-toastify` (zero-dependency, ~10 kB) and registered it globally in `main.js` with `position: 'top-right'`, `autoClose: 3000`, `theme: 'light'`.

#### v0.3.0 — Features

- **Search Form Integration & Grid Filtering (Order Inquiry)**: Wired the search panel in `OrderInquiry.vue` to the AG-Grid data source so that filtering happens entirely on the client against the full 1,000-row mock dataset.
  - **`v-model` bindings**: All three search controls — Keyword text input, Status `<select>`, and Carrier `<select>` — are bound to reactive `ref` variables (`searchKeyword`, `selectedStatus`, `selectedDelivery`).
  - **Dynamic option rendering**: The Status and Carrier `<select>` options are no longer hardcoded. Options are derived at runtime from `useCommonCodeStore` (`orderStatusCodes` and `deliveryCodes`) via `computed` properties and rendered with `v-for`. A static "All" option (`value=""`) is prepended to each list to represent the unfiltered state.
  - **Search logic**: Clicking the Search button (or pressing Enter in the keyword field) runs a filter pass over `allRowData`. Keyword matching uses case-insensitive `includes` against both `orderId` and `customerName`; Status and Carrier filters use exact code matching. Only rows satisfying all active conditions are assigned to `rowData`.
  - **Reset logic**: Clicking the Reset button clears all three reactive fields to their empty/default values and restores `rowData` to the full 1,000-row dataset, giving the user a one-click way to return to the unfiltered view.

### 2026-04-30

#### v0.2.1 — Improvements

- **Grid Column Auto-sizing & Flex Layout (Order Inquiry)**: Replaced fixed pixel widths on all non-pinned AG-Grid columns in `OrderInquiry.vue` with proportional `flex` values so the grid fills the full container width at any viewport size.
  - **Order ID** column remains pinned left with a fixed `width: 175` / `minWidth: 150` (pinned columns are excluded from flex layout).
  - **Proportional flex weights**: `shippingAddress` → `flex: 3`; `productName` → `flex: 2.5`; `orderDate` and `trackingNumber` → `flex: 2`; all other columns → `flex: 1.5`. Longer-content columns receive a higher flex ratio to avoid awkward truncation.
  - **`minWidth` guards**: Every flex column carries a `minWidth` constraint so narrow viewport widths degrade gracefully without collapsing columns to zero.
  - Columns continue to be independently resizable by the user and the grid responds smoothly to browser window resize events without any manual `sizeColumnsToFit()` call.

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
