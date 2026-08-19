import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import CourseSidebar from '../components/CourseSidebar';
import PurchaseGate from '../components/PurchaseGate';
import CodePlayground from '../components/CodePlayground';
import CodeChallenge from '../components/CodeChallenge';
import CopyButton from '../components/CopyButton';
import { api } from '../api';
import { useAuth } from '../AuthContext';

function detectLanguage(code) {
  if (!code) return 'html';
  if (/<\/?[a-z][\s\S]*>/i.test(code)) return 'html';
  if (/function|const|let|var|=>|console\.log|document\./.test(code)) return 'javascript';
  if (/def |import |print\(|class |if __name__/.test(code)) return 'python';
  if (/body\s*\{|margin:|color:|font-|background/.test(code)) return 'css';
  return 'html';
}

function MarkdownWithCopy({ content }) {
  return (
    <ReactMarkdown
      components={{
        pre({ children }) {
          const code = children?.props?.children || '';
          return (
            <pre style={{ position: 'relative' }}>
              <CopyButton text={typeof code === 'string' ? code : ''} />
              {children}
            </pre>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default function LessonView() {
  const { courseSlug, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [completed, setCompleted] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locked, setLocked] = useState(null);

  const id = Number(lessonId);

  useEffect(() => {
    setLoading(true); setLocked(null); setError('');
    Promise.all([api(`/courses/${courseSlug}`), api(`/lessons/${id}`)])
      .then(([c, l]) => { setCourse(c); setLesson(l); })
      .catch(e => {
        if (e.data && e.data.locked) {
          api(`/courses/${courseSlug}`).then(setCourse).catch(() => {});
          setLocked(e.data);
        } else setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [courseSlug, id]);

  useEffect(() => {
    if (!user) return;
    api('/progress').then(p => setCompleted(new Set(p.completedLessons))).catch(() => {});
  }, [user, id]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-success"></div></div>;

  if (locked) {
    return (
      <div className="course-layout">
        {course && <CourseSidebar course={course} activeLessonId={id} />}
        <div className="flex-grow-1"><PurchaseGate course={course} onPurchased={() => window.location.reload()} /></div>
      </div>
    );
  }

  if (error || !lesson || !course) return <div className="alert alert-warning">{error || 'Not found'}</div>;

  const allItems = [];
  course.topics.forEach(t => {
    t.lessons.forEach(l => allItems.push({ type: 'lesson', id: l.id, title: l.title }));
    t.quizzes.forEach(q => allItems.push({ type: 'quiz', id: q.id, title: q.title }));
  });
  const idx = allItems.findIndex(i => i.type === 'lesson' && i.id === id);
  const prev = idx > 0 ? allItems[idx - 1] : null;
  const next = idx >= 0 && idx < allItems.length - 1 ? allItems[idx + 1] : null;
  const isDone = completed.has(id);

  function toggleComplete() {
    if (!user) { navigate('/login'); return; }
    const newVal = !isDone;
    api('/progress', { method: 'POST', body: JSON.stringify({ lessonId: id, completed: newVal }) }).then(() => {
      setCompleted(prev => { const s = new Set(prev); newVal ? s.add(id) : s.delete(id); return s; });
    }).catch(() => {});
  }

  function goto(item) {
    if (item.type === 'lesson') navigate(`/lesson/${courseSlug}/${item.id}`);
    else navigate(`/quiz/${courseSlug}/${item.id}`);
  }

  const detectedLang = detectLanguage(lesson.code);
  let challengeData = null;
  if (lesson.challenge) {
    try { challengeData = JSON.parse(lesson.challenge); } catch {}
  }

  return (
    <>
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="rounded-3 d-flex align-items-center justify-content-center text-white flex-shrink-0" style={{ width: 48, height: 48, background: course.color }}>
          <i className="bi bi-mortarboard-fill"></i>
        </div>
        <div>
          <h4 className="fw-bold mb-0">{lesson.title}</h4>
          <small className="text-muted">{course.title}</small>
        </div>
      </div>

      <div className="course-layout">
        <CourseSidebar course={course} activeLessonId={id} completedLessons={[...completed]} />
        <div className="flex-grow-1 min-width-0">
          <div className="card">
            <div className="card-body lesson-content">
              <MarkdownWithCopy content={lesson.content} />

              {lesson.code && (
                <CodePlayground
                  code={lesson.code}
                  language={detectedLang}
                  title="Try it Yourself"
                />
              )}

              {challengeData && (
                <CodeChallenge challenge={challengeData} />
              )}

              {lesson.video_url && (
                <div className="mt-4">
                  <h5><i className="bi bi-play-circle me-2"></i>Video Tutorial</h5>
                  <div className="video-wrapper">
                    <iframe src={lesson.video_url} title={lesson.title} allowFullScreen loading="lazy" />
                  </div>
                </div>
              )}

              <hr />
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <button className={`btn ${isDone ? 'btn-success' : 'btn-outline-success'}`} onClick={toggleComplete}>
                  <i className={`bi ${isDone ? 'bi-check-circle-fill' : 'bi-check-circle'} me-1`}></i>
                  {isDone ? 'Lesson completed!' : 'Mark as complete'}
                </button>
                <Link to={`/certificate/${courseSlug}`} className="btn btn-outline-info btn-sm">
                  <i className="bi bi-award me-1"></i>Certificate
                </Link>
              </div>

              <div className="d-flex justify-content-between mt-4">
                {prev ? (
                  <button className="btn btn-outline-secondary" onClick={() => goto(prev)}>
                    <i className="bi bi-arrow-left me-1"></i>{prev.title}
                  </button>
                ) : <span />}
                {next ? (
                  <button className="btn btn-success" onClick={() => goto(next)}>
                    {next.title}<i className="bi bi-arrow-right ms-1"></i>
                  </button>
                ) : (
                  <Link to={`/course/${courseSlug}`} className="btn btn-success">Finish course <i className="bi bi-arrow-right ms-1"></i></Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
