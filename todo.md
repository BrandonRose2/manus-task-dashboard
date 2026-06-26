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
