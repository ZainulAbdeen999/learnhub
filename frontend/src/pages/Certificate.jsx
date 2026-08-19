import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';

export default function Certificate() {
  const { courseSlug } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    api(`/certificate/${courseSlug}`)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [courseSlug, user]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-success"></div></div>;
  if (!user) return (
    <div className="text-center py-5">
      <i className="bi bi-lock display-1 text-muted"></i>
      <p className="mt-3 text-muted">Please login to view your certificate.</p>
      <Link to="/login" className="btn btn-success">Login</Link>
    </div>
  );
  if (error) return <div className="alert alert-warning">{error}</div>;
  if (!data) return null;

  const handlePrint = () => window.print();

  return (
    <div className="certificate-page">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body * { visibility: hidden; }
          .certificate-card, .certificate-card * { visibility: visible; }
          .certificate-card { position: fixed; left: 0; top: 0; width: 100%; box-shadow: none !important; border: 3px solid #04aa6d !important; }
        }
      `}</style>

      <div className="no-print text-center mb-4">
        <h2 className="fw-bold"><i className="bi bi-award text-success me-2"></i>Your Certificate</h2>
        <p className="text-muted">Congratulations on completing {data.course_title}!</p>
        <button className="btn btn-success" onClick={handlePrint}>
          <i className="bi bi-printer me-2"></i>Print / Save as PDF
        </button>
      </div>

      <div className="certificate-card card mx-auto" style={{ maxWidth: 800 }}>
        <div className="card-body p-5 text-center">
          <div style={{ borderBottom: '4px solid #04aa6d', paddingBottom: 20, marginBottom: 20 }}>
            <h1 className="fw-bold text-success mb-1" style={{ fontSize: '2.5rem' }}>Certificate of Completion</h1>
            <p className="text-muted mb-0">LearnHub Learning Platform</p>
          </div>

          <p className="text-muted mb-2" style={{ fontSize: '1.1rem' }}>This is to certify that</p>
          <h2 className="fw-bold mb-2" style={{ color: '#04aa6d', fontSize: '2rem' }}>{user.name}</h2>
          <p className="text-muted mb-2">has successfully completed the course</p>
          <h3 className="fw-bold mb-3">{data.course_title}</h3>

          <div className="d-flex justify-content-center gap-5 mb-4">
            <div>
              <div className="fw-bold text-success">{data.total_lessons}</div>
              <small className="text-muted">Lessons Completed</small>
            </div>
            <div>
              <div className="fw-bold text-success">{data.quizzes_passed}</div>
              <small className="text-muted">Quizzes Passed</small>
            </div>
            <div>
              <div className="fw-bold text-success">{data.date}</div>
              <small className="text-muted">Date</small>
            </div>
          </div>

          <div style={{ borderTop: '2px solid #dee2e6', paddingTop: 16 }}>
            <div className="d-flex justify-content-between align-items-end">
              <div className="text-start">
                <small className="text-muted">Certificate ID</small><br/>
                <small className="fw-semibold">{data.certificate_id}</small>
              </div>
              <div>
                <i className="bi bi-mortarboard-fill text-success" style={{ fontSize: '3rem' }}></i>
              </div>
              <div className="text-end">
                <small className="text-muted">Issued by</small><br/>
                <small className="fw-semibold">LearnHub</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
