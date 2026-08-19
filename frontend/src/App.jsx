import { useState } from 'react';
import { Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import { useTheme } from './contexts/ThemeContext';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import LessonView from './pages/LessonView';
import QuizView from './pages/QuizView';
import Practice from './pages/Practice';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Search from './pages/Search';
import Certificate from './pages/Certificate';
import Payment from './pages/Payment';

function Navbar() {
  const { user, logout } = useAuth();
  const { lang, setLang, LANGUAGES } = useLanguage();
  const { dark, toggle: toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const [searchVal, setSearchVal] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
      setCollapsed(true);
    }
  }

  return (
    <nav className={`navbar navbar-expand-lg ${dark ? 'navbar-dark bg-dark' : 'navbar-light bg-white'} border-bottom border-3 border-success shadow-sm sticky-top`}>
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold fs-4">
          <i className="bi bi-mortarboard-fill text-success me-2"></i>
          Learn<b className="text-success">Hub</b>
        </Link>

        <div className="d-flex align-items-center gap-2 d-lg-none">
          <form className="nav-search d-none d-sm-flex" onSubmit={handleSearch}>
            <i className="bi bi-search nav-search-icon"></i>
            <input className="nav-search-input" type="search" placeholder="Search..." value={searchVal} onChange={e => setSearchVal(e.target.value)} />
          </form>
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {dark ? <i className="bi bi-sun-fill"></i> : <i className="bi bi-moon-fill"></i>}
          </button>
          <button className="navbar-toggler border-0" type="button" onClick={() => setCollapsed(!collapsed)}>
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        <div className={`collapse navbar-collapse ${collapsed ? '' : 'show'}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active fw-semibold' : ''}`} onClick={() => setCollapsed(true)}>
                <i className="bi bi-house-door me-1"></i> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/courses" className={({ isActive }) => `nav-link ${isActive ? 'active fw-semibold' : ''}`} onClick={() => setCollapsed(true)}>
                <i className="bi bi-book me-1"></i> Courses
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/practice" className={({ isActive }) => `nav-link ${isActive ? 'active fw-semibold' : ''}`} onClick={() => setCollapsed(true)}>
                <i className="bi bi-pencil-square me-1"></i> Practice
              </NavLink>
            </li>
            {user && (
              <li className="nav-item">
                <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active fw-semibold' : ''}`} onClick={() => setCollapsed(true)}>
                  <i className="bi bi-bar-chart me-1"></i> My Progress
                </NavLink>
              </li>
            )}
            {user && user.role === 'admin' && (
              <li className="nav-item">
                <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active fw-semibold' : ''}`} onClick={() => setCollapsed(true)}>
                  <i className="bi bi-gear me-1"></i> Admin
                </NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <form className="nav-search d-none d-lg-flex" onSubmit={handleSearch}>
              <i className="bi bi-search nav-search-icon"></i>
              <input className="nav-search-input" type="search" placeholder="Search courses & lessons..." value={searchVal} onChange={e => setSearchVal(e.target.value)} />
            </form>

            <button className="theme-toggle d-none d-lg-flex" onClick={toggleTheme} title="Toggle theme">
              {dark ? <i className="bi bi-sun-fill"></i> : <i className="bi bi-moon-fill"></i>}
            </button>

            <div className="lang-picker border rounded-pill px-3 py-1 bg-light">
              <i className="bi bi-globe2 text-success me-1"></i>
              <select className="border-0 bg-transparent text-dark" value={lang} onChange={e => setLang(e.target.value)}>
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
              </select>
            </div>
            {user ? (
              <>
                <span className="badge bg-light text-dark border px-3 py-2">
                  <i className="bi bi-person-circle me-1"></i> {user.name}
                </span>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => { logout(); navigate('/'); setCollapsed(true); }}>
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-success btn-sm" onClick={() => setCollapsed(true)}>Login</Link>
                <Link to="/register" className="btn btn-success btn-sm" onClick={() => setCollapsed(true)}>
                  <i className="bi bi-person-plus me-1"></i> Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container flex-grow-1 py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:slug" element={<CourseDetail />} />
          <Route path="/lesson/:courseSlug/:lessonId" element={<LessonView />} />
          <Route path="/quiz/:courseSlug/:quizId" element={<QuizView />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/search" element={<Search />} />
          <Route path="/certificate/:courseSlug" element={<Certificate />} />
          <Route path="/payment/:courseId" element={<Payment />} />
        </Routes>
      </main>
      <footer className="footer-section text-center">
        <div className="container">
          <p className="mb-0">
            <i className="bi bi-mortarboard-fill text-success me-1"></i>
            LearnHub &copy; 2026 &mdash; Learn coding the easy way.
          </p>
        </div>
      </footer>
    </div>
  );
}
