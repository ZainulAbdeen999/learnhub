import { useState, useRef, useCallback } from 'react';

const SERVER_LANGS = ['python', 'java', 'cpp', 'c', 'go', 'typescript'];

export default function CodePlayground({ code: initialCode = '', language = 'html', title = 'Try it Yourself' }) {
  const [code, setCode] = useState(initialCode);
  const [showOutput, setShowOutput] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const iframeRef = useRef(null);

  const run = useCallback(() => {
    setShowOutput(true);
    const lang = (language || '').toLowerCase();

    const writeIframe = (html) => {
      setTimeout(() => {
        if (iframeRef.current) {
          const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
          doc.open();
          doc.write(html);
          doc.close();
        }
      }, 50);
    };

    if (lang === 'html') {
      writeIframe(code);
      return;
    }

    if (lang === 'javascript' || lang === 'js') {
      const preview = `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Courier New',monospace;background:#0d1117;color:#e6edf3;padding:16px;font-size:14px;line-height:1.6;white-space:pre-wrap}pre{margin:0}.err{color:#f87171}.log{color:#4ade80}</style></head><body><pre id="out"></pre><script>const out=document.getElementById('out');const logs=[];function write(cls,msg){const d=document.createElement('div');d.className=cls;d.textContent=msg;out.appendChild(d)}console.log=(...a)=>write('log',a.map(v=>typeof v==='object'?JSON.stringify(v,null,2):String(v)).join(' '));console.error=(...a)=>write('err',a.join(' '));console.warn=(...a)=>write('err','\\u26A0 '+a.join(' ')));window.onerror=(m,s,l,c)=>{write('err','Error: '+m+' (line '+l+')')};try{${code}}catch(e){write('err',e.message)}</script></body></html>`;
      writeIframe(preview);
      return;
    }

    if (SERVER_LANGS.includes(lang)) {
      setIsRunning(true);
      const apiBase = import.meta.env.VITE_API_URL || 'https://zainulabdeen-api.vercel.app';
      fetch(`${apiBase}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang, code }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.error) throw new Error(data.error);
          const out = data.output || data.stderr || data.stdout || '(no output)';
          const escaped = out.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          writeIframe(`<!DOCTYPE html><html><head><style>body{font-family:'Courier New',monospace;background:#0d1117;color:#e6edf3;padding:16px;white-space:pre-wrap;line-height:1.6;font-size:14px;margin:0}pre{margin:0}</style></head><body><pre>${escaped}</pre></body></html>`);
        })
        .catch(err => {
          writeIframe(`<!DOCTYPE html><html><head><style>body{font-family:'Courier New',monospace;background:#0d1117;color:#f87171;padding:16px;font-size:14px;margin:0}</style></head><body>Error: ${err.message.replace(/</g, '&lt;')}</body></html>`);
        })
        .finally(() => setIsRunning(false));
      return;
    }

    writeIframe(`<!DOCTYPE html><html><head><style>body{font-family:system-ui;padding:16px;background:#0d1117;color:#e6edf3}</style></head><body><pre>${code.replace(/</g, '&lt;')}</pre></body></html>`);
  }, [code, language]);

  const reset = useCallback(() => { setCode(initialCode); setShowOutput(false); }, [initialCode]);
  const copyCode = useCallback(() => { navigator.clipboard.writeText(code).catch(() => {}); }, [code]);

  return (
    <div className="code-playground mt-4 mb-3">
      <div className="code-playground-header d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-code-slash text-success"></i>
          <span className="fw-bold">{title}</span>
          <span className="badge ms-1" style={{ fontSize: '.7rem', background: 'rgba(74,222,128,0.12)', color: '#4ade80' }}>{language.toUpperCase()}</span>
        </div>
        <div className="d-flex gap-1">
          <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--lh-text-muted)', border: '1px solid var(--lh-border)' }} onClick={copyCode} title="Copy">
            <i className="bi bi-clipboard"></i>
          </button>
          <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--lh-text-muted)', border: '1px solid var(--lh-border)' }} onClick={reset} title="Reset">
            <i className="bi bi-arrow-counterclockwise"></i>
          </button>
          <button className="btn btn-success btn-sm" onClick={run} disabled={isRunning}>
            {isRunning ? <><span className="spinner-border spinner-border-sm me-1"></span>Running...</> : <><i className="bi bi-play-fill me-1"></i>Run</>}
          </button>
        </div>
      </div>
      <div className="code-playground-body">
        <div className="code-editor-wrap">
          <div className="code-line-numbers">
            {Array.from({ length: code.split('\n').length }, (_, i) => <span key={i}>{i + 1}</span>)}
          </div>
          <textarea className="code-editor" value={code} onChange={e => setCode(e.target.value)} spellCheck="false" autoCapitalize="off" autoComplete="off" />
        </div>
        {showOutput && (
          <div className="code-output-wrap">
            <div className="code-output-label">
              <i className="bi bi-terminal me-1"></i>Output
              <button className="btn btn-sm p-0 ms-2" style={{ color: 'var(--lh-text-dim)', background: 'none', border: 'none' }} onClick={() => setShowOutput(false)}><i className="bi bi-x-lg"></i></button>
            </div>
            <iframe ref={iframeRef} className="code-output-frame" title="Output" sandbox="allow-scripts" />
          </div>
        )}
      </div>
    </div>
  );
}
