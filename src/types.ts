export type Language =
  | "javascript"
  | "typescript"
  | "python"
  | "rust"
  | "c"
  | "cpp"
  | "zig";

export interface LanguageConfig {
  label: string;
  execution: "js" | "piston" | "none";
  pistonId?: string;
  filename?: string;
  sampleCode: string;
}

export interface ExecutionResult {
  stdout?: string;
  stderr?: string;
  error?: string;
  table?: { columns: string[]; rows: unknown[][] };
}

export interface Snippet {
  id: string;
  name: string;
  language: Language;
  content: string;
  savedAt: number;
}
