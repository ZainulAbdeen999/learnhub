import { useState, useCallback } from 'react';

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(text || '').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }, [text]);

  return (
    <button className="copy-btn" onClick={copy} title="Copy code">
      {copied ? <><i className="bi bi-check-lg me-1"></i>Copied</> : <><i className="bi bi-clipboard me-1"></i>Copy</>}
    </button>
  );
}
