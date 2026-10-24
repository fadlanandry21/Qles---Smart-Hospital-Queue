import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { 
  CalendarPlus, 
  Menu, 
  X, 
  Activity, 
  User, 
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import Button from '../common/Button';
import './Navbar.css';

export function Navbar() {
  const { scrollDirection, isAtTop } = useScrollDirection({ threshold: 12, initialDelay: 60 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, admin, logoutAdmin, isAdminAuthenticated } = useAuth();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/about', label: 'Tentang' },
    { to: '/doctors', label: 'Dokter' },
    { to: '/queue', label: 'Antrean Live' },
    { to: '/gallery', label: 'Galeri' },
    { to: '/blog', label: 'Artikel' },
    { to: '/contact', label: 'Kontak' }
  ];

  const isHidden = scrollDirection === 'down' && !isAtTop && !mobileMenuOpen;

  return (
    <>
      <header className={`floating-nav-container ${isHidden ? 'is-hidden' : ''} ${!isAtTop ? 'is-scrolled' : ''}`}>
        <nav className="floating-pill-nav" aria-label="Navigasi Utama">
          {/* Brand Logo */}
          <Link to="/" className="nav-brand" aria-label="RS Qless Beranda">
            <div className="brand-icon-box">
              <Activity className="brand-icon" size={20} />
            </div>
            <div className="brand-text-group">
              <span className="brand-title">Qless</span>
              <span className="brand-subtitle">Smart Hospital Queue</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="nav-links-desktop">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  end={link.to === '/'}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Nav Actions (Theme, Auth, Booking CTA) */}
          <div className="nav-actions-desktop">
            <ThemeToggle />

            {isAdminAuthenticated ? (
              <div className="admin-nav-group">
                <Link to="/admin" className="admin-nav-pill" title="Buka Dashboard Manajemen Antrean">
                  <ShieldCheck size={16} className="text-primary" />
                  <span className="admin-pill-text">Dashboard Loket</span>
                </Link>
                <button
                  type="button"
                  onClick={logoutAdmin}
                  className="user-logout-btn"
                  title="Keluar dari Akun Petugas Loket"
                  aria-label="Keluar Admin"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : user ? (
              <div className="user-nav-dropdown">
                <Link to="/profile" className="user-pill-btn" title="Lihat & Edit Profil Saya">
                  <User size={16} />
                  <span className="user-name-short">{user.name.split(' ')[0]} (Profil)</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="user-logout-btn"
                  title="Keluar dari Akun"
                  aria-label="Keluar"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Button as={Link} to="/login" variant="ghost" size="sm">
                Masuk
              </Button>
            )}

            <Button
              as={Link}
              to="/appointment"
              variant="primary"
              size="sm"
              iconLeft={<CalendarPlus size={16} />}
            >
              Buat Janji
            </Button>
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`mobile-drawer-backdrop ${mobileMenuOpen ? 'is-open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer Container */}
      <aside
        className={`mobile-drawer ${mobileMenuOpen ? 'is-open' : ''}`}
        aria-label="Navigasi Menu Seluler"
      >
        <div className="mobile-drawer-header">
          <Link to="/" className="nav-brand" onClick={() => setMobileMenuOpen(false)}>
            <div className="brand-icon-box">
              <Activity className="brand-icon" size={20} />
            </div>
            <div className="brand-text-group">
              <span className="brand-title">Qless</span>
              <span className="brand-subtitle">Smart Hospital Queue</span>
            </div>
          </Link>
          <div className="mobile-drawer-controls">
            <ThemeToggle />
            <button
              type="button"
              className="drawer-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Tutup menu"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="mobile-drawer-body">
          <ul className="drawer-nav-list">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => `drawer-nav-link ${isActive ? 'active' : ''}`}
                  end={link.to === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{link.label}</span>
                  <ChevronRight size={16} className="drawer-nav-arrow" />
                </NavLink>
              </li>
            ))}
            {user && (
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) => `drawer-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Profil & Data Diri Pasien</span>
                  <ChevronRight size={16} className="drawer-nav-arrow" />
                </NavLink>
              </li>
            )}
          </ul>

          <div className="mobile-drawer-cta">
            <Button
              as={Link}
              to="/appointment"
              variant="primary"
              size="lg"
              className="w-full"
              iconLeft={<CalendarPlus size={18} />}
              onClick={() => setMobileMenuOpen(false)}
            >
              Buat Janji Dokter Sekarang
            </Button>

            {isAdminAuthenticated ? (
              <div className="drawer-user-info drawer-admin-info">
                <p className="drawer-user-greeting">
                  <ShieldCheck size={16} className="text-primary inline-icon" />
                  Masuk sebagai <strong>Admin Loket ({admin?.email || 'Staf RS'})</strong>
                </p>
                <div className="drawer-admin-buttons">
                  <Button
                    as={Link}
                    to="/admin"
                    variant="primary"
                    size="md"
                    className="w-full"
                    iconLeft={<ShieldCheck size={16} />}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Buka Dashboard Loket
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      logoutAdmin();
                      setMobileMenuOpen(false);
                    }}
                    iconLeft={<LogOut size={16} />}
                  >
                    Keluar Admin
                  </Button>
                </div>
              </div>
            ) : user ? (
              <div className="drawer-user-info">
                <p className="drawer-user-greeting">
                  Masuk sebagai <strong>{user.name}</strong>
                </p>
                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  <Button
                    as={Link}
                    to="/profile"
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => setMobileMenuOpen(false)}
                    iconLeft={<User size={16} />}
                  >
                    Lihat Profil
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    iconLeft={<LogOut size={16} />}
                  >
                    Keluar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="drawer-auth-buttons">
                <Button
                  as={Link}
                  to="/login"
                  variant="secondary"
                  size="md"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Masuk Akun
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="ghost"
                  size="md"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Daftar Pasien Baru
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Navbar;
