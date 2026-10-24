import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Activity, 
  Sparkles,
  Clock,
  Eye,
  EyeOff,
  AlertTriangle,
  ShieldCheck,
  User,
  CheckCircle2
} from 'lucide-react';
import { useAuth, ADMIN_CREDENTIALS } from '../context/AuthContext';
import { getBruteForceStatus } from '../utils/security';
import FormField from '../components/common/FormField';
import Button from '../components/common/Button';
import './AuthPages.css';

export function LoginPage() {
  const [activeRoleTab, setActiveRoleTab] = useState('patient'); // 'patient' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [bruteForceInfo, setBruteForceInfo] = useState({ isLocked: false, remainingSeconds: 0 });

  const { login } = useAuth();
  const navigate = useNavigate();

  // Check anti brute-force status on mount and on ticker
  useEffect(() => {
    const status = getBruteForceStatus();
    setBruteForceInfo(status);

    if (status.isLocked) {
      const interval = setInterval(() => {
        const updated = getBruteForceStatus();
        setBruteForceInfo(updated);
        if (!updated.isLocked) clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Alamat email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!password) {
      newErrors.password = 'Kata sandi wajib diisi';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (bruteForceInfo.isLocked) {
      setErrors({
        general: `Akun terkunci sementara karena terlalu banyak percobaan gagal. Silakan tunggu ${bruteForceInfo.remainingSeconds} detik.`
      });
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      setLoading(false);

      if (!res.success) {
        setErrors({ general: res.error || 'Autentikasi gagal.' });
        return;
      }

      // Role-based routing: Admin directly to dashboard, Patient to home
      if (res.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setLoading(false);
      setErrors({ general: 'Terjadi kesalahan sistem saat mencoba masuk.' });
    }
  };

  return (
    <div className="auth-split-layout">
      {/* 1. Left Side: Form Container */}
      <div className="auth-form-side">
        <div className="auth-form-card">
          <div className="auth-brand-header">
            <Link to="/" className="auth-brand-logo">
              <div className="brand-icon-box">
                <Activity size={20} />
              </div>
              <span className="brand-title">Qless</span>
            </Link>
          </div>

          <div className="auth-title-group">
            <h1 className="auth-heading">Masuk ke Akun Anda</h1>
            <p className="auth-subheading">
              Smart Hospital Queue — Satu pintu masuk terintegrasi untuk pasien konsultasi dan staf administrator loket rumah sakit.
            </p>
          </div>

          {/* Role Mode Selector */}
          <div className="auth-role-tabs-wrapper">
            <div className="auth-role-tabs">
              <button
                type="button"
                className={`auth-role-tab ${activeRoleTab === 'patient' ? 'active' : ''}`}
                onClick={() => {
                  setActiveRoleTab('patient');
                  setErrors({});
                }}
              >
                <User size={15} />
                <span>Pasien / Pengunjung</span>
              </button>
              <button
                type="button"
                className={`auth-role-tab ${activeRoleTab === 'admin' ? 'active' : ''}`}
                onClick={() => {
                  setActiveRoleTab('admin');
                  setErrors({});
                  if (!email) setEmail('admin@mail.com');
                }}
              >
                <ShieldCheck size={15} />
                <span>Petugas Loket (Admin)</span>
              </button>
            </div>

            {activeRoleTab === 'admin' ? (
              <div className="auth-role-hint admin-hint">
                <div className="hint-text-wrap">
                  <ShieldCheck size={16} className="text-primary flex-shrink-0" />
                  <span>Portal Administrator Loket & Poliklinik RS.</span>
                </div>
                <button
                  type="button"
                  className="quick-demo-fill-btn"
                  onClick={() => {
                    setEmail('admin@mail.com');
                    setPassword('admin123');
                    setErrors({});
                  }}
                >
                  Isi Kredensial Admin
                </button>
              </div>
            ) : (
              <div className="auth-role-hint patient-hint">
                <div className="hint-text-wrap">
                  <User size={16} className="text-primary flex-shrink-0" />
                  <span>Portal Pasien untuk reservasi & cek status tiket.</span>
                </div>
                <button
                  type="button"
                  className="quick-demo-fill-btn"
                  onClick={() => {
                    setEmail('hendra.wijaya@gmail.com');
                    setPassword('admin123');
                    setErrors({});
                  }}
                >
                  Isi Demo Pasien
                </button>
              </div>
            )}
          </div>

          {errors.general && (
            <div className="auth-general-error-box" role="alert" style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '12px 14px',
              color: 'var(--danger)',
              fontSize: '13px',
              lineHeight: '1.4',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}>
              <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-actual-form" noValidate>
            <FormField
              label={activeRoleTab === 'admin' ? "Email Petugas Loket (Admin)" : "Alamat Email Pasien"}
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email || errors.general) setErrors(prev => ({ ...prev, email: '', general: '' }));
              }}
              placeholder={activeRoleTab === 'admin' ? "admin@mail.com" : "nama@email.com"}
              required
              error={errors.email}
              iconLeft={activeRoleTab === 'admin' ? <ShieldCheck size={16} /> : <Mail size={16} />}
            />

            <div className="auth-password-wrapper">
              <FormField
                label="Kata Sandi"
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password || errors.general) setErrors(prev => ({ ...prev, password: '', general: '' }));
                }}
                placeholder="••••••••"
                required
                error={errors.password}
                iconLeft={<Lock size={16} />}
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(prev => !prev)}
                title={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="auth-options-row">
              <label className="remember-me-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Ingat saya di perangkat ini</span>
              </label>

              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Hubungi IT Support RS untuk reset kata sandi.');
                }}
                className="forgot-link"
              >
                Lupa kata sandi?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={bruteForceInfo.isLocked}
              className="w-full"
              iconRight={<LogIn size={18} />}
            >
              {bruteForceInfo.isLocked
                ? `Akun Terkunci (${bruteForceInfo.remainingSeconds}s)`
                : 'Masuk'}
            </Button>
          </form>

          <div className="auth-switch-footer">
            <p>
              Belum memiliki akun rekam medis digital?{' '}
              <Link to="/register" className="auth-switch-link">
                Daftar Pasien Baru
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Right Side: Supporting Visual & Message */}
      <div className="auth-visual-side">
        <div className="auth-visual-content">
          <div className="visual-badge">
            <Sparkles size={14} />
            <span>SMART HOSPITAL QUEUE</span>
          </div>

          <h2 className="visual-heading">
            Satu Sistem Terpadu untuk Pasien dan Staf Medis Rumah Sakit
          </h2>

          <p className="visual-description">
            Sistem Qless menyelaraskan alur pendaftaran, antrean dokter poliklinik, dan verifikasi kehadiran secara real-time.
          </p>

          <div className="visual-features-list">
            <div className="visual-feature-item">
              <div className="feature-icon-circle">
                <Clock size={16} />
              </div>
              <div>
                <strong>Kemudahan Pasien & Pemantauan Antrean</strong>
                <p>Reservasi online dokter spesialis dan pantau estimasi giliran langsung dari ponsel Anda.</p>
              </div>
            </div>

            <div className="visual-feature-item">
              <div className="feature-icon-circle">
                <ShieldCheck size={16} />
              </div>
              <div>
                <strong>Portal Administrasi & Loket Terpadu</strong>
                <p>Petugas loket memverifikasi kehadiran pasien, memanggil nomor antrean, dan memantau ruang poli.</p>
              </div>
            </div>

            <div className="visual-feature-item">
              <div className="feature-icon-circle">
                <Activity size={16} />
              </div>
              <div>
                <strong>Standar Keamanan Rekam Medis</strong>
                <p>Kepatuhan privasi standar kesehatan nasional dengan proteksi sesi bertanda tangan digital.</p>
              </div>
            </div>
          </div>

          <div className="visual-quote-box">
            <p className="quote-text">
              "Pelayanan berobat di RS Qless sangat efisien. Alur antrean tertata rapi dari pendaftaran hingga konsultasi dokter."
            </p>
            <span className="quote-author">— Dr. Siti Rahmawati, Spesialis Kedokteran Keluarga</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
