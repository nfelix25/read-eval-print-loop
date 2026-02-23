## 1. Fix Vite Base Path

- [x] 1.1 In `vite.config.ts`, change `base: "/"` to `base: "/read-eval-print-loop/"`

## 2. Deploy to GitHub Pages

- [ ] 2.1 Commit the base path change and push to `main`
- [ ] 2.2 Wait for the GitHub Actions deploy workflow to complete
- [ ] 2.3 Confirm the app loads at `https://<user>.github.io/read-eval-print-loop/` over HTTPS

## 3. Verify PWA on Android Chrome

- [ ] 3.1 Open the GitHub Pages URL in Chrome on Android
- [ ] 3.2 Confirm the "Add to Home Screen" / install prompt appears
- [ ] 3.3 Install the app and launch it — verify it opens in standalone mode (no browser chrome)

## 4. Verify PWA on iOS Safari

- [ ] 4.1 Open the GitHub Pages URL in Safari on iOS
- [ ] 4.2 Use the Share menu → "Add to Home Screen" and confirm the correct icon and name appear
- [ ] 4.3 Launch from home screen — verify standalone display mode

## 5. Verify Service Worker Caching

- [ ] 5.1 On first load, open DevTools (or browser equivalent) → Application → Service Workers — confirm the service worker is registered and active
- [ ] 5.2 Run a SQL snippet to trigger sql.js WASM load, then check Network tab on reload — confirm WASM is served from service worker cache (not network)
