import { useState, useRef } from 'react';
import { api } from '../api';

const LANGUAGES = [
  { id: 'html', label: 'HTML', color: '#e34c26' },
  { id: 'css', label: 'CSS', color: '#2965f1' },
  { id: 'javascript', label: 'JavaScript', color: '#f7df1e' },
  { id: 'typescript', label: 'TypeScript', color: '#3178c6' },
  { id: 'python', label: 'Python', color: '#3572A5' },
  { id: 'c', label: 'C', color: '#555555' },
  { id: 'cpp', label: 'C++', color: '#f34b7d' },
  { id: 'java', label: 'Java', color: '#b07219' },
  { id: 'go', label: 'Go', color: '#00ADD8' },
];

const TEMPLATES = {
  html: `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Arial, sans-serif; text-align: center; padding: 40px; }
</style>
</head>
<body>
  <h1>Hello, LearnHub!</h1>
  <p>Write your HTML here and hit Run.</p>
</body>
</html>`,
  css: `.sample {
  font-size: 24px;
  color: #04aa6d;
  font-weight: bold;
}`,
  javascript: `// Edit and run JavaScript
console.log('Hello, JavaScript!');

let total = 0;
for (let i = 1; i <= 10; i++) {
  total += i;
}
console.log('Sum 1 to 10 =', total);`,
  typescript: `// Edit and run TypeScript
let message: string = 'Hello, TypeScript!';
function greet(name: string): string {
  return message + ' ' + name;
}
console.log(greet('Developer'));`,
  python: `# Edit and run Python
print('Hello, Python!')

total = sum(range(1, 11))
print('Sum 1 to 10 =', total)`,
  c: `#include <stdio.h>

int main() {
    printf("Hello, C!\\n");
    int total = 0;
    for (int i = 1; i <= 10; i++) total += i;
    printf("Sum 1 to 10 = %d\\n", total);
    return 0;
}`,
  cpp: `#include <iostream>

int main() {
    std::cout << "Hello, C++!" << std::endl;
    int total = 0;
    for (int i = 1; i <= 10; i++) total += i;
    std::cout << "Sum 1 to 10 = " << total << std::endl;
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
        int total = 0;
        for (int i = 1; i <= 10; i++) total += i;
        System.out.println("Sum 1 to 10 = " + total);
    }
}`,
  go: `package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
    total := 0
    for i := 1; i <= 10; i++ {
        total += i
    }
    fmt.Println("Sum 1 to 10 =", total)
}`,
};

export default function Playground() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(TEMPLATES.javascript);
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const iframeRef = useRef(null);

  const lang = LANGUAGES.find(l => l.id === language);
  const isClientSide = language === 'html' || language === 'css';
  const isServerSide = language !== 'html' && language !== 'css';

  function changeLang(id) {
    setLanguage(id);
    setCode(TEMPLATES[id]);
    setResult(null);
  }

  function writeIframe(html) {
    setTimeout(() => {
      if (iframeRef.current) {
        const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();
      }
    }, 50);
  }

  function renderClientSide() {
    setResult({ type: 'iframe', running: true });
    const preview = language === 'html'
      ? code
      : `<!DOCTYPE html><html><head><style>body{font-family:system-ui;padding:20px}*{box-sizing:border-box}</style>
<style>
${code}
</style></head><body><div class="sample">Hello, styled world!</div></body></html>`;
    writeIframe(preview);
    setResult({ type: 'iframe' });
  }

  async function renderServerSide() {
    setIsRunning(true);
    setResult({ type: 'text', output: 'Running...', err: false });
    try {
      const data = await api('/execute', {
        method: 'POST',
        body: JSON.stringify({ language, code }),
      });
      const output = data.output || data.stdout || data.stderr || '(no output)';
      setResult({ type: 'text', output, err: String(data.exitCode) !== '0' && !output });
    } catch (e) {
      setResult({ type: 'text', output: e.message, err: true });
    } finally {
      setIsRunning(false);
    }
  }

  function run() {
    if (isClientSide) renderClientSide();
    else renderServerSide();
  }

  function reset() {
    setCode(TEMPLATES[language]);
    setResult(null);
  }

  function copy() {
    navigator.clipboard.writeText(code).catch(() => {});
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-1 flex-wrap gap-2">
        <h2 className="fw-bold mb-0"><i className="bi bi-code-slash text-success me-2"></i>Code Playground</h2>
        <span className="badge" style={{ background: 'rgba(25,135,84,0.12)', color: '#04aa6d' }}>
          Run {LANGUAGES.map(l => l.label).join(' · ')} for free
        </span>
      </div>
      <p className="text-muted mb-3">Write, run and test code right in your browser. No setup needed.</p>

      {/* Language selector */}
      <div className="d-flex gap-2 flex-wrap mb-3">
        {LANGUAGES.map(l => (
          <button
            key={l.id}
            className={`btn btn-sm ${language === l.id ? 'btn-success' : 'btn-outline-secondary'}`}
            onClick={() => changeLang(l.id)}
            style={language === l.id ? {} : { borderColor: l.color }}
          >
            <i className="bi bi-dot me-1" style={language !== l.id ? { color: l.color, fontSize: '1.4rem', verticalAlign: 'middle' } : {}}></i>
            {l.label}
          </button>
        ))}
      </div>

      <div className="code-playground mb-4">
        <div className="code-playground-header d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-code-slash text-success"></i>
            <span className="fw-bold">{lang.label}</span>
            <span className="badge ms-1" style={{ fontSize: '.7rem', background: 'rgba(74,222,128,0.12)', color: lang.color }}>{language.toUpperCase()}</span>
          </div>
          <div className="d-flex gap-1">
            <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--lh-text-muted)', border: '1px solid var(--lh-border)' }} onClick={copy} title="Copy">
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
          <div className="code-output-wrap">
            <div className="code-output-label">
              <i className="bi bi-terminal me-1"></i>Output
            </div>
            {isClientSide ? (
              <iframe ref={iframeRef} className="code-output-frame" title="Output" sandbox="allow-scripts" />
            ) : result ? (
              <pre className={`playground-console ${result.err ? 'text-danger' : ''}`}>{result.output}</pre>
            ) : (
              <div className="playground-console text-muted" style={{ opacity: 0.6 }}>Press Run to see output.</div>
            )}
          </div>
        </div>
      </div>

      <div className="alert alert-info d-flex align-items-start" style={{ borderRadius: 12 }}>
        <i className="bi bi-info-circle-fill me-2 mt-1"></i>
        <div className="small">
          <strong>Tip:</strong> {isClientSide
            ? 'HTML and CSS run instantly in your browser inside the sandboxed preview.'
            : 'Other languages are executed securely on a remote server. A locally running executor is used first, with a free public cloud compiler as backup.'}
        </div>
      </div>
    </>
  );
}