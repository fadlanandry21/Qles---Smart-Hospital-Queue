import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  CreditCard, 
  CheckCircle2, 
  Activity, 
  Sparkles,
  ShieldCheck,
  CalendarCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/common/FormField';
import Button from '../components/common/Button';
import './AuthPages.css';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nik: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nama lengkap wajib diisi';
    if (!formData.email.trim()) {
      newErrors.email = 'Alamat email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Nomor WhatsApp wajib diisi';
    if (!formData.nik.trim()) {
      newErrors.nik = 'NIK KTP wajib diisi';
    } else if (formData.nik.length < 16) {
      newErrors.nik = 'NIK harus 16 digit';
    }
    if (!formData.password) {
      newErrors.password = 'Kata sandi minimal 8 karakter';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Kata sandi terlalu pendek';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi kata sandi tidak cocok';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Anda harus menyetujui syarat & ketentuan';
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

    setLoading(true);
    try {
      const res = await register(formData);
      setLoading(false);
      if (!res.success) {
        setErrors({ email: res.error || 'Pendaftaran gagal.' });
        return;
      }
      navigate('/appointment');
    } catch (err) {
      setLoading(false);
      setErrors({ email: 'Terjadi kesalahan sistem saat mendaftar.' });
    }
  };

  return (
    <div className="auth-split-layout">
      {/* 1. Left Form Side */}
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
            <h1 className="auth-heading">Pendaftaran Pasien Baru</h1>
            <p className="auth-subheading">
              Smart Hospital Queue — Buat akun dalam 1 menit untuk kemudahan reservasi antrean dokter dan rekam medis elektronik.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-actual-form" noValidate>
            <FormField
              label="Nama Lengkap (Sesuai KTP)"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Contoh: Siti Rahmawati"
              required
              error={errors.name}
              iconLeft={<User size={16} />}
            />

            <div className="form-row-2">
              <FormField
                label="Nomor WhatsApp / HP"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="0812-xxxx-xxxx"
                required
                error={errors.phone}
                iconLeft={<Phone size={16} />}
              />

              <FormField
                label="NIK (No. Induk Kependudukan)"
                name="nik"
                value={formData.nik}
                onChange={handleInputChange}
                placeholder="16 digit NIK KTP"
                required
                error={errors.nik}
                iconLeft={<CreditCard size={16} />}
                maxLength={16}
                inputMode="numeric"
                pattern="\d{16}"
              />
            </div>

            <FormField
              label="Alamat Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="nama@email.com"
              required
              error={errors.email}
              iconLeft={<Mail size={16} />}
            />

            <div className="form-row-2">
              <FormField
                label="Kata Sandi"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Minimal 6 karakter"
                required
                error={errors.password}
                iconLeft={<Lock size={16} />}
              />

              <FormField
                label="Konfirmasi Kata Sandi"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Ulangi kata sandi"
                required
                error={errors.confirmPassword}
                iconLeft={<Lock size={16} />}
              />
            </div>

            <div className="auth-options-row">
              <label className="remember-me-label">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                />
                <span>
                  Saya menyetujui <Link to="/terms">Syarat Ketentuan</Link> dan <Link to="/privacy">Kebijakan Privasi</Link>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="form-error">{errors.agreeTerms}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
              iconRight={<UserPlus size={18} />}
            >
              Daftar & Lanjutkan Reservasi
            </Button>
          </form>

          <div className="auth-switch-footer">
            <p>
              Sudah memiliki akun terdaftar?{' '}
              <Link to="/login" className="auth-switch-link">
                Masuk di Sini
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Right Side: Supporting Visual & Message */}
      <div className="auth-visual-side register-theme">
        <div className="auth-visual-content">
          <div className="visual-badge">
            <Sparkles size={14} />
            <span>PENGALAMAN BEROBAT MODERN</span>
          </div>

          <h2 className="visual-heading">
            Satu Akun untuk Seluruh Kebutuhan Kesehatan Keluarga
          </h2>

          <p className="visual-description">
            Daftarkan diri Anda sekali dan nikmati kemudahan akses ke lebih dari 150 dokter spesialis dan sub-spesialis terkemuka.
          </p>

          <div className="visual-features-list">
            <div className="visual-feature-item">
              <div className="feature-icon-circle">
                <CalendarCheck size={16} />
              </div>
              <div>
                <strong>Reservasi Hingga 14 Hari ke Depan</strong>
                <p>Pilih hari dan slot waktu luang tanpa khawatir kehabisan kuota poliklinik.</p>
              </div>
            </div>

            <div className="visual-feature-item">
              <div className="feature-icon-circle">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <strong>Check-In Mandiri Cepat via Barcode</strong>
                <p>Cukup pindai kode reservasi di kiosk lobi rumah sakit dalam 10 detik.</p>
              </div>
            </div>

            <div className="visual-feature-item">
              <div className="feature-icon-circle">
                <ShieldCheck size={16} />
              </div>
              <div>
                <strong>Aman & Terverifikasi KARS</strong>
                <p>Seluruh identitas medis Anda terintegrasi langsung dengan standar privasi tertinggi.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
