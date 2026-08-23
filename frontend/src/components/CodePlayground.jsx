import { useState, useRef, useCallback } from 'react';

const SERVER_LANGS = ['python', 'java', 'cpp', 'c', 'go', 'typescript'];

function buildPreview(code, language) {
  if (language === 'javascript' || language === 'js') {
    return `<!DOCTYPE html><html><head><style>body{font-family:monospace;background:#1e1e2e;color:#cdd6f4;padding:16px}#out{white-space:pre-wrap}.log{color:#a6e3a1;margin:4px 0}.err{color:#f38ba8;margin:4px 0}</style></head><body><div id="out"></div><script>const out=document.getElementById("out");const _log=console.log;console.log=(...a)=>{out.innerHTML+='<div class="log">'+a.map(v=>typeof v==="object"?JSON.stringify(v,null,2):String(v)).join(" ")+"</div>";_log(...a)};console.error=(...a)=>{out.innerHTML+='<div class="err">'+a.join(" ")+"</div>"};window.onerror=(m)=>{out.innerHTML+='<div class="err">Error: '+m+"</div>"};try{${code}}catch(e){out.innerHTML+='<div class="err">'+e.message+"</div>"}</script></body></html>`;
  }
  return `<!DOCTYPE html><html><head><style>body{font-family:system-ui;padding:16px;background:#1e1e2e;color:#cdd6f4}</style></head><body>${code}</body></html>`;
}

export default function CodePlayground({ code: initialCode = '', language = 'html', title = 'Try it Yourself' }) {
  const [code, setCode] = useState(initialCode);
  const [showOutput, setShowOutput] = useState(false);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const iframeRef = useRef(null);

  const run = useCallback(async () => {
    setShowOutput(true);
    const lang = (language || '').toLowerCase();

    if (SERVER_LANGS.includes(lang)) {
      setIsRunning(true);
      setOutput('Running...');
      try {
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiBase}/api/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: lang, code }),
        });
        const data = await res.json();
        if (res.ok) {
          const out = data.output || data.stderr || '(no output)';
          setOutput(out);
          const preview = `<!DOCTYPE html><html><head><style>body{font-family:'Courier New',monospace;background:#1e1e2e;color:#cdd6f4;padding:20px;white-space:pre-wrap;line-height:1.6}pre{margin:0}.err{color:#f38ba8}</style></head><body><pre>${out.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre></body></html>`;
          setTimeout(() => {
            if (iframeRef.current) {
              const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
              doc.open(); doc.write(preview); doc.close();
            }
          }, 50);
        } else {
          setOutput('Error: ' + (data.error || 'Execution failed'));
        }
      } catch (err) {
        setOutput('Network error: Could not reach server.\n' + err.message);
      } finally {
        setIsRunning(false);
      }
    } else {
      const preview = buildPreview(code, language);
      setOutput('');
      setTimeout(() => {
        if (iframeRef.current) {
          const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
          doc.open(); doc.write(preview); doc.close();
        }
      }, 50);
    }
  }, [code, language]);

  const reset = useCallback(() => {
    setCode(initialCode);
    setShowOutput(false);
    setOutput('');
  }, [initialCode]);

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(code).catch(() => {});
  }, [code]);

  const lineCount = code.split('\n').length;

  return (
    <div className="code-playground mt-4 mb-3">
      <div className="code-playground-header d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-code-slash text-success"></i>
          <span className="fw-bold">{title}</span>
          <span className="badge bg-success-subtle text-success ms-1" style={{ fontSize: '.7rem' }}>{language.toUpperCase()}</span>
        </div>
        <div className="d-flex gap-1">
          <button className="btn btn-sm btn-outline-secondary" onClick={copyCode} title="Copy code">
            <i className="bi bi-clipboard"></i>
          </button>
          <button className="btn btn-sm btn-outline-secondary" onClick={reset} title="Reset code">
            <i className="bi bi-arrow-counterclockwise"></i>
          </button>
          <button className="btn btn-sm btn-success" onClick={run} disabled={isRunning}>
            {isRunning ? (
              <><span className="spinner-border spinner-border-sm me-1"></span>Running...</>
            ) : (
              <><i className="bi bi-play-fill me-1"></i>Run</>
            )}
          </button>
        </div>
      </div>
      <div className="code-playground-body">
        <div className="code-editor-wrap">
          <div className="code-line-numbers">
            {Array.from({ length: lineCount }, (_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
          <textarea
            className="code-editor"
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck="false"
            autoCapitalize="off"
            autoComplete="off"
          />
        </div>
        {showOutput && (
          <div className="code-output-wrap">
            <div className="code-output-label">
              <i className="bi bi-terminal me-1"></i>Output
              <button className="btn btn-sm btn-link text-decoration-none p-0 ms-2" onClick={() => setShowOutput(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <iframe ref={iframeRef} className="code-output-frame" title="Output" sandbox="allow-scripts" />
          </div>
        )}
      </div>
    </div>
  );
}
