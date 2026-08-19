import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CourseSidebar({ course, activeLessonId, activeQuizId, completedLessons = [] }) {
  const completed = new Set(completedLessons);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="btn btn-outline-success d-lg-none w-100 mb-3" onClick={() => setOpen(!open)}>
        <i className="bi bi-list me-2"></i>{open ? 'Hide' : 'Show'} course menu
      </button>
      <aside className={`course-sidebar ${open ? 'd-block' : 'd-none'} d-lg-block`}>
        <div className="bg-success text-white fw-bold p-3">
          <i className="bi bi-mortarboard-fill me-2"></i>{course.title}
        </div>
        {course.topics.map(topic => (
          <div key={topic.id}>
            <div className="sidebar-topic-label">{topic.title}</div>
            {topic.lessons.map(lesson => (
              <Link
                key={lesson.id}
                to={`/lesson/${course.slug}/${lesson.id}`}
                className={`sidebar-link ${activeLessonId === lesson.id ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <span><i className="bi bi-file-earmark-text me-2 small"></i>{lesson.title}</span>
                {completed.has(lesson.id)
                  ? <i className="bi bi-check-circle-fill text-success"></i>
                  : <i className="bi bi-circle text-muted small"></i>}
              </Link>
            ))}
            {topic.quizzes.map(quiz => (
              <Link
                key={quiz.id}
                to={`/quiz/${course.slug}/${quiz.id}`}
                className={`sidebar-link ${activeQuizId === quiz.id ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <span><i className="bi bi-clipboard-check me-2 small text-success"></i>{quiz.title}</span>
              </Link>
            ))}
          </div>
        ))}
      </aside>
    </>
  );
}
