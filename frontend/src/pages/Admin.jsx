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
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const loadCourses = () => api('/courses').then(setCourses).catch(e => setError(e.message));
  const loadSelected = () => { if (selected?.slug) api(`/courses/${selected.slug}`).then(setSelected).catch(() => {}); };
  const loadReviews = () => api('/admin/reviews').then(setReviews).catch(() => {});

  useEffect(() => { if (user) { loadCourses(); loadReviews(); } }, [user]);
  useEffect(() => { loadSelected(); }, [selected?.slug]);
  useEffect(() => {
    if (user && user.role === 'admin') {
      if (tab === 'users') api('/admin/users').then(setUsers).catch(() => {});
      if (tab === 'earnings') api('/admin/earnings').then(setEarnings).catch(() => {});
      if (tab === 'reviews') loadReviews();
    }
  }, [user, tab]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-success"></div></div>;
  if (!user) return <div className="alert alert-warning">Please login as admin.</div>;
  if (user.role !== 'admin') return <div className="alert alert-danger">Admin access only.</div>;

  const LANGS = [{ code: 'en', name: 'English' }, { code: 'ur', name: 'Urdu' }, { code: 'ru', name: 'Roman Urdu' }, { code: 'ar', name: 'Arabic' }, { code: 'hi', name: 'Hindi' }];

  const tabStyle = (active) => ({ background: active ? 'var(--lh-primary)' : 'var(--lh-bg-card)', color: active ? 'white' : 'var(--lh-text-muted)', border: '1px solid var(--lh-border)', borderRadius: 10, padding: '8px 16px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' });

  return (
    <>
      <h2 className="fw-bold mb-1"><i className="bi bi-gear text-success me-2"></i>Admin Panel</h2>
      <p className="text-muted mb-3">Manage courses, lessons, quizzes, reviews, earnings and users.</p>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      {msg && <div className="alert alert-success py-2">{msg}</div>}

      <div className="d-flex gap-2 flex-wrap mb-4">
        <button style={tabStyle(tab === 'courses')} onClick={() => setTab('courses')}><i className="bi bi-book me-1"></i>Courses</button>
        <button style={tabStyle(tab === 'reviews')} onClick={() => setTab('reviews')}><i className="bi bi-star me-1"></i>Reviews</button>
        <button style={tabStyle(tab === 'earnings')} onClick={() => setTab('earnings')}><i className="bi bi-cash me-1"></i>Earnings</button>
        <button style={tabStyle(tab === 'users')} onClick={() => setTab('users')}><i className="bi bi-people me-1"></i>Users</button>
      </div>

      {tab === 'courses' && (
        <>
          <AddCourseForm langs={LANGS} onAdded={() => { loadCourses(); setMsg('Course added!'); setTimeout(() => setMsg(''), 2500); }} />
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: '0 0 280px', maxWidth: '100%' }}>
              <div style={{ background: 'var(--lh-bg-card)', border: '1px solid var(--lh-border)', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--lh-border)', fontWeight: 700, fontSize: '0.9rem' }}><i className="bi bi-list me-1 text-success"></i>All courses</div>
                <div style={{ maxHeight: 500, overflowY: 'auto' }}>
                  {courses.map(c => (
                    <div key={c.id} onClick={() => setSelected(c)} style={{ padding: '10px 16px', borderBottom: '1px solid var(--lh-border)', cursor: 'pointer', background: selected?.id === c.id ? 'rgba(25,135,84,0.1)' : 'transparent', transition: 'background 0.15s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, display: 'inline-block', marginRight: 8 }}></span>{c.title}</span>
                      <button style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#f87171', padding: '2px 6px', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); if (confirm('Delete this course?')) api(`/admin/courses/${c.id}`, { method: 'DELETE' }).then(() => { setSelected(null); loadCourses(); }); }}><i className="bi bi-trash"></i></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ flex: '1 1 400px', minWidth: 0 }}>
              {selected ? (
                <>
                  <div style={{ background: 'var(--lh-bg-card)', border: '1px solid var(--lh-border)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                    <h5 style={{ fontWeight: 700, marginBottom: 16 }}>{selected.title}</h5>
                    <div className="mb-3"><label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>Description</label>
                      <textarea className="form-control" rows={2} value={selected.description} onChange={e => setSelected({ ...selected, description: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      <div><label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>Language</label>
                        <select className="form-select form-select-sm" value={selected.language || 'en'} onChange={e => setSelected({ ...selected, language: e.target.value })}>{LANGS.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}</select>
                      </div>
                      <div><label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>Price (0=free)</label>
                        <input type="number" className="form-control form-control-sm" value={selected.price ?? 0} onChange={e => setSelected({ ...selected, price: Number(e.target.value) })} step="0.01" style={{ width: 100 }} />
                      </div>
                    </div>
                    <button className="btn btn-success btn-sm mt-3 rounded-pill px-3" onClick={() => api(`/admin/courses/${selected.id}`, { method: 'PUT', body: JSON.stringify({ ...selected, price: Number(selected.price) }) }).then(loadSelected).then(() => setMsg('Saved!')).then(() => setTimeout(() => setMsg(''), 2000))}><i className="bi bi-check-lg me-1"></i>Save</button>
                  </div>
                  <AddTopicForm courseId={selected.id} onAdded={() => { loadSelected(); setMsg('Topic added!'); setTimeout(() => setMsg(''), 2000); }} />
                  <div style={{ background: 'var(--lh-bg-card)', border: '1px solid var(--lh-border)', borderRadius: 12, marginTop: 16, overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--lh-border)', fontWeight: 700, fontSize: '0.9rem' }}>Topics & Content</div>
                    {selected.topics.map(t => (
                      <div key={t.id} style={{ borderBottom: '1px solid var(--lh-border)' }}>
                        <div style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 600 }}><button style={{ background: 'none', border: 'none', color: 'var(--lh-text)', cursor: 'pointer', marginRight: 6 }} onClick={() => setExpanded(p => ({ ...p, [t.id]: !p[t.id] }))}><i className={`bi bi-chevron-${expanded[t.id] ? 'down' : 'right'}`}></i></button>{t.title}</span>
                          <span className="d-flex gap-1">
                            <AddLessonButton topicId={t.id} onAdded={loadSelected} />
                            <AddQuizButton topicId={t.id} onAdded={loadSelected} />
                          </span>
                        </div>
                        {expanded[t.id] && (
                          <div style={{ padding: '8px 16px 16px 32px' }}>
                            {t.lessons.map(l => <LessonEditor key={l.id} lesson={l} onSaved={() => { loadSelected(); setMsg('Lesson saved!'); setTimeout(() => setMsg(''), 2000); }} onDeleted={loadSelected} />)}
                            {t.quizzes.map(q => <QuizEditor key={q.id} quiz={q} onChanged={loadSelected} />)}
                            {t.lessons.length === 0 && t.quizzes.length === 0 && <p style={{ color: 'var(--lh-text-dim)', fontSize: '0.82rem' }}>No content yet.</p>}
                          </div>
                        )}
                      </div>
                    ))}
                    {selected.topics.length === 0 && <p style={{ color: 'var(--lh-text-dim)', padding: 16, fontSize: '0.85rem' }}>No topics yet.</p>}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: 48, color: 'var(--lh-text-dim)' }}><i className="bi bi-arrow-left d-block mb-2" style={{ fontSize: '2rem' }}></i>Select a course to manage it.</div>
              )}
            </div>
          </div>
        </>
      )}

      {tab === 'reviews' && (
        <div style={{ background: 'var(--lh-bg-card)', border: '1px solid var(--lh-border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--lh-border)', fontWeight: 700 }}>Reviews ({reviews.length})</div>
          {reviews.length === 0 ? (
            <p style={{ color: 'var(--lh-text-dim)', padding: 24, textAlign: 'center', fontSize: '0.88rem' }}>No reviews yet.</p>
          ) : (
            <div style={{ maxHeight: 600, overflowY: 'auto' }}>
              {reviews.map(r => (
                <div key={r.id} style={{ padding: '14px 16px', borderBottom: '1px solid var(--lh-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ color: '#fbbf24', fontSize: '0.85rem' }}>{Array.from({ length: 5 }, (_, i) => <i key={i} className={`bi bi-star${i < r.rating ? '-fill' : ''}`}></i>)}</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{r.user_name}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--lh-text-dim)' }}>{r.user_email}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--lh-text-muted)', marginBottom: 2 }}>{r.comment || '(no comment)'}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--lh-text-dim)' }}>on <b>{r.course_title}</b> &middot; {r.created_at}</div>
                  </div>
                  <button style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#f87171', padding: '4px 8px', borderRadius: 6, cursor: 'pointer', fontSize: '0.75rem' }} onClick={() => { if (confirm('Delete review?')) api(`/admin/reviews/${r.id}`, { method: 'DELETE' }).then(loadReviews); }}><i className="bi bi-trash"></i></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'earnings' && (
        <>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, background: 'var(--lh-bg-card)', border: '1px solid var(--lh-border)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4ade80' }}>${earnings?.total?.toFixed(2) ?? '0.00'}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--lh-text-dim)' }}>Total Earnings</div>
            </div>
            <div style={{ flex: 1, background: 'var(--lh-bg-card)', border: '1px solid var(--lh-border)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#60a5fa' }}>{earnings?.sales ?? 0}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--lh-text-dim)' }}>Total Sales</div>
            </div>
          </div>
          <div style={{ background: 'var(--lh-bg-card)', border: '1px solid var(--lh-border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--lh-border)', fontWeight: 700 }}>Recent Sales</div>
            {earnings?.recent?.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead><tr><th>Student</th><th>Course</th><th>Amount</th><th>Date</th></tr></thead>
                  <tbody>{earnings.recent.map((e, i) => <tr key={i}><td>{e.name} <small className="text-muted">{e.email}</small></td><td>{e.title}</td><td style={{ color: '#4ade80', fontWeight: 700 }}>${Number(e.price_paid).toFixed(2)}</td><td style={{ color: 'var(--lh-text-dim)' }}>{e.created_at}</td></tr>)}</tbody>
                </table>
              </div>
            ) : <p style={{ color: 'var(--lh-text-dim)', padding: 24, textAlign: 'center', fontSize: '0.88rem' }}>No sales yet.</p>}
          </div>
        </>
      )}

      {tab === 'users' && (
        <div style={{ background: 'var(--lh-bg-card)', border: '1px solid var(--lh-border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--lh-border)', fontWeight: 700 }}>Users ({users.length})</div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
              <tbody>{users.map(u => <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.role === 'admin' ? <span style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', padding: '3px 10px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600 }}>admin</span> : <span style={{ background: 'rgba(136,136,160,0.12)', color: 'var(--lh-text-muted)', padding: '3px 10px', borderRadius: 6, fontSize: '0.75rem' }}>student</span>}</td><td style={{ color: 'var(--lh-text-dim)', fontSize: '0.82rem' }}>{u.created_at}</td></tr>)}</tbody>
            </table>
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
    <div style={{ background: 'var(--lh-bg-card)', border: '1px solid var(--lh-border)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
      {!open ? (
        <button className="btn btn-success btn-sm rounded-pill" onClick={() => setOpen(true)}><i className="bi bi-plus-lg me-1"></i>New course</button>
      ) : (
        <>
          <h5 style={{ fontWeight: 700, marginBottom: 12 }}>New Course</h5>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <input className="form-control form-control-sm" style={{ flex: 1, minWidth: 150 }} placeholder="Title" value={f.title} onChange={e => setF({ ...f, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} />
            <input className="form-control form-control-sm" style={{ flex: 1, minWidth: 120 }} placeholder="Slug" value={f.slug} onChange={e => setF({ ...f, slug: e.target.value })} />
            <select className="form-select form-select-sm" style={{ width: 120 }} value={f.language} onChange={e => setF({ ...f, language: e.target.value })}>{langs.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}</select>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <textarea className="form-control form-control-sm" rows={1} style={{ flex: 2 }} placeholder="Description" value={f.description} onChange={e => setF({ ...f, description: e.target.value })} />
            <input type="number" className="form-control form-control-sm" style={{ flex: 1, minWidth: 80 }} placeholder="Price" value={f.price} onChange={e => setF({ ...f, price: e.target.value })} step="0.01" />
            <input type="color" className="form-control form-control-sm form-control-color" value={f.color} onChange={e => setF({ ...f, color: e.target.value })} />
          </div>
          <button className="btn btn-success btn-sm rounded-pill me-2" onClick={() => api('/admin/courses', { method: 'POST', body: JSON.stringify({ ...f, price: Number(f.price) }) }).then(() => { setF({ title: '', slug: '', description: '', icon: 'code', color: '#04aa6d', price: 0, language: 'en' }); setOpen(false); onAdded(); })}>Create</button>
          <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--lh-text-muted)', border: '1px solid var(--lh-border)' }} onClick={() => setOpen(false)}>Cancel</button>
        </>
      )}
    </div>
  );
}

function AddTopicForm({ courseId, onAdded }) {
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: 'var(--lh-bg-card)', border: '1px solid var(--lh-border)', borderRadius: 12, padding: 12, marginBottom: 16 }}>
      {!open ? (
        <button className="btn btn-sm" style={{ background: 'rgba(25,135,84,0.12)', color: 'var(--lh-accent)', border: '1px solid var(--lh-border)' }} onClick={() => setOpen(true)}><i className="bi bi-plus-lg me-1"></i>Add topic</button>
      ) : (
        <div className="d-flex gap-2">
          <input className="form-control form-control-sm" placeholder="Topic title" value={title} onChange={e => setTitle(e.target.value)} />
          <button className="btn btn-success btn-sm rounded-pill px-3" onClick={() => api(`/admin/courses/${courseId}/topics`, { method: 'POST', body: JSON.stringify({ title }) }).then(() => { setTitle(''); setOpen(false); onAdded(); })}>Add</button>
          <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--lh-text-muted)', border: '1px solid var(--lh-border)' }} onClick={() => setOpen(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

function AddLessonButton({ topicId, onAdded }) {
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);
  return !open ? (
    <button style={{ background: 'rgba(25,135,84,0.12)', border: 'none', color: 'var(--lh-accent)', padding: '2px 8px', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer' }} onClick={() => setOpen(true)}><i className="bi bi-plus"></i> Lesson</button>
  ) : (
    <span className="d-flex gap-1">
      <input className="form-control form-control-sm" style={{ width: 120, fontSize: '0.78rem' }} placeholder="Lesson" value={title} onChange={e => setTitle(e.target.value)} />
      <button style={{ background: 'var(--lh-primary)', border: 'none', color: 'white', padding: '2px 8px', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer' }} onClick={() => api(`/admin/topics/${topicId}/lessons`, { method: 'POST', body: JSON.stringify({ title }) }).then(() => { setTitle(''); setOpen(false); onAdded(); })}>+</button>
      <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--lh-border)', color: 'var(--lh-text-dim)', padding: '2px 6px', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer' }} onClick={() => setOpen(false)}>x</button>
    </span>
  );
}

function AddQuizButton({ topicId, onAdded }) {
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);
  return !open ? (
    <button style={{ background: 'rgba(251,191,36,0.12)', border: 'none', color: '#fbbf24', padding: '2px 8px', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer' }} onClick={() => setOpen(true)}><i className="bi bi-clipboard"></i> Quiz</button>
  ) : (
    <span className="d-flex gap-1">
      <input className="form-control form-control-sm" style={{ width: 110, fontSize: '0.78rem' }} placeholder="Quiz" value={title} onChange={e => setTitle(e.target.value)} />
      <button style={{ background: 'var(--lh-primary)', border: 'none', color: 'white', padding: '2px 8px', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer' }} onClick={() => api(`/admin/topics/${topicId}/quizzes`, { method: 'POST', body: JSON.stringify({ title }) }).then(() => { setTitle(''); setOpen(false); onAdded(); })}>+</button>
      <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--lh-border)', color: 'var(--lh-text-dim)', padding: '2px 6px', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer' }} onClick={() => setOpen(false)}>x</button>
    </span>
  );
}

function LessonEditor({ lesson, onSaved, onDeleted }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(null);
  useEffect(() => { setF({ title: lesson.title, content: lesson.content, code: lesson.code, video_url: lesson.video_url }); }, [lesson, open]);
  if (!f) return null;
  return open ? (
    <div style={{ background: 'var(--lh-bg-input)', border: '1px solid var(--lh-border)', borderRadius: 8, padding: 12, marginBottom: 8 }}>
      <input className="form-control form-control-sm mb-2" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} />
      <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--lh-text-muted)' }}>Markdown Content</label>
      <textarea className="form-control form-control-sm mb-2 font-monospace" rows={5} value={f.content} onChange={e => setF({ ...f, content: e.target.value })} style={{ fontSize: '0.8rem' }} />
      <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--lh-text-muted)' }}>Code Example</label>
      <textarea className="form-control form-control-sm mb-2 font-monospace" rows={2} value={f.code} onChange={e => setF({ ...f, code: e.target.value })} style={{ fontSize: '0.8rem' }} />
      <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--lh-text-muted)' }}>Video URL</label>
      <input className="form-control form-control-sm mb-2" value={f.video_url} onChange={e => setF({ ...f, video_url: e.target.value })} />
      <div className="d-flex gap-1">
        <button className="btn btn-success btn-sm rounded-pill px-3" onClick={() => api(`/admin/lessons/${lesson.id}`, { method: 'PUT', body: JSON.stringify(f) }).then(() => { setOpen(false); onSaved(); })}>Save</button>
        <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--lh-text-muted)', border: '1px solid var(--lh-border)' }} onClick={() => setOpen(false)}>Close</button>
      </div>
    </div>
  ) : (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
      <span style={{ fontSize: '0.82rem', color: 'var(--lh-text-muted)' }}><i className="bi bi-file-earmark-text me-1 text-success"></i>{lesson.title}</span>
      <div className="d-flex gap-1">
        <button style={{ background: 'rgba(25,135,84,0.12)', border: 'none', color: 'var(--lh-accent)', padding: '2px 6px', borderRadius: 6, fontSize: '0.72rem', cursor: 'pointer' }} onClick={() => setOpen(true)}><i className="bi bi-pencil"></i></button>
        <button style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#f87171', padding: '2px 6px', borderRadius: 6, fontSize: '0.72rem', cursor: 'pointer' }} onClick={() => { if (confirm('Delete?')) api(`/admin/lessons/${lesson.id}`, { method: 'DELETE' }).then(onDeleted); }}><i className="bi bi-trash"></i></button>
      </div>
    </div>
  );
}

function QuizEditor({ quiz, onChanged }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState({ question: '', options: ['', '', '', ''], correct_index: 0, explanation: '' });
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <span style={{ fontSize: '0.82rem', color: '#fbbf24' }}><i className="bi bi-clipboard-check me-1"></i>{quiz.title} <span style={{ color: 'var(--lh-text-dim)' }}>({quiz.questions?.length || 0})</span></span>
        <button style={{ background: 'rgba(251,191,36,0.12)', border: 'none', color: '#fbbf24', padding: '2px 6px', borderRadius: 6, fontSize: '0.72rem', cursor: 'pointer' }} onClick={() => setOpen(!open)}><i className="bi bi-plus"></i></button>
      </div>
      {open && (
        <div style={{ background: 'var(--lh-bg-input)', border: '1px solid var(--lh-border)', borderRadius: 8, padding: 12, marginTop: 8 }}>
          <input className="form-control form-control-sm mb-2" placeholder="Question" value={q.question} onChange={e => setQ({ ...q, question: e.target.value })} />
          {q.options.map((opt, i) => (
            <div className="input-group input-group-sm mb-1" key={i}>
              <div className="input-group-text"><input type="radio" checked={q.correct_index === i} onChange={() => setQ({ ...q, correct_index: i })} name={`quiz_${quiz.id}`} /></div>
              <input className="form-control" placeholder={`Option ${i + 1}`} value={opt} onChange={e => { const opts = [...q.options]; opts[i] = e.target.value; setQ({ ...q, options: opts }); }} />
            </div>
          ))}
          <input className="form-control form-control-sm mb-2" placeholder="Explanation" value={q.explanation} onChange={e => setQ({ ...q, explanation: e.target.value })} />
          <button className="btn btn-success btn-sm rounded-pill px-3" onClick={() => {
            if (!q.question || q.options.some(o => !o.trim())) return;
            api(`/admin/quizzes/${quiz.id}/questions`, { method: 'POST', body: JSON.stringify({ ...q, options: q.options.filter(o => o.trim()) }) }).then(() => { setQ({ question: '', options: ['', '', '', ''], correct_index: 0, explanation: '' }); onChanged(); });
          }}><i className="bi bi-plus me-1"></i>Add question</button>
          {quiz.questions?.map(qq => (
            <div key={qq.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--lh-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>{qq.question}</span>
              <button style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#f87171', padding: '2px 6px', borderRadius: 6, fontSize: '0.72rem', cursor: 'pointer', flexShrink: 0 }} onClick={() => api(`/admin/questions/${qq.id}`, { method: 'DELETE' }).then(onChanged)}><i className="bi bi-trash"></i></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
