import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try { await login(email, password); navigate('/'); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return (
    <div className="auth-container">
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h3 className="fw-bold mb-1"><i className="bi bi-box-arrow-in-right text-success me-2"></i>Welcome back</h3>
          <p className="text-muted mb-4">Login to continue your learning journey.</p>
          {error && <div className="alert alert-danger py-2"><i className="bi bi-exclamation-circle me-1"></i>{error}</div>}
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" required />
            </div>
            <button className="btn btn-success w-100" type="submit" disabled={busy}>
              {busy ? <><span className="spinner-border spinner-border-sm me-1"></span>Logging in...</> : 'Login'}
            </button>
          </form>
          <div className="text-center mt-3">
            <small className="text-muted">No account? <Link to="/register" className="text-success fw-semibold">Create one free</Link></small>
          </div>
          <div className="text-center mt-2">
            <small className="text-muted">Demo: student@learnhub.com / student123</small>
          </div>
        </div>
      </div>
    </div>
  );
}
