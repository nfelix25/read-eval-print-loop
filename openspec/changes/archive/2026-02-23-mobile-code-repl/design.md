## Context

New greenfield project — a personal PWA for experimenting with code on a phone. No existing codebase to integrate with. Primary target is Android Chrome with future iPad/iOS Safari support. The user wants an instant, full-screen experience (home screen icon → editor), with a few languages that cover curiosity-driven learning: JavaScript, Python, SQL as core; Rust, C, C++, TypeScript, Zig as secondary.

## Goals / Non-Goals

**Goals:**
- Instant load from home screen (PWA, cached app shell)
- Code editor with syntax highlighting + completion for all supported languages
- Execute code: JS locally, SQL locally, everything else via Piston API
- Save and load named snippets via localStorage
- Mobile-optimized layout (full-screen, touch-friendly)

**Non-Goals:**
- Multi-file projects or a file system
- Collaboration or snippet sharing
- Offline execution for compiled languages
- Accounts, sync, or cloud storage
- Terminal/shell access

## Decisions

### 1. Vanilla TypeScript + Vite, no framework

**Decision:** No React/Svelte/Vue. Plain TypeScript with Vite as the build tool.

**Rationale:** The reactive surface is small — a language picker drives editor mode, a run button triggers execution, a save button updates a list. These are three event handlers and a state object, not a component tree. Svelte would be pleasant but adds a compile step and abstraction layer for no meaningful gain. Vanilla keeps every line of glue code visible and debuggable.

**Alternative considered:** Svelte — would be clean and minimal. Rejected because the app is simple enough that the framework adds indirection without benefit.

---

### 2. CodeMirror 6 over Monaco

**Decision:** CodeMirror 6 as the editor.

**Rationale:** Monaco (VS Code's editor) is ~2MB, has poor mobile touch support, and requires complex configuration. CodeMirror 6 is modular (only bundle the language packages you need), designed for mobile, and has a first-class extension API for completions, hover tooltips, and linting. Better fit for a phone-first experience.

**Alternative considered:** Monaco — richer out-of-the-box for desktop. Rejected due to size and mobile UX.

---

### 3. Execution strategy: iframe + sql.js + Piston

**Decision:** Three-way execution split based on language tier.

- **JavaScript:** Sandboxed `<iframe>` with `srcdoc`. Captures `console.log` via `postMessage`. Instant, no network, true REPL-like feedback.
- **SQL:** sql.js (SQLite compiled to WASM). Runs in-browser, supports building up a schema across executions, no network round-trip.
- **Everything else (Python, TypeScript, Rust, C, C++, Zig):** Piston public API (`emkc.org/api/v2/piston`). Free, no API key, ~500ms latency, supports all needed languages.

**Rationale:** JS and SQL are the most interactive — local execution makes them feel like a real REPL. Compiled languages are inherently "write → run → see output" so a network round-trip matches the mental model and saves shipping Pyodide (~10MB) or WASM compilers.

**Alternative considered:** Pyodide for Python — excellent but ~10MB and slow cold start. Piston Python is good enough for learning snippets and loads in milliseconds.

**Alternative considered:** Piston for everything — simpler, but JS loses the interactive feel and SQL loses the stateful schema. Not worth it.

---

### 4. Piston public API, not self-hosted

**Decision:** Use the free public Piston instance at `emkc.org`.

**Rationale:** Personal project with a single user. The public instance is free, no API key required, and has no known hard rate limits for light use. Self-hosting would require a VPS and ongoing maintenance.

**Risk:** Public instance could go down or add rate limits. Acceptable for a personal tool — failure mode is a clear error message.

---

### 5. localStorage for snippets

**Decision:** Persist snippets as a JSON array in `localStorage`.

**Rationale:** Simple, zero-dependency, works offline, sufficient for dozens of snippets. No sync needed — this is a single-device personal tool.

**Alternative considered:** IndexedDB — more robust for large data. Overkill for a snippet list.

---

### 6. vite-plugin-pwa for PWA setup

**Decision:** Use `vite-plugin-pwa` (Workbox) to generate the manifest and service worker.

**Rationale:** Handles precaching of the app shell automatically. Configuring a service worker manually is error-prone. The plugin integrates cleanly with Vite's build output.

**Caching strategy:** Precache all app assets (JS, CSS, HTML). sql.js WASM cached on first load. Piston API calls are never cached (always need fresh execution).

---

### 7. GitHub Pages for hosting

**Decision:** Deploy to GitHub Pages via a `gh-pages` branch or GitHub Actions.

**Rationale:** Free, provides HTTPS (required for PWA installation), zero infrastructure to manage. Simple push-to-deploy workflow.

## Risks / Trade-offs

- **Piston reliability** → Show a clear error with the raw error message. No retry logic needed for a personal tool.
- **Mobile keyboard layout jank** → CodeMirror + virtual keyboard can cause viewport resize issues. Use `height: 100dvh` and fixed-position layout to minimize. Test on Android Chrome early.
- **sql.js WASM size (~1MB)** → Lazy-load on first SQL tab selection. After first load, service worker caches it.
- **TypeScript language service** → Running the full TS language service in a web worker for hover docs is complex. Defer to CodeMirror's built-in TS syntax highlighting + basic completion initially; add language service in a later iteration if wanted.
- **Piston cold starts** → Some language runtimes on Piston have ~1-2s warm-up. Show a loading indicator on run.
