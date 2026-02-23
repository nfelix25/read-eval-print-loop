import type { ExecutionResult, Language, LanguageConfig } from "../types";

const PROXY_URL_KEY = "repl-proxy-url";

interface PistonResponse {
  run: { stdout: string; stderr: string; code: number };
  compile?: { stdout: string; stderr: string; code: number };
  message?: string;
}

export function getProxyUrl(): string | null {
  return localStorage.getItem(PROXY_URL_KEY);
}

export function setProxyUrl(url: string): void {
  localStorage.setItem(PROXY_URL_KEY, url.trim().replace(/\/$/, ''));
}

export function clearProxyUrl(): void {
  localStorage.removeItem(PROXY_URL_KEY);
}

export async function executePiston(
  code: string,
  lang: Language,
  config: LanguageConfig,
): Promise<ExecutionResult> {
  if (!config.pistonId) {
    return { error: `No runtime configured for ${lang}.` };
  }

  try {
    const response = await fetch(`/piston/api/v2/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: config.pistonId,
        version: "*",
        files: [{ name: config.filename ?? "main", content: code }],
      }),
    });

    if (!response.ok) {
      return {
        error: `Piston error ${response.status}: ${await response.text()}`,
      };
    }

    const data: PistonResponse = await response.json();

    if (data.message) {
      return { error: `Piston: ${data.message}` };
    }

    const stdout: string[] = [];
    const stderr: string[] = [];

    if (data.compile) {
      if (data.compile.stderr) stderr.push(data.compile.stderr.trim());
      if (data.compile.code !== 0 && !data.compile.stderr)
        stderr.push("Compilation failed.");
    }
    if (data.run.stdout) stdout.push(data.run.stdout.trim());
    if (data.run.stderr) stderr.push(data.run.stderr.trim());

    return {
      stdout: stdout.join("\n") || undefined,
      stderr: stderr.join("\n") || undefined,
    };
  } catch (e) {
    return {
      error: `Could not reach Piston.\n${e instanceof Error ? e.message : String(e)}\n\nCheck your Piston URL in the snippets drawer.`,
    };
  }
}
