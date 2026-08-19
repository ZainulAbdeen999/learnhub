import { useState, useRef, useCallback } from 'react';

function runTests(code, tests) {
  if (!tests || tests.length === 0) return [];
  return tests.map(t => {
    try {
      const regex = new RegExp(t.pattern, 'i');
      return { ...t, pass: regex.test(code) };
    } catch {
      return { ...t, pass: false };
    }
  });
}

function buildPreview(code) {
  return `<!DOCTYPE html><html><head><style>body{font-family:monospace;background:#1e1e2e;color:#cdd6f4;padding:20px;white-space:pre-wrap}pre{margin:0}pre b{color:#a6e3a1}pre em{color:#f38ba8}</style></head><body><pre>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre></body></html>`;
}

export default function CodeChallenge({ challenge }) {
  const [code, setCode] = useState(challenge.starterCode || '');
  const [results, setResults] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const iframeRef = useRef(null);

  const allPass = results && results.every(r => r.pass);

  const submit = useCallback(() => {
    const testResults = runTests(code, challenge.tests);
    setResults(testResults);
    setSubmitted(true);
  }, [code, challenge.tests]);

  const showPreview = useCallback(() => {
    const preview = buildPreview(code);
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      doc.open();
      doc.write(preview);
      doc.close();
    }
  }, [code]);

  return (
    <div className="code-challenge mt-4 mb-3">
      <div className="code-challenge-header">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-lightning-fill text-warning"></i>
          <span className="fw-bold">Code Challenge</span>
        </div>
        <span className="badge bg-warning text-dark" style={{ fontSize: '.7rem' }}>
          {challenge.tests?.length || 0} tests
        </span>
      </div>

      <div className="code-challenge-body">
        <div className="challenge-title fw-bold mb-2">{challenge.title}</div>
        <p className="challenge-desc text-muted mb-3" style={{ fontSize: '.9rem' }}>{challenge.description}</p>

        <div className="code-editor-wrap">
          <textarea
            className="code-editor"
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck="false"
            autoCapitalize="off"
            autoComplete="off"
            style={{ minHeight: 140 }}
          />
        </div>

        <div className="d-flex align-items-center gap-2 mt-3 flex-wrap">
          <button className="btn btn-warning btn-sm fw-semibold" onClick={submit}>
            <i className="bi bi-play-fill me-1"></i>Run Tests
          </button>
          <button className="btn btn-outline-secondary btn-sm" onClick={showPreview}>
            <i className="bi bi-eye me-1"></i>Preview
          </button>
          {!showHint && challenge.hint && (
            <button className="btn btn-link btn-sm text-decoration-none" onClick={() => setShowHint(true)}>
              <i className="bi bi-lightbulb me-1"></i>Show hint
            </button>
          )}
          {showHint && (
            <span className="text-muted small"><i className="bi bi-lightbulb text-warning me-1"></i>{challenge.hint}</span>
          )}
        </div>

        {showHint && <iframe ref={iframeRef} style={{ display: 'none' }} />}

        {results && (
          <div className="mt-3">
            {allPass ? (
              <div className="alert alert-success py-2 mb-2">
                <i className="bi bi-check-circle-fill me-2"></i>
                <b>All tests passed!</b> Great job!
              </div>
            ) : (
              <div className="alert alert-warning py-2 mb-2">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <b>{results.filter(r => r.pass).length}/{results.length} tests passed.</b> Keep trying!
              </div>
            )}
            <ul className="list-unstyled mb-0">
              {results.map((r, i) => (
                <li key={i} className="d-flex align-items-center gap-2 py-1" style={{ fontSize: '.85rem' }}>
                  {r.pass ? (
                    <i className="bi bi-check-circle-fill text-success"></i>
                  ) : (
                    <i className="bi bi-x-circle-fill text-danger"></i>
                  )}
                  <span className={r.pass ? 'text-success' : 'text-danger'}>{r.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
