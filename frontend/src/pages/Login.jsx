import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, setToken } from '../api';
import { useAuth } from '../AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await api('/auth/login', { method: 'POST', body: { email, password } });
      setToken(data.token);
      login(data.user);
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="text-center mb-4">
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #198754, #20c997)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <i className="bi bi-mortarboard-fill text-white" style={{ fontSize: '1.5rem' }}></i>
          </div>
          <h3 className="fw-bold mb-1">Welcome Back</h3>
          <p style={{ color: 'var(--lh-text-muted)', fontSize: '0.9rem' }}>Login to continue learning</p>
        </div>

        {error && <div className="alert alert-danger"><i className="bi bi-exclamation-triangle me-2"></i>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-success w-100 py-2 fw-semibold rounded-pill" disabled={busy}>
            {busy ? <><span className="spinner-border spinner-border-sm me-2"></span>Logging in...</> : <><i className="bi bi-box-arrow-in-right me-2"></i>Login</>}
          </button>
        </form>

        <div className="text-center mt-4">
          <span style={{ color: 'var(--lh-text-muted)', fontSize: '0.88rem' }}>
            Don't have an account?{' '}
            <Link to="/register" className="fw-semibold">Sign Up</Link>
          </span>
        </div>

        <div className="text-center mt-3">
          <small style={{ color: 'var(--lh-text-dim)' }}>
            <i className="bi bi-info-circle me-1"></i>Demo: admin@learnhub.com / admin123
          </small>
        </div>
      </div>
    </div>
  );
}
