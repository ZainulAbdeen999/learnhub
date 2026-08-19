import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseSidebar from '../components/CourseSidebar';
import PurchaseGate from '../components/PurchaseGate';
import { api } from '../api';
import { useAuth } from '../AuthContext';

export default function QuizView() {
  const { courseSlug, quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locked, setLocked] = useState(null);
  const id = Number(quizId);

  useEffect(() => {
    setLoading(true); setLocked(null); setError('');
    Promise.all([api(`/courses/${courseSlug}`), api(`/quizzes/${id}`)])
      .then(([c, q]) => { setCourse(c); setQuiz(q); })
      .catch(e => {
        if (e.data && e.data.locked) {
          api(`/courses/${courseSlug}`).then(setCourse).catch(() => {});
          setLocked(e.data);
        } else setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [courseSlug, id]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-success"></div></div>;

  if (locked) {
    return (
      <div className="course-layout">
        {course && <CourseSidebar course={course} activeQuizId={id} />}
        <div className="flex-grow-1"><PurchaseGate course={course} onPurchased={() => window.location.reload()} /></div>
      </div>
    );
  }

  if (error || !quiz || !course) return <div className="alert alert-warning">{error || 'Not found'}</div>;

  const qCount = quiz.questions.length;
  const answered = Object.keys(answers).length;

  function submit() {
    if (!user) { navigate('/login'); return; }
    api(`/quizzes/${id}/submit`, { method: 'POST', body: JSON.stringify({ answers: quiz.questions.map((_, i) => answers[i] ?? null) }) })
      .then(setSubmitted).catch(e => setError(e.message));
  }

  const pass = submitted && submitted.passed;

  return (
    <>
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="rounded-3 d-flex align-items-center justify-content-center text-white flex-shrink-0" style={{ width: 48, height: 48, background: course.color, fontWeight: 700 }}>
          {course.title[0]}
        </div>
        <div>
          <h4 className="fw-bold mb-0">{quiz.title}</h4>
          <small className="text-muted">{course.title} &middot; {qCount} questions</small>
        </div>
      </div>

      <div className="course-layout">
        <CourseSidebar course={course} activeQuizId={id} />
        <div className="flex-grow-1 min-width-0">
          <div className="card">
            <div className="card-body">
              {submitted ? (
                <>
                  <div className={`result-banner ${pass ? 'pass' : 'fail'}`}>
                    <i className={`bi ${pass ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'}`} style={{ fontSize: '2.5rem' }}></i>
                    <h3 className="mt-2 mb-1">{submitted.score} / {submitted.total}</h3>
                    <p className="mb-2">{pass ? 'Well done! You passed the quiz.' : 'You need 60% to pass. Try again!'}</p>
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => { setSubmitted(null); setAnswers({}); }}>
                      <i className="bi bi-arrow-counterclockwise me-1"></i>Retake quiz
                    </button>
                  </div>
                  {quiz.questions.map((qq, i) => (
                    <div className="mb-4" key={qq.id}>
                      <h6 className="fw-bold">{i + 1}. {qq.question}</h6>
                      {JSON.parse(qq.options).map((opt, oi) => {
                        const isCorrect = oi === qq.correct_index;
                        const isPicked = answers[i] === oi;
                        return (
                          <div className={`quiz-option ${isCorrect ? 'correct' : ''} ${isPicked && !isCorrect ? 'wrong' : ''}`} key={oi}>
                            {isCorrect ? <i className="bi bi-check-circle-fill text-success"></i> : isPicked ? <i className="bi bi-x-circle-fill text-danger"></i> : <i className="bi bi-circle text-muted"></i>}
                            {opt}
                          </div>
                        );
                      })}
                      {qq.explanation && <small className="text-muted d-block mt-1"><b>Explanation:</b> {qq.explanation}</small>}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="progress mb-3" style={{ height: 8 }}>
                    <div className="progress-bar bg-success" style={{ width: `${(answered / qCount) * 100}%` }}></div>
                  </div>
                  <small className="text-muted d-block mb-3">Answered {answered} / {qCount} questions</small>
                  {quiz.questions.map((qq, i) => (
                    <div className="mb-4" key={qq.id}>
                      <h6 className="fw-bold">{i + 1}. {qq.question}</h6>
                      {JSON.parse(qq.options).map((opt, oi) => (
                        <div
                          className={`quiz-option ${answers[i] === oi ? 'selected' : ''}`}
                          key={oi}
                          onClick={() => setAnswers({ ...answers, [i]: oi })}
                        >
                          <i className={`bi ${answers[i] === oi ? 'bi-check-circle-fill text-success' : 'bi-circle'}`}></i>
                          {opt}
                        </div>
                      ))}
                    </div>
                  ))}
                  <button className="btn btn-success" onClick={submit} disabled={answered < qCount}>
                    <i className="bi bi-send me-1"></i>Submit Quiz
                  </button>
                  {answered < qCount && <small className="text-muted d-block mt-1">Answer all questions to submit.</small>}
                </>
              )}
            </div>
          </div>
          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-outline-secondary" onClick={() => navigate(`/course/${courseSlug}`)}>
              <i className="bi bi-arrow-left me-1"></i>Back to {course.title}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
