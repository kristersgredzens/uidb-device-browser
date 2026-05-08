# UIDB Device Browser

Internal productivity tool for Ubiquiti — helps developers, designers, and PMs discover, verify, share, and align on product data from the UIDB.

## Live Demo

---

## Quick Start

```bash
# Prerequisites: Node.js 18+
npm install
npm run dev
```

Other scripts:

| Command             | What it does                          |
|---------------------|---------------------------------------|
| `npm run build`     | Type-check + production build → `dist/` |
| `npm run preview`   | Serve the production build locally    |
| `npm run lint`      | Run ESLint                            |

No environment variables, API keys, or backend services are required — the app fetches data directly from a public endpoint.

---

## Features

- **List View** — Virtualized table with device thumbnail, product line, and name
- **Grid View** — Responsive card grid (6/4/2/1 columns) with product image, line badge, name, and shortname
- **Device Detail** — Full product info with large image, specs table, and raw JSON viewer with copy-to-clipboard
- **Search** — Autocomplete dropdown matching device names and shortnames with keyboard navigation
- **Filter** — Product line filter dropdown with checkboxes and reset
- **View Toggle** — List/grid switch persisted in the URL (`?view=list|grid`)
- **Prev/Next Navigation** — Browse devices sequentially from the detail page

---

## Data Source

All data comes from the public UIDB endpoint:

```
GET https://static.ui.com/fingerprint/ui/public.json
```

**Response shape:** `{ devices: Device[] }` — an array of ~150+ product objects.

**Product image URL template:**

```
https://images.svc.ui.com/?u=https%3A%2F%2Fstatic.ui.com%2Ffingerprint%2Fui%2Fimages%2F{id}%2Fdefault%2F{images.default}.png&w={size}&q=75
```

The image utility in `src/utils/image.ts` builds these URLs and handles missing hashes with a placeholder fallback.

---

## Tech Stack

| Layer           | Choice                       | Why                                                              |
|-----------------|------------------------------|------------------------------------------------------------------|
| Framework       | **React 19** + **TypeScript 6** | Project requirements                                          |
| Build           | **Vite 8**                   | Fast dev/build, native CSS Modules support                       |
| Styling         | **CSS Modules** (`.module.css`) | Scoped styles                                                 |
| Routing         | **React Router v7**          | List/detail navigation, URL-based state                          |
| Data Fetching   | **TanStack Query v5**        | Caching (5min stale, 24h localStorage persistence)               |
| Virtualization  | **TanStack Virtual**         | Smooth scrolling for both list and grid views                    |
| Path Aliases    | `@/` maps to `src/`          | Configured in `tsconfig.app.json` + `vite.config.ts`             |

---

## Project Structure

```
src/
├── components/                  # Reusable components
│   ├── DeviceGrid/              # Responsive card grid
│   ├── DeviceTable/             # Virtualized table
│   ├── ErrorCatcher/            # Error catcher
│   ├── FilterDropdown/          # Product filter
│   ├── Header/                  # App header
│   ├── Icons/                   # Shared SVGs
│   ├── Layout/                  # Shell: Header + page content
│   ├── SearchAutocomplete/      # Search input with autocomplete dropdown
│   └── Toolbar/                 # Search, count, view toggle, filter bar
├── pages/
│   ├── DeviceDetail/            # JSON viewer
│   ├── DeviceList/              # Main page: data fetching, filtering, table/grid
│   └── NotFound/                # 404 page
├── hooks/
│   └── useDevices.ts            # TanStack Query hook for UIDB data
├── types/
│   └── device.ts                # TypeScript interfaces for API
├── utils/
│   ├── device.ts                # Device data helpers (search matching, power, speed, ports)
│   ├── image.ts                 # Image URL builder
│   └── preload.ts               # Image preload on hover
├── styles/
│   └── global.css               # CSS reset, design tokens as custom properties, base typography
├── App.tsx                      # Route definitions + 404 route
└── main.tsx                     # Entry: providers (QueryClient, Router, ErrorCatcher)
```

Each component lives in its own folder with an `index.tsx` and a co-located `.module.css` file.

---

### URL StateF

| URL Pattern         | State                                    |
|---------------------|------------------------------------------|
| `/?view=list`       | List (table) view — default              |
| `/?view=grid`       | Grid (card) view                         |
| `/devices/:id`      | Device detail page with prev/next nav    |

### Design Tokens

All colors, shadows, and layout values from the Figma design are defined as CSS custom properties in `src/styles/global.css` using the `--unifi-*` prefix:

```css
--unifi-color-ublue-06: #006FFF;   /* Primary blue */
--unifi-text-black-85: rgba(0,0,0,0.85);  /* Headings */
--unifi-color-neutral-03: #EDEDF0; /* Borders */
--unifi-shadow-high: 0px 16px 32px rgba(28,30,45,0.2); /* Dropdowns */
/* ...etc */
```

When adding new components, reference these tokens instead of hardcoding color values.

## Known Limitations

- **No tests** — the project was kick-started for handoff; adding unit/integration tests (e.g., Vitest + React Testing Library) is a recommended first step.
- **No i18n** — all strings are hardcoded in English.
- **No auth** — this is an internal tool; authentication/authorization is not implemented.
- **Single API endpoint** — if the UIDB endpoint goes down or changes its schema significantly, the app may show empty/degraded data. The error catcher and TanStack Query error states handle this gracefully but there's no retry UI beyond the built-in query retry (3 attempts).
