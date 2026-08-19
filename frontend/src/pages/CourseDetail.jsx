import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import CourseSidebar from '../components/CourseSidebar';
import PurchaseGate, { PurchaseSuccess } from '../components/PurchaseGate';
import { api, formatPrice } from '../api';

export default function CourseDetail() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api(`/courses/${slug}`)
      .then(setCourse)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug, searchParams.get('purchase')]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-success"></div></div>;
  if (error || !course) return <div className="alert alert-warning">{error || 'Course not found'}</div>;

  const lessonCount = course.topics.reduce((n, t) => n + t.lessons.length, 0);
  const quizCount = course.topics.reduce((n, t) => n + t.quizzes.length, 0);
  const firstLesson = course.topics[0]?.lessons[0];
  const purchased = course.purchased || course.accessible;
  const isPaid = course.price > 0;
  const showSuccess = searchParams.get('purchase') === 'success';

  return (
    <>
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="rounded-3 d-flex align-items-center justify-content-center text-white flex-shrink-0" style={{ width: 56, height: 56, background: course.color, fontSize: '1.5rem' }}>
          <i className="bi bi-mortarboard-fill"></i>
        </div>
        <div className="flex-grow-1">
          <h3 className="fw-bold mb-0">{course.title}</h3>
          <div className="d-flex align-items-center gap-2 flex-wrap mt-1">
            <span className="text-muted small">{course.description}</span>
            {isPaid && !purchased && <span className="badge bg-warning text-dark"><i className="bi bi-lock-fill me-1"></i>{formatPrice(course.price)}</span>}
            {isPaid && purchased && <span className="badge bg-success">Owned</span>}
            {!isPaid && <span className="badge bg-success">FREE</span>}
          </div>
        </div>
      </div>

      {showSuccess && <PurchaseSuccess />}

      <div className="course-layout">
        <CourseSidebar course={course} />
        <div className="flex-grow-1 min-width-0">
          {!purchased ? (
            <>
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Course overview</h5>
                  <p className="text-muted">
                    This course has <b>{course.topics.length}</b> topics, <b>{lessonCount}</b> lessons and <b>{quizCount}</b> quizzes.
                  </p>
                </div>
              </div>
              <PurchaseGate course={course} onPurchased={() => api(`/courses/${slug}`).then(setCourse)} />
            </>
          ) : (
            <>
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Course overview</h5>
                  <p className="text-muted mb-3">
                    This course has <b>{course.topics.length}</b> topics, <b>{lessonCount}</b> lessons and <b>{quizCount}</b> quizzes.
                    Complete lessons, then take quizzes to test what you learned.
                  </p>
                  {firstLesson && (
                    <Link to={`/lesson/${course.slug}/${firstLesson.id}`} className="btn btn-success">
                      <i className="bi bi-play-fill me-1"></i> Start learning
                    </Link>
                  )}
                </div>
              </div>
              {course.topics.map(topic => (
                <div className="card mb-3" key={topic.id}>
                  <div className="card-header fw-semibold">{topic.title}</div>
                  <ul className="list-group list-group-flush">
                    {topic.lessons.map(l => (
                      <li className="list-group-item" key={l.id}>
                        <Link to={`/lesson/${course.slug}/${l.id}`} className="text-decoration-none">
                          <i className="bi bi-file-earmark-text me-2 text-success"></i>{l.title}
                        </Link>
                      </li>
                    ))}
                    {topic.quizzes.map(q => (
                      <li className="list-group-item" key={q.id}>
                        <Link to={`/quiz/${course.slug}/${q.id}`} className="text-decoration-none text-success fw-semibold">
                          <i className="bi bi-clipboard-check me-2"></i>{q.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
