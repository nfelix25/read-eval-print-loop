import { Compartment, Extension } from "@codemirror/state";
import { EditorState } from "@codemirror/state";
import {
  EditorView,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
} from "@codemirror/view";
import {
  defaultKeymap,
  historyKeymap,
  history,
  indentWithTab,
} from "@codemirror/commands";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
  bracketMatching,
  indentOnInput,
} from "@codemirror/language";
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
} from "@codemirror/autocomplete";
import { oneDark } from "@codemirror/theme-one-dark";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { cpp } from "@codemirror/lang-cpp";
import type { Language } from "./types";

const langCompartment = new Compartment();

function getLanguageExtension(lang: Language): Extension {
  switch (lang) {
    case "javascript":
      return javascript();
    case "typescript":
      return javascript({ typescript: true });
    case "python":
      return python();
    case "rust":
      return rust();
    case "c":
    case "cpp":
      return cpp();
    case "zig":
      return []; // No official package; editor still works
  }
}

export function createEditor(
  container: HTMLElement,
  initialContent: string,
  language: Language,
): EditorView {
  const mobileTheme = EditorView.theme({
    "&": { fontSize: "14px" },
    ".cm-scroller": {
      fontFamily:
        "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
    },
    ".cm-content": { caretColor: "#89b4fa" },
    ".cm-cursor": { borderLeftColor: "#89b4fa" },
  });

  const state = EditorState.create({
    doc: initialContent,
    extensions: [
      history(),
      lineNumbers(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
      bracketMatching(),
      closeBrackets(),
      indentOnInput(),
      autocompletion(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      oneDark,
      mobileTheme,
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        ...completionKeymap,
        ...closeBracketsKeymap,
        indentWithTab,
      ]),
      langCompartment.of(getLanguageExtension(language)),
      EditorView.lineWrapping,
    ],
  });

  return new EditorView({ state, parent: container });
}

export function setEditorLanguage(view: EditorView, lang: Language): void {
  view.dispatch({
    effects: langCompartment.reconfigure(getLanguageExtension(lang)),
  });
}

export function getEditorContent(view: EditorView): string {
  return view.state.doc.toString();
}

export function setEditorContent(view: EditorView, content: string): void {
  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: content },
  });
}
