## Why

Coding on a phone is currently painful — it requires opening a browser, navigating to an online REPL, and dealing with browser chrome. A PWA installed to the home screen can provide an instant, full-screen coding environment for experimenting with language features on the go, without needing a laptop.

## What Changes

- New static web app (PWA) built with Vite + TypeScript
- Multi-language code editor powered by CodeMirror 6 with syntax highlighting and completion
- In-browser execution for JavaScript (sandboxed iframe) and SQL (sql.js/SQLite WASM)
- Remote execution via Piston API for Python, TypeScript, Rust, C, C++, and Zig
- Snippet management persisted to localStorage
- PWA manifest + service worker for home screen installation and cached app shell
- Hosted on GitHub Pages (HTTPS required for PWA install)

## Capabilities

### New Capabilities

- `editor`: Multi-language code editor with syntax highlighting, completion, and hover docs
- `execution`: Code execution across languages (local sandboxing + Piston API)
- `snippets`: Save, name, load, and delete code snippets stored in localStorage
- `pwa`: Web app manifest, service worker, and installability for Android/iOS home screen

### Modified Capabilities

## Impact

- New project, no existing code affected
- Runtime dependencies: CodeMirror 6 packages, sql.js (WASM), vite-plugin-pwa
- Network dependency: Piston public API (emkc.org) for compiled language execution
- Hosting: GitHub Pages (free, HTTPS, PWA-compatible)
