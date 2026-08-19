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
  { id: 1, title: 'HTML Fundamentals', icon: 'bi-filetype-html', lessons: 12, level: 'Beginner', price: 'Free', color: '#e44d26' },
  { id: 2, title: 'CSS Masterclass', icon: 'bi-filetype-css', lessons: 18, level: 'Beginner', price: 'Free', color: '#264de4' },
  { id: 3, title: 'JavaScript Deep Dive', icon: 'bi-filetype-js', lessons: 25, level: 'Intermediate', price: 'Free', color: '#f7df1e' },
  { id: 4, title: 'Python for Beginners', icon: 'bi-filetype-py', lessons: 20, level: 'Beginner', price: 'Free', color: '#3776ab' },
  { id: 5, title: 'React Essentials', icon: 'bi-react', lessons: 15, level: 'Intermediate', price: 'Free', color: '#61dafb' },
  { id: 6, title: 'SQL & Databases', icon: 'bi-database', lessons: 14, level: 'Beginner', price: 'Free', color: '#6f42c1' },
];

const features = [
  { icon: 'bi-book', title: 'Documentation', text: 'Step-by-step written tutorials for every topic. Easy to read, easy to follow.' },
  { icon: 'bi-play-circle', title: 'Video Tutorials', text: "Don't feel like reading? Watch the video lessons embedded right in each page." },
  { icon: 'bi-pencil-square', title: 'Practice & Quizzes', text: 'Test your knowledge with quizzes after every topic and track your scores.' },
  { icon: 'bi-bar-chart', title: 'Progress Tracking', text: 'Mark lessons complete and watch your overall course progress grow.' },
  { icon: 'bi-code-slash', title: 'Try it Yourself Editor', text: 'Live code editor in every lesson. Write, edit and run code right in your browser.' },
  { icon: 'bi-moon', title: 'Dark Mode', text: 'Easy on the eyes with dark mode. Toggle between light and dark themes instantly.' },
  { icon: 'bi-award', title: 'Certificates', text: 'Complete a course and earn a certificate. Print it or share it on LinkedIn.' },
  { icon: 'bi-translate', title: 'Multi-Language', text: 'Learn in English, Urdu, Roman Urdu, Arabic, or Hindi. Content in your preferred language.' },
];

const heroStyle = {
  background: 'linear-gradient(135deg, #0a1a0a 0%, #1a2a1a 30%, #1a1a2e 70%, #16213e 100%)',
  position: 'relative',
  overflow: 'hidden',
};

const floatCodeStyle = {
  position: 'absolute',
  fontFamily: "'Courier New', monospace",
  fontSize: '14px',
  color: 'rgba(255,255,255,0.06)',
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
  animation: 'floatCode linear infinite',
};

export default function Home() {
  const { user } = useAuth();
  const { lang, setLang } = useLanguage();
  const navigate = useNavigate();

  const snippets = [
    { text: '<div class="container">', top: '10%', left: '5%', duration: '25s', delay: '0s' },
    { text: 'function hello() {', top: '20%', left: '70%', duration: '30s', delay: '3s' },
    { text: 'SELECT * FROM courses', top: '60%', left: '15%', duration: '22s', delay: '7s' },
    { text: 'import React from "react"', top: '75%', left: '60%', duration: '28s', delay: '2s' },
    { text: '.hero { display: flex; }', top: '35%', left: '85%', duration: '20s', delay: '5s' },
    { text: 'def learn_python():', top: '85%', left: '30%', duration: '26s', delay: '10s' },
    { text: 'const [state, setState]', top: '15%', left: '40%', duration: '24s', delay: '8s' },
    { text: 'body { font-size: 16px; }', top: '50%', left: '90%', duration: '32s', delay: '1s' },
  ];

  return (
    <>
      <style>{`
        @keyframes floatCode {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-120px) translateX(40px); opacity: 0; }
        }
        @keyframes pulse { 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.05); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0%{ background-position: -200% center; } 100%{ background-position: 200% center; } }
        .hero-section { animation: fadeUp 0.8s ease-out; }
        .hero-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.3); }
        .hero-btn { transition: all 0.3s ease; }
        .category-card { transition: all 0.3s ease; cursor: pointer; }
        .category-card:hover { transform: translateY(-6px); box-shadow: 0 12px 30px rgba(0,0,0,0.15); }
        .course-card-home { transition: all 0.3s ease; }
        .course-card-home:hover { transform: translateY(-8px); box-shadow: 0 15px 35px rgba(0,0,0,0.2); }
        .feature-card { transition: all 0.3s ease; border: 1px solid #e9ecef; }
        .feature-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-color: #198754; }
        .lang-pill { transition: all 0.25s ease; cursor: pointer; }
        .lang-pill:hover { transform: scale(1.08); }
        .step-card { position: relative; }
        .step-arrow { color: #198754; font-size: 2rem; font-weight: bold; }
        .stat-card { backdrop-filter: blur(10px); transition: all 0.3s ease; }
        .stat-card:hover { transform: translateY(-3px); background: rgba(255,255,255,0.15) !important; }
        .cta-section { background: linear-gradient(135deg, #198754 0%, #0d6efd 100%); }
        .price-badge { backdrop-filter: blur(5px); }
        .section-divider { width: 60px; height: 4px; border-radius: 2px; }
      `}</style>

      <style>{`
        @media (max-width: 768px) {
          .hero-section h1 { font-size: 2.2rem !important; }
          .stat-grid { flex-direction: column !important; }
          .feature-grid { grid-template-columns: 1fr 1fr !important; }
          .step-arrow { transform: rotate(90deg) !important; }
          .category-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 576px) {
          .feature-grid { grid-template-columns: 1fr !important; }
          .category-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ animation: 'fadeUp 0.6s ease-out' }}>

        {/* ─── HERO SECTION ─── */}
        <section className="hero-section rounded-4 mx-2 mx-md-4 mb-5 p-5 p-md-5 text-white text-center" style={heroStyle}>
          {snippets.map((s, i) => (
            <div key={i} style={{ ...floatCodeStyle, top: s.top, left: s.left, animationDuration: s.duration, animationDelay: s.delay }}>
              {s.text}
            </div>
          ))}

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div className="mb-3">
              <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-30 px-3 py-2 rounded-pill fw-semibold" style={{ fontSize: '0.9rem' }}>
                <i className="bi bi-lightning-fill me-1"></i> Free Coding Platform
              </span>
            </div>

            <h1 className="fw-bold mb-3" style={{ fontSize: '3.5rem', lineHeight: 1.15 }}>
              Learn to Code.<br />
              Build the <span style={{ background: 'linear-gradient(90deg, #4ade80, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Future.</span>
            </h1>

            <p className="mx-auto mb-4 text-white-50" style={{ maxWidth: '650px', fontSize: '1.15rem', lineHeight: 1.7 }}>
              Master HTML, CSS, JavaScript, Python, SQL, React &amp; more — with a live code editor, quizzes, certificates and multi-language support.
            </p>

            <div className="d-flex gap-3 justify-content-center flex-wrap mb-5">
              {user ? (
                <Link to="/courses" className="btn btn-success btn-lg px-5 py-3 hero-btn fw-semibold rounded-pill">
                  <i className="bi bi-play-fill me-2"></i> Continue Learning
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-success btn-lg px-5 py-3 hero-btn fw-semibold rounded-pill">
                    <i className="bi bi-rocket-takeoff me-2"></i> Start Learning Free
                  </Link>
                  <Link to="/courses" className="btn btn-outline-light btn-lg px-5 py-3 hero-btn fw-semibold rounded-pill">
                    <i className="bi bi-grid me-2"></i> Browse Courses
                  </Link>
                </>
              )}
            </div>

            <div className="d-flex justify-content-center gap-3 gap-md-4 flex-wrap stat-grid">
              {[
                { num: '10+', label: 'Courses', icon: 'bi-book-half' },
                { num: '100+', label: 'Lessons', icon: 'bi-journal-text' },
                { num: '5', label: 'Languages', icon: 'bi-translate' },
                { num: '✓', label: 'Certificates', icon: 'bi-award' },
              ].map((s, i) => (
                <div key={i} className="stat-card text-center px-4 py-3 rounded-3" style={{ background: 'rgba(255,255,255,0.07)', minWidth: '130px' }}>
                  <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                    <i className={`bi ${s.icon} text-success`}></i>
                    <span className="fw-bold fs-4">{s.num}</span>
                  </div>
                  <div className="text-white-50 small">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── LANGUAGE SELECTOR ─── */}
        <section className="text-center mb-5 px-3">
          <div className="d-inline-block mb-3">
            <div className="section-divider mx-auto mb-3" style={{ background: 'linear-gradient(90deg, #198754, #0d6efd)' }}></div>
          </div>
          <h2 className="fw-bold mb-2">
            <i className="bi bi-globe2 text-success me-2"></i>Choose Your Language
          </h2>
          <p className="text-muted mb-4" style={{ fontSize: '1.05rem' }}>
            Learn in the language you're most comfortable with
          </p>
          <div className="d-flex gap-2 justify-content-center flex-wrap">
            {languages.map(l => (
              <button
                key={l.code}
                className={`btn px-4 py-2 rounded-pill fw-semibold lang-pill ${
                  lang === l.code
                    ? 'btn-success text-white shadow'
                    : 'btn-outline-secondary'
                }`}
                style={lang === l.code ? { boxShadow: '0 4px 15px rgba(25,135,84,0.35)' } : {}}
                onClick={() => { setLang(l.code); navigate('/courses'); }}
              >
                <span className="me-1" style={{ fontSize: '1.1rem' }}>{l.flag}</span> {l.name}
              </button>
            ))}
          </div>
        </section>

        {/* ─── COURSE CATEGORIES ─── */}
        <section className="mb-5 px-3 px-md-4">
          <div className="text-center mb-4">
            <div className="section-divider mx-auto mb-3" style={{ background: 'linear-gradient(90deg, #0d6efd, #6f42c1)' }}></div>
            <h2 className="fw-bold mb-2">Browse by Category</h2>
            <p className="text-muted" style={{ fontSize: '1.05rem' }}>Find the right path for your learning journey</p>
          </div>
          <div className="category-grid d-grid gap-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)', maxWidth: '900px', margin: '0 auto' }}>
            {categories.map(c => (
              <Link key={c.name} to="/courses" className="text-decoration-none">
                <div className="category-card card h-100 border-0 shadow-sm text-center p-4 rounded-4">
                  <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-3" style={{ width: 64, height: 64, background: `${c.color}15` }}>
                    <i className={`bi ${c.icon} fs-2`} style={{ color: c.color }}></i>
                  </div>
                  <h5 className="fw-bold text-dark mb-1">{c.name}</h5>
                  <small className="text-muted">{c.desc}</small>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── FEATURED COURSES ─── */}
        <section className="mb-5 px-3 px-md-4">
          <div className="text-center mb-4">
            <div className="section-divider mx-auto mb-3" style={{ background: 'linear-gradient(90deg, #198754, #20c997)' }}></div>
            <h2 className="fw-bold mb-2">Featured Courses</h2>
            <p className="text-muted" style={{ fontSize: '1.05rem' }}>Start with the most popular courses</p>
          </div>
          <div className="row g-4 justify-content-center">
            {featuredCourses.map(c => (
              <div className="col-sm-6 col-lg-4" key={c.id}>
                <Link to="/courses" className="text-decoration-none">
                  <div className="card course-card-home h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="p-4 text-white text-center" style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}99)` }}>
                      <i className={`bi ${c.icon}`} style={{ fontSize: '3.5rem' }}></i>
                    </div>
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="fw-bold text-dark mb-0">{c.title}</h5>
                      </div>
                      <div className="d-flex align-items-center gap-3 mt-3">
                        <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">
                          <i className="bi bi-journal-text me-1"></i>{c.lessons} Lessons
                        </span>
                        <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">
                          <i className="bi bi-bar-chart me-1"></i>{c.level}
                        </span>
                      </div>
                      <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-success fs-5">{c.price}</span>
                        <span className="text-muted small d-flex align-items-center">
                          Start <i className="bi bi-arrow-right ms-1"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/courses" className="btn btn-outline-success btn-lg px-5 rounded-pill fw-semibold hero-btn">
              View All Courses <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>
        </section>

        {/* ─── FEATURES GRID ─── */}
        <section className="mb-5 px-3 px-md-4">
          <div className="text-center mb-4">
            <div className="section-divider mx-auto mb-3" style={{ background: 'linear-gradient(90deg, #fd7e14, #ffc107)' }}></div>
            <h2 className="fw-bold mb-2">Everything You Need</h2>
            <p className="text-muted" style={{ fontSize: '1.05rem' }}>One platform — docs, videos, editor, quizzes &amp; certificates</p>
          </div>
          <div className="feature-grid d-grid gap-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)', maxWidth: '1100px', margin: '0 auto' }}>
            {features.map(f => (
              <div key={f.title} className="feature-card card border-0 shadow-sm rounded-4 p-4 h-100">
                <div className="mb-3 d-flex align-items-center justify-content-center rounded-3" style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #19875420, #0d6efd20)' }}>
                  <i className={`bi ${f.icon} fs-4 text-success`}></i>
                </div>
                <h5 className="fw-bold mb-2">{f.title}</h5>
                <p className="text-muted mb-0" style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="mb-5 px-3 px-md-4">
          <div className="text-center mb-5">
            <div className="section-divider mx-auto mb-3" style={{ background: 'linear-gradient(90deg, #6f42c1, #d63384)' }}></div>
            <h2 className="fw-bold mb-2">How It Works</h2>
            <p className="text-muted" style={{ fontSize: '1.05rem' }}>Get started in three simple steps</p>
          </div>
          <div className="d-flex justify-content-center align-items-start flex-wrap gap-4 gap-lg-0" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {[
              { icon: 'bi-person-plus', title: 'Sign Up Free', desc: 'Create your free account in seconds. No credit card needed.' },
              { icon: 'bi-grid', title: 'Pick a Course', desc: 'Browse categories, choose a language and find the perfect course.' },
              { icon: 'bi-trophy', title: 'Start Learning', desc: 'Follow lessons, code in the editor, take quizzes and earn certificates.' },
            ].map((step, i) => (
              <div key={i} className="d-flex align-items-start flex-column flex-lg-row gap-3">
                <div className="text-center step-card" style={{ width: '280px' }}>
                  <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #198754, #0d6efd)', boxShadow: '0 8px 25px rgba(25,135,84,0.3)' }}>
                    <i className={`bi ${step.icon} text-white`} style={{ fontSize: '2rem' }}></i>
                  </div>
                  <div className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 mb-2 fw-semibold">Step {i + 1}</div>
                  <h4 className="fw-bold mb-2">{step.title}</h4>
                  <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>{step.desc}</p>
                </div>
                {i < 2 && (
                  <div className="d-none d-lg-flex align-items-center pt-4">
                    <i className="bi bi-chevron-double-right step-arrow"></i>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ─── TESTIMONIALS / TRUST ─── */}
        <section className="mb-5 px-3 px-md-4">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)' }}>
            <div className="card-body p-5">
              <div className="text-center mb-5">
                <div className="section-divider mx-auto mb-3" style={{ background: 'linear-gradient(90deg, #198754, #20c997)' }}></div>
                <h2 className="fw-bold mb-2">Why LearnHub?</h2>
                <p className="text-muted" style={{ fontSize: '1.05rem' }}>We're building the best free coding platform in the world</p>
              </div>
              <div className="row g-4 justify-content-center">
                {[
                  {
                    icon: 'bi-translate',
                    title: 'Content in Your Language',
                    desc: 'Learn in English, Urdu, or Roman Urdu. We break the language barrier so everyone can learn to code.',
                    gradient: 'linear-gradient(135deg, #198754, #20c997)',
                  },
                  {
                    icon: 'bi-code-slash',
                    title: 'Learn by Doing',
                    desc: "It's not just reading. Write real code in our live editor, run it instantly and see results in real time.",
                    gradient: 'linear-gradient(135deg, #0d6efd, #6610f2)',
                  },
                  {
                    icon: 'bi-award',
                    title: 'Earn Certificates',
                    desc: 'Complete a course and get a real certificate. Add it to your LinkedIn, resume or share it proudly.',
                    gradient: 'linear-gradient(135deg, #fd7e14, #ffc107)',
                  },
                ].map((item, i) => (
                  <div className="col-md-4" key={i}>
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100 text-center" style={{ transition: 'all 0.3s ease' }}>
                      <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: 72, height: 72, background: item.gradient, boxShadow: `0 8px 20px ${i === 0 ? 'rgba(25,135,84,0.3)' : i === 1 ? 'rgba(13,110,253,0.3)' : 'rgba(253,126,20,0.3)'}` }}>
                        <i className={`bi ${item.icon} text-white`} style={{ fontSize: '1.8rem' }}></i>
                      </div>
                      <h4 className="fw-bold mb-3">{item.title}</h4>
                      <p className="text-muted mb-0" style={{ fontSize: '0.95rem', lineHeight: 1.7 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA BANNER ─── */}
        <section className="mb-5 px-3 px-md-4">
          <div className="cta-section rounded-4 p-5 p-md-5 text-center text-white position-relative overflow-hidden">
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
            <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 className="fw-bold mb-3" style={{ fontSize: '2.2rem' }}>Ready to Start Your Coding Journey?</h2>
              <p className="mb-4 text-white-50" style={{ fontSize: '1.1rem', maxWidth: 550, margin: '0 auto' }}>
                Join thousands of learners building their future with code. It's 100% free.
              </p>
              <Link to="/register" className="btn btn-light btn-lg px-5 py-3 fw-bold rounded-pill hero-btn" style={{ boxShadow: '0 8px 25px rgba(0,0,0,0.2)' }}>
                <i className="bi bi-rocket-takeoff me-2"></i> Get Started Free
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
