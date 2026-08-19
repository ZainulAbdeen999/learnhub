import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { api } from '../api';
import { formatPrice } from '../api';

export default function Admin() {
  const { user, loading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [tab, setTab] = useState('courses');
  const [users, setUsers] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const loadCourses = () => api('/courses').then(setCourses).catch(e => setError(e.message));

  useEffect(() => { if (user) loadCourses(); }, [user]);
  useEffect(() => {
    if (selected?.slug) api(`/courses/${selected.slug}`).then(setSelected).catch(() => {});
  }, [selected?.slug]);
  useEffect(() => {
    if (user && user.role === 'admin') {
      if (tab === 'users') api('/admin/users').then(setUsers).catch(() => {});
      if (tab === 'earnings') api('/admin/earnings').then(setEarnings).catch(() => {});
    }
  }, [user, tab]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-success"></div></div>;
  if (!user) return <div className="alert alert-warning">Please login as admin.</div>;
  if (user.role !== 'admin') return <div className="alert alert-danger">Admin access only.</div>;

  const LANGS = [{ code: 'en', name: 'English' }, { code: 'ur', name: 'Urdu' }, { code: 'ru', name: 'Roman Urdu' }, { code: 'ar', name: 'Arabic' }, { code: 'hi', name: 'Hindi' }];

  return (
    <>
      <h2 className="fw-bold mb-1"><i className="bi bi-gear text-success me-2"></i>Admin Panel</h2>
      <p className="text-muted mb-3">Manage courses, lessons, quizzes, earnings and users.</p>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      {msg && <div className="alert alert-success py-2">{msg}</div>}

      <ul className="nav nav-pills mb-4">
        <li className="nav-item"><button className={`nav-link ${tab === 'courses' ? 'active bg-success' : ''}`} onClick={() => setTab('courses')}><i className="bi bi-book me-1"></i>Courses</button></li>
        <li className="nav-item"><button className={`nav-link ${tab === 'earnings' ? 'active bg-success' : ''}`} onClick={() => setTab('earnings')}><i className="bi bi-cash me-1"></i>Earnings</button></li>
        <li className="nav-item"><button className={`nav-link ${tab === 'users' ? 'active bg-success' : ''}`} onClick={() => setTab('users')}><i className="bi bi-people me-1"></i>Users</button></li>
      </ul>

      {tab === 'courses' && (
        <>
          <AddCourseForm langs={LANGS} onAdded={() => { loadCourses(); setMsg('Course added!'); setTimeout(() => setMsg(''), 2500); }} />
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card admin-section">
                <div className="card-header fw-semibold bg-success text-white"><i className="bi bi-list me-1"></i>All courses</div>
                <ul className="list-group list-group-flush">
                  {courses.map(c => (
                    <li className={`list-group-item d-flex justify-content-between align-items-center ${selected?.id === c.id ? 'bg-success bg-opacity-10' : ''}`} key={c.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(c)}>
                      <span>
                        <span className="d-inline-block rounded-circle me-2" style={{ width: 10, height: 10, background: c.color }}></span>
                        {c.title}
                        <small className="text-muted ms-1">{c.language}</small>
                      </span>
                      <button className="btn btn-outline-danger btn-sm py-0 px-2" onClick={e => { e.stopPropagation(); if (confirm('Delete this course?')) api(`/admin/courses/${c.id}`, { method: 'DELETE' }).then(() => { setSelected(null); loadCourses(); }); }}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-lg-8">
              {selected ? (
                <>
                  <div className="card admin-section mb-3">
                    <div className="card-body">
                      <h5 className="card-title">{selected.title}</h5>
                      <div className="mb-3"><label className="form-label fw-semibold">Description</label>
                        <textarea className="form-control" rows={2} value={selected.description} onChange={e => setSelected({ ...selected, description: e.target.value })} />
                      </div>
                      <div className="row g-2 mb-3">
                        <div className="col-md-4"><label className="form-label fw-semibold small">Language</label>
                          <select className="form-select form-select-sm" value={selected.language || 'en'} onChange={e => setSelected({ ...selected, language: e.target.value })}>
                            {LANGS.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                          </select>
                        </div>
                        <div className="col-md-4"><label className="form-label fw-semibold small">Price (0=free)</label>
                          <input type="number" className="form-control form-control-sm" value={selected.price ?? 0} onChange={e => setSelected({ ...selected, price: Number(e.target.value) })} step="0.01" />
                        </div>
                      </div>
                      <button className="btn btn-outline-success btn-sm" onClick={() => api(`/admin/courses/${selected.id}`, { method: 'PUT', body: JSON.stringify({ ...selected, price: Number(selected.price) }) }).then(loadSelected).then(() => setMsg('Saved!')).then(() => setTimeout(() => setMsg(''), 2000))}>
                        <i className="bi bi-check-lg me-1"></i>Save course
                      </button>
                    </div>
                  </div>

                  <AddTopicForm courseId={selected.id} onAdded={() => { loadSelected(); setMsg('Topic added!'); setTimeout(() => setMsg(''), 2000); }} />

                  <div className="card admin-section mt-3">
                    <div className="card-header fw-semibold">Topics, lessons &amp; quizzes</div>
                    <div className="card-body p-0">
                      {selected.topics.map(t => (
                        <div key={t.id}>
                          <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-light border-bottom">
                            <b className="small"><button className="btn btn-sm py-0" onClick={() => setExpanded(p => ({ ...p, [t.id]: !p[t.id] }))}><i className={`bi bi-chevron-${expanded[t.id] ? 'down' : 'right'}`}></i></button>{t.title}</b>
                            <span className="d-flex gap-1">
                              <AddLessonButton topicId={t.id} onAdded={loadSelected} />
                              <AddQuizButton topicId={t.id} onAdded={loadSelected} />
                            </span>
                          </div>
                          {expanded[t.id] && (
                            <div className="px-4 py-2">
                              {t.lessons.map(l => <LessonEditor key={l.id} lesson={l} onSaved={() => { loadSelected(); setMsg('Lesson saved!'); setTimeout(() => setMsg(''), 2000); }} onDeleted={loadSelected} />)}
                              {t.quizzes.map(q => <QuizEditor key={q.id} quiz={q} onChanged={loadSelected} />)}
                              {t.lessons.length === 0 && t.quizzes.length === 0 && <p className="text-muted small">No content yet.</p>}
                            </div>
                          )}
                        </div>
                      ))}
                      {selected.topics.length === 0 && <p className="text-muted p-3">No topics yet.</p>}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-5 text-muted"><i className="bi bi-arrow-left display-4 d-block mb-2"></i>Select a course to manage it.</div>
              )}
            </div>
          </div>
        </>
      )}

      {tab === 'earnings' && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-6"><div className="card stat-card"><div className="card-body"><div className="stat-num">${earnings?.total?.toFixed(2) ?? '0.00'}</div><div className="stat-lbl">Total earnings</div></div></div></div>
            <div className="col-6"><div className="card stat-card"><div className="card-body"><div className="stat-num">{earnings?.sales ?? 0}</div><div className="stat-lbl">Sales</div></div></div></div>
          </div>
          <div className="card admin-section">
            <div className="card-header fw-semibold">Recent sales</div>
            <div className="card-body">
              {earnings?.recent?.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light"><tr><th>Student</th><th>Course</th><th>Amount</th><th>Date</th></tr></thead>
                    <tbody>
                      {earnings.recent.map((e, i) => (
                        <tr key={i}>
                          <td>{e.name} <small className="text-muted">{e.email}</small></td>
                          <td>{e.title}</td>
                          <td className="fw-bold">${Number(e.price_paid).toFixed(2)}</td>
                          <td>{e.created_at}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p className="text-muted mb-0">No sales yet. Connect Stripe to start earning!</p>}
            </div>
          </div>
        </>
      )}

      {tab === 'users' && (
        <div className="card admin-section">
          <div className="card-header fw-semibold">Users ({users.length})</div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light"><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td><td>{u.email}</td>
                      <td>{u.role === 'admin' ? <span className="badge bg-success">admin</span> : <span className="badge bg-secondary">student</span>}</td>
                      <td>{u.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AddCourseForm({ langs, onAdded }) {
  const [f, setF] = useState({ title: '', slug: '', description: '', icon: 'code', color: '#04aa6d', price: 0, language: 'en' });
  const [open, setOpen] = useState(false);
  return (
    <div className="card admin-section mb-3">
      <div className="card-body">
        {!open ? (
          <button className="btn btn-success btn-sm" onClick={() => setOpen(true)}><i className="bi bi-plus-lg me-1"></i>New course</button>
        ) : (
          <>
            <h5>New course</h5>
            <div className="row g-2 mb-2">
              <div className="col-md-4"><label className="form-label small">Title</label>
                <input className="form-control form-control-sm" value={f.title} onChange={e => setF({ ...f, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} />
              </div>
              <div className="col-md-4"><label className="form-label small">Slug</label><input className="form-control form-control-sm" value={f.slug} onChange={e => setF({ ...f, slug: e.target.value })} /></div>
              <div className="col-md-4"><label className="form-label small">Language</label>
                <select className="form-select form-select-sm" value={f.language} onChange={e => setF({ ...f, language: e.target.value })}>
                  {langs.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                </select>
              </div>
            </div>
            <div className="row g-2 mb-2">
              <div className="col-md-6"><label className="form-label small">Description</label><textarea className="form-control form-control-sm" rows={1} value={f.description} onChange={e => setF({ ...f, description: e.target.value })} /></div>
              <div className="col-md-3"><label className="form-label small">Price</label><input type="number" className="form-control form-control-sm" value={f.price} onChange={e => setF({ ...f, price: e.target.value })} step="0.01" /></div>
              <div className="col-md-3"><label className="form-label small">Color</label><input type="color" className="form-control form-control-sm form-control-color" value={f.color} onChange={e => setF({ ...f, color: e.target.value })} /></div>
            </div>
            <button className="btn btn-success btn-sm me-2" onClick={() => api('/admin/courses', { method: 'POST', body: JSON.stringify({ ...f, price: Number(f.price) }) }).then(() => { setF({ title: '', slug: '', description: '', icon: 'code', color: '#04aa6d', price: 0, language: 'en' }); setOpen(false); onAdded(); })}>Create</button>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setOpen(false)}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}

function AddTopicForm({ courseId, onAdded }) {
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);
  return (
    <div className="card admin-section">
      <div className="card-body">
        {!open ? (
          <button className="btn btn-outline-success btn-sm" onClick={() => setOpen(true)}><i className="bi bi-plus-lg me-1"></i>Add topic</button>
        ) : (
          <div className="d-flex gap-2">
            <input className="form-control form-control-sm" placeholder="Topic title" value={title} onChange={e => setTitle(e.target.value)} />
            <button className="btn btn-success btn-sm" onClick={() => api(`/admin/courses/${courseId}/topics`, { method: 'POST', body: JSON.stringify({ title }) }).then(() => { setTitle(''); setOpen(false); onAdded(); })}>Add</button>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setOpen(false)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

function AddLessonButton({ topicId, onAdded }) {
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);
  return !open ? (
    <button className="btn btn-outline-success btn-sm py-0" onClick={() => setOpen(true)}><i className="bi bi-plus"></i></button>
  ) : (
    <span className="d-flex gap-1">
      <input className="form-control form-control-sm" style={{ width: 120 }} placeholder="Lesson" value={title} onChange={e => setTitle(e.target.value)} />
      <button className="btn btn-success btn-sm py-0" onClick={() => api(`/admin/topics/${topicId}/lessons`, { method: 'POST', body: JSON.stringify({ title }) }).then(() => { setTitle(''); setOpen(false); onAdded(); })}>+</button>
      <button className="btn btn-outline-secondary btn-sm py-0" onClick={() => setOpen(false)}>x</button>
    </span>
  );
}

function AddQuizButton({ topicId, onAdded }) {
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);
  return !open ? (
    <button className="btn btn-outline-success btn-sm py-0" onClick={() => setOpen(true)}><i className="bi bi-clipboard"></i></button>
  ) : (
    <span className="d-flex gap-1">
      <input className="form-control form-control-sm" style={{ width: 110 }} placeholder="Quiz" value={title} onChange={e => setTitle(e.target.value)} />
      <button className="btn btn-success btn-sm py-0" onClick={() => api(`/admin/topics/${topicId}/quizzes`, { method: 'POST', body: JSON.stringify({ title }) }).then(() => { setTitle(''); setOpen(false); onAdded(); })}>+</button>
      <button className="btn btn-outline-secondary btn-sm py-0" onClick={() => setOpen(false)}>x</button>
    </span>
  );
}

function LessonEditor({ lesson, onSaved, onDeleted }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(null);
  useEffect(() => { setF({ title: lesson.title, content: lesson.content, code: lesson.code, video_url: lesson.video_url }); }, [lesson, open]);
  if (!f) return null;
  return open ? (
    <div className="card card-body mb-2">
      <input className="form-control form-control-sm mb-2" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} />
      <label className="form-label small fw-semibold">Markdown</label>
      <textarea className="form-control form-control-sm mb-2 font-monospace" rows={5} value={f.content} onChange={e => setF({ ...f, content: e.target.value })} />
      <label className="form-label small fw-semibold">Code</label>
      <textarea className="form-control form-control-sm mb-2 font-monospace" rows={2} value={f.code} onChange={e => setF({ ...f, code: e.target.value })} />
      <label className="form-label small fw-semibold">Video URL</label>
      <input className="form-control form-control-sm mb-2" value={f.video_url} onChange={e => setF({ ...f, video_url: e.target.value })} />
      <div className="d-flex gap-1">
        <button className="btn btn-success btn-sm" onClick={() => api(`/admin/lessons/${lesson.id}`, { method: 'PUT', body: JSON.stringify(f) }).then(() => { setOpen(false); onSaved(); })}>Save</button>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => setOpen(false)}>Close</button>
      </div>
    </div>
  ) : (
    <div className="d-flex justify-content-between align-items-center py-1 border-bottom">
      <span className="small"><i className="bi bi-file-earmark-text me-1"></i>{lesson.title}</span>
      <span className="d-flex gap-1">
        <button className="btn btn-outline-success btn-sm py-0" onClick={() => setOpen(true)}><i className="bi bi-pencil"></i></button>
        <button className="btn btn-outline-danger btn-sm py-0" onClick={() => { if (confirm('Delete?')) api(`/admin/lessons/${lesson.id}`, { method: 'DELETE' }).then(onDeleted); }}><i className="bi bi-trash"></i></button>
      </span>
    </div>
  );
}

function QuizEditor({ quiz, onChanged }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState({ question: '', options: ['', '', '', ''], correct_index: 0, explanation: '' });
  return (
    <div className="mb-2">
      <div className="d-flex justify-content-between align-items-center py-1 border-bottom">
        <span className="small"><i className="bi bi-clipboard-check me-1 text-success"></i>{quiz.title} <span className="text-muted">({quiz.questions?.length || 0})</span></span>
        <button className="btn btn-outline-success btn-sm py-0" onClick={() => setOpen(!open)}><i className="bi bi-plus"></i></button>
      </div>
      {open && (
        <div className="card card-body mt-1">
          <input className="form-control form-control-sm mb-2" placeholder="Question" value={q.question} onChange={e => setQ({ ...q, question: e.target.value })} />
          {q.options.map((opt, i) => (
            <div className="input-group input-group-sm mb-1" key={i}>
              <div className="input-group-text"><input type="radio" checked={q.correct_index === i} onChange={() => setQ({ ...q, correct_index: i })} name={`quiz_${quiz.id}`} /></div>
              <input className="form-control" placeholder={`Option ${i + 1}`} value={opt} onChange={e => { const opts = [...q.options]; opts[i] = e.target.value; setQ({ ...q, options: opts }); }} />
            </div>
          ))}
          <input className="form-control form-control-sm mb-2" placeholder="Explanation" value={q.explanation} onChange={e => setQ({ ...q, explanation: e.target.value })} />
          <button className="btn btn-success btn-sm" onClick={() => {
            if (!q.question || q.options.some(o => !o.trim())) return;
            api(`/admin/quizzes/${quiz.id}/questions`, { method: 'POST', body: JSON.stringify({ ...q, options: q.options.filter(o => o.trim()) }) }).then(() => { setQ({ question: '', options: ['', '', '', ''], correct_index: 0, explanation: '' }); onChanged(); });
          }}><i className="bi bi-plus me-1"></i>Add question</button>
          {quiz.questions?.map(qq => (
            <div key={qq.id} className="d-flex justify-content-between align-items-center py-1 border-bottom small">
              <span className="text-truncate" style={{ maxWidth: '80%' }}>{qq.question}</span>
              <button className="btn btn-outline-danger btn-sm py-0" onClick={() => api(`/admin/questions/${qq.id}`, { method: 'DELETE' }).then(onChanged)}><i className="bi bi-trash"></i></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
