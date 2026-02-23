import type { ExecutionResult } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let SQL: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any = null;

async function initSQL() {
  if (SQL) return;
  const initSqlJs = (await import('sql.js')).default;
  SQL = await initSqlJs({
    locateFile: () => `${import.meta.env.BASE_URL}sql-wasm.wasm`,
  });
}

export async function getDb() {
  await initSQL();
  if (!db) db = new SQL.Database();
  return db;
}

export function resetDb(): void {
  db = null;
}

export async function executeSQL(code: string): Promise<ExecutionResult> {
  try {
    const database = await getDb();

    // Run all statements; only capture the last SELECT result for display
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: any[] = database.exec(code);

    if (results.length === 0) {
      return { stdout: 'OK — no rows returned.' };
    }

    // Return the last result set as a table
    const last = results[results.length - 1];
    return {
      table: {
        columns: last.columns as string[],
        rows: last.values as unknown[][],
      },
    };
  } catch (e) {
    return { stderr: e instanceof Error ? e.message : String(e) };
  }
}
