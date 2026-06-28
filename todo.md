# Manus Task Dashboard — TODO

## Core Features
- [x] PIN lock screen (Brandon Rose's Manus Tasks branding)
- [x] Task list fetched live from Manus API via server-side tRPC proxy (no CORS, API key server-side)
- [x] Full pagination — fetches all pages incrementally, shows progress
- [x] Task grid view with amber/slate design
- [x] Task list view toggle
- [x] Search with debounce (Cmd+K shortcut)
- [x] Filter by status (completed / running / waiting)
- [x] Filter by type (standard / project / subtask)
- [x] Filter by agent profile
- [x] Hide subtasks toggle
- [x] Sort by newest / oldest / credits
- [x] Task detail panel (Sheet) with full metadata
- [x] Download task as JSON button
- [x] Bar chart showing tasks by status
- [x] Stat cards (total, completed, running, credits)
- [x] Dark mode theme (deep slate + amber gold)
- [x] Lock dashboard button
- [x] Apps page (/apps)

## Infrastructure
- [x] Upgraded to full-stack (Express + tRPC + Vite)
- [x] MANUS_API_KEY stored as server-side secret
- [x] Vitest tests for API key and auth logout

## Mobile
- [x] Responsive layout for iPhone (hamburger menu, slide-in sidebar drawer)
- [x] 2x2 stats grid on mobile
- [x] Mobile card-style list view (replaces wide table on small screens)
- [x] Responsive top bar (sort hidden on xs, compact padding)
- [x] Touch-friendly tap targets throughout

## Upcoming Features
- [x] PWA manifest.json + iPhone home screen meta tags (Add to Home Screen)
- [x] Tap-to-refresh button in mobile top bar
- [x] Running tasks alert badge on hamburger button / sidebar

## GitHub Repositories
- [x] Fetch all GitHub repos for BrandonRose2 via GitHub API
- [x] Add GitHub Repositories page/sidebar nav item with repo cards and links

## GitHub Repo Indicator & Creator
- [x] Backend tRPC endpoint: fetch all GitHub repos for BrandonRose2 (live, not static)
- [x] Backend tRPC endpoint: create a new GitHub repo by name
- [x] GitHub indicator badge on each task card (green checkmark if repo exists, grey + if not)
- [x] Create Repo modal: click card badge → enter repo name → push to GitHub
