## Context

The app is implemented and ready for production but has never been deployed. The GitHub Actions workflow (`.github/workflows/deploy.yml`) is already wired up to build and publish to `gh-pages` branch on push to `main`. One misconfiguration blocks a working deploy: `vite.config.ts` has `base: "/"` while the PWA manifest uses `scope: "/read-eval-print-loop/"` and `start_url: "/read-eval-print-loop/"`. On GitHub Pages, assets served at `/read-eval-print-loop/` with `base: "/"` will produce broken asset URLs.

## Goals / Non-Goals

**Goals:**
- Fix the `base` path so the built app works correctly at the GitHub Pages subpath
- Get the app live on GitHub Pages over HTTPS
- Confirm PWA install flow and WASM caching work end-to-end

**Non-Goals:**
- Custom domain setup
- Changing the deployment target (GitHub Pages is the right choice for a static PWA)
- Automating the manual device testing steps (8.2–8.4, 8.6)

## Decisions

**Decision: Set `base: "/read-eval-print-loop/"` in vite.config.ts**
Vite uses `base` to prefix all asset URLs in the build output. GitHub Pages serves the repo at `/<repo-name>/`, so `base` must match. The manifest's `scope` and `start_url` already use `/read-eval-print-loop/` — aligning `base` makes the build consistent. Alternative (deploying to a custom domain at `/`) would require DNS setup and is out of scope.

**Decision: Keep the existing GitHub Actions workflow unchanged**
The `deploy.yml` workflow already does `npm ci && npm run icons && npm run build` then publishes `dist/`. Once the base path is fixed, this workflow produces a correct build. No workflow changes are needed.

## Risks / Trade-offs

- [Risk] The `base` change breaks local dev if absolute paths are expected → Mitigation: Vite's dev server uses a separate `server.base` (defaults to `/`), so local dev at `localhost:5173` is unaffected.
- [Risk] Piston proxy (`/piston` → `192.168.50.228:2000`) won't work from GitHub Pages (different host) → This is expected and pre-existing: Piston only works on the local network. The deployed app will gracefully fail Piston calls with an error message.

## Migration Plan

1. Change `base: "/"` to `base: "/read-eval-print-loop/"` in `vite.config.ts`
2. Commit and push to `main`
3. GitHub Actions deploys automatically
4. Manually verify the app at the GitHub Pages URL
5. Test PWA install on Android Chrome and iOS Safari
6. Verify standalone display mode
7. Verify sql.js WASM is cached after first load

Rollback: revert the `base` change and push.
