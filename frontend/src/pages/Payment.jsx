import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, formatPrice } from '../api';
import { useAuth } from '../AuthContext';

const PROMOS = {
  LEARN20: { discount: 0.2, description: '20% off' },
  WELCOME10: { discount: 0.1, description: '10% off' },
  STUDENT50: { discount: 0.5, description: '50% off - Student Discount' }
};

export default function Payment() {
  const { courseId } = useParams();
  const courseSlug = courseId;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [method, setMethod] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [promoResult, setPromoResult] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    api(`/courses/${courseSlug}`)
      .then(c => { setCourse(c); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [courseSlug, user, navigate]);

  const discount = promoResult ? promoResult.discount : 0;
  const displayPrice = course ? course.price : 0;
  const finalPrice = promoResult ? promoResult.finalPrice : displayPrice;

  function formatCardNumber(val) {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  function formatExpiry(val) {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  }

  async function handleApplyPromo() {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    setPromoResult(null);
    try {
      const result = await api('/promo/validate', {
        method: 'POST',
        body: JSON.stringify({ code: promoCode.trim(), courseId: course.id })
      });
      setPromoResult(result);
    } catch (e) {
      setPromoError(e.message);
    } finally {
      setPromoLoading(false);
    }
  }

  async function handlePayment() {
    setSubmitting(true);
    setError('');
    try {
      if (method === 'card') {
        const res = await api(`/checkout/${course.id}`, { method: 'POST' });
        if (res.url) {
          window.location.href = res.url;
        } else {
          setError('Stripe checkout is not configured yet. Please try another payment method.');
          setSubmitting(false);
        }
      } else {
        const res = await api('/pay/manual', {
          method: 'POST',
          body: JSON.stringify({ courseId: course.id, method, promoCode: promoCode.trim() || undefined })
        });
        setSuccess(res);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-success" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="alert alert-danger d-flex align-items-center" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
        <div>
          <strong>Error:</strong> {error}
          <div className="mt-2">
            <Link to="/courses" className="btn btn-outline-danger btn-sm">Browse Courses</Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg" style={{ borderRadius: 16 }}>
            <div className="card-body text-center py-5 px-4">
              <div className="mb-4">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10" style={{ width: 100, height: 100 }}>
                  <i className="bi bi-check-circle-fill text-success" style={{ fontSize: 64 }}></i>
                </div>
              </div>
              <h2 className="fw-bold text-dark mb-2">Payment Submitted!</h2>
              <p className="text-muted mb-4">Your payment is being processed via <strong>{success.method}</strong></p>

              <div className="card bg-light border-0 mb-4 mx-auto" style={{ maxWidth: 450, borderRadius: 12 }}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Payment ID</span>
                    <code className="fw-bold text-success">{success.paymentId}</code>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Amount</span>
                    <span className="fw-bold">{formatPrice(success.amount)}</span>
                  </div>
                  {success.discount && (
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Discount</span>
                      <span className="fw-bold text-danger">{success.discount}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Method</span>
                    <span className="fw-bold text-capitalize">{success.method}</span>
                  </div>
                  {success.promoCode && (
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Promo Code</span>
                      <span className="badge bg-success">{success.promoCode}</span>
                    </div>
                  )}
                </div>
              </div>

              {method === 'bank' && (
                <div className="alert alert-info text-start mb-4" style={{ borderRadius: 12 }}>
                  <h6 className="fw-bold mb-2"><i className="bi bi-bank me-1"></i> Bank Transfer Instructions</h6>
                  <p className="mb-1">Transfer <strong>{formatPrice(success.amount)}</strong> to:</p>
                  <ul className="mb-0 mt-1 small">
                    <li>Account Title: <strong>LearnHub</strong></li>
                    <li>Account No: <strong>1234567890</strong></li>
                    <li>Bank: <strong>Meezan Bank</strong></li>
                    <li>IBAN: <strong>PK36MEZN000000012345678901</strong></li>
                  </ul>
                </div>
              )}

              {(method === 'jazzcash' || method === 'easypaisa') && (
                <div className="alert alert-info text-start mb-4" style={{ borderRadius: 12 }}>
                  <h6 className="fw-bold mb-2"><i className="bi bi-phone me-1"></i> {method === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'} Instructions</h6>
                  <p className="mb-0 small">
                    You will receive a confirmation within 24 hours. Please keep this Payment ID: <strong>{success.paymentId}</strong> for reference.
                  </p>
                </div>
              )}

              <p className="text-muted small mb-4">
                <i className="bi bi-clock me-1"></i>
                {success.message}
              </p>

              <div className="d-flex gap-3 justify-content-center">
                <Link to={`/course/${course.slug}`} className="btn btn-success px-4">
                  <i className="bi bi-book me-1"></i> View Course
                </Link>
                <Link to="/courses" className="btn btn-outline-secondary px-4">
                  <i className="bi bi-arrow-left me-1"></i> Browse More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {/* Left Column - Payment Form */}
      <div className="col-lg-7">
        <div className="d-flex align-items-center mb-4">
          <Link to={`/course/${course.slug}`} className="text-decoration-none text-muted">
            <i className="bi bi-arrow-left fs-5 me-2"></i>
          </Link>
          <h2 className="fw-bold mb-0">Checkout</h2>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center mb-3" role="alert" style={{ borderRadius: 10 }}>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        {/* Order Summary */}
        <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 14 }}>
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-receipt me-2 text-success"></i>Order Summary
            </h5>
            <div className="d-flex align-items-start border-bottom pb-3 mb-3">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                style={{ width: 56, height: 56, background: course.color || '#04aa6d' + '18' }}
              >
                <i className={`bi bi-${course.icon || 'code'} fs-4`} style={{ color: course.color || '#04aa6d' }}></i>
              </div>
              <div className="flex-grow-1">
                <h6 className="fw-bold mb-1">{course.title}</h6>
                <small className="text-muted">Lifetime Access &bull; 1 seat</small>
              </div>
              <div className="fw-bold text-end">{formatPrice(course.price)}</div>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted">Subtotal</span>
              <span>{formatPrice(displayPrice)}</span>
            </div>
            {promoResult && (
              <div className="d-flex justify-content-between text-danger mb-1">
                <span>
                  Discount ({promoResult.description})
                  <button className="btn btn-link btn-sm p-0 ms-1 text-danger" onClick={() => { setPromoResult(null); setPromoCode(''); }}>
                    <i className="bi bi-x-circle"></i>
                  </button>
                </span>
                <span>-{formatPrice(displayPrice - promoResult.finalPrice)}</span>
              </div>
            )}
            <hr className="my-2" />
            <div className="d-flex justify-content-between">
              <span className="fs-5 fw-bold">Total</span>
              <span className="fs-5 fw-bold text-success">{formatPrice(finalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Promo Code */}
        <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 14 }}>
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3">
              <i className="bi bi-tag me-2 text-success"></i>Promo Code
            </h6>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                disabled={!!promoResult}
                style={{ borderRadius: '10px 0 0 10px' }}
              />
              <button
                className="btn btn-success px-4"
                onClick={handleApplyPromo}
                disabled={promoLoading || !promoCode.trim() || !!promoResult}
                style={{ borderRadius: '0 10px 10px 0' }}
              >
                {promoLoading ? <span className="spinner-border spinner-border-sm"></span> : 'Apply'}
              </button>
            </div>
            {promoError && <small className="text-danger mt-1 d-block">{promoError}</small>}
            {promoResult && <small className="text-success mt-1 d-block"><i className="bi bi-check-circle me-1"></i>{promoResult.description} applied!</small>}
          </div>
        </div>

        {/* Payment Method */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 14 }}>
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-credit-card me-2 text-success"></i>Payment Method
            </h5>

            <div className="d-flex flex-column gap-2">
              {/* Card */}
              <label
                className={`p-3 rounded-3 border cursor-pointer ${method === 'card' ? 'border-success bg-success bg-opacity-10' : 'border-light'}`}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center">
                  <input type="radio" name="paymentMethod" className="form-check-input me-3" checked={method === 'card'} onChange={() => setMethod('card')} />
                  <i className="bi bi-credit-card-2-front fs-4 text-success me-3"></i>
                  <div>
                    <span className="fw-bold">Credit / Debit Card</span>
                    <small className="d-block text-muted">Visa, Mastercard, etc. via Stripe</small>
                  </div>
                </div>
                {method === 'card' && (
                  <div className="mt-3 ms-5">
                    <div className="row g-2">
                      <div className="col-12">
                        <label className="form-label small text-muted">Card Number</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                          maxLength={19}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small text-muted">Expiry Date</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                          maxLength={5}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small text-muted">CVC</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="123"
                          value={cardCvc}
                          onChange={e => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          maxLength={4}
                        />
                      </div>
                    </div>
                    <small className="text-muted d-block mt-2">
                      <i className="bi bi-shield-lock me-1"></i>
                      You will be securely redirected to Stripe to complete payment
                    </small>
                  </div>
                )}
              </label>

              {/* JazzCash */}
              <label
                className={`p-3 rounded-3 border ${method === 'jazzcash' ? 'border-success bg-success bg-opacity-10' : 'border-light'}`}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center">
                  <input type="radio" name="paymentMethod" className="form-check-input me-3" checked={method === 'jazzcash'} onChange={() => setMethod('jazzcash')} />
                  <div className="d-flex align-items-center justify-content-center rounded me-3" style={{ width: 36, height: 36, background: '#d4213d' }}>
                    <span className="text-white fw-bold" style={{ fontSize: 10 }}>JC</span>
                  </div>
                  <div>
                    <span className="fw-bold">JazzCash</span>
                    <small className="d-block text-muted">Mobile wallet payment</small>
                  </div>
                </div>
                {method === 'jazzcash' && (
                  <div className="mt-3 ms-5">
                    <div className="alert alert-info mb-0 py-2 px-3" style={{ borderRadius: 8, fontSize: '0.9rem' }}>
                      <i className="bi bi-info-circle me-1"></i>
                      You will be redirected to JazzCash to complete the payment.
                    </div>
                  </div>
                )}
              </label>

              {/* EasyPaisa */}
              <label
                className={`p-3 rounded-3 border ${method === 'easypaisa' ? 'border-success bg-success bg-opacity-10' : 'border-light'}`}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center">
                  <input type="radio" name="paymentMethod" className="form-check-input me-3" checked={method === 'easypaisa'} onChange={() => setMethod('easypaisa')} />
                  <div className="d-flex align-items-center justify-content-center rounded me-3" style={{ width: 36, height: 36, background: '#1da23d' }}>
                    <span className="text-white fw-bold" style={{ fontSize: 10 }}>EP</span>
                  </div>
                  <div>
                    <span className="fw-bold">EasyPaisa</span>
                    <small className="d-block text-muted">Mobile wallet payment</small>
                  </div>
                </div>
                {method === 'easypaisa' && (
                  <div className="mt-3 ms-5">
                    <div className="alert alert-info mb-0 py-2 px-3" style={{ borderRadius: 8, fontSize: '0.9rem' }}>
                      <i className="bi bi-info-circle me-1"></i>
                      You will be redirected to EasyPaisa to complete the payment.
                    </div>
                  </div>
                )}
              </label>

              {/* Bank Transfer */}
              <label
                className={`p-3 rounded-3 border ${method === 'bank' ? 'border-success bg-success bg-opacity-10' : 'border-light'}`}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center">
                  <input type="radio" name="paymentMethod" className="form-check-input me-3" checked={method === 'bank'} onChange={() => setMethod('bank')} />
                  <i className="bi bi-bank fs-4 text-success me-3"></i>
                  <div>
                    <span className="fw-bold">Bank Transfer</span>
                    <small className="d-block text-muted">Direct bank deposit</small>
                  </div>
                </div>
                {method === 'bank' && (
                  <div className="mt-3 ms-5">
                    <div className="card bg-light border-0" style={{ borderRadius: 10 }}>
                      <div className="card-body p-3">
                        <h6 className="fw-bold mb-2"><i className="bi bi-bank me-1"></i> Bank Details</h6>
                        <div className="row g-2 small">
                          <div className="col-sm-6">
                            <span className="text-muted d-block">Account Title</span>
                            <span className="fw-bold">LearnHub</span>
                          </div>
                          <div className="col-sm-6">
                            <span className="text-muted d-block">Account No</span>
                            <span className="fw-bold font-monospace">1234567890</span>
                          </div>
                          <div className="col-sm-6">
                            <span className="text-muted d-block">Bank</span>
                            <span className="fw-bold">Meezan Bank</span>
                          </div>
                          <div className="col-sm-6">
                            <span className="text-muted d-block">IBAN</span>
                            <span className="fw-bold font-monospace">PK36MEZN000000012345678901</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Complete Payment Button */}
        <button
          className="btn btn-success btn-lg w-100 py-3 fw-bold mb-3"
          onClick={handlePayment}
          disabled={submitting}
          style={{ borderRadius: 12, fontSize: '1.1rem' }}
        >
          {submitting ? (
            <><span className="spinner-border spinner-border-sm me-2"></span>Processing...</>
          ) : (
            <><i className="bi bi-lock-fill me-2"></i>Complete Payment &mdash; {formatPrice(finalPrice)}</>
          )}
        </button>
        <p className="text-center text-muted small mb-0">
          <i className="bi bi-shield-lock me-1"></i>
          Your payment information is encrypted and secure
        </p>
      </div>

      {/* Right Column - Course Info & Trust Badges */}
      <div className="col-lg-5">
        <div className="position-sticky" style={{ top: 90 }}>
          {/* Course Card */}
          <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 14, overflow: 'hidden' }}>
            <div
              className="card-body p-4 text-center"
              style={{ background: `linear-gradient(135deg, ${course.color || '#04aa6d'}22 0%, ${course.color || '#04aa6d'}08 100%)` }}
            >
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{ width: 72, height: 72, background: course.color || '#04aa6d' + '20' }}
              >
                <i className={`bi bi-${course.icon || 'code'} fs-2`} style={{ color: course.color || '#04aa6d' }}></i>
              </div>
              <h5 className="fw-bold mb-1">{course.title}</h5>
              <p className="text-muted small mb-3" style={{ lineHeight: 1.5 }}>
                {course.description ? course.description.slice(0, 120) + (course.description.length > 120 ? '...' : '') : ''}
              </p>
              <div className="d-flex justify-content-center gap-2 flex-wrap">
                <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
                  <i className="bi bi-play-circle me-1"></i>{course.lesson_count || 0} Lessons
                </span>
                <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
                  <i className="bi bi-list-check me-1"></i>{course.topic_count || 0} Topics
                </span>
              </div>
            </div>
            <div className="card-body border-top p-4">
              <h6 className="fw-bold mb-3"><i className="bi bi-check-circle-fill text-success me-2"></i>What's Included</h6>
              <ul className="list-unstyled mb-0">
                {[
                  { icon: 'infinity', text: 'Lifetime Access' },
                  { icon: 'play-btn', text: 'All Video Lessons' },
                  { icon: 'patch-question', text: 'Interactive Quizzes' },
                  { icon: 'award', text: 'Completion Certificate' }
                ].map((item, i) => (
                  <li key={i} className="d-flex align-items-center mb-2">
                    <i className={`bi bi-${item.icon} text-success me-2 fs-6`} style={{ width: 20, textAlign: 'center' }}></i>
                    <span className="small">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Price Summary */}
          <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 14 }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Course Price</span>
                <span className="fw-bold">{formatPrice(displayPrice)}</span>
              </div>
              {promoResult && (
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-success">Discount</span>
                  <span className="fw-bold text-success">-{formatPrice(displayPrice - promoResult.finalPrice)}</span>
                </div>
              )}
              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold fs-5">Total</span>
                <span className="fw-bold fs-4 text-success">{formatPrice(finalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Security Badges */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
            <div className="card-body p-4">
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 me-3" style={{ width: 40, height: 40 }}>
                    <i className="bi bi-shield-lock text-success fs-6"></i>
                  </div>
                  <div>
                    <span className="fw-bold small d-block">256-bit SSL Encrypted</span>
                    <small className="text-muted">Your data is always secure</small>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 me-3" style={{ width: 40, height: 40 }}>
                    <i className="bi bi-arrow-return-left text-success fs-6"></i>
                  </div>
                  <div>
                    <span className="fw-bold small d-block">Money Back Guarantee</span>
                    <small className="text-muted">30-day refund policy</small>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 me-3" style={{ width: 40, height: 40 }}>
                    <i className="bi bi-credit-card-2-front text-success fs-6"></i>
                  </div>
                  <div>
                    <span className="fw-bold small d-block">Secure Payment</span>
                    <small className="text-muted">Powered by industry standards</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="d-flex justify-content-center gap-4 mt-3 flex-wrap">
            {[
              { icon: 'shield-check', label: 'Verified' },
              { icon: 'gem', label: 'Premium' },
              { icon: 'globe2', label: 'Global' }
            ].map((badge, i) => (
              <div key={i} className="text-center">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light mb-1" style={{ width: 44, height: 44 }}>
                  <i className={`bi bi-${badge.icon} text-success fs-6`}></i>
                </div>
                <small className="d-block text-muted" style={{ fontSize: '0.7rem' }}>{badge.label}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
