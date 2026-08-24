import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';

const COURSE_ICONS = {
  html: 'bi-filetype-html', css: 'bi-filetype-css', javascript: 'bi-filetype-js',
  python: 'bi-filetype-py', sql: 'bi-database', react: 'bi-react',
  bootstrap: 'bi-bootstrap', java: 'bi-cup', cpp: 'bi-cpu',
  typescript: 'bi-filetype-tsx', go: 'bi-terminal',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [courseLessons, setCourseLessons] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const [enrollData, courseListData] = await Promise.all([
          api('/enrollments').catch(() => []),
          api('/courses').catch(() => []),
        ]);

        const enrollArr = Array.isArray(enrollData) ? enrollData : (enrollData?.enrollments || []);
        setEnrollments(enrollArr);

        const courseList = Array.isArray(courseListData) ? courseListData : (courseListData?.value || courseListData?.courses || []);

        const enrolledSlugs = enrollArr.map(e => e.course_slug);
        const coursesWithTopics = await Promise.all(
          courseList.filter(c => enrolledSlugs.includes(c.slug)).map(c =>
            api(`/courses/${c.slug}`).catch(() => c)
          )
        );

        const lessonsMap = {};
        const allLessons = [];
        coursesWithTopics.forEach(c => {
          const lessons = [];
          (c.topics || []).forEach(t => {
            (t.lessons || []).forEach(l => {
              lessons.push({ ...l, courseTitle: c.title, courseSlug: c.slug, courseColor: c.color });
            });
          });
          lessonsMap[c.slug] = lessons;
          allLessons.push(...lessons);
        });
        setCourseLessons(lessonsMap);

        const progressResults = await Promise.all(
          enrolledSlugs.map(slug =>
            api(`/progress/${slug}`).catch(() => ({ completed_lessons: [] }))
          )
        );

        const newProgressMap = {};
        enrolledSlugs.forEach((slug, i) => {
          const data = progressResults[i];
          const completed = data?.completed_lessons || data?.completedLessons || [];
          newProgressMap[slug] = { completed, total: (lessonsMap[slug] || []).length };
        });
        setProgressMap(newProgressMap);
      } catch (err) {
        console.error('Dashboard load error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!chartRef.current || enrollments.length === 0 || !window.Chart) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const labels = enrollments.map(e => e.course_title.replace('Learn ', ''));
    const progressData = enrollments.map(e => {
      const p = progressMap[e.course_slug];
      if (!p || !p.total) return 0;
      return Math.round((p.completed.length / p.total) * 100);
    });

    chartInstance.current = new window.Chart(chartRef.current, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: progressData.map(v => Math.max(v, 2)),
          backgroundColor: ['#198754', '#4ade80', '#0d6efd', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
          borderColor: '#12121a',
          borderWidth: 3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { position: 'bottom', labels: { color: '#8888a0', padding: 16, font: { size: 12 } } },
        },
      },
    });

    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [enrollments, progressMap]);

  const totalLessons = Object.values(progressMap).reduce((s, p) => s + (p.total || 0), 0);
  const completedLessons = Object.values(progressMap).reduce((s, p) => s + (p.completed?.length || 0), 0);
  const overallPct = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-success" role="status"><span className="visually-hidden">Loading...</span></div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--lh-text)' }}>Dashboard</h2>
          <p className="text-muted mb-0">Welcome back, {user?.name}!</p>
        </div>
        <Link to="/courses" className="btn btn-success">
          <i className="bi bi-plus-circle me-1"></i> Browse Courses
        </Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="stat-card rounded-3 p-3 text-center">
            <div className="fs-2 fw-bold" style={{ color: 'var(--lh-primary)' }}>{enrollments.length}</div>
            <div className="text-muted small mt-1">Enrolled Courses</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card rounded-3 p-3 text-center">
            <div className="fs-2 fw-bold" style={{ color: 'var(--lh-accent)' }}>{completedLessons}</div>
            <div className="text-muted small mt-1">Lessons Completed</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card rounded-3 p-3 text-center">
            <div className="fs-2 fw-bold" style={{ color: '#0d6efd' }}>{overallPct}%</div>
            <div className="text-muted small mt-1">Overall Progress</div>
          </div>
        </div>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-journal-bookmark display-1 text-muted mb-3" style={{ opacity: 0.3 }}></i>
          <h4 className="text-muted mb-2">No courses yet</h4>
          <p className="text-muted mb-3" style={{ maxWidth: 400, margin: '0 auto' }}>
            Start your coding journey! Browse our courses and enroll in the ones that interest you.
          </p>
          <Link to="/courses" className="btn btn-success">Explore Courses</Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-7">
            <h5 className="fw-bold mb-3" style={{ color: 'var(--lh-text)' }}>My Courses</h5>
            <div className="d-flex flex-column gap-3">
              {enrollments.map(en => {
                const slug = en.course_slug;
                const p = progressMap[slug] || { completed: [], total: 0 };
                const pct = p.total ? Math.round((p.completed.length / p.total) * 100) : 0;
                return (
                  <Link
                    key={slug}
                    to={`/course/${slug}`}
                    className="card border-0 text-decoration-none"
                    style={{ background: 'var(--lh-bg-card)', border: '1px solid var(--lh-border) !important' }}
                  >
                    <div className="card-body d-flex align-items-center gap-3">
                      <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: `linear-gradient(135deg, ${en.course_color || '#198754'}20, ${en.course_color || '#198754'}40)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <i className={`bi ${COURSE_ICONS[slug] || 'bi-book'} fs-4`} style={{ color: en.course_color || '#198754' }}></i>
                      </div>
                      <div className="flex-grow-1 min-w-0">
                        <div className="fw-semibold" style={{ color: 'var(--lh-text)' }}>{en.course_title}</div>
                        <div className="text-muted small">{p.completed.length} / {p.total} lessons completed</div>
                      </div>
                      <div className="text-end" style={{ minWidth: 60 }}>
                        <div className="fw-bold" style={{ color: 'var(--lh-primary)' }}>{pct}%</div>
                        <div className="progress mt-1" style={{ height: 6, width: 60 }}>
                          <div className="progress-bar" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="col-lg-5">
            <h5 className="fw-bold mb-3" style={{ color: 'var(--lh-text)' }}>Progress Overview</h5>
            <div className="card border-0" style={{ background: 'var(--lh-bg-card)', border: '1px solid var(--lh-border) !important' }}>
              <div className="card-body" style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
