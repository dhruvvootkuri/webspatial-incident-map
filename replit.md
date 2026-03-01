# WebSpatial US Incident Map

## Overview
Standalone interactive US incident map with WebSpatial 3D support. Shows camera feed locations (gray pins) and incident locations (red severity-coded pins) pulled from Neon PostgreSQL. Clicking a state pops out a 3D detail panel (via WebSpatial SDK) with zoomed state view and labeled pins. Each incident card has an inline video player for Firebase Storage URLs. Map only — no dashboard.

## Architecture
- **Frontend**: React 18 + TypeScript, Vite, TanStack Query, Shadcn UI, Tailwind CSS
- **Backend**: Express.js + TypeScript, PostgreSQL + Drizzle ORM
- **Spatial**: WebSpatial SDK (@webspatial/core-sdk, @webspatial/react-sdk) for visionOS 3D pop-out
- **Map**: SVG US map using pre-generated TopoJSON paths with Albers USA projection
- **Database**: Neon PostgreSQL (via NEON_DATABASE_URL env var)

## Key Files
- `shared/schema.ts` - Database tables (incidents, cameraFeeds, cameraDetections, users)
- `client/src/pages/MapView.tsx` - Full interactive US map with pins and state detail pop-out
- `client/src/data/us-states.ts` - 51 US state SVG paths, projection helpers, state detection
- `client/src/data/us-states-generated.json` - Pre-generated SVG path data from TopoJSON
- `client/src/App.tsx` - Renders MapView at root (no routing needed, map-only app)
- `client/src/index.css` - Dark theme + WebSpatial glass panel CSS
- `server/routes.ts` - `/api/incidents` + `/api/modules/camera-processing/feeds`
- `server/db.ts` - Database connection (prefers NEON_DATABASE_URL, falls back to DATABASE_URL)
- `server/index.ts` - Express server setup

## API Routes
- `/api/incidents` - Incident CRUD (GET, POST, PATCH, DELETE)
- `/api/modules/camera-processing/feeds` - Camera feed list + create + toggle

## Auto-Coordinate Resolution
Incidents with null coordinates are automatically resolved on the frontend:
1. Camera name extracted from title (pattern: "X Detected — Camera Name")
2. Camera name matched against camera feeds table to get coordinates
3. Small offset applied per incident ID to prevent pin stacking
4. Works with em-dash (—), en-dash (–), and regular dash (-)

## Map Features
- Full SVG US map (51 states including DC) via TopoJSON + d3-geo Albers USA projection
- 20 gray camera pins spread across US (NY, CA, IL, TX, FL, WA, CO, GA, MA, PA, NV, MO, LA, DC)
- Red severity-coded incident pins (critical/high/medium/low) with pulse animation
- ALL incidents shown as pins (not filtered by videoUrl)
- Hover tooltips on pins (name, location, severity)
- State hover shows camera/incident counts
- State click opens detail panel with zoomed state outline and pin list
- Inline video player for incidents with Firebase Storage videoUrl

## WebSpatial 3D
- `enable-xr` attribute set via `ref.setAttribute()` in useEffect
- `--xr-back: 150px` CSS var controls depth offset
- `--xr-background-material: glass.thick` for visionOS glass effect
- Panel and overlay both spatialized at different depths
- `html.is-spatial` class enables spatial-specific styles
- 2D glass overlay fallback on regular browsers

## Database
- Neon PostgreSQL via Drizzle ORM (NEON_DATABASE_URL)
- `cameraFeeds` has `coordinates` jsonb field ({lat, lng}) — 20 feeds across US
- `incidents` has `coordinates` jsonb field ({lat, lng}) — auto-resolved from camera name
- `incidents` has `videoUrl` text field for Firebase Storage video links
- Push schema: `npx drizzle-kit push`
- Seed data: `npx tsx server/scripts/seed.ts`

## Port
- Runs on port 5000 (Replit default)

## Theme
- Dark mode command-center aesthetic
- Slate/navy base, red/orange severity accents
- Monospace font for status text
