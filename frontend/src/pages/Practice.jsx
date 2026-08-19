import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

const exercises = [
  { q: 'Which HTML tag creates a paragraph?', a: '<p>' },
  { q: 'Which HTML tag creates a hyperlink?', a: '<a>' },
  { q: 'Which CSS property changes text color?', a: 'color' },
  { q: 'Which keyword declares a block-scoped variable?', a: 'let' },
  { q: 'Which tag makes a table row?', a: '<tr>' },
  { q: 'Which HTML tag is used for the largest heading?', a: '<h1>' },
  { q: 'How do you print text in Python?', a: 'print()' },
  { q: 'Which CSS selector targets id="demo"?', a: '#demo' }
];

export default function Practice() {
  const [courses, setCourses] = useState([]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState({ right: 0, wrong: 0 });

  useEffect(() => { api('/courses').then(setCourses).catch(() => {}); }, []);

  const ex = exercises[idx];

  function check() {
    const correct = input.trim().toLowerCase() === ex.a.toLowerCase();
    setFeedback(correct);
    setScore(s => ({ right: s.right + (correct ? 1 : 0), wrong: s.wrong + (correct ? 0 : 1) }));
  }

  function next() { setIdx(i => (i + 1) % exercises.length); setInput(''); setFeedback(null); }

  return (
    <>
      <h2 className="fw-bold mb-1"><i className="bi bi-pencil-square text-success me-2"></i>Practice Zone</h2>
      <p className="text-muted mb-4">Quick recall drills to strengthen what you've learned.</p>

      <div className="row g-3 mb-4">
        <div className="col-4"><div className="card stat-card"><div className="card-body"><div className="stat-num">{score.right}</div><div className="stat-lbl">Correct</div></div></div></div>
        <div className="col-4"><div className="card stat-card"><div className="card-body"><div className="stat-num">{score.wrong}</div><div className="stat-lbl">Wrong</div></div></div></div>
        <div className="col-4"><div className="card stat-card"><div className="card-body"><div className="stat-num">{exercises.length}</div><div className="stat-lbl">Total</div></div></div></div>
      </div>

      <div className="card mb-5">
        <div className="card-body">
          <h6 className="text-muted mb-2">Drill #{idx + 1}</h6>
          <h5 className="fw-bold mb-3">{ex.q}</h5>
          <div className="row g-2 align-items-end">
            <div className="col-md-6">
              <input className="form-control" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && check()} placeholder="Type your answer..." />
            </div>
            <div className="col-auto">
              <button className="btn btn-success" onClick={check}><i className="bi bi-check-lg me-1"></i>Check</button>
            </div>
            <div className="col-auto">
              <button className="btn btn-outline-secondary" onClick={next} disabled={feedback === null}>Next drill</button>
            </div>
          </div>
          {feedback !== null && (
            <div className={`alert ${feedback ? 'alert-success' : 'alert-danger'} mt-3 mb-0`}>
              {feedback ? <><i className="bi bi-check-circle me-1"></i>Correct!</> : <><i className="bi bi-x-circle me-1"></i>Not quite. Answer: <b>{ex.a}</b></>}
            </div>
          )}
        </div>
      </div>

      <h4 className="fw-bold mb-3">Or take a quiz from a course</h4>
      <div className="row g-3">
        {courses.map(c => (
          <div className="col-md-6 col-lg-3" key={c.id}>
            <Link to={`/course/${c.slug}`} className="text-decoration-none">
              <div className="card course-card h-100">
                <div className="card-header text-white" style={{ background: c.color }}><i className="bi bi-clipboard-check me-2"></i>{c.title}</div>
                <div className="card-body"><p className="text-muted mb-0">Go to this course and test yourself with its quizzes.</p></div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
