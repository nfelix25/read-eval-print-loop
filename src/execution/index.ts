import type { ExecutionResult, Language } from '../types';
import { LANGUAGES } from '../languages';
import { executeJavaScript } from './js-executor';
import { executeSQL } from './sql-executor';
import { executePiston } from './piston-executor';

export { resetDb } from './sql-executor';

export async function execute(code: string, lang: Language): Promise<ExecutionResult> {
  const config = LANGUAGES[lang];

  switch (config.execution) {
    case 'js':     return executeJavaScript(code);
    case 'sql':    return executeSQL(code);
    case 'piston': return executePiston(code, lang, config);
    case 'none':   return { error: `Execution not supported for ${config.label}.` };
  }
}
