# Green Farm Web — Technical Foundation

## Stack

- Next.js App Router, React, and TypeScript for routes and interface.
- Three.js through React Three Fiber for the scene at `/game`.
- Supabase PostgreSQL for player data once a Supabase project and evidence-backed schema exist.
- `@supabase/ssr` browser/server client helpers; only the publishable key is referenced by the app.
- Zustand for client game state; typed rule functions validate the local MVP actions.
- LocalStorage snapshot version 1 for the playable vertical slice. This is a prototype save, not a trusted server save.
- Vercel is the planned host; no deployment has been configured.

## Current routes

- `/` is a project landing page and preview of original art tests.
- `/game` is a playable local vertical slice: clear a rock, plant/harvest wheat, produce feed, fulfill one neighbor request, and retain timestamp-based progress in the browser.

## Boundaries

- `src/game/world` contains Three.js rendering and visual scene elements.
- `src/game/state/farm-rules.ts` contains MVP game rules and action validation; `ui-store.ts` applies actions and writes versioned local save data.
- `src/components` composes panels and the game view.
- `src/lib/supabase` contains server and browser client factories. No query or authentication flow is enabled yet.
- `src/game/world` currently builds original low-poly assets from React Three Fiber geometry. Blender/GLB production can follow after the runtime art direction is reviewed; Blender is unavailable in the current environment.

## Save and action architecture

**MVP:** action → typed local rule → state update → localStorage snapshot. Crop and production timers store `readyAt` timestamps and are rechecked when the player claims an action. This supports a local demo, but users can edit browser state and saves do not sync between devices.

**Online follow-up:** action → server validation → transactional state change → response to UI. Never trust browser currency, inventory, timer, or order-completion values. Implement this after Supabase project credentials exist and online save migration is approved. The MVP has no authentication, SQL migrations, or remote persistence.

## Configuration

Copy `.env.example` to `.env.local` and fill in the Supabase project URL and publishable key when a project exists. Never add a service-role or secret key to a `NEXT_PUBLIC_` variable. Authentication session refresh middleware/proxy should be added when auth routes are actually implemented.
