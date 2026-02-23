## ADDED Requirements

### Requirement: Correct asset base path for GitHub Pages
The app SHALL be built with `base: "/read-eval-print-loop/"` so all asset URLs (JS, CSS, WASM, icons) resolve correctly when served from the GitHub Pages subpath.

#### Scenario: Assets load at subpath
- **WHEN** user navigates to `https://<user>.github.io/read-eval-print-loop/`
- **THEN** all JS, CSS, WASM, and icon assets load without 404 errors

#### Scenario: Manifest scope and start_url match base
- **WHEN** browser fetches the web app manifest
- **THEN** `scope` and `start_url` both resolve to `/read-eval-print-loop/`, matching the Vite base

### Requirement: GitHub Pages deployment via CI
The app SHALL be automatically deployed to GitHub Pages on every push to `main` via the existing GitHub Actions workflow.

#### Scenario: Push to main triggers deploy
- **WHEN** a commit is pushed to the `main` branch
- **THEN** the GitHub Actions workflow builds the app and publishes the `dist/` directory to the `gh-pages` branch

#### Scenario: App accessible over HTTPS after deploy
- **WHEN** the workflow completes successfully
- **THEN** the app is accessible at `https://<user>.github.io/read-eval-print-loop/` over HTTPS
