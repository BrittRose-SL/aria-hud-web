# A.R.I.A. Wearer HUD - Web Panels

Static, dependency-free pages loaded via Second Life MOAP (`llSetPrimMediaParams`)
on the 4 linked prims that make up the A.R.I.A. wearer HUD (main, unit status,
app status, proximity scanner). Deployed as a single GitHub Pages site; each
panel is just a folder/route.

## Why static works here

Each HUD is its own in-world object with its own LSL script state, so there is
no cross-wearer data to manage. The LSL side already pulls the connected
unit's stats over region chat (`ARIA_STATUS`/`BATTERY_UPDATE` etc. in
`unit_master_kernel.lsl` / `wearer_hud_main_kernel.lsl`) - this site never
talks to the unit directly. Instead, each prim's script encodes its current
values as query parameters and calls `llSetPrimMediaParams` with a new
`PRIM_MEDIA_CURRENT_URL` whenever something changes; the page's JS reads
`location.search` and renders. No backend, no shared state, no per-wearer
mixups - isolation is free because the object itself is per-wearer.

**Important for the LSL side:** changing `PRIM_MEDIA_CURRENT_URL` re-navigates
the embedded browser (there is no in-page push channel). Debounce/diff values
in the script and only push a URL update when something actually changed, or
the panel will visibly flicker/reload on every poll tick.

## Panels and their query-param contract

### `/main/` - main kernel HUD (`wearer_hud_main_kernel.lsl`)
| Param | Type | Meaning |
|---|---|---|
| `connection` | `DISCONNECTED` \| `SCANNING` \| `CONNECTED` | Kernel's `gState` |
| `unit` | string | `gConnectedUnit` |
| `persona` | string | `gPersona` |
| `battery` | int 0-100 | `gBattery` |
| `mode` | string | `gMode` |
| `status` | string | `gStatus` |
| `unitsFound` | int | count of units found while scanning |

### `/unit-status/` - unit vitals (`wearer_hud_status_display.lsl`)
| Param | Type | Meaning |
|---|---|---|
| `unit` | string | connected unit name (empty = not connected) |
| `persona` | string | |
| `admin` | string | current admin/wearer display name |
| `secured` | `0`\|`1` | secured state |
| `battery` | float 0-100 | |
| `arousal` | float 0-100 | |
| `stimulation` | float 0-100 | |
| `pain` | float 0-100 | |
| `energy` | float 0-100 | |

### `/app-status/` - module & restriction state (`wearer_hud_app_interface.lsl`)
| Param | Type | Meaning |
|---|---|---|
| `unit` | string | connected unit name |
| `modules` | comma-separated list | active module names |
| `restrictions` | comma-separated list | active restriction names |

### `/proximity/` - local sensor sweep (`wearer_hud_proximity_scanner.lsl`)
This one is **not** unit telemetry - it's the wearer's own `llSensor` scan and
has no connection to the unit at all.

| Param | Type | Meaning |
|---|---|---|
| `active` | `0`\|`1` | scanner currently running |
| `range` | float | scan range in meters |
| `count` | int | detected avatar count |
| `avatars` | `Name:Distance,Name:Distance` | nearby avatars |

Any page loaded with **no** query params renders sample data and shows a
"SAMPLE DATA" badge, so you can sanity-check the page shape without a HUD.

## Deploy

1. Push this repo to GitHub.
2. Repo Settings -> Pages -> Deploy from branch -> `main` / `(root)`.
3. Point each prim's `gMediaURL` (or equivalent config) at
   `https://<user>.github.io/<repo>/main/`, `/unit-status/`, `/app-status/`,
   `/proximity/` respectively, then append live query params from LSL.

## Status

Placeholder styling and layout - the visual design (colors, layout, motion)
is expected to change; the query-param contract above is the part other
scripts should treat as stable once it's wired up.
