import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, formatPrice } from '../api';
import { useAuth } from '../AuthContext';

export default function PurchaseGate({ course, onPurchased }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function buy() {
    if (!user) { navigate('/login'); return; }
    navigate(`/payment/${course.slug}`);
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body text-center py-5">
        <i className="bi bi-lock-fill display-1 text-warning"></i>
        <h3 className="fw-bold mt-3">Premium Course</h3>
        <p className="text-muted mx-auto" style={{ maxWidth: 400 }}>
          Unlock <b>{course.title}</b> and get lifetime access to all lessons, videos and quizzes.
        </p>
        <div className="display-5 fw-bold text-dark my-3">
          {formatPrice(course.price)}
          <small className="text-muted fw-normal fs-6"> / lifetime</small>
        </div>
        {error && <div className="alert alert-danger mx-auto" style={{ maxWidth: 400 }}>{error}</div>}
        <button className="btn btn-success btn-lg px-4" onClick={buy} disabled={busy}>
          {busy ? <><span className="spinner-border spinner-border-sm me-1"></span>Opening checkout...</> : <><i className="bi bi-cart3 me-1"></i>Buy now</>}
        </button>
        <p className="text-muted small mt-3"><i className="bi bi-shield-lock me-1"></i>Secure payment via Stripe</p>
      </div>
    </div>
  );
}

export function PurchaseSuccess() {
  return (
    <div className="alert alert-success d-flex align-items-center mb-4 py-3">
      <i className="bi bi-check-circle-fill fs-3 me-3"></i>
      <div>
        <h5 className="mb-0">Thank you for your purchase!</h5>
        <small>Your course is now unlocked. Happy learning!</small>
      </div>
    </div>
  );
}
