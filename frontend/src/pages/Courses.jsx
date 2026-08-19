import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatPrice } from '../api';
import { useLanguage } from '../LanguageContext';

const LANG_FLAGS = { en: '🇺🇸', ur: '🇵🇰', ru: '📝', ar: '🇸🇦', hi: '🇮🇳' };
const LANG_NAMES = { en: 'English', ur: 'Urdu', ru: 'Roman Urdu', ar: 'Arabic', hi: 'Hindi' };

export default function Courses() {
  const { lang } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    const q = lang && lang !== 'all' ? `?lang=${lang}` : '';
    api(`/courses${q}`)
      .then(setCourses)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [lang]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-success"></div><p className="mt-2 text-muted">Loading courses...</p></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <h2 className="fw-bold mb-1">Courses</h2>
      <p className="text-muted mb-4">
        {lang && lang !== 'all' ? `Showing courses in ${LANG_NAMES[lang]}. ` : 'Pick a course and start learning. '}
        Each course has topics, lessons, videos and quizzes.
      </p>

      <div className="row g-4">
        {courses.map(c => {
          const isPaid = c.price > 0;
          return (
            <div className="col-md-6 col-lg-4 col-xl-3" key={c.id}>
              <Link to={`/course/${c.slug}`} className="text-decoration-none">
                <div className="card course-card h-100">
                    <div className="card-header text-white" style={{ background: c.color }}>
                      <div className="d-flex justify-content-between align-items-start">
                        <span><i className="bi bi-mortarboard-fill me-2"></i>{c.title}</span>
                      <span className="lang-badge">{LANG_FLAGS[c.language] || '🌐'}</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="card-text">{c.description}</p>
                  </div>
                  <div className="card-footer d-flex justify-content-between align-items-center">
                    <span className="text-muted small">{c.topic_count} topics &middot; {c.lesson_count} lessons</span>
                    {isPaid ? (
                      <span className="badge bg-warning text-dark"><i className="bi bi-lock-fill me-1"></i>{formatPrice(c.price)}</span>
                    ) : (
                      <span className="badge bg-success">FREE</span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
      {courses.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-globe2 display-1 text-muted"></i>
          <p className="mt-3 text-muted">
            {lang && lang !== 'all' ? `No courses in ${LANG_NAMES[lang]} yet.` : 'No courses yet. Come back soon!'}
          </p>
        </div>
      )}
    </>
  );
}
