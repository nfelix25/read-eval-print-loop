import "./style.css";
import { EditorView } from "@codemirror/view";
import {
  createEditor,
  setEditorLanguage,
  getEditorContent,
  setEditorContent,
} from "./editor";
import { execute, resetDb } from "./execution/index";
import {
  getProxyUrl,
  setProxyUrl,
  clearProxyUrl,
} from "./execution/piston-executor";
import { loadSnippets, saveSnippet, deleteSnippet } from "./snippets";
import { LANGUAGES, LANGUAGE_ORDER } from "./languages";
import type { ExecutionResult, Language, Snippet } from "./types";

// ─── Storage keys ───────────────────────────────────────────────
const KEY_LANG = "repl-language";
const KEY_CONTENT = (lang: Language) => `repl-content-${lang}`;

// ─── State ──────────────────────────────────────────────────────
let currentLang: Language =
  (localStorage.getItem(KEY_LANG) as Language | null) ?? "javascript";
let editorView: EditorView;
let isRunning = false;

// ─── DOM refs ───────────────────────────────────────────────────
const editorContainer = document.getElementById("editor-container")!;
const outputContent = document.getElementById("output-content")!;
const btnRun = document.getElementById("btn-run") as HTMLButtonElement;
const btnSnippets = document.getElementById("btn-snippets")!;
const btnCloseSnippets = document.getElementById("btn-close-snippets")!;
const btnSaveSnippet = document.getElementById("btn-save-snippet")!;
const btnClearOutput = document.getElementById("btn-clear-output")!;
const btnResetDb = document.getElementById("btn-reset-db")!;
const drawerOverlay = document.getElementById("drawer-overlay")!;
const snippetsDrawer = document.getElementById("snippets-drawer")!;
const snippetsList = document.getElementById("snippets-list")!;
const btnManageKey = document.getElementById("btn-manage-key")!;
const langPicker = document.getElementById("lang-picker")!;

// ─── Language picker ────────────────────────────────────────────
function buildLangPicker() {
  langPicker.innerHTML = "";
  for (const lang of LANGUAGE_ORDER) {
    const btn = document.createElement("button");
    btn.className = "lang-btn" + (lang === currentLang ? " active" : "");
    btn.textContent = LANGUAGES[lang].label;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", String(lang === currentLang));
    btn.dataset.lang = lang;
    langPicker.appendChild(btn);
  }
}

langPicker.addEventListener("click", (e) => {
  const target = (e.target as HTMLElement).closest(
    "[data-lang]",
  ) as HTMLElement | null;
  if (!target || isRunning) return;
  switchLanguage(target.dataset.lang as Language);
});

function switchLanguage(lang: Language) {
  if (lang === currentLang) return;
  // Save current content
  localStorage.setItem(KEY_CONTENT(currentLang), getEditorContent(editorView));
  currentLang = lang;
  localStorage.setItem(KEY_LANG, lang);
  // Restore or use sample code
  const saved = localStorage.getItem(KEY_CONTENT(lang));
  setEditorContent(editorView, saved ?? LANGUAGES[lang].sampleCode);
  setEditorLanguage(editorView, lang);
  // Update picker
  langPicker.querySelectorAll(".lang-btn").forEach((b) => {
    const btn = b as HTMLButtonElement;
    const active = btn.dataset.lang === lang;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", String(active));
  });
  clearOutput();
}

// ─── Editor init ────────────────────────────────────────────────
const initialContent =
  localStorage.getItem(KEY_CONTENT(currentLang)) ??
  LANGUAGES[currentLang].sampleCode;
editorView = createEditor(editorContainer, initialContent, currentLang);

// Persist content on changes
editorView.dom.addEventListener("keyup", () => {
  localStorage.setItem(KEY_CONTENT(currentLang), getEditorContent(editorView));
});

// ─── Run ────────────────────────────────────────────────────────
async function run() {
  if (isRunning) return;
  const code = getEditorContent(editorView).trim();
  if (!code) return;

  isRunning = true;
  btnRun.disabled = true;
  btnRun.classList.add("running");
  btnRun.textContent = "…";

  clearOutput();
  appendOutput("info", "Running…");

  try {
    const result = await execute(code, currentLang);
    clearOutput();
    renderResult(result);
  } finally {
    isRunning = false;
    btnRun.disabled = false;
    btnRun.classList.remove("running");
    btnRun.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg> Run`;
  }
}

btnRun.addEventListener("click", run);

// Ctrl+Enter / Cmd+Enter to run
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    run();
  }
});

// ─── Output rendering ───────────────────────────────────────────
function clearOutput() {
  outputContent.innerHTML = "";
}

function appendOutput(
  type: "stdout" | "stderr" | "error" | "info" | "ok",
  text: string,
) {
  const el = document.createElement("div");
  el.className = `out-${type}`;
  el.textContent = text;
  outputContent.appendChild(el);
  outputContent.scrollTop = outputContent.scrollHeight;
}

function renderResult(result: ExecutionResult) {
  if (result.error) {
    appendOutput("error", `Error: ${result.error}`);
    return;
  }

  if (result.table) {
    const { columns, rows } = result.table;
    const table = document.createElement("table");
    table.className = "out-table";
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    for (const col of columns) {
      const th = document.createElement("th");
      th.textContent = col;
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    for (const row of rows) {
      const tr = document.createElement("tr");
      for (const cell of row) {
        const td = document.createElement("td");
        td.textContent = cell === null ? "NULL" : String(cell);
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    outputContent.appendChild(table);

    appendOutput("info", `${rows.length} row${rows.length !== 1 ? "s" : ""}`);
    return;
  }

  let hasOutput = false;
  if (result.stdout?.trim()) {
    appendOutput("stdout", result.stdout.trim());
    hasOutput = true;
  }
  if (result.stderr?.trim()) {
    appendOutput("stderr", result.stderr.trim());
    hasOutput = true;
  }
  if (!hasOutput) {
    appendOutput("ok", "✓ Done (no output)");
  }
}

btnClearOutput.addEventListener("click", clearOutput);

// ─── Proxy URL management ───────────────────────────────────────
btnManageKey.addEventListener("click", () => {
  const current = getProxyUrl();
  const label = current
    ? `Current Piston URL: ${current}\n\nEnter a new URL to replace it, or leave blank to keep current:`
    : "Enter your local Piston URL:\nExample: http://192.168.1.x:2000";
  const input = prompt(label);
  if (input === null) return;
  if (input.trim()) {
    setProxyUrl(input.trim());
    appendOutput("ok", "✓ Proxy URL saved.");
  } else if (current && confirm("Clear the saved proxy URL?")) {
    clearProxyUrl();
    appendOutput("info", "Proxy URL cleared.");
  }
  closeDrawer();
});

// ─── Snippets drawer ────────────────────────────────────────────
function openDrawer() {
  snippetsDrawer.classList.add("open");
  drawerOverlay.classList.add("visible");
  renderSnippets();
}

function closeDrawer() {
  snippetsDrawer.classList.remove("open");
  drawerOverlay.classList.remove("visible");
}

btnSnippets.addEventListener("click", openDrawer);
btnCloseSnippets.addEventListener("click", closeDrawer);
drawerOverlay.addEventListener("click", closeDrawer);

function renderSnippets() {
  const snippets = loadSnippets();
  snippetsList.innerHTML = "";

  if (snippets.length === 0) {
    const empty = document.createElement("div");
    empty.className = "snippets-empty";
    empty.textContent =
      'No snippets yet.\nTap "Save current" to save your code.';
    snippetsList.appendChild(empty);
    return;
  }

  // Sort by most recently saved
  snippets.sort((a, b) => b.savedAt - a.savedAt);

  for (const snippet of snippets) {
    snippetsList.appendChild(buildSnippetItem(snippet));
  }
}

function buildSnippetItem(snippet: Snippet): HTMLElement {
  const item = document.createElement("div");
  item.className = "snippet-item";
  item.innerHTML = `
    <span class="snippet-lang-badge">${LANGUAGES[snippet.language].label}</span>
    <span class="snippet-name">${escapeHtml(snippet.name)}</span>
    <span class="snippet-date">${formatDate(snippet.savedAt)}</span>
    <button class="snippet-delete" aria-label="Delete ${escapeHtml(snippet.name)}">✕</button>
  `;

  // Load on tap (anywhere except delete button)
  item.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest(".snippet-delete")) return;
    loadSnippet(snippet);
  });

  item.querySelector(".snippet-delete")!.addEventListener("click", (e) => {
    e.stopPropagation();
    if (confirm(`Delete "${snippet.name}"?`)) {
      deleteSnippet(snippet.id);
      renderSnippets();
    }
  });

  return item;
}

function loadSnippet(snippet: Snippet) {
  // Save current content before switching
  localStorage.setItem(KEY_CONTENT(currentLang), getEditorContent(editorView));
  // Switch language if needed
  if (snippet.language !== currentLang) {
    currentLang = snippet.language;
    localStorage.setItem(KEY_LANG, currentLang);
    setEditorLanguage(editorView, currentLang);
    langPicker.querySelectorAll(".lang-btn").forEach((b) => {
      const btn = b as HTMLButtonElement;
      btn.classList.toggle("active", btn.dataset.lang === currentLang);
    });
  }
  setEditorContent(editorView, snippet.content);
  localStorage.setItem(KEY_CONTENT(currentLang), snippet.content);
  closeDrawer();
  clearOutput();
}

// ─── Save snippet ───────────────────────────────────────────────
btnSaveSnippet.addEventListener("click", () => {
  const content = getEditorContent(editorView).trim();
  if (!content) {
    alert("Editor is empty — nothing to save.");
    return;
  }
  const name = prompt("Snippet name:");
  if (!name?.trim()) return;
  const { overwrote } = saveSnippet(name.trim(), currentLang, content);
  closeDrawer();
  clearOutput();
  appendOutput(
    "ok",
    `✓ Snippet "${name.trim()}" ${overwrote ? "updated" : "saved"}.`,
  );
});

// ─── Helpers ────────────────────────────────────────────────────
function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// ─── Init ───────────────────────────────────────────────────────
buildLangPicker();
