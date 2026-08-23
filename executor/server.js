const express = require('express');
const cors = require('cors');
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const TIMEOUT = 10000;
const TMP = '/tmp';

function runCommand(cmd, args, stdin, timeout) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, {
      timeout,
      cwd: TMP,
      env: { ...process.env, PATH: process.env.PATH },
    });

    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', d => { stdout += d; });
    proc.stderr.on('data', d => { stderr += d; });
    if (stdin) proc.stdin.write(stdin);
    proc.stdin.end();

    const timer = setTimeout(() => {
      proc.kill('SIGKILL');
      reject(new Error('Execution timed out (10s limit)'));
    }, timeout);

    proc.on('close', code => {
      clearTimeout(timer);
      resolve({ stdout, stderr, code });
    });
    proc.on('error', err => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

function writeFileSafe(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
}

const runners = {
  javascript: async (code, stdin) => {
    const file = path.join(TMP, `run_${uuid()}.js`);
    writeFileSafe(file, code);
    try {
      const r = await runCommand('node', [file], stdin, TIMEOUT);
      return { stdout: r.stdout, stderr: r.stderr, exitCode: r.code };
    } finally { try { fs.unlinkSync(file); } catch {} }
  },

  python: async (code, stdin) => {
    const file = path.join(TMP, `run_${uuid()}.py`);
    writeFileSafe(file, code);
    try {
      const r = await runCommand('python3', [file], stdin, TIMEOUT);
      return { stdout: r.stdout, stderr: r.stderr, exitCode: r.code };
    } finally { try { fs.unlinkSync(file); } catch {} }
  },

  c: async (code, stdin) => {
    const id = uuid();
    const src = path.join(TMP, `${id}.c`);
    const bin = path.join(TMP, `${id}.out`);
    writeFileSafe(src, code);
    try {
      const comp = await runCommand('gcc', [src, '-o', bin, '-lm'], '', 8000);
      if (comp.code !== 0) return { stdout: '', stderr: comp.stderr || comp.stdout, exitCode: comp.code };
      const r = await runCommand(bin, [], stdin, TIMEOUT);
      return { stdout: r.stdout, stderr: r.stderr, exitCode: r.code };
    } finally {
      try { fs.unlinkSync(src); } catch {}
      try { fs.unlinkSync(bin); } catch {}
    }
  },

  cpp: async (code, stdin) => {
    const id = uuid();
    const src = path.join(TMP, `${id}.cpp`);
    const bin = path.join(TMP, `${id}.out`);
    writeFileSafe(src, code);
    try {
      const comp = await runCommand('g++', [src, '-o', bin, '-std=c++17', '-lm'], '', 8000);
      if (comp.code !== 0) return { stdout: '', stderr: comp.stderr || comp.stdout, exitCode: comp.code };
      const r = await runCommand(bin, [], stdin, TIMEOUT);
      return { stdout: r.stdout, stderr: r.stderr, exitCode: r.code };
    } finally {
      try { fs.unlinkSync(src); } catch {}
      try { fs.unlinkSync(bin); } catch {}
    }
  },

  java: async (code, stdin) => {
    const id = uuid();
    const dir = path.join(TMP, `java_${id}`);
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, 'Main.java');
    writeFileSafe(file, code);
    try {
      const comp = await runCommand('javac', [file], '', 8000);
      if (comp.code !== 0) return { stdout: '', stderr: comp.stderr || comp.stdout, exitCode: comp.code };
      const r = await runCommand('java', ['-cp', dir, 'Main'], stdin, TIMEOUT);
      return { stdout: r.stdout, stderr: r.stderr, exitCode: r.code };
    } finally {
      try { fs.rmSync(dir, { recursive: true }); } catch {}
    }
  },

  go: async (code, stdin) => {
    const id = uuid();
    const dir = path.join(TMP, `go_${id}`);
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, 'main.go');
    writeFileSafe(file, 'package main\n\nimport "fmt"\n\n' + code.replace(/func main\(\)/, 'func main()'));
    try {
      const init = await runCommand('go', ['mod', 'init', 'main'], '', 3000);
      const r = await runCommand('go', ['run', file], stdin, TIMEOUT);
      return { stdout: r.stdout, stderr: r.stderr, exitCode: r.code };
    } finally {
      try { fs.rmSync(dir, { recursive: true }); } catch {}
    }
  },

  typescript: async (code, stdin) => {
    const file = path.join(TMP, `run_${uuid()}.ts`);
    writeFileSafe(file, code);
    try {
      const r = await runCommand('npx', ['tsx', file], stdin, TIMEOUT);
      return { stdout: r.stdout, stderr: r.stderr, exitCode: r.code };
    } finally { try { fs.unlinkSync(file); } catch {} }
  },
};

app.get('/health', (req, res) => {
  res.json({ status: 'ok', languages: Object.keys(runners), uptime: process.uptime() });
});

app.get('/languages', (req, res) => {
  const info = {
    javascript: 'Node.js',
    python: 'Python 3',
    c: 'C (GCC)',
    cpp: 'C++ (GCC)',
    java: 'Java (OpenJDK)',
    go: 'Go',
    typescript: 'TypeScript (tsx)',
  };
  res.json(info);
});

app.post('/execute', async (req, res) => {
  const { language, code, stdin } = req.body || {};
  if (!code) return res.status(400).json({ error: 'No code provided' });

  const lang = (language || '').toLowerCase();
  const runner = runners[lang];
  if (!runner) {
    return res.status(400).json({
      error: `Unsupported language: ${language}`,
      supported: Object.keys(runners),
    });
  }

  const start = Date.now();
  try {
    const result = await runner(code, stdin || '');
    const elapsed = ((Date.now() - start) / 1000).toFixed(3);
    res.json({
      output: (result.stdout || '') + (result.stderr || ''),
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      exitCode: result.exitCode,
      executionTime: elapsed,
      language: lang,
    });
  } catch (err) {
    const elapsed = ((Date.now() - start) / 1000).toFixed(3);
    res.status(500).json({
      output: 'Execution error: ' + err.message,
      stdout: '',
      stderr: 'Execution error: ' + err.message,
      exitCode: -1,
      executionTime: elapsed,
    });
  }
});

app.listen(PORT, () => {
  console.log(`LearnHub Executor running on port ${PORT}`);
  console.log(`Languages: ${Object.keys(runners).join(', ')}`);
});
