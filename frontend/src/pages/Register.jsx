import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError(''); setInfo('');
    try {
      const user = await register(name, email, password, adminKey || undefined);
      if (user.role === 'admin') setInfo('Admin account created!');
      setTimeout(() => navigate('/'), 600);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return (
    <div className="auth-container">
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h3 className="fw-bold mb-1"><i className="bi bi-person-plus text-success me-2"></i>Create account</h3>
          <p className="text-muted mb-4">Join LearnHub and start learning to code for free.</p>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          {info && <div className="alert alert-success py-2">{info}</div>}
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Full name</label>
              <input className="form-control" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Admin key <small className="text-muted">(optional)</small></label>
              <input className="form-control" value={adminKey} onChange={e => setAdminKey(e.target.value)} placeholder="Leave empty for student" />
            </div>
            <button className="btn btn-success w-100" type="submit" disabled={busy}>
              {busy ? <><span className="spinner-border spinner-border-sm me-1"></span>Creating...</> : 'Create account'}
            </button>
          </form>
          <div className="text-center mt-3">
            <small className="text-muted">Already have an account? <Link to="/login" className="text-success fw-semibold">Login</Link></small>
          </div>
        </div>
      </div>
    </div>
  );
}
