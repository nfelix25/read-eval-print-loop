import type { Snippet, Language } from './types';

const STORAGE_KEY = 'repl-snippets';

export function loadSnippets(): Snippet[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveAll(snippets: Snippet[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
}

export function saveSnippet(
  name: string,
  language: Language,
  content: string,
): { saved: Snippet; overwrote: boolean } {
  const snippets = loadSnippets();
  const existing = snippets.findIndex(
    (s) => s.name.toLowerCase() === name.toLowerCase() && s.language === language,
  );

  const snippet: Snippet = {
    id: existing >= 0 ? snippets[existing].id : crypto.randomUUID(),
    name,
    language,
    content,
    savedAt: Date.now(),
  };

  if (existing >= 0) {
    snippets[existing] = snippet;
  } else {
    snippets.push(snippet);
  }

  saveAll(snippets);
  return { saved: snippet, overwrote: existing >= 0 };
}

export function deleteSnippet(id: string): void {
  saveAll(loadSnippets().filter((s) => s.id !== id));
}
