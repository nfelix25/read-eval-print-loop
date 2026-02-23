## 1. Project Setup

- [x] 1.1 Initialize Vite + TypeScript project (`npm create vite@latest`)
- [x] 1.2 Install CodeMirror 6 core and language packages (js, ts, python, sql, rust, cpp, wasm)
- [x] 1.3 Install sql.js and its TypeScript types
- [x] 1.4 Install vite-plugin-pwa and configure basic manifest (name, short_name, display: standalone, theme_color)
- [x] 1.5 Create app icons (at minimum 192x192 and 512x512 PNG)
- [x] 1.6 Configure GitHub Pages deployment (gh-pages branch or GitHub Actions workflow)

## 2. App Shell and Layout

- [x] 2.1 Create base HTML structure: language picker bar, editor container, run button, output panel, snippets drawer toggle
- [x] 2.2 Apply mobile-first CSS: full-viewport layout using `100dvh`, fixed header, scrollable output, no horizontal overflow
- [x] 2.3 Implement virtual keyboard handling (ensure output panel remains accessible when keyboard is open)
- [x] 2.4 Add dark theme (easier on eyes, standard for code editors)

## 3. Editor

- [x] 3.1 Initialize CodeMirror 6 editor with base extensions (line numbers, bracket matching, auto-indent, undo/redo history)
- [x] 3.2 Implement language switching: map each language to its CodeMirror language package and swap on picker change
- [x] 3.3 Add auto-completion extension with language-appropriate keyword completions
- [x] 3.4 Persist selected language to localStorage and restore on load
- [x] 3.5 Persist editor content to localStorage per language and restore on load / language switch

## 4. JavaScript Execution

- [x] 4.1 Implement sandboxed iframe executor: create iframe with `sandbox` attribute, inject user code, capture `console.log`/`console.error` via `postMessage`
- [x] 4.2 Add 5-second timeout: terminate iframe and show timeout message if execution doesn't complete
- [x] 4.3 Display stdout and stderr in output panel with visual distinction (color)

## 5. SQL Execution

- [x] 5.1 Lazy-load sql.js WASM on first SQL tab selection
- [x] 5.2 Implement in-memory SQLite database that persists across executions within a session
- [x] 5.3 Execute SQL statements and render SELECT results as a table in the output panel
- [x] 5.4 Display SQL errors in the output panel
- [x] 5.5 Add "Reset DB" button to clear the in-memory database

## 6. Piston Execution

- [x] 6.1 Implement Piston API client: POST to `https://emkc.org/api/v2/piston/execute` with language, version, and code
- [x] 6.2 Map each supported language (Python, TypeScript, Rust, C, C++, Zig) to the correct Piston language identifier and version
- [x] 6.3 Display stdout and stderr from Piston response in the output panel
- [x] 6.4 Handle Piston errors (network failure, API error) with a clear user-facing message

## 7. Snippets

- [x] 7.1 Implement snippet data model in localStorage: array of `{ id, name, language, content, savedAt }`
- [x] 7.2 Build snippet save flow: prompt for name, check for duplicate, write to localStorage, update list
- [x] 7.3 Build snippet list UI: slide-in drawer or panel showing all snippets with name and language badge
- [x] 7.4 Implement snippet load: replace editor content and switch language on snippet selection
- [x] 7.5 Implement snippet delete with confirmation
- [x] 7.6 Show empty state message when no snippets are saved

## 8. PWA and Deployment

- [x] 8.1 Verify vite-plugin-pwa generates valid service worker with app shell precaching
- [ ] 8.2 Test PWA installability on Android Chrome (install prompt appears)
- [ ] 8.3 Test "Add to Home Screen" on iOS Safari
- [ ] 8.4 Verify standalone display mode (no browser chrome) on both platforms
- [ ] 8.5 Deploy to GitHub Pages and confirm HTTPS and install flow work end-to-end
- [ ] 8.6 Verify sql.js WASM is cached by service worker after first load
