## Why

The app is built but not yet deployed to GitHub Pages. There is also a misconfiguration in `vite.config.ts` where `base: "/"` conflicts with the manifest's `scope` and `start_url` of `/read-eval-print-loop/`, which will cause the PWA to fail to install and load correctly on GitHub Pages.

## What Changes

- Fix `base` in `vite.config.ts` from `"/"` to `"/read-eval-print-loop/"` so Vite resolves assets against the correct GitHub Pages subpath
- Trigger the GitHub Actions deploy workflow (push to `main`) to publish to GitHub Pages over HTTPS
- Manually verify PWA installability on Android Chrome and iOS Safari after deploy
- Manually verify standalone display mode (no browser chrome) on both platforms
- Manually verify sql.js WASM is served and cached by the service worker after first load

## Capabilities

### New Capabilities

- `github-pages-deploy`: Fix the Vite base path and deploy the app to GitHub Pages, enabling HTTPS and PWA install flows

### Modified Capabilities

<!-- No existing spec-level requirements are changing -->

## Impact

- `vite.config.ts`: Change `base` field from `"/"` to `"/read-eval-print-loop/"`
- `.github/workflows/deploy.yml`: No changes needed — workflow is already correct
- No API or dependency changes
