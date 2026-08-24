import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import PurchaseGate, { PurchaseSuccess } from '../components/PurchaseGate';
import { api, formatPrice } from '../api';
import { useAuth } from '../AuthContext';

const COURSE_ICONS = {
  html: { bi: 'bi-filetype-html', color: '#e44d26' },
  css: { bi: 'bi-filetype-css', color: '#264de4' },
  javascript: { bi: 'bi-filetype-js', color: '#f7df1e' },
  python: { bi: 'bi-filetype-py', color: '#3776ab' },
  react: { bi: 'bi-react', color: '#61dafb' },
  sql: { bi: 'bi-database', color: '#6f42c1' },
  bootstrap: { bi: 'bi-bootstrap', color: '#7952b3' },
  java: { bi: 'bi-filetype-java', color: '#f89820' },
  cpp: { bi: 'bi-cpu', color: '#00599C' },
  typescript: { bi: 'bi-braces', color: '#3178c6' },
  go: { bi: 'bi-terminal', color: '#00ADD8' },
};

export default function CourseDetail() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewsData, setReviewsData] = useState({ reviews: [], avgRating: 0, totalReviews: 0 });
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    api(`/courses/${slug}`)
      .then(setCourse)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
    loadReviews();
  }, [slug]);

  function loadReviews() {
    api(`/reviews/${slug}`).then(setReviewsData).catch(() => {});
  }

  function submitReview() {
    if (!myRating) return;
    setSubmitting(true);
    api(`/reviews/${slug}`, { method: 'POST', body: JSON.stringify({ rating: myRating, comment: myComment }) })
      .then(() => { setMyRating(0); setMyComment(''); setReviewMsg('Review submitted!'); loadReviews(); setTimeout(() => setReviewMsg(''), 2500); })
      .catch(e => setReviewMsg(e.message))
      .finally(() => setSubmitting(false));
  }

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-success"></div></div>;
  if (error || !course) return <div className="alert alert-warning">{error || 'Course not found'}</div>;

  const icon = COURSE_ICONS[slug] || { bi: 'bi-book', color: course.color || '#198754' };
  const lessonCount = course.topics.reduce((n, t) => n + t.lessons.length, 0);
  const quizCount = course.topics.reduce((n, t) => n + t.quizzes.length, 0);
  const firstLesson = course.topics[0]?.lessons[0];
  const purchased = course.purchased || course.accessible;
  const isPaid = course.price > 0;
  const showSuccess = searchParams.get('purchase') === 'success';

  return (
    <>
      <style>{`
        .cd-hero { background: linear-gradient(135deg, ${icon.color}18 0%, ${icon.color}08 100%); border: 1px solid var(--lh-border); border-radius: 14px; padding: 32px; margin-bottom: 28px; display: flex; align-items: center; gap: 24px; }
        .cd-icon { width: 72px; height: 72px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; color: white; background: linear-gradient(135deg, ${icon.color}, ${icon.color}aa); flex-shrink: 0; }
        .cd-info h3 { font-weight: 800; margin-bottom: 6px; }
        .cd-meta { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 8px; }
        .cd-meta-tag { font-size: 0.75rem; padding: 4px 10px; border-radius: 8px; font-weight: 600; }
        .review-card { background: var(--lh-bg-card); border: 1px solid var(--lh-border); border-radius: 12px; padding: 16px; margin-bottom: 12px; }
        .review-stars { color: #fbbf24; font-size: 0.9rem; margin-bottom: 6px; }
        .review-author { font-size: 0.82rem; font-weight: 600; }
        .review-date { font-size: 0.72rem; color: var(--lh-text-dim); }
        .review-text { font-size: 0.88rem; color: var(--lh-text-muted); line-height: 1.6; margin-top: 6px; }
        .star-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--lh-text-dim); transition: color 0.15s; padding: 0 2px; }
        .star-btn.active { color: #fbbf24; }
        .star-btn:hover { color: #fbbf24; }
        .overview-card { background: var(--lh-bg-card); border: 1px solid var(--lh-border); border-radius: 12px; padding: 20px; margin-bottom: 20px; }
        .topic-header { background: rgba(255,255,255,0.02); border-bottom: 1px solid var(--lh-border); padding: 12px 16px; font-weight: 700; font-size: 0.9rem; display: flex; justify-content: space-between; align-items: center; }
        .topic-item { padding: 10px 16px 10px 28px; border-bottom: 1px solid rgba(255,255,255,0.02); }
        .topic-item a { color: var(--lh-text-muted); text-decoration: none; font-size: 0.88rem; transition: color 0.15s; display: block; }
        .topic-item a:hover { color: var(--lh-accent); }
        .topic-item .quiz-link { color: var(--lh-primary); font-weight: 600; }
        .avg-rating { font-size: 2rem; font-weight: 800; color: var(--lh-text); }
        .avg-stars { color: #fbbf24; }
      `}</style>

      <div className="cd-hero">
        <div className="cd-icon"><i className={`bi ${icon.bi}`}></i></div>
        <div className="cd-info">
          <h3>{course.title}</h3>
          <p style={{ color: 'var(--lh-text-muted)', fontSize: '0.9rem', margin: 0 }}>{course.description}</p>
          <div className="cd-meta">
            <span className="cd-meta-tag" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}><i className="bi bi-journal-text me-1"></i>{lessonCount} Lessons</span>
            <span className="cd-meta-tag" style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa' }}><i className="bi bi-clipboard-check me-1"></i>{quizCount} Quizzes</span>
            <span className="cd-meta-tag" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24' }}><i className="bi bi-bar-chart me-1"></i>{course.topics.length} Topics</span>
            {isPaid ? (
              purchased ? <span className="cd-meta-tag" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}><i className="bi bi-check-circle me-1"></i>Owned</span>
              : <span className="cd-meta-tag" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24' }}><i className="bi bi-lock me-1"></i>{formatPrice(course.price)}</span>
            ) : <span className="cd-meta-tag" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>FREE</span>}
            {reviewsData.totalReviews > 0 && <span className="cd-meta-tag" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24' }}><i className="bi bi-star-fill me-1"></i>{reviewsData.avgRating} ({reviewsData.totalReviews})</span>}
          </div>
        </div>
      </div>

      {showSuccess && <PurchaseSuccess />}

      {!purchased && isPaid ? (
        <PurchaseGate course={course} onPurchased={() => api(`/courses/${slug}`).then(setCourse)} />
      ) : (
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', minWidth: 0 }}>
            {firstLesson && (
              <div className="overview-card">
                <h5 style={{ fontWeight: 700, marginBottom: 12 }}>Course Content</h5>
                <p style={{ color: 'var(--lh-text-muted)', fontSize: '0.88rem', marginBottom: 16 }}>
                  {course.topics.length} topics &middot; {lessonCount} lessons &middot; {quizCount} quizzes
                </p>
                <Link to={`/lesson/${course.slug}/${firstLesson.id}`} className="btn btn-success rounded-pill px-4">
                  <i className="bi bi-play-fill me-1"></i>Start Learning
                </Link>
              </div>
            )}
            {course.topics.map(topic => (
              <div key={topic.id} style={{ background: 'var(--lh-bg-card)', border: '1px solid var(--lh-border)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
                <div className="topic-header"><span>{topic.title}</span><span style={{ fontSize: '0.75rem', color: 'var(--lh-text-dim)' }}>{topic.lessons.length} lessons</span></div>
                {topic.lessons.map(l => (
                  <div className="topic-item" key={l.id}>
                    <Link to={`/lesson/${course.slug}/${l.id}`}><i className="bi bi-file-earmark-text me-2" style={{ color: icon.color }}></i>{l.title}</Link>
                  </div>
                ))}
                {topic.quizzes.map(q => (
                  <div className="topic-item" key={q.id}>
                    <Link to={`/quiz/${course.slug}/${q.id}`} className="quiz-link"><i className="bi bi-clipboard-check me-2"></i>{q.title}</Link>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ flex: '0 0 380px', maxWidth: '100%' }}>
            <div className="overview-card">
              <h5 style={{ fontWeight: 700, marginBottom: 16 }}>Reviews</h5>
              {reviewsData.totalReviews > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--lh-border)' }}>
                  <div className="avg-rating">{reviewsData.avgRating}</div>
                  <div>
                    <div className="avg-stars">{Array.from({ length: 5 }, (_, i) => <i key={i} className={`bi bi-star${i < Math.round(reviewsData.avgRating) ? '-fill' : ''}`}></i>)}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--lh-text-dim)' }}>{reviewsData.totalReviews} reviews</div>
                  </div>
                </div>
              )}
              {reviewsData.reviews.map(r => (
                <div key={r.id} className="review-card">
                  <div className="review-stars">{Array.from({ length: 5 }, (_, i) => <i key={i} className={`bi bi-star${i < r.rating ? '-fill' : ''}`}></i>)}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="review-author">{r.user_name}</span>
                    <span className="review-date">{r.created_at?.split(' ')[0]}</span>
                  </div>
                  {r.comment && <div className="review-text">{r.comment}</div>}
                </div>
              ))}
              {reviewsData.reviews.length === 0 && <p style={{ color: 'var(--lh-text-dim)', fontSize: '0.88rem' }}>No reviews yet. Be the first!</p>}
            </div>

            {user && purchased && (
              <div className="overview-card">
                <h5 style={{ fontWeight: 700, marginBottom: 12 }}>Write a Review</h5>
                {reviewMsg && <div className={`alert ${reviewMsg.includes('!') ? 'alert-success' : 'alert-danger'} py-2 mb-3`} style={{ fontSize: '0.85rem' }}>{reviewMsg}</div>}
                <div style={{ marginBottom: 12 }}>
                  <div>{[1,2,3,4,5].map(s => (
                    <button key={s} className={`star-btn ${s <= myRating ? 'active' : ''}`} onClick={() => setMyRating(s)}><i className={`bi bi-star${s <= myRating ? '-fill' : ''}`}></i></button>
                  ))}</div>
                </div>
                <textarea className="form-control mb-3" rows={3} placeholder="Share your experience (optional)" value={myComment} onChange={e => setMyComment(e.target.value)} style={{ fontSize: '0.88rem' }} />
                <button className="btn btn-success btn-sm rounded-pill px-4" onClick={submitReview} disabled={!myRating || submitting}>
                  {submitting ? <span className="spinner-border spinner-border-sm me-1"></span> : null}
                  Submit Review
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
