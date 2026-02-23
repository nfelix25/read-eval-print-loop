import type { ExecutionResult } from '../types';

const TIMEOUT_MS = 5000;

export function executeJavaScript(code: string): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    let settled = false;
    const stdout: string[] = [];
    const stderr: string[] = [];

    const iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 'allow-scripts');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const cleanup = () => {
      window.removeEventListener('message', onMessage);
      if (document.body.contains(iframe)) document.body.removeChild(iframe);
    };

    const finish = (result: ExecutionResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      cleanup();
      resolve(result);
    };

    const timer = setTimeout(() => {
      finish({ error: 'Execution timed out after 5 seconds.' });
    }, TIMEOUT_MS);

    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) return;
      const { type, data } = event.data as { type: string; data: string };
      if (type === 'stdout') stdout.push(data);
      else if (type === 'stderr') stderr.push(data);
      else if (type === 'done') finish({ stdout: stdout.join('\n'), stderr: stderr.join('\n') });
      else if (type === 'error') finish({ stdout: stdout.join('\n'), stderr: data });
    };

    window.addEventListener('message', onMessage);

    // JSON-encode the user code so any </script> or special chars are safe
    const encodedCode = JSON.stringify(code);

    iframe.srcdoc = `<!DOCTYPE html><script>
const _post = (type, data) => window.parent.postMessage({ type, data }, '*');
const fmt = (...args) => args.map(a =>
  typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
).join(' ');

console.log   = (...a) => _post('stdout', fmt(...a));
console.info  = (...a) => _post('stdout', fmt(...a));
console.warn  = (...a) => _post('stderr', fmt(...a));
console.error = (...a) => _post('stderr', fmt(...a));

window.onerror = (msg, _src, _line, _col, err) => {
  _post('error', err ? err.message : String(msg));
  return true;
};

try {
  const __code = ${encodedCode};
  eval(__code);
  _post('done', null);
} catch (e) {
  _post('error', e instanceof Error ? e.message : String(e));
}
<\/script>`;
  });
}
