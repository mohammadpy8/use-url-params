# use-url-params-react

> Zero-dependency React hooks for managing URL search params with grouped sort support.

[![npm version](https://img.shields.io/npm/v/use-url-params-react)](https://www.npmjs.com/package/use-url-params-react)
[![license](https://img.shields.io/npm/l/use-url-params-react)](./LICENSE)
[![peerDependencies](https://img.shields.io/npm/peer-dependency-version/use-url-params-react/react)](https://reactjs.org/)

## Features

- **Zero dependencies** — only React (≥ 18) as a peer dependency
- **Framework agnostic** — works with any React-based router (Next.js, React Router, TanStack Router, etc.)
- **Grouped sort params** — manage `sort_by` / `sort_dir` per model without conflicts
- **Shared pending state** — multiple hooks in the same tree share one pending ref, so concurrent updates don't overwrite each other
- **Full TypeScript support**

## Installation

```bash
npm install use-url-params-react
# or
pnpm add use-url-params-react
# or
yarn add use-url-params-react
```

## Quick Start

Wrap your app (or the relevant subtree) with `URLParamsProvider`, then use the hooks anywhere inside it.

```tsx
// app/layout.tsx  (Next.js example)
import { URLParamsProvider } from "use-url-params-react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <URLParamsProvider>{children}</URLParamsProvider>
      </body>
    </html>
  );
}
```

```tsx
// components/UserTable.tsx
"use client";

import { useQueryParams, useSortParams } from "use-url-params-react";

export default function UserTable() {
  const { setParam, getParam, removeParam, removeAllParams, getAllParams } = useQueryParams();
  const { setSort, getSort, getAllSort, removeSort } = useSortParams();

  return (
    <div>
      {/* Regular params */}
      <button onClick={() => setParam("page", "2")}>Page 2</button>
      <button onClick={() => setParam("search", "ali")}>Search</button>
      <p>Current page: {getParam("page")}</p>
      <p>Full URL: {getAllParams()}</p>

      {/* Sort params */}
      <button onClick={() => setSort("users", { sort_by: "name", sort_dir: "asc" })}>
        Sort users by name
      </button>
      <button onClick={() => setSort("orders", { sort_by: "date", sort_dir: "desc" })}>
        Sort orders by date
      </button>

      <p>Users sort: {JSON.stringify(getSort("users"))}</p>
      <p>All sorts: {JSON.stringify(getAllSort())}</p>
    </div>
  );
}
```

**URL result:**
```
/users?page=2&search=ali&users[sort_by]=name&users[sort_dir]=asc&orders[sort_by]=date&orders[sort_dir]=desc
```

## API Reference

### `<URLParamsProvider>`

Provides shared pending state to all hooks in the tree. Must wrap any component that uses the hooks.

```tsx
import { URLParamsProvider } from "use-url-params-react";

<URLParamsProvider>
  {children}
</URLParamsProvider>
```

---

### `useQueryParams()`

Manage regular (non-sort) search params.

```ts
const {
  setParam,       // (key, value) => void
  getParam,       // (key) => string | null
  removeParam,    // (key) => void
  removeAllParams,// () => void
  getAllParams,   // () => string  — returns full URL string
} = useQueryParams();
```

**Examples:**

```ts
// Set a param
setParam("page", "3");
// → ?page=3

// Get a param
const page = getParam("page"); // "3"

// Remove a param
removeParam("page");
// → (page removed from URL)

// Remove all params
removeAllParams();
// → /current-path

// Get full URL string
const url = getAllParams();
// → "/dashboard?page=3&search=ali"
```

---

### `useSortParams()`

Manage grouped sort params. Each model gets its own isolated `sort_by` / `sort_dir` pair in the URL using bracket notation: `model[sort_by]` and `model[sort_dir]`.

```ts
const {
  setSort,    // (model, { sort_by, sort_dir }) => void
  getSort,    // (model) => SortGroup | null
  getAllSort,  // () => Record<string, SortGroup>
  removeSort, // (model) => void
} = useSortParams();
```

**Examples:**

```ts
// Set sort for a model
setSort("users", { sort_by: "name", sort_dir: "asc" });
// → ?users[sort_by]=name&users[sort_dir]=asc

// Set multiple sorts — they don't overwrite each other
setSort("users",  { sort_by: "name", sort_dir: "asc" });
setSort("orders", { sort_by: "date", sort_dir: "desc" });
// → ?users[sort_by]=name&users[sort_dir]=asc&orders[sort_by]=date&orders[sort_dir]=desc

// Get sort for a model
const usersSort = getSort("users");
// → { sort_by: "name", sort_dir: "asc" }

// Get all active sorts
const allSorts = getAllSort();
// → { users: { sort_by: "name", sort_dir: "asc" }, orders: { sort_by: "date", sort_dir: "desc" } }

// Remove sort for a model
removeSort("users");
// → (users sort removed, orders sort remains)
```

---

### `useURLParams()` (advanced)

Low-level hook exposing `buildParams` and `pushParams`. Used internally by `useQueryParams` and `useSortParams`. You can use it to build custom param logic.

```ts
const { buildParams, pushParams } = useURLParams();

// Build a URLSearchParams from current URL + pending state
const params = buildParams();
params.set("custom", "value");
pushParams(params);
```

---

## Types

```ts
type SortDir = "asc" | "desc";

interface SortGroup {
  sort_by: string;
  sort_dir: SortDir;
}
```

---

## Framework Integration

### Next.js (App Router)

The hooks use `window.history.pushState` internally. If you need Next.js router awareness (e.g. `useSearchParams` reactivity), wrap the hooks in a thin adapter that calls `router.replace` after `pushParams`. The built-in behavior still works correctly for reading and writing params.

### React Router / TanStack Router

Works out of the box — no adapter needed.

---

## Why `URLParamsProvider`?

When multiple hooks (`useQueryParams` + `useSortParams`) are used together, they need to share a single pending `URLSearchParams` ref. Without the provider, each hook instance reads from the URL independently, causing concurrent updates to overwrite each other.

```
Without provider:
  setSort("users", ...)  → reads URL → writes ?users[sort_by]=name
  setSort("orders", ...) → reads URL (old!) → writes ?orders[sort_by]=date  ← users sort lost!

With provider:
  setSort("users", ...)  → reads pending ref → writes both to ref → pushes once
  setSort("orders", ...) → reads updated pending ref → appends → pushes once ✅
```

---

## Contributing

Issues and PRs are welcome at [github.com/mohammadpy8/use-url-params](https://github.com/mohammadpy8/use-url-params).

## License

MIT © [Mohammad](https://github.com/mohammadpy8)
