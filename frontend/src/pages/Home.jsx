import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useLanguage } from '../LanguageContext';

const languages = [
  { code: 'all', name: 'All Languages', flag: '🌍' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
  { code: 'ru', name: 'Roman Urdu', flag: '📝' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
];

const categories = [
  { name: 'Frontend', icon: 'bi-layout-wtf', color: '#0d6efd', desc: 'HTML, CSS, JavaScript, Bootstrap' },
  { name: 'Backend', icon: 'bi-server', color: '#198754', desc: 'Python, Node.js, APIs' },
  { name: 'Database', icon: 'bi-database', color: '#6f42c1', desc: 'SQL, MySQL, MongoDB' },
  { name: 'Frameworks', icon: 'bi-box-seam', color: '#fd7e14', desc: 'React, Next.js, Express' },
];

const featuredCourses = [
  { id: 1, title: 'HTML', icon: '</>', lessons: 12, level: 'Beginner', price: 'Free', color: '#e44d26', slug: 'html' },
  { id: 2, title: 'CSS', icon: '{ }', lessons: 11, level: 'Beginner', price: 'Free', color: '#264de4', slug: 'css' },
  { id: 3, title: 'JavaScript', icon: 'JS', lessons: 13, level: 'Intermediate', price: 'Free', color: '#f7df1e', slug: 'javascript' },
  { id: 4, title: 'Python', icon: 'Py', lessons: 12, level: 'Beginner', price: 'Free', color: '#3776ab', slug: 'python' },
  { id: 5, title: 'React', icon: '⚛', lessons: 9, level: 'Intermediate', price: 'Free', color: '#61dafb', slug: 'react' },
  { id: 6, title: 'SQL', icon: 'DB', lessons: 9, level: 'Beginner', price: 'Free', color: '#6f42c1', slug: 'sql' },
  { id: 7, title: 'Bootstrap', icon: 'B', lessons: 8, level: 'Beginner', price: 'Free', color: '#7952b3', slug: 'bootstrap' },
  { id: 8, title: 'Java', icon: 'Jv', lessons: 8, level: 'Beginner', price: 'Paid', color: '#f89820', slug: 'java' },
  { id: 9, title: 'C++', icon: 'C+', lessons: 8, level: 'Intermediate', price: 'Paid', color: '#00599C', slug: 'cpp' },
  { id: 10, title: 'TypeScript', icon: 'TS', lessons: 8, level: 'Intermediate', price: 'Paid', color: '#3178c6', slug: 'typescript' },
  { id: 11, title: 'Go', icon: 'Go', lessons: 8, level: 'Intermediate', price: 'Paid', color: '#00ADD8', slug: 'go' },
];

const features = [
  { icon: 'bi-book', title: 'Documentation', text: 'Step-by-step written tutorials for every topic.' },
  { icon: 'bi-play-circle', title: 'Video Tutorials', text: 'Watch video lessons embedded right in each page.' },
  { icon: 'bi-pencil-square', title: 'Practice & Quizzes', text: 'Test your knowledge with quizzes after every topic.' },
  { icon: 'bi-bar-chart', title: 'Progress Tracking', text: 'Mark lessons complete and track your overall progress.' },
  { icon: 'bi-code-slash', title: 'Live Code Editor', text: 'Write, edit and run code right in your browser.' },
  { icon: 'bi-moon', title: 'Dark Mode', text: 'Easy on the eyes with a beautiful dark theme.' },
  { icon: 'bi-award', title: 'Certificates', text: 'Complete a course and earn a certificate.' },
  { icon: 'bi-translate', title: 'Multi-Language', text: 'Learn in English, Urdu, Roman Urdu, Arabic, or Hindi.' },
];

export default function Home() {
  const { user } = useAuth();
  const { lang, setLang } = useLanguage();
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .home-hero {
          background: linear-gradient(135deg, #0a1a0a 0%, #1a2a1a 30%, #1a1a2e 70%, #16213e 100%);
          border-radius: 16px;
          padding: 60px 40px;
          margin-bottom: 40px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(25,135,84,0.15);
        }
        .home-hero::before {
          content: '';
          position: absolute;
          top: -100px; right: -100px;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(25,135,84,0.08) 0%, transparent 70%);
        }
        .home-hero::after {
          content: '';
          position: absolute;
          bottom: -150px; left: -150px;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(13,110,253,0.06) 0%, transparent 70%);
        }
        .home-hero * { position: relative; z-index: 2; }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(25,135,84,0.15);
          border: 1px solid rgba(25,135,84,0.3);
          color: #4ade80;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.82rem;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .hero-title {
          font-size: 3.2rem;
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 16px;
          color: #fff;
        }
        .hero-title span {
          background: linear-gradient(90deg, #4ade80, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.55);
          max-width: 600px;
          line-height: 1.7;
          margin-bottom: 28px;
        }
        .hero-stats {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 32px;
        }
        .hero-stat {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 14px 22px;
          text-align: center;
          min-width: 120px;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }
        .hero-stat:hover { background: rgba(255,255,255,0.07); transform: translateY(-2px); }
        .hero-stat-num { font-size: 1.5rem; font-weight: 800; color: #fff; }
        .hero-stat-label { font-size: 0.75rem; color: rgba(255,255,255,0.4); margin-top: 2px; }
        .section-title {
          text-align: center;
          margin-bottom: 32px;
        }
        .section-title h2 {
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 6px;
        }
        .section-title p {
          color: var(--lh-text-muted);
          font-size: 0.95rem;
        }
        .section-line {
          width: 48px;
          height: 3px;
          border-radius: 2px;
          margin: 0 auto 12px;
        }
        .course-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 48px;
        }
        .home-course-card {
          background: var(--lh-bg-card);
          border: 1px solid var(--lh-border);
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.3s ease;
          text-decoration: none;
          display: block;
        }
        .home-course-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.5);
          border-color: var(--lh-primary);
        }
        .home-course-icon {
          height: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Fira Code', monospace;
          font-weight: 700;
          font-size: 1.3rem;
          color: white;
          opacity: 0.95;
        }
        .home-course-body {
          padding: 14px 16px;
        }
        .home-course-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--lh-text);
          margin-bottom: 6px;
        }
        .home-course-meta {
          font-size: 0.75rem;
          color: var(--lh-text-dim);
          margin-bottom: 10px;
        }
        .home-course-progress {
          height: 3px;
          background: var(--lh-border);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 6px;
        }
        .home-course-progress-fill {
          height: 100%;
          border-radius: 2px;
          background: var(--lh-primary);
          transition: width 0.5s ease;
        }
        .home-course-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .home-course-level {
          font-size: 0.7rem;
          color: var(--lh-text-dim);
        }
        .home-course-price {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 6px;
        }
        .home-course-price.free { color: #4ade80; background: rgba(74,222,128,0.1); }
        .home-course-price.paid { color: #fbbf24; background: rgba(251,191,36,0.1); }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 48px;
        }
        .home-feature-card {
          background: var(--lh-bg-card);
          border: 1px solid var(--lh-border);
          border-radius: 12px;
          padding: 24px 20px;
          transition: all 0.3s ease;
        }
        .home-feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.4);
          border-color: var(--lh-primary);
        }
        .home-feature-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba(25,135,84,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          font-size: 1.1rem;
          color: var(--lh-primary);
        }
        .home-feature-card h5 { font-size: 0.95rem; font-weight: 700; margin-bottom: 6px; }
        .home-feature-card p { font-size: 0.8rem; color: var(--lh-text-muted); line-height: 1.5; margin: 0; }
        .category-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 48px;
        }
        .home-category-card {
          background: var(--lh-bg-card);
          border: 1px solid var(--lh-border);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          transition: all 0.3s ease;
          text-decoration: none;
          display: block;
        }
        .home-category-card:hover { transform: translateY(-4px); border-color: var(--lh-primary); }
        .home-category-icon {
          width: 52px; height: 52px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 12px;
          font-size: 1.3rem;
        }
        .home-category-card h5 { font-size: 0.95rem; font-weight: 700; margin-bottom: 4px; }
        .home-category-card small { color: var(--lh-text-dim); font-size: 0.75rem; }
        .lang-grid {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 48px;
        }
        .lang-pill {
          background: var(--lh-bg-card);
          border: 1px solid var(--lh-border);
          color: var(--lh-text);
          padding: 10px 22px;
          border-radius: 24px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
        }
        .lang-pill:hover { border-color: var(--lh-primary); color: var(--lh-accent); }
        .lang-pill.active {
          background: var(--lh-primary);
          border-color: var(--lh-primary);
          color: white;
          box-shadow: 0 4px 16px var(--lh-primary-glow);
        }
        .testimonial-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 48px;
        }
        .testimonial-card {
          background: var(--lh-bg-card);
          border: 1px solid var(--lh-border);
          border-radius: 14px;
          padding: 24px;
          transition: all 0.3s ease;
        }
        .testimonial-card:hover { border-color: var(--lh-primary); }
        .testimonial-stars { color: #fbbf24; margin-bottom: 12px; font-size: 0.85rem; }
        .testimonial-text { font-size: 0.88rem; color: var(--lh-text-muted); line-height: 1.7; margin-bottom: 16px; }
        .testimonial-avatar {
          display: flex; align-items: center; gap: 10px;
        }
        .testimonial-avatar-circle {
          width: 38px; height: 38px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 700; font-size: 0.85rem;
        }
        .testimonial-name { font-size: 0.85rem; font-weight: 600; }
        .testimonial-role { font-size: 0.72rem; color: var(--lh-text-dim); }
        .cta-banner {
          background: linear-gradient(135deg, #198754 0%, #0d6efd 100%);
          border-radius: 16px;
          padding: 48px;
          text-align: center;
          color: white;
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
        }
        .cta-banner::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 240px; height: 240px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
        }
        .cta-banner h2 { font-size: 1.8rem; font-weight: 800; margin-bottom: 12px; position: relative; z-index: 2; }
        .cta-banner p { color: rgba(255,255,255,0.7); margin-bottom: 24px; font-size: 1rem; position: relative; z-index: 2; }
        @media (max-width: 992px) {
          .feature-grid, .category-grid { grid-template-columns: repeat(2, 1fr); }
          .testimonial-grid { grid-template-columns: 1fr; }
          .hero-title { font-size: 2.4rem; }
        }
        @media (max-width: 576px) {
          .feature-grid, .category-grid { grid-template-columns: 1fr; }
          .hero-title { font-size: 1.8rem; }
          .home-hero { padding: 32px 20px; }
          .course-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
      `}</style>

      {/* HERO */}
      <section className="home-hero text-center">
        <div className="hero-badge"><i className="bi bi-lightning-fill"></i> Free Coding Platform</div>
        <h1 className="hero-title">Learn to Code.<br/>Build the <span>Future.</span></h1>
        <p className="hero-subtitle mx-auto">Master HTML, CSS, JavaScript, Python, SQL, React &amp; more — with a live code editor, quizzes, certificates and multi-language support.</p>
        <div className="d-flex gap-3 justify-content-center flex-wrap mb-4">
          {user ? (
            <Link to="/courses" className="btn btn-success btn-lg px-5 py-3 fw-semibold rounded-pill">
              <i className="bi bi-play-fill me-2"></i>Continue Learning
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-success btn-lg px-5 py-3 fw-semibold rounded-pill">
                <i className="bi bi-rocket-takeoff me-2"></i>Start Learning Free
              </Link>
              <Link to="/courses" className="btn btn-outline-light btn-lg px-5 py-3 fw-semibold rounded-pill">
                <i className="bi bi-grid me-2"></i>Browse Courses
              </Link>
            </>
          )}
        </div>
        <div className="hero-stats justify-content-center">
          {[{ num: '14+', label: 'Courses' }, { num: '120+', label: 'Lessons' }, { num: '5', label: 'Languages' }, { num: '✓', label: 'Certificates' }].map((s, i) => (
            <div key={i} className="hero-stat">
              <div className="hero-stat-num">{s.num}</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LANGUAGE SELECTOR */}
      <div className="section-title">
        <div className="section-line" style={{ background: 'linear-gradient(90deg, #198754, #0d6efd)' }}></div>
        <h2><i className="bi bi-globe2 text-success me-2"></i>Choose Your Language</h2>
        <p>Learn in the language you're most comfortable with</p>
      </div>
      <div className="lang-grid">
        {languages.map(l => (
          <button key={l.code} className={`lang-pill ${lang === l.code ? 'active' : ''}`}
            onClick={() => { setLang(l.code); navigate('/courses'); }}>
            <span className="me-1" style={{ fontSize: '1.1rem' }}>{l.flag}</span> {l.name}
          </button>
        ))}
      </div>

      {/* CATEGORIES */}
      <div className="section-title">
        <div className="section-line" style={{ background: 'linear-gradient(90deg, #0d6efd, #6f42c1)' }}></div>
        <h2>Browse by Category</h2>
        <p>Find the right path for your learning journey</p>
      </div>
      <div className="category-grid">
        {categories.map(c => (
          <Link key={c.name} to="/courses" className="home-category-card">
            <div className="home-category-icon" style={{ background: `${c.color}15`, color: c.color }}>
              <i className={`bi ${c.icon}`}></i>
            </div>
            <h5>{c.name}</h5>
            <small>{c.desc}</small>
          </Link>
        ))}
      </div>

      {/* FEATURED COURSES */}
      <div className="section-title">
        <div className="section-line" style={{ background: 'linear-gradient(90deg, #198754, #20c997)' }}></div>
        <h2>Featured Courses</h2>
        <p>Start with the most popular courses</p>
      </div>
      <div className="course-grid">
        {featuredCourses.map(c => (
          <Link key={c.id} to={`/course/${c.slug}`} className="home-course-card">
            <div className="home-course-icon" style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}88)` }}>
              {c.icon}
            </div>
            <div className="home-course-body">
              <div className="home-course-title">{c.title}</div>
              <div className="home-course-meta">{c.lessons} Lessons</div>
              <div className="home-course-footer">
                <span className="home-course-level">{c.level}</span>
                <span className={`home-course-price ${c.price === 'Free' ? 'free' : 'paid'}`}>{c.price}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="text-center mb-5">
        <Link to="/courses" className="btn btn-outline-success btn-lg px-5 rounded-pill fw-semibold">
          View All Courses <i className="bi bi-arrow-right ms-2"></i>
        </Link>
      </div>

      {/* FEATURES */}
      <div className="section-title">
        <div className="section-line" style={{ background: 'linear-gradient(90deg, #fd7e14, #ffc107)' }}></div>
        <h2>Everything You Need</h2>
        <p>One platform — docs, videos, editor, quizzes &amp; certificates</p>
      </div>
      <div className="feature-grid">
        {features.map(f => (
          <div key={f.title} className="home-feature-card">
            <div className="home-feature-icon"><i className={`bi ${f.icon}`}></i></div>
            <h5>{f.title}</h5>
            <p>{f.text}</p>
          </div>
        ))}
      </div>

      {/* TESTIMONIALS */}
      <div className="section-title">
        <div className="section-line" style={{ background: 'linear-gradient(90deg, #ffc107, #fd7e14)' }}></div>
        <h2>Loved by Learners</h2>
        <p>See what our students are saying</p>
      </div>
      <div className="testimonial-grid">
        {[
          { name: 'Ali Khan', role: 'Frontend Developer', text: 'LearnHub made coding so easy to understand. The live editor and quizzes help me practice while I learn!', stars: 5, color: '#198754' },
          { name: 'Sara Ahmed', role: 'CS Student', text: 'I love that I can learn in Roman Urdu. The courses are well-structured and certificates look great on LinkedIn.', stars: 5, color: '#0d6efd' },
          { name: 'Ahmed Raza', role: 'Self-Taught Dev', text: 'From HTML to Python — I learned everything here for free. The code playground is my favorite feature!', stars: 5, color: '#6f42c1' },
        ].map((t, i) => (
          <div key={i} className="testimonial-card">
            <div className="testimonial-stars">
              {Array.from({ length: t.stars }, (_, j) => <i key={j} className="bi bi-star-fill me-1"></i>)}
            </div>
            <div className="testimonial-text">"{t.text}"</div>
            <div className="testimonial-avatar">
              <div className="testimonial-avatar-circle" style={{ background: t.color }}>{t.name.charAt(0)}</div>
              <div>
                <div className="testimonial-name">{t.name}</div>
                <div className="testimonial-role">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <section className="cta-banner">
        <h2>Ready to Start Your Coding Journey?</h2>
        <p>Join thousands of learners building their future with code. It's 100% free.</p>
        <Link to="/register" className="btn btn-light btn-lg px-5 py-3 fw-bold rounded-pill">
          <i className="bi bi-rocket-takeoff me-2"></i>Get Started Free
        </Link>
      </section>
    </>
  );
}
