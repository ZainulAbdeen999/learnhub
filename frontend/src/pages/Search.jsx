import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';

const LANG_FLAGS = { en: '🇺🇸', ur: '🇵🇰', ru: '📝', ar: '🇸🇦', hi: '🇮🇳' };

export default function Search() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!q.trim()) { setResults(null); return; }
    setLoading(true);
    setError('');
    api(`/search?q=${encodeURIComponent(q)}`)
      .then(setResults)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [q]);

  if (!q.trim()) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-search display-1 text-muted"></i>
        <p className="mt-3 text-muted">Type something in the search bar to find courses and lessons.</p>
      </div>
    );
  }

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-success"></div><p className="mt-2 text-muted">Searching...</p></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const { courses = [], lessons = [] } = results || {};

  return (
    <>
      <h2 className="fw-bold mb-1"><i className="bi bi-search text-success me-2"></i>Search results</h2>
      <p className="text-muted mb-4">{courses.length + lessons.length} results for "<b>{q}</b>"</p>

      {courses.length > 0 && (
        <>
          <h5 className="fw-bold mb-3">Courses</h5>
          <div className="row g-3 mb-4">
            {courses.map(c => (
              <div className="col-md-6 col-lg-4" key={c.id}>
                <Link to={`/course/${c.slug}`} className="text-decoration-none">
                  <div className="card course-card h-100">
                    <div className="card-header text-white" style={{ background: c.color }}>
                      <span><i className="bi bi-mortarboard-fill me-2"></i>{c.title}</span>
                    </div>
                    <div className="card-body">
                      <p className="card-text small mb-0">{c.description}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      {lessons.length > 0 && (
        <>
          <h5 className="fw-bold mb-3">Lessons</h5>
          <div className="list-group mb-4">
            {lessons.map(l => (
              <Link
                key={l.id}
                to={`/lesson/${l.course_slug}/${l.id}`}
                className="list-group-item list-group-item-action d-flex align-items-center gap-3"
              >
                <div className="rounded d-flex align-items-center justify-content-center text-white flex-shrink-0" style={{ width: 40, height: 40, background: l.course_color || '#04aa6d' }}>
                  <i className="bi bi-mortarboard-fill" style={{ fontSize: '1rem' }}></i>
                </div>
                <div className="min-width-0">
                  <div className="fw-semibold">{l.title}</div>
                  <small className="text-muted">{l.course_title}</small>
                </div>
                <i className="bi bi-arrow-right text-muted ms-auto flex-shrink-0"></i>
              </Link>
            ))}
          </div>
        </>
      )}

      {courses.length === 0 && lessons.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-emoji-frown display-1 text-muted"></i>
          <p className="mt-3 text-muted">No results found for "<b>{q}</b>". Try different keywords.</p>
        </div>
      )}
    </>
  );
}
