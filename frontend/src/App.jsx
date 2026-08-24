import { useState, useEffect } from 'react';
import { Routes, Route, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
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

function Sidebar({ open, setOpen }) {
  const { user, logout } = useAuth();
  const { theme: dark, toggleTheme } = useTheme();
  const { lang, setLang, LANGUAGES } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const navItems = [
    { to: '/', icon: 'bi-house-door', label: 'Home' },
    { to: '/courses', icon: 'bi-book', label: 'Courses' },
    { to: '/practice', icon: 'bi-pencil-square', label: 'Code Playground' },
  ];

  const userItems = user ? [
    { to: '/dashboard', icon: 'bi-bar-chart', label: 'My Progress' },
    { to: '/search', icon: 'bi-search', label: 'Search' },
  ] : [];

  const adminItems = user && user.role === 'admin' ? [
    { to: '/admin', icon: 'bi-gear', label: 'Admin Panel' },
  ] : [];

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-brand">
            <div className="sidebar-logo">
              <i className="bi bi-mortarboard-fill"></i>
            </div>
            <span>Learn<b>Hub</b></span>
          </Link>
          <button className="sidebar-close d-lg-none" onClick={() => setOpen(false)}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="sidebar-nav">
          <div className="sidebar-label">Menu</div>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
          {userItems.length > 0 && <div className="sidebar-label mt-3">Personal</div>}
          {userItems.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
          {adminItems.length > 0 && <div className="sidebar-label mt-3">Admin</div>}
          {adminItems.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-label">Settings</div>
          <button className="sidebar-link w-100 text-start" onClick={toggleTheme}>
            <i className={`bi ${dark ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
            <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <div className="sidebar-lang-picker">
            <select className="form-select form-select-sm" value={lang} onChange={e => setLang(e.target.value)}>
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
            </select>
          </div>

          <div className="sidebar-divider"></div>

          {user ? (
            <div className="sidebar-user">
              <div className="sidebar-avatar">{user.name?.charAt(0)?.toUpperCase() || 'U'}</div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{user.name}</div>
                <div className="sidebar-user-email">{user.email}</div>
              </div>
              <button className="sidebar-logout" onClick={() => { logout(); navigate('/'); }} title="Logout">
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-outline-success btn-sm flex-grow-1">Login</Link>
              <Link to="/register" className="btn btn-success btn-sm flex-grow-1">Sign Up</Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function TopBar({ sidebarOpen, setSidebarOpen }) {
  const { dark } = useTheme();
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
    }
  }

  return (
    <header className="topbar">
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-link sidebar-toggle d-lg-none" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <i className="bi bi-list fs-4"></i>
        </button>
        <form className="topbar-search d-none d-md-flex" onSubmit={handleSearch}>
          <i className="bi bi-search"></i>
          <input type="text" placeholder="Search courses, lessons..." value={searchVal} onChange={e => setSearchVal(e.target.value)} />
        </form>
      </div>
      <div className="d-flex align-items-center gap-2">
        <span className="topbar-badge">
          <i className="bi bi-book-half me-1"></i> 14+ Courses
        </span>
      </div>
    </header>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="app-main">
        <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="app-content">
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
        <footer className="app-footer">
          <div>
            <i className="bi bi-mortarboard-fill text-success me-1"></i>
            LearnHub &copy; 2026 &mdash; Built by{' '}
            <a href="https://zain-portfolio786.netlify.app" target="_blank" rel="noopener noreferrer">
              Zainul Abdeen
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
