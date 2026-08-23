import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatPrice } from '../api';
import { useLanguage } from '../LanguageContext';

const LANG_FLAGS = { en: '🇺🇸', ur: '🇵🇰', ru: '📝', ar: '🇸🇦', hi: '🇮🇳' };
const LANG_NAMES = { en: 'English', ur: 'Urdu', ru: 'Roman Urdu', ar: 'Arabic', hi: 'Hindi' };

const COURSE_ICONS = {
  html: { bi: 'bi-filetype-html', bg: '#e44d26' },
  css: { bi: 'bi-filetype-css', bg: '#264de4' },
  javascript: { bi: 'bi-filetype-js', bg: '#f7df1e' },
  python: { bi: 'bi-filetype-py', bg: '#3776ab' },
  react: { bi: 'bi-react', bg: '#61dafb' },
  sql: { bi: 'bi-database', bg: '#6f42c1' },
  bootstrap: { bi: 'bi-bootstrap', bg: '#7952b3' },
  java: { bi: 'bi-filetype-java', bg: '#f89820' },
  cpp: { bi: 'bi-cpu', bg: '#00599C' },
  typescript: { bi: 'bi-braces', bg: '#3178c6' },
  go: { bi: 'bi-terminal', bg: '#00ADD8' },
  'html-urdu': { bi: 'bi-filetype-html', bg: '#e44d26' },
  'html-roman-urdu': { bi: 'bi-filetype-html', bg: '#e44d26' },
  'css-roman-urdu': { bi: 'bi-filetype-css', bg: '#264de4' },
};

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

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-success"></div>
      <p className="mt-3" style={{ color: 'var(--lh-text-muted)' }}>Loading courses...</p>
    </div>
  );
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <style>{`
        .courses-header { margin-bottom: 32px; }
        .courses-header h2 { font-size: 1.8rem; font-weight: 800; margin-bottom: 6px; }
        .courses-header p { color: var(--lh-text-muted); font-size: 0.95rem; }
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }
        .vip-course-card {
          background: var(--lh-bg-card);
          border: 1px solid var(--lh-border);
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.3s ease;
          text-decoration: none;
          display: flex;
          flex-direction: column;
        }
        .vip-course-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.5);
          border-color: var(--lh-primary);
        }
        .vip-course-icon-wrap {
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
        }
        .vip-course-icon-text {
          font-family: 'Fira Code', monospace;
          font-weight: 700;
          font-size: 1.4rem;
          color: white;
          opacity: 0.95;
        }
        .vip-course-lang {
          font-size: 1rem;
        }
        .vip-course-body {
          padding: 16px 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .vip-course-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--lh-text);
          margin-bottom: 4px;
        }
        .vip-course-desc {
          font-size: 0.8rem;
          color: var(--lh-text-dim);
          line-height: 1.5;
          margin-bottom: 12px;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .vip-course-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }
        .vip-course-tag {
          font-size: 0.68rem;
          padding: 3px 8px;
          border-radius: 6px;
          font-weight: 600;
        }
        .vip-course-tag.lessons { color: #4ade80; background: rgba(74,222,128,0.1); }
        .vip-course-tag.level { color: #60a5fa; background: rgba(96,165,250,0.1); }
        .vip-course-tag.lang { color: #a78bfa; background: rgba(167,139,250,0.1); }
        .vip-course-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid var(--lh-border);
        }
        .vip-course-price {
          font-weight: 700;
          font-size: 0.9rem;
        }
        .vip-course-price.free { color: #4ade80; }
        .vip-course-price.paid { color: #fbbf24; }
        .vip-course-arrow {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(25,135,84,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--lh-primary);
          font-size: 0.8rem;
          transition: all 0.2s;
        }
        .vip-course-card:hover .vip-course-arrow {
          background: var(--lh-primary);
          color: white;
        }
        .courses-empty {
          text-align: center;
          padding: 60px 20px;
        }
        .courses-empty i { font-size: 3rem; color: var(--lh-text-dim); margin-bottom: 12px; display: block; }
        .courses-empty p { color: var(--lh-text-muted); }
      `}</style>

      <div className="courses-header">
        <h2><i className="bi bi-book text-success me-2"></i>Courses</h2>
        <p>
          {lang && lang !== 'all' ? `Showing courses in ${LANG_NAMES[lang]}. ` : 'Pick a course and start learning. '}
          Each course has topics, lessons, videos and quizzes.
        </p>
      </div>

      <div className="courses-grid">
        {courses.map(c => {
          const isPaid = c.price > 0;
          const icon = COURSE_ICONS[c.slug] || { bi: 'bi-book', bg: c.color || '#198754' };
          return (
            <Link key={c.id} to={`/course/${c.slug}`} className="vip-course-card">
              <div className="vip-course-icon-wrap" style={{ background: `linear-gradient(135deg, ${icon.bg}, ${icon.bg}88)` }}>
                <i className={`bi ${icon.bi} vip-course-icon-text`}></i>
                <span className="vip-course-lang">{LANG_FLAGS[c.language] || '🌐'}</span>
              </div>
              <div className="vip-course-body">
                <div className="vip-course-title">{c.title}</div>
                <div className="vip-course-desc">{c.description}</div>
                <div className="vip-course-tags">
                  <span className="vip-course-tag lessons"><i className="bi bi-journal-text me-1"></i>{c.lesson_count} Lessons</span>
                  <span className="vip-course-tag level"><i className="bi bi-bar-chart me-1"></i>{c.topic_count} Topics</span>
                </div>
                <div className="vip-course-bottom">
                  <span className={`vip-course-price ${isPaid ? 'paid' : 'free'}`}>
                    {isPaid ? formatPrice(c.price) : 'FREE'}
                  </span>
                  <span className="vip-course-arrow"><i className="bi bi-arrow-right"></i></span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {courses.length === 0 && (
        <div className="courses-empty">
          <i className="bi bi-globe2"></i>
          <p>
            {lang && lang !== 'all' ? `No courses in ${LANG_NAMES[lang]} yet.` : 'No courses yet. Come back soon!'}
          </p>
        </div>
      )}
    </>
  );
}
