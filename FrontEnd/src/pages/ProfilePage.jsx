import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Edit3, 
  Save, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Ticket, 
  LogOut, 
  Sparkles,
  HeartPulse,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useQueue } from '../context/QueueContext';
import Card, { CardBody, CardHeader } from '../components/common/Card';
import Button from '../components/common/Button';
import FormField from '../components/common/FormField';
import Badge from '../components/common/Badge';
import TicketCard from '../components/queue/TicketCard';
import './ProfilePage.css';

export function ProfilePage() {
  const { user, updateProfile, logout, isAuthenticated } = useAuth();
  const { tickets } = useQueue();
  const navigate = useNavigate();

  // Redirect to login if user not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true, state: { from: '/profile' } });
    }
  }, [isAuthenticated, navigate]);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    nik: user?.nik || '',
    address: user?.address || '',
    gender: user?.gender || 'Laki-laki',
    birthDate: user?.birthDate || '',
    password: '',
    password_confirmation: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        nik: user.nik || '',
        address: user.address || '',
        gender: user.gender || 'Laki-laki',
        birthDate: user.birthDate || ''
      }));
    }
  }, [user]);

  if (!user) return null;

  // Filter user's tickets
  const userTickets = (tickets || []).filter(t => 
    (t.patientName && t.patientName.toLowerCase() === user.name.toLowerCase()) ||
    (t.nik && t.nik === user.nik) ||
    (t.phone && t.phone === user.phone)
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nama lengkap wajib diisi';
    if (!formData.phone.trim()) newErrors.phone = 'Nomor telepon wajib diisi';
    if (!formData.nik.trim()) {
      newErrors.nik = 'NIK KTP wajib diisi';
    } else if (formData.nik.length < 10) {
      newErrors.nik = 'NIK minimal 10 digit';
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Kata sandi baru minimal 6 karakter';
    }
    if (formData.password && formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Konfirmasi kata sandi tidak cocok';
    }
    return newErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const valErrors = validate();
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        nik: formData.nik,
        address: formData.address,
        gender: formData.gender,
        birth_date: formData.birthDate,
      };

      if (formData.password) {
        payload.password = formData.password;
        payload.password_confirmation = formData.password_confirmation;
      }

      const res = await updateProfile(payload);
      setLoading(false);

      if (res.success) {
        setIsEditing(false);
        setFeedback({
          type: 'success',
          message: 'Data profil Anda berhasil diperbarui dan tersimpan di sistem rekam medis.'
        });
        setTimeout(() => setFeedback(null), 4000);
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Gagal memperbarui profil. Silakan coba lagi.'
        });
      }
    } catch (err) {
      setLoading(false);
      setFeedback({
        type: 'error',
        message: 'Terjadi kesalahan sistem saat memperbarui profil.'
      });
    }
  };

  return (
    <div className="profile-page-wrapper">
      <div className="container profile-container">
        {/* Page Top Header */}
        <div className="profile-header-card">
          <div className="profile-header-left">
            <div className="profile-avatar-box">
              <User size={38} />
            </div>
            <div className="profile-title-block">
              <div className="profile-badge-row">
                <span className="profile-role-badge">
                  <ShieldCheck size={14} />
                  Pasien Terdaftar RS Qless
                </span>
                <span className="profile-status-dot">
                  <span className="dot" /> Akun Aktif
                </span>
              </div>
              <h1 className="profile-user-name">{user.name}</h1>
              <p className="profile-user-email">
                <Mail size={14} /> {user.email}
              </p>
            </div>
          </div>

          <div className="profile-header-actions">
            {!isEditing ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsEditing(true)}
                iconLeft={<Edit3 size={16} />}
              >
                Edit Data Diri
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setIsEditing(false);
                  setErrors({});
                }}
                iconLeft={<X size={16} />}
              >
                Batal
              </Button>
            )}
            <Button
              variant="ghost"
              size="md"
              onClick={logout}
              iconLeft={<LogOut size={16} />}
              className="profile-logout-btn"
            >
              Keluar
            </Button>
          </div>
        </div>

        {/* Notification Toast */}
        {feedback && (
          <div className={`profile-feedback-box ${feedback.type}`}>
            {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="profile-content-grid">
          {/* Left Column: Data Diri Details / Form */}
          <div className="profile-main-col">
            <Card className="profile-card">
              <CardHeader className="profile-card-header">
                <div className="card-header-icon-box">
                  <User size={18} />
                </div>
                <div>
                  <h2 className="card-section-title">Informasi Data Diri Pasien</h2>
                  <p className="card-section-subtitle">
                    Data identitas digunakan untuk validasi antrean loket dan pencatatan rekam medis elektronik.
                  </p>
                </div>
              </CardHeader>

              <CardBody className="profile-card-body">
                {isEditing ? (
                  <form onSubmit={handleSave} className="profile-edit-form" noValidate>
                    <div className="form-two-cols">
                      <FormField
                        label="Nama Lengkap (Sesuai KTP)"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        error={errors.name}
                        iconLeft={<User size={16} />}
                      />
                      <FormField
                        label="Alamat Email (Akun)"
                        name="email"
                        value={formData.email}
                        disabled
                        iconLeft={<Mail size={16} />}
                        hint="Email terdaftar sebagai identitas akun utama."
                      />
                    </div>

                    <div className="form-two-cols">
                      <FormField
                        label="Nomor WhatsApp / HP"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        error={errors.phone}
                        iconLeft={<Phone size={16} />}
                      />
                      <FormField
                        label="Nomor Induk Kependudukan (NIK)"
                        name="nik"
                        value={formData.nik}
                        onChange={handleInputChange}
                        required
                        error={errors.nik}
                        iconLeft={<CreditCard size={16} />}
                        placeholder="16 Digit NIK KTP"
                      />
                    </div>

                    <div className="form-two-cols">
                      <div className="form-group">
                        <label className="form-label">Jenis Kelamin</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="form-select-custom"
                        >
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      </div>
                      <FormField
                        label="Tanggal Lahir"
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        iconLeft={<Calendar size={16} />}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Alamat Domisili Lengkap</label>
                      <textarea
                        name="address"
                        rows={3}
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Nama jalan, RT/RW, Kelurahan, Kecamatan, Kota..."
                        className="form-textarea-custom"
                      />
                    </div>

                    <div className="password-change-box">
                      <h4 className="password-box-title">
                        <Lock size={15} /> Ganti Kata Sandi (Opsional)
                      </h4>
                      <p className="password-box-desc">
                        Kosongkan jika Anda tidak ingin mengubah kata sandi akun saat ini.
                      </p>
                      <div className="form-two-cols" style={{ marginTop: '12px' }}>
                        <FormField
                          label="Kata Sandi Baru"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Minimal 6 karakter"
                          error={errors.password}
                        />
                        <FormField
                          label="Konfirmasi Kata Sandi Baru"
                          name="password_confirmation"
                          type="password"
                          value={formData.password_confirmation}
                          onChange={handleInputChange}
                          placeholder="Ulangi kata sandi baru"
                          error={errors.password_confirmation}
                        />
                      </div>
                    </div>

                    <div className="form-actions-row">
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        loading={loading}
                        iconLeft={<Save size={16} />}
                      >
                        Simpan Perubahan
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        onClick={() => {
                          setIsEditing(false);
                          setErrors({});
                        }}
                      >
                        Batal
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-details-view">
                    <div className="profile-info-grid">
                      <div className="info-item">
                        <span className="info-label">Nama Lengkap</span>
                        <div className="info-value-row">
                          <User size={15} className="info-icon" />
                          <strong className="info-value">{user.name || '-'}</strong>
                        </div>
                      </div>

                      <div className="info-item">
                        <span className="info-label">Alamat Email</span>
                        <div className="info-value-row">
                          <Mail size={15} className="info-icon" />
                          <span className="info-value">{user.email || '-'}</span>
                        </div>
                      </div>

                      <div className="info-item">
                        <span className="info-label">Nomor WhatsApp / HP</span>
                        <div className="info-value-row">
                          <Phone size={15} className="info-icon" />
                          <span className="info-value">{user.phone || '-'}</span>
                        </div>
                      </div>

                      <div className="info-item">
                        <span className="info-label">Nomor Induk Kependudukan (NIK)</span>
                        <div className="info-value-row">
                          <CreditCard size={15} className="info-icon" />
                          <span className="info-value font-mono">{user.nik || '-'}</span>
                        </div>
                      </div>

                      <div className="info-item">
                        <span className="info-label">Jenis Kelamin</span>
                        <div className="info-value-row">
                          <span className="info-value">{user.gender || 'Laki-laki'}</span>
                        </div>
                      </div>

                      <div className="info-item">
                        <span className="info-label">Tanggal Lahir</span>
                        <div className="info-value-row">
                          <Calendar size={15} className="info-icon" />
                          <span className="info-value">{user.birthDate || user.birth_date || '-'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="info-item full-width" style={{ marginTop: '16px' }}>
                      <span className="info-label">Alamat Domisili</span>
                      <div className="info-value-row">
                        <MapPin size={15} className="info-icon" />
                        <span className="info-value">
                          {user.address || 'Belum diisi. Klik tombol "Edit Data Diri" untuk melengkapi alamat domisili Anda.'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Right Column: Quick Status & Recent Tickets */}
          <div className="profile-side-col">
            {/* Quick Actions Card */}
            <Card className="profile-side-card">
              <CardBody>
                <div className="side-card-badge">
                  <Sparkles size={14} />
                  <span>SMART QUEUE</span>
                </div>
                <h3 className="side-card-title">Kunjungan Poliklinik</h3>
                <p className="side-card-desc">
                  Reservasi dokter spesialis sekarang tanpa repot antre sejak subuh.
                </p>
                <Button
                  as={Link}
                  to="/appointment"
                  variant="primary"
                  size="md"
                  className="w-full"
                  iconLeft={<Ticket size={16} />}
                >
                  Buat Janji Dokter Baru
                </Button>
                <Button
                  as={Link}
                  to="/queue"
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  style={{ marginTop: '8px' }}
                  iconLeft={<Clock size={15} />}
                >
                  Lihat Antrean Real-Time
                </Button>
              </CardBody>
            </Card>

            {/* Active Tickets List */}
            <div className="user-active-tickets-box">
              <div className="section-title-sm">
                <Ticket size={16} />
                <span>Tiket Antrean Terdaftar ({userTickets.length})</span>
              </div>

              {userTickets.length > 0 ? (
                <div className="tickets-mini-list">
                  {userTickets.map(ticket => (
                    <div key={ticket.id} className="ticket-mini-item">
                      <div className="ticket-mini-top">
                        <span className="ticket-mini-num">{ticket.ticketNumber}</span>
                        <Badge
                          variant={
                            ticket.status === 'serving' ? 'success' :
                            ticket.status === 'waiting' ? 'primary' :
                            ticket.status === 'completed' ? 'secondary' : 'accent'
                          }
                          size="sm"
                        >
                          {ticket.status === 'serving' ? 'Sedang Dilayani' :
                           ticket.status === 'waiting' ? 'Siap Dipanggil' :
                           ticket.status === 'completed' ? 'Selesai' : 'Menunggu Validasi'}
                        </Badge>
                      </div>
                      <p className="ticket-mini-clinic">{ticket.clinicName}</p>
                      <p className="ticket-mini-doc">{ticket.doctorName}</p>
                      <div className="ticket-mini-meta">
                        <span>Kode: <strong>{ticket.bookingCode}</strong></span>
                        <span>Estimasi: {ticket.estimatedCall}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-tickets-box">
                  <HeartPulse size={32} className="no-tickets-icon" />
                  <p className="no-tickets-text">Belum ada tiket antrean aktif hari ini.</p>
                  <Link to="/appointment" className="no-tickets-link">
                    + Reservasi Antrean Dokter
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
