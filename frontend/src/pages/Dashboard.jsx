import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api, formatDate, formatPrice } from '../api';
import { useAuth } from '../AuthContext';

const COLORS = {
  green: '#04aa6d',
  greenLight: '#06d6a0',
  greenDark: '#038a5c',
  grey: '#dee2e6',
  red: '#e74c3c',
  blue: '#3498db',
  orange: '#f39c12',
  purple: '#9b59b6',
  bg: '#f8f9fa',
};

function useChart(canvasRef, createFn, deps) {
  const chartRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current || !window.Chart) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = createFn(canvasRef.current);
    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, deps);
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState({ completedLessons: [], attempts: [] });
  const [enrollments, setEnrollments] = useState([]);
  const [certs, setCerts] = useState({});
  const [err, setErr] = useState('');

  const doughnutRef = useRef(null);
  const barRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([api('/courses'), api('/progress'), api('/enrollments').catch(() => [])])
      .then(([c, p, e]) => {
        setCourses(c);
        setProgress(p);
        setEnrollments(e);
        const done = new Set(p.completedLessons);
        c.forEach(course => {
          const lessons = [];
          course.topics?.forEach(t => lessons.push(...t.lessons));
          const allDone = lessons.length > 0 && lessons.every(l => done.has(l.id));
          if (allDone) {
            api(`/certificate/${course.slug}`).then(d => {
              setCerts(prev => ({ ...prev, [course.slug]: d }));
            }).catch(() => {});
          }
        });
      })
      .catch(e => setErr(e.message));
  }, [user]);

  // Derived data
  const done = new Set(progress.completedLessons);
  let totalLessons = 0, doneLessons = 0;
  const courseStats = courses.map(c => {
    const lessons = [];
    c.topics?.forEach(t => lessons.push(...t.lessons));
    const d = lessons.filter(l => done.has(l.id)).length;
    totalLessons += lessons.length;
    doneLessons += d;
    return { course: c, total: lessons.length, done: d };
  });
  const passedQuizzes = progress.attempts.filter(a => a.passed).length;
  const pct = totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0;

  // Doughnut chart — lessons completed vs remaining
  useChart(doughnutRef, (canvas) => {
    return new window.Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Remaining'],
        datasets: [{
          data: [doneLessons, Math.max(0, totalLessons - doneLessons)],
          backgroundColor: [COLORS.green, COLORS.grey],
          borderWidth: 0,
          hoverOffset: 8,
        }],
      },
      options: {
        cutout: '72%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true, pointStyle: 'circle' } },
          tooltip: {
            backgroundColor: '#333',
            titleFont: { size: 13 },
            bodyFont: { size: 13 },
            padding: 10,
            cornerRadius: 8,
          },
        },
      },
    });
  }, [doneLessons, totalLessons]);

  // Bar chart — quiz scores over time
  useChart(barRef, (canvas) => {
    const attempts = [...progress.attempts].sort((a, b) => new Date(a.taken_at) - new Date(b.taken_at));
    const labels = attempts.map((a, i) => {
      const d = new Date(a.taken_at.replace(' ', 'T'));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    const scores = attempts.map(a => Math.round((a.score / a.total) * 100));
    const barColors = attempts.map(a => a.passed ? COLORS.green : COLORS.red);

    return new window.Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Score %',
          data: scores,
          backgroundColor: barColors.map(c => c + 'cc'),
          borderColor: barColors,
          borderWidth: 2,
          borderRadius: 6,
          maxBarThickness: 48,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%', font: { size: 12 } }, grid: { color: '#eee' } },
          x: { ticks: { font: { size: 11 } }, grid: { display: false } },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#333',
            cornerRadius: 8,
            padding: 10,
            callbacks: {
              label: ctx => {
                const a = attempts[ctx.dataIndex];
                return ` ${a.score}/${a.total} (${ctx.raw}%)`;
              },
            },
          },
        },
      },
    });
  }, [progress.attempts]);

  // Line chart — weekly learning streak (mock based on attempt dates)
  useChart(lineRef, (canvas) => {
    const attempts = progress.attempts || [];
    const weekMap = {};
    const now = new Date();
    // Generate last 8 weeks
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      weekMap[key] = 0;
    }
    attempts.forEach(a => {
      const d = new Date(a.taken_at.replace(' ', 'T'));
      const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
      const weekIdx = 7 - Math.floor(diffDays / 7);
      if (weekIdx >= 0 && weekIdx < 8) {
        const wk = new Date(now);
        wk.setDate(wk.getDate() - weekIdx * 7);
        const key = wk.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        weekMap[key] = (weekMap[key] || 0) + 1;
      }
    });
    const labels = Object.keys(weekMap);
    const data = Object.values(weekMap);

    return new window.Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Quiz Attempts',
          data,
          fill: true,
          backgroundColor: COLORS.green + '18',
          borderColor: COLORS.green,
          borderWidth: 3,
          tension: 0.4,
          pointBackgroundColor: COLORS.green,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 12 } }, grid: { color: '#eee' } },
          x: { ticks: { font: { size: 11 } }, grid: { display: false } },
        },
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#333', cornerRadius: 8, padding: 10 },
        },
      },
    });
  }, [progress.attempts]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-success"></div></div>;
  if (!user) return (
    <div className="text-center py-5">
      <i className="bi bi-lock display-1 text-muted"></i>
      <p className="mt-3 text-muted">Please login to see your progress.</p>
      <Link to="/login" className="btn btn-success">Login</Link>
    </div>
  );
  if (err) return <div className="alert alert-danger">{err}</div>;

  const overallColor = pct >= 75 ? COLORS.green : pct >= 40 ? COLORS.orange : COLORS.red;

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Welcome header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">
          <i className="bi bi-bar-chart-fill text-success me-2"></i>My Dashboard
        </h2>
        <p className="text-muted mb-0">Welcome back, <strong>{user.name}</strong>! Here's your learning overview.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderTop: `4px solid ${COLORS.green}` }}>
            <div className="card-body d-flex align-items-center gap-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 56, height: 56, background: COLORS.green + '18' }}>
                <i className="bi bi-book fs-3" style={{ color: COLORS.green }}></i>
              </div>
              <div>
                <div className="fs-2 fw-bold mb-0" style={{ color: COLORS.green }}>{doneLessons}<span className="fs-6 fw-normal text-muted">/{totalLessons}</span></div>
                <div className="text-muted small">Lessons Done</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderTop: `4px solid ${COLORS.blue}` }}>
            <div className="card-body d-flex align-items-center gap-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 56, height: 56, background: COLORS.blue + '18' }}>
                <i className="bi bi-pencil-square fs-3" style={{ color: COLORS.blue }}></i>
              </div>
              <div>
                <div className="fs-2 fw-bold mb-0" style={{ color: COLORS.blue }}>{progress.attempts.length}</div>
                <div className="text-muted small">Quizzes Taken</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderTop: `4px solid ${COLORS.greenDark}` }}>
            <div className="card-body d-flex align-items-center gap-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 56, height: 56, background: COLORS.greenDark + '18' }}>
                <i className="bi bi-check-circle fs-3" style={{ color: COLORS.greenDark }}></i>
              </div>
              <div>
                <div className="fs-2 fw-bold mb-0" style={{ color: COLORS.greenDark }}>{passedQuizzes}</div>
                <div className="text-muted small">Passed</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderTop: `4px solid ${overallColor}` }}>
            <div className="card-body d-flex align-items-center gap-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 56, height: 56, background: overallColor + '18' }}>
                <i className="bi bi-graph-up-arrow fs-3" style={{ color: overallColor }}></i>
              </div>
              <div>
                <div className="fs-2 fw-bold mb-0" style={{ color: overallColor }}>{pct}%</div>
                <div className="text-muted small">Overall</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Charts Row ── */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-bold mb-3"><i className="bi bi-pie-chart me-2 text-success"></i>Lessons Progress</h6>
              {window.Chart ? (
                <div style={{ height: 280 }}><canvas ref={doughnutRef}></canvas></div>
              ) : (
                <div className="text-center text-muted py-5">Charts loading...</div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-bold mb-3"><i className="bi bi-bar-chart me-2 text-success"></i>Quiz Scores</h6>
              {window.Chart ? (
                <div style={{ height: 280 }}><canvas ref={barRef}></canvas></div>
              ) : (
                <div className="text-center text-muted py-5">Charts loading...</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Line Chart Full Width ── */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h6 className="fw-bold mb-3"><i className="bi bi-activity me-2 text-success"></i>Weekly Learning Streak</h6>
          {window.Chart ? (
            <div style={{ height: 260 }}><canvas ref={lineRef}></canvas></div>
          ) : (
            <div className="text-center text-muted py-5">Charts loading...</div>
          )}
        </div>
      </div>

      {/* ── Course Progress Cards ── */}
      {courseStats.filter(cs => cs.total > 0).length > 0 && (
        <>
          <h5 className="fw-bold mb-3"><i className="bi bi-laptop me-2 text-success"></i>Course Progress</h5>
          <div className="row g-3 mb-4">
            {courseStats.filter(cs => cs.total > 0).map(cs => {
              const cp = Math.round((cs.done / cs.total) * 100);
              const hasCert = certs[cs.course.slug];
              const barColor = cp === 100
                ? `linear-gradient(90deg, ${COLORS.green}, ${COLORS.greenLight})`
                : cp > 50
                  ? `linear-gradient(90deg, ${COLORS.green}, ${COLORS.greenLight})`
                  : `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.blue})`;
              return (
                <div className="col-md-6" key={cs.course.id}>
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold mb-0">{cs.course.title}</h6>
                        <span className="badge" style={{ background: cp === 100 ? COLORS.green : COLORS.blue + '22', color: cp === 100 ? '#fff' : COLORS.blue }}>
                          {cp}%
                        </span>
                      </div>
                      <p className="text-muted small mb-2">{cs.done} of {cs.total} lessons completed</p>
                      <div className="progress mb-3" style={{ height: 10, borderRadius: 10 }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: `${cp}%`, borderRadius: 10, background: barColor }}
                          aria-valuenow={cp}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <div className="d-flex gap-2 flex-wrap">
                        <Link to={`/course/${cs.course.slug}`} className="btn btn-sm" style={{ background: COLORS.green + '15', color: COLORS.green, border: 'none' }}>
                          {cp === 100 ? 'Review' : 'Continue'} <i className="bi bi-arrow-right ms-1"></i>
                        </Link>
                        {hasCert && (
                          <Link to={`/certificate/${cs.course.slug}`} className="btn btn-sm" style={{ background: COLORS.blue + '15', color: COLORS.blue, border: 'none' }}>
                            <i className="bi bi-award me-1"></i>Certificate
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── Purchases Table ── */}
      {enrollments.length > 0 && (
        <>
          <h5 className="fw-bold mb-3"><i className="bi bi-bag-check me-2 text-success"></i>My Purchased Courses</h5>
          <div className="card border-0 shadow-sm mb-4">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr style={{ background: '#f1faf5' }}>
                    <th className="fw-semibold text-muted small text-uppercase">Course</th>
                    <th className="fw-semibold text-muted small text-uppercase">Price Paid</th>
                    <th className="fw-semibold text-muted small text-uppercase">Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((e, i) => (
                    <tr key={i}>
                      <td className="fw-semibold">{e.title}</td>
                      <td style={{ color: COLORS.green }}>{formatPrice(e.price_paid)}</td>
                      <td className="text-muted">{formatDate(e.created_at)}</td>
                      <td>
                        <Link to={`/course/${e.slug}`} className="btn btn-sm" style={{ background: COLORS.green, color: '#fff', border: 'none', borderRadius: 6 }}>
                          Open <i className="bi bi-box-arrow-up-right ms-1"></i>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── Quiz History ── */}
      <h5 className="fw-bold mb-3"><i className="bi bi-clock-history me-2 text-success"></i>Quiz History</h5>
      {progress.attempts.length === 0 ? (
        <div className="card border-0 shadow-sm text-center py-5">
          <div className="card-body">
            <i className="bi bi-clipboard display-1 d-block mb-3" style={{ color: COLORS.grey }}></i>
            <p className="text-muted mb-0">No quizzes taken yet. Start learning to unlock quizzes!</p>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm mb-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr style={{ background: '#f1faf5' }}>
                  <th className="fw-semibold text-muted small text-uppercase">Quiz</th>
                  <th className="fw-semibold text-muted small text-uppercase">Score</th>
                  <th className="fw-semibold text-muted small text-uppercase">Result</th>
                  <th className="fw-semibold text-muted small text-uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {progress.attempts.map((a, i) => (
                  <tr key={i}>
                    <td className="fw-semibold">{a.title}</td>
                    <td>
                      <span className="fw-bold" style={{ color: a.passed ? COLORS.green : COLORS.red }}>
                        {a.score}/{a.total}
                      </span>
                      <small className="text-muted ms-1">({Math.round((a.score / a.total) * 100)}%)</small>
                    </td>
                    <td>
                      {a.passed
                        ? <span className="badge" style={{ background: COLORS.green + '20', color: COLORS.green }}><i className="bi bi-check-circle me-1"></i>Passed</span>
                        : <span className="badge" style={{ background: COLORS.red + '20', color: COLORS.red }}><i className="bi bi-x-circle me-1"></i>Failed</span>
                      }
                    </td>
                    <td className="text-muted">{formatDate(a.taken_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
