import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  X, 
  Volume2, 
  RotateCcw, 
  Search, 
  CreditCard, 
  FileText, 
  UserCheck, 
  Activity, 
  ArrowRight,
  Eye,
  ShieldCheck,
  LogOut,
  ScanLine,
  QrCode,
  BadgeCheck,
  Trash2,
  Plus,
  Stethoscope,
  MapPin,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';
import { useAuth } from '../context/AuthContext';
import { specialties } from '../data/hospitalData';
import Card, { CardBody, CardHeader } from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import FormField from '../components/common/FormField';
import TicketCard from '../components/queue/TicketCard';
import ThemeToggle from '../components/common/ThemeToggle';
import './AdminDashboardPage.css';

export function AdminDashboardPage() {
  const { 
    tickets, 
    acceptTicket, 
    callPatient, 
    servePatient,
    completeTicket, 
    cancelTicket,
    deleteTicket,
    doctors,
    addDoctor,
    deleteDoctor,
    resetDemoData
  } = useQueue();

  const { admin, logoutAdmin, isAdminAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Protect Admin Dashboard: Redirect to /login if not logged in, or / if logged in as patient
  useEffect(() => {
    if (user && !isAdminAuthenticated) {
      navigate('/', { replace: true, state: { accessDenied: true } });
    } else if (!isAdminAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAdminAuthenticated, user, navigate]);

  const [selectedClinic, setSelectedClinic] = useState('all');
  const [selectedStatusTab, setSelectedStatusTab] = useState('all'); // 'all' | 'pending' | 'waiting' | 'serving' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNotification, setActiveNotification] = useState(null);
  const [previewTicket, setPreviewTicket] = useState(null);

  // Quick Ticket Validation State
  const [validationCode, setValidationCode] = useState('');
  const [validationFeedback, setValidationFeedback] = useState(null);

  // Trigger temporary notification toast
  const showToast = (message, type = 'success') => {
    setActiveNotification({ message, type });
    setTimeout(() => {
      setActiveNotification(null);
    }, 3500);
  };

  // Direct Ticket Validation Handler (Check-In at Counter)
  const handleValidateTicket = (e) => {
    if (e) e.preventDefault();
    const cleanCode = validationCode.trim().toUpperCase();
    if (!cleanCode) {
      setValidationFeedback({
        type: 'error',
        title: 'Kode Kosong',
        message: 'Harap masukkan Kode Booking (misal: QLS-8821) atau Nomor Antrean (misal: A-027).'
      });
      return;
    }

    const foundTicket = tickets.find(t => 
      t.bookingCode.toUpperCase() === cleanCode || 
      t.ticketNumber.toUpperCase() === cleanCode ||
      (t.nik && t.nik.trim() === cleanCode)
    );

    if (!foundTicket) {
      setValidationFeedback({
        type: 'error',
        title: 'Tiket Tidak Ditemukan',
        message: `Tiket dengan kode/nomor "${cleanCode}" tidak terdaftar dalam antrean aktif hari ini. Pastikan kode sudah sesuai.`
      });
      return;
    }

    if (foundTicket.status === 'pending') {
      acceptTicket(foundTicket.bookingCode);
      const updatedTicket = { ...foundTicket, status: 'waiting' };
      setValidationFeedback({
        type: 'success',
        title: 'Tiket Pasien Berhasil Divalidasi!',
        message: `Nomor antrean ${foundTicket.ticketNumber} atas nama ${foundTicket.patientName} telah divalidasi hadir di loket dan siap dipanggil dokter.`,
        ticket: updatedTicket
      });
      showToast(`Antrean ${foundTicket.ticketNumber} (${foundTicket.patientName}) BERHASIL DIVALIDASI!`, 'success');
      setValidationCode('');
    } else if (foundTicket.status === 'waiting') {
      setValidationFeedback({
        type: 'info',
        title: 'Tiket Sudah Divalidasi Sebelumnya',
        message: `Antrean ${foundTicket.ticketNumber} (${foundTicket.patientName}) sudah berada dalam daftar SIAP PANGGIL di ${foundTicket.clinicName} (${foundTicket.room}).`,
        ticket: foundTicket,
        canCall: true
      });
    } else if (foundTicket.status === 'serving') {
      setValidationFeedback({
        type: 'info',
        title: 'Pasien Sedang Diperiksa Dokter',
        message: `Antrean ${foundTicket.ticketNumber} (${foundTicket.patientName}) saat ini sedang menjalani konsultasi di ${foundTicket.room}.`,
        ticket: foundTicket
      });
    } else if (foundTicket.status === 'completed') {
      setValidationFeedback({
        type: 'info',
        title: 'Pelayanan Pasien Sudah Selesai',
        message: `Antrean ${foundTicket.ticketNumber} (${foundTicket.patientName}) telah menyelesaikan konsultasi dan resep obat.`,
        ticket: foundTicket
      });
    } else if (foundTicket.status === 'cancelled') {
      setValidationFeedback({
        type: 'error',
        title: 'Tiket Telah Dibatalkan',
        message: `Antrean ${foundTicket.ticketNumber} (${foundTicket.patientName}) berstatus batal (${foundTicket.cancelReason || 'Dibatalkan loket'}).`,
        ticket: foundTicket
      });
    }
  };

  // Filter tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchClinic = selectedClinic === 'all' || ticket.clinicId === selectedClinic;
      const matchStatus = selectedStatusTab === 'all' || ticket.status === selectedStatusTab;
      
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        ticket.patientName.toLowerCase().includes(q) ||
        ticket.bookingCode.toLowerCase().includes(q) ||
        ticket.ticketNumber.toLowerCase().includes(q) ||
        (ticket.nik && ticket.nik.includes(q));

      return matchClinic && matchStatus && matchSearch;
    });
  }, [tickets, selectedClinic, selectedStatusTab, searchQuery]);

  // Statistics
  const pendingCount = tickets.filter(t => t.status === 'pending').length;
  const waitingCount = tickets.filter(t => t.status === 'waiting').length;
  const servingCount = tickets.filter(t => t.status === 'serving').length;
  const completedCount = tickets.filter(t => t.status === 'completed').length;
  const totalCount = tickets.length;

  const handleAccept = (ticket) => {
    acceptTicket(ticket.bookingCode);
    showToast(`Antrean ${ticket.ticketNumber} (${ticket.patientName}) BERHASIL DITERIMA & masuk ke daftar siap panggil!`, 'success');
  };

  const handleCall = (ticket) => {
    callPatient(ticket.bookingCode);
    const count = (ticket.callCount || 0) + 1;
    showToast(`Panggilan ke-${count}: Memanggil nomor ${ticket.ticketNumber} (${ticket.patientName}) ke ${ticket.room}!`, 'primary');
  };

  const handleServe = (ticket) => {
    servePatient(ticket.bookingCode);
    showToast(`Antrean ${ticket.ticketNumber} (${ticket.patientName}) masuk ke ruang dokter & SEDANG DILAYANI!`, 'success');
  };

  const handleComplete = (ticket) => {
    completeTicket(ticket.bookingCode);
    showToast(`Pelayanan untuk ${ticket.ticketNumber} (${ticket.patientName}) SELESAI.`, 'success');
  };

  const handleDeleteTicket = (ticket) => {
    if (window.confirm(`Hapus permanen nomor antrean ${ticket.ticketNumber} (${ticket.patientName}) dari sistem? Data ini tidak dapat dikembalikan.`)) {
      deleteTicket(ticket.bookingCode);
      showToast(`Antrean ${ticket.ticketNumber} berhasil dihapus permanen.`, 'danger');
    }
  };

  const handleCancel = (ticket) => {
    if (window.confirm(`Batalkan / tolak antrean ${ticket.ticketNumber} (${ticket.patientName})?`)) {
      cancelTicket(ticket.bookingCode, 'Dibatalkan oleh petugas loket');
      showToast(`Antrean ${ticket.ticketNumber} dibatalkan.`, 'danger');
    }
  };

  // --- Doctor Management States & Handlers ---
  const [dashboardTab, setDashboardTab] = useState('queue'); // 'queue' | 'doctors'
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);

  const ALL_DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const STANDARD_SLOTS = [
    '08:00 - 08:30',
    '08:30 - 09:00',
    '09:00 - 09:30',
    '09:30 - 10:00',
    '10:00 - 10:30',
    '10:30 - 11:00',
    '11:00 - 11:30',
    '13:30 - 14:00',
    '14:00 - 14:30',
    '15:00 - 15:30'
  ];

  const initialDoctorState = {
    name: '',
    title: '',
    specialty: 'Penyakit Dalam',
    fee: 'Rp 300.000',
    clinicRoom: 'Ruang 204, Lantai 2',
    totalQuota: '20',
    experience: '8 Tahun',
    education: 'Spesialis FK Universitas Indonesia',
    days: ['Senin', 'Rabu', 'Jumat'],
    selectedSlots: [
      '08:30 - 09:00',
      '09:00 - 09:30',
      '10:00 - 10:30',
      '11:00 - 11:30',
      '13:30 - 14:00',
      '14:00 - 14:30'
    ]
  };

  const [doctorForm, setDoctorForm] = useState(initialDoctorState);

  const handleDeleteDoctor = (doc) => {
    if (window.confirm(`Hapus data ${doc.name} dari sistem poliklinik?`)) {
      deleteDoctor(doc.id);
      showToast(`Data ${doc.name} berhasil dihapus.`, 'danger');
    }
  };

  const handleToggleDay = (day) => {
    setDoctorForm(prev => {
      const exists = prev.days.includes(day);
      return {
        ...prev,
        days: exists ? prev.days.filter(d => d !== day) : [...prev.days, day]
      };
    });
  };

  const handleToggleSlot = (slot) => {
    setDoctorForm(prev => {
      const exists = prev.selectedSlots.includes(slot);
      return {
        ...prev,
        selectedSlots: exists ? prev.selectedSlots.filter(s => s !== slot) : [...prev.selectedSlots, slot]
      };
    });
  };

  const handleSaveDoctor = (e) => {
    e.preventDefault();
    if (!doctorForm.name.trim()) {
      alert('Nama lengkap dokter wajib diisi');
      return;
    }
    if (doctorForm.days.length === 0) {
      alert('Pilih minimal 1 hari jadwal praktik dokter');
      return;
    }
    if (doctorForm.selectedSlots.length === 0) {
      alert('Pilih minimal 1 slot sesi waktu praktik dokter');
      return;
    }

    const totalQ = parseInt(doctorForm.totalQuota, 10) || 20;
    const perSlot = Math.max(1, Math.ceil(totalQ / doctorForm.selectedSlots.length));

    const timeSlots = doctorForm.selectedSlots.map(time => ({
      time,
      available: true,
      quotaRemaining: perSlot
    }));

    addDoctor({
      name: doctorForm.name,
      title: doctorForm.title || `Dokter Spesialis ${doctorForm.specialty}`,
      specialty: doctorForm.specialty,
      fee: doctorForm.fee,
      clinicRoom: doctorForm.clinicRoom,
      totalQuota: totalQ,
      experience: doctorForm.experience,
      education: doctorForm.education,
      days: doctorForm.days,
      timeSlots
    });

    showToast(`Dokter ${doctorForm.name} berhasil ditambahkan!`, 'success');
    setShowAddDoctorModal(false);
    setDoctorForm(initialDoctorState);
  };

  if (!isAdminAuthenticated) {
    return null;
  }

  return (
    <div className="admin-dashboard-page">
      {/* Toast Notification */}
      {activeNotification && (
        <div className={`admin-toast admin-toast-${activeNotification.type}`} role="alert">
          {activeNotification.type === 'success' ? (
            <CheckCircle2 size={18} />
          ) : activeNotification.type === 'danger' ? (
            <AlertCircle size={18} />
          ) : (
            <Volume2 size={18} />
          )}
          <span>{activeNotification.message}</span>
        </div>
      )}

      {/* Top Admin Bar */}
      <header className="admin-header-bar">
        <div className="container admin-header-container">
          <div className="admin-brand-group">
            <div className="admin-logo-badge">
              <Activity size={20} />
            </div>
            <div>
              <div className="admin-badge-role">PORTAL PETUGAS LOKET & POLIKLINIK</div>
              <h1 className="admin-main-title">Dashboard Manajemen Rumah Sakit</h1>
            </div>
          </div>

          <div className="admin-header-actions">
            {/* View Switcher: Antrean vs Kelola Dokter */}
            <div className="admin-main-view-switcher">
              <button
                type="button"
                className={`view-switch-btn ${dashboardTab === 'queue' ? 'active' : ''}`}
                onClick={() => setDashboardTab('queue')}
              >
                <Users size={15} />
                <span>Antrean ({totalCount})</span>
              </button>
              <button
                type="button"
                className={`view-switch-btn ${dashboardTab === 'doctors' ? 'active' : ''}`}
                onClick={() => setDashboardTab('doctors')}
              >
                <Stethoscope size={15} />
                <span>Kelola Dokter & Sesi ({doctors?.length || 0})</span>
              </button>
            </div>

            {/* Active Admin Profile Tag */}
            <div className="admin-active-profile-card">
              <div className="admin-avatar-icon">
                <ShieldCheck size={16} />
              </div>
              <div className="admin-profile-meta">
                <span className="admin-email-tag">{admin?.email || 'admin@mail.com'}</span>
                <span className="admin-title-tag">Admin Loket Resmi</span>
              </div>
            </div>

            <ThemeToggle />

            <Link to="/queue" className="btn btn-sm btn-secondary" target="_blank" rel="noreferrer" title="Buka Layar Monitor Publik di Tab Baru">
              Layar Publik <ArrowRight size={14} />
            </Link>

            <button
              type="button"
              className="btn btn-sm btn-ghost reset-btn"
              onClick={() => {
                if (window.confirm('Muat ulang data simulasi antrean awal?')) {
                  resetDemoData();
                  showToast('Data antrean berhasil di-reset ke status demo awal.');
                }
              }}
              title="Reset data demo ke status awal"
            >
              <RotateCcw size={14} /> Reset Demo
            </button>

            <button
              type="button"
              className="btn btn-sm btn-outline-danger admin-logout-btn"
              onClick={() => {
                logoutAdmin();
                navigate('/login', { replace: true });
              }}
              title="Keluar dari akun admin"
            >
              <LogOut size={14} /> Keluar Admin
            </button>
          </div>
        </div>
      </header>

      <div className="container admin-content-container">
        {dashboardTab === 'queue' && (
          <>
            {/* KPI Stat Cards Grid */}
        <section className="admin-kpi-grid">
          <Card className="kpi-card" elevated>
            <CardBody className="kpi-body">
              <div className="kpi-icon-box primary">
                <Users size={22} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Total Terdaftar Hari Ini</span>
                <strong className="kpi-number">{totalCount}</strong>
                <span className="kpi-sub">Seluruh Poliklinik</span>
              </div>
            </CardBody>
          </Card>

          <Card className={`kpi-card ${pendingCount > 0 ? 'kpi-highlight-pending' : ''}`} elevated>
            <CardBody className="kpi-body">
              <div className="kpi-icon-box accent">
                <AlertCircle size={22} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Perlu Diterima (Pending)</span>
                <strong className="kpi-number accent">{pendingCount}</strong>
                <span className="kpi-sub font-semibold">
                  {pendingCount > 0 ? 'Perlu tindakan loket' : 'Tidak ada antrean tertunda'}
                </span>
              </div>
            </CardBody>
          </Card>

          <Card className="kpi-card" elevated>
            <CardBody className="kpi-body">
              <div className="kpi-icon-box success">
                <Clock size={22} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Siap Dipanggil Dokter</span>
                <strong className="kpi-number">{waitingCount}</strong>
                <span className="kpi-sub">Sudah terverifikasi</span>
              </div>
            </CardBody>
          </Card>

          <Card className="kpi-card" elevated>
            <CardBody className="kpi-body">
              <div className="kpi-icon-box live-serving">
                <Activity size={22} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Sedang Dilayani</span>
                <strong className="kpi-number success">{servingCount}</strong>
                <span className="kpi-sub">Di ruang konsultasi</span>
              </div>
            </CardBody>
          </Card>

          <Card className="kpi-card" elevated>
            <CardBody className="kpi-body">
              <div className="kpi-icon-box neutral">
                <CheckCircle2 size={22} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Pelayanan Selesai</span>
                <strong className="kpi-number text-muted">{completedCount}</strong>
                <span className="kpi-sub">Pasien pulang / ke farmasi</span>
              </div>
            </CardBody>
          </Card>
        </section>

        {/* Loket Validasi & Check-In Tiket Pasien */}
        <Card className="admin-validation-card" elevated>
          <CardBody className="admin-validation-body">
            <div className="admin-validation-header">
              <div className="validation-header-title">
                <div className="validation-icon-circle">
                  <ScanLine size={22} />
                </div>
                <div>
                  <h2 className="validation-main-heading">Loket Validasi & Check-in Tiket Kehadiran Pasien</h2>
                  <p className="validation-sub-heading">
                    Verifikasi kehadiran pasien saat tiba di loket pendaftaran. Masukkan kode booking atau nomor antrean untuk memvalidasi tiket masuk ke daftar panggil dokter.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleValidateTicket} className="admin-validation-form">
              <div className="validation-input-group">
                <div className="validation-input-wrapper">
                  <FormField
                    placeholder="Masukkan Kode Reservasi (contoh: QLS-8821) atau No. Tiket (contoh: A-027)..."
                    value={validationCode}
                    onChange={(e) => {
                      setValidationCode(e.target.value);
                      if (validationFeedback) setValidationFeedback(null);
                    }}
                    iconLeft={<QrCode size={18} />}
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="validation-submit-btn"
                  iconLeft={<BadgeCheck size={18} />}
                >
                  Validasi Kehadiran Tiket
                </Button>
              </div>

              {/* Quick Pending Ticket Validation Suggestions */}
              {pendingCount > 0 && (
                <div className="pending-quick-pills">
                  <span className="quick-pills-label">
                    <UserCheck size={14} />
                    {pendingCount} Antrean Baru Menunggu Validasi Loket:
                  </span>
                  <div className="pills-scroll-row">
                    {tickets.filter(t => t.status === 'pending').map(ticket => (
                      <button
                        key={ticket.bookingCode}
                        type="button"
                        className="quick-validate-pill"
                        title="Klik untuk langsung validasi kehadiran pasien ini"
                        onClick={() => {
                          setValidationCode(ticket.bookingCode);
                          acceptTicket(ticket.bookingCode);
                          const updatedTicket = { ...ticket, status: 'waiting' };
                          setValidationFeedback({
                            type: 'success',
                            title: 'Tiket Berhasil Divalidasi!',
                            message: `Antrean ${ticket.ticketNumber} (${ticket.patientName}) terkonfirmasi hadir di loket dan siap dipanggil dokter.`,
                            ticket: updatedTicket
                          });
                          showToast(`Antrean ${ticket.ticketNumber} (${ticket.patientName}) BERHASIL DIVALIDASI!`, 'success');
                          setValidationCode('');
                        }}
                      >
                        <strong>{ticket.bookingCode}</strong> ({ticket.ticketNumber} • {ticket.patientName.split(' ')[0]})
                        <span className="pill-action-tag">Validasi</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>

            {/* Validation Feedback Result Box */}
            {validationFeedback && (
              <div className={`validation-result-panel result-${validationFeedback.type}`}>
                <div className="validation-result-header">
                  <div className="result-status-title">
                    {validationFeedback.type === 'success' ? (
                      <CheckCircle2 size={22} className="text-success" />
                    ) : validationFeedback.type === 'error' ? (
                      <AlertCircle size={22} className="text-danger" />
                    ) : (
                      <Clock size={22} className="text-primary" />
                    )}
                    <div>
                      <h4 className="result-heading">{validationFeedback.title}</h4>
                      <p className="result-detail-text">{validationFeedback.message}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setValidationFeedback(null)}
                    title="Tutup hasil validasi"
                  >
                    <X size={16} /> Tutup
                  </Button>
                </div>

                {validationFeedback.ticket && (
                  <div className="result-ticket-details-card">
                    <div className="result-meta-row">
                      <div className="result-ticket-badge">
                        <span className="result-code-tag">{validationFeedback.ticket.bookingCode}</span>
                        <span className="result-number-tag">{validationFeedback.ticket.ticketNumber}</span>
                      </div>
                      <div className="result-patient-summary">
                        <strong>{validationFeedback.ticket.patientName}</strong>
                        <span>NIK: {validationFeedback.ticket.nik} • HP: {validationFeedback.ticket.phone}</span>
                        <span className="result-clinic-info">
                          🏥 {validationFeedback.ticket.clinicName} — {validationFeedback.ticket.doctorName} ({validationFeedback.ticket.room})
                        </span>
                      </div>
                      <div className="result-actions-cluster">
                        {validationFeedback.ticket.status === 'waiting' && (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <Button
                              variant="primary"
                              size="sm"
                              iconLeft={<Volume2 size={16} />}
                              onClick={() => {
                                handleCall(validationFeedback.ticket);
                              }}
                            >
                              Panggil Pasien
                            </Button>
                            <Button
                              variant="success"
                              size="sm"
                              iconLeft={<Stethoscope size={16} />}
                              onClick={() => {
                                handleServe(validationFeedback.ticket);
                                setValidationFeedback(null);
                              }}
                            >
                              Sedang Dilayani
                            </Button>
                          </div>
                        )}
                        <Button
                          variant="secondary"
                          size="sm"
                          iconLeft={<Eye size={14} />}
                          onClick={() => setPreviewTicket(validationFeedback.ticket)}
                        >
                          Lihat E-Tiket
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Controls: Search & Poliklinik Filter */}
        <div className="admin-controls-card">
          <div className="admin-search-col">
            <FormField
              placeholder="Cari nama pasien, kode booking (QLS-...), no. antrean (A-028), atau NIK..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              iconLeft={<Search size={18} />}
            />
          </div>

          <div className="admin-clinic-select-col">
            <FormField
              label=""
              as="select"
              value={selectedClinic}
              onChange={(e) => setSelectedClinic(e.target.value)}
              options={[
                { value: 'all', label: '🏥 Semua Poliklinik' },
                ...specialties.map(s => ({
                  value: s.id,
                  label: `${s.name} (${s.room})`
                }))
              ]}
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="admin-status-tabs">
          <button
            type="button"
            className={`admin-tab-btn ${selectedStatusTab === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedStatusTab('all')}
          >
            Semua Antrean ({totalCount})
          </button>
          <button
            type="button"
            className={`admin-tab-btn tab-pending ${selectedStatusTab === 'pending' ? 'active' : ''}`}
            onClick={() => setSelectedStatusTab('pending')}
          >
            Perlu Diterima ({pendingCount})
          </button>
          <button
            type="button"
            className={`admin-tab-btn tab-waiting ${selectedStatusTab === 'waiting' ? 'active' : ''}`}
            onClick={() => setSelectedStatusTab('waiting')}
          >
            Siap Dipanggil ({waitingCount})
          </button>
          <button
            type="button"
            className={`admin-tab-btn tab-serving ${selectedStatusTab === 'serving' ? 'active' : ''}`}
            onClick={() => setSelectedStatusTab('serving')}
          >
            Sedang Dilayani ({servingCount})
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${selectedStatusTab === 'completed' ? 'active' : ''}`}
            onClick={() => setSelectedStatusTab('completed')}
          >
            Selesai ({completedCount})
          </button>
        </div>

        {/* Queue Items Table / Cards */}
        <div className="admin-tickets-container">
          {filteredTickets.length === 0 ? (
            <Card className="no-tickets-card">
              <CardBody className="no-tickets-body">
                <FileText size={44} className="text-muted" />
                <h3>Tidak Ada Antrean yang Cocok</h3>
                <p>Tidak ada antrean pada kategori atau filter poliklinik yang dipilih saat ini.</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedClinic('all');
                    setSelectedStatusTab('all');
                    setSearchQuery('');
                  }}
                >
                  Reset Semua Filter
                </Button>
              </CardBody>
            </Card>
          ) : (
            <div className="admin-tickets-list">
              {filteredTickets.map((ticket) => {
                const isPending = ticket.status === 'pending';
                const isWaiting = ticket.status === 'waiting';
                const isServing = ticket.status === 'serving';
                const isCompleted = ticket.status === 'completed';
                const isCancelled = ticket.status === 'cancelled';

                return (
                  <Card
                    key={ticket.bookingCode}
                    className={`admin-ticket-row-card ${isPending ? 'border-pending' : ''} ${isServing ? 'border-serving' : ''}`}
                    elevated
                  >
                    <div className="ticket-row-grid">
                      {/* Left: Big Ticket Number & Code */}
                      <div className="ticket-digit-col">
                        <span className="row-code-pill">{ticket.bookingCode}</span>
                        <div className="row-number-digit">{ticket.ticketNumber}</div>
                        <span className="row-time-slot">
                          <Clock size={12} /> {ticket.timeSlot}
                        </span>
                      </div>

                      {/* Middle: Patient Info & Clinical Target */}
                      <div className="ticket-info-col">
                        <div className="patient-name-header">
                          <h3 className="patient-name">{ticket.patientName}</h3>
                          {isPending && (
                            <Badge variant="accent" size="sm">
                              Menunggu Penerimaan Loket
                            </Badge>
                          )}
                          {isWaiting && (
                            <Badge variant={ticket.callCount > 0 ? "accent" : "primary"} pulse={ticket.callCount > 0} size="sm">
                              {ticket.callCount > 0 
                                ? `Dipanggil (${ticket.callCount}x) • Siap Dilayani`
                                : 'Terkonfirmasi • Siap Panggil'}
                            </Badge>
                          )}
                          {isServing && (
                            <Badge variant="success" pulse size="sm">
                              Sedang Diperiksa Dokter
                            </Badge>
                          )}
                          {isCompleted && (
                            <Badge variant="secondary" size="sm">
                              Pelayanan Selesai
                            </Badge>
                          )}
                          {isCancelled && (
                            <Badge variant="danger" size="sm">
                              Dibatalkan
                            </Badge>
                          )}
                        </div>

                        <div className="patient-meta-details">
                          <span className="meta-tag">NIK: {ticket.nik}</span>
                          <span className="meta-tag">HP: {ticket.phone}</span>
                          <span className="meta-tag payment-tag">
                            <CreditCard size={12} /> {ticket.paymentMethod}
                          </span>
                        </div>

                        <div className="patient-clinic-target">
                          <strong>{ticket.clinicName}</strong> • {ticket.doctorName} ({ticket.room})
                        </div>

                        {ticket.notes && (
                          <div className="patient-complaint-snippet">
                            <span className="snippet-label">Keluhan:</span> "{ticket.notes}"
                          </div>
                        )}
                      </div>

                      {/* Right: Actions Column */}
                      <div className="ticket-actions-col">
                        {/* 1. Action if Pending: ACCEPT THE QUEUE */}
                        {isPending && (
                          <div className="actions-cluster">
                            <Button
                              variant="primary"
                              size="md"
                              className="w-full btn-accept-action"
                              iconLeft={<Check size={16} />}
                              onClick={() => handleAccept(ticket)}
                            >
                              Terima Antrean
                            </Button>
                            <div className="secondary-actions-row">
                              <Button
                                variant="secondary"
                                size="sm"
                                iconLeft={<Eye size={14} />}
                                onClick={() => setPreviewTicket(ticket)}
                              >
                                Lihat Tiket
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-danger"
                                iconLeft={<X size={14} />}
                                onClick={() => handleCancel(ticket)}
                                title="Tolak antrean ini"
                              >
                                Tolak
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-danger action-delete-btn"
                                iconLeft={<Trash2 size={14} />}
                                onClick={() => handleDeleteTicket(ticket)}
                                title="Hapus antrean permanen"
                              >
                                Hapus
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* 2. Action if Waiting: CALL PATIENT & SERVE PATIENT */}
                        {isWaiting && (
                          <div className="actions-cluster">
                            <div className="action-buttons-stack" style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                              <Button
                                variant="primary"
                                size="md"
                                className="w-full btn-call-action"
                                iconLeft={<Volume2 size={16} />}
                                onClick={() => handleCall(ticket)}
                              >
                                {ticket.callCount > 0 ? `Panggil Lagi (${ticket.callCount}x)` : 'Panggil Pasien'}
                              </Button>

                              <Button
                                variant="success"
                                size="md"
                                className="w-full btn-serve-action"
                                iconLeft={<Stethoscope size={16} />}
                                onClick={() => handleServe(ticket)}
                              >
                                Sedang Dilayani
                              </Button>
                            </div>
                            <div className="secondary-actions-row">
                              <Button
                                variant="secondary"
                                size="sm"
                                iconLeft={<Eye size={14} />}
                                onClick={() => setPreviewTicket(ticket)}
                              >
                                Detail E-Tiket
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCancel(ticket)}
                                title="Batalkan antrean ini"
                              >
                                Batal
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-danger action-delete-btn"
                                iconLeft={<Trash2 size={14} />}
                                onClick={() => handleDeleteTicket(ticket)}
                                title="Hapus antrean permanen"
                              >
                                Hapus
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* 3. Action if Serving: COMPLETE CONSULTATION */}
                        {isServing && (
                          <div className="actions-cluster">
                            <Button
                              variant="primary"
                              size="md"
                              className="w-full btn-finish-action"
                              iconLeft={<CheckCircle2 size={16} />}
                              onClick={() => handleComplete(ticket)}
                            >
                              Selesai Konsultasi
                            </Button>
                            <div className="secondary-actions-row">
                              <span className="serving-since-text">
                                Mulai dipanggil: {ticket.calledAt || 'Baru saja'}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-danger action-delete-btn"
                                iconLeft={<Trash2 size={14} />}
                                onClick={() => handleDeleteTicket(ticket)}
                                title="Hapus antrean permanen"
                              >
                                Hapus
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* 4. Action if Completed or Cancelled */}
                        {(isCompleted || isCancelled) && (
                          <div className="actions-cluster">
                            <span className="done-status-text">
                              {isCompleted ? 'Pelayanan selesai' : 'Dibatalkan'}
                            </span>
                            <div className="secondary-actions-row">
                              <Button
                                variant="secondary"
                                size="sm"
                                iconLeft={<Eye size={14} />}
                                onClick={() => setPreviewTicket(ticket)}
                              >
                                Lihat Tiket
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-danger action-delete-btn"
                                iconLeft={<Trash2 size={14} />}
                                onClick={() => handleDeleteTicket(ticket)}
                                title="Hapus antrean permanen"
                              >
                                Hapus
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </>
    )}

    {/* Doctor Management View */}
    {dashboardTab === 'doctors' && (
      <div className="admin-doctors-container">
        <div className="admin-doctors-header-row">
          <div>
            <div className="admin-badge-sub">MANAJEMEN DOKTER & JADWAL POLIKLINIK</div>
            <h2 className="admin-section-heading">Data Dokter, Tarif, Lantai & Sesi Konsultasi</h2>
            <p className="admin-section-subheading">
              Kelola daftar dokter spesialis, poliklinik, tarif konsultasi, nomor lantai & ruang, total jatah pasien harian, serta ketersediaan sesi konsultasi.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            iconLeft={<Plus size={18} />}
            onClick={() => setShowAddDoctorModal(true)}
          >
            Tambah Dokter Baru
          </Button>
        </div>

        <div className="admin-doctors-grid">
          {doctors.map(doc => {
            const activeSlots = doc.timeSlots?.filter(s => s.available !== false) || [];
            const totalSlotsCount = doc.timeSlots?.length || 0;
            return (
              <Card key={doc.id} className="doctor-admin-card" elevated>
                <CardBody className="doctor-admin-card-body">
                  <div className="doctor-admin-top">
                    <div className="doctor-avatar-wrapper">
                      <img
                        src={doc.photo || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300"}
                        alt={doc.name}
                        className="doctor-admin-avatar"
                      />
                      <span className="doctor-status-dot" title="Aktif Bertugas" />
                    </div>
                    <div className="doctor-admin-info">
                      <div className="doctor-admin-header-line">
                        <h3 className="doctor-admin-name">{doc.name}</h3>
                        <Badge variant="primary" size="sm">
                          {doc.specialty}
                        </Badge>
                      </div>
                      <p className="doctor-admin-title">{doc.title}</p>
                      
                      <div className="doctor-admin-meta-tags">
                        <span className="doc-meta-badge price-badge" title="Tarif / Biaya Konsultasi">
                          <CreditCard size={13} /> {doc.fee || 'Rp 250.000'}
                        </span>
                        <span className="doc-meta-badge room-badge" title="Lokasi Lantai & Ruang Praktik">
                          <MapPin size={13} /> {doc.clinicRoom || 'Lantai 2'}
                        </span>
                        <span className="doc-meta-badge quota-badge" title="Total Jatah Pasien Ditangani per Hari">
                          <Users size={13} /> Kuota: {doc.totalQuota || 20} Pasien / Hari
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Jadwal Hari Praktik Available */}
                  <div className="doctor-admin-schedule-section">
                    <div className="doc-section-title">
                      <Calendar size={14} />
                      <span>Jadwal Hari Available Praktik:</span>
                    </div>
                    <div className="doc-days-row">
                      {doc.days?.map(d => (
                        <span key={d} className="doc-day-pill">{d}</span>
                      ))}
                    </div>
                  </div>

                  {/* Sesi Waktu Tersedia & Available */}
                  <div className="doctor-admin-slots-section">
                    <div className="doc-section-title">
                      <Clock size={14} />
                      <span>Sesi Konsultasi ({activeSlots.length}/{totalSlotsCount} Tersedia):</span>
                    </div>
                    <div className="doc-slots-grid">
                      {doc.timeSlots?.map(slot => (
                        <div
                          key={slot.time}
                          className={`doc-slot-pill ${slot.available !== false ? 'available' : 'full'}`}
                        >
                          <span className="slot-time-text">{slot.time}</span>
                          <span className="slot-quota-tag">
                            {slot.available !== false ? `Sisa ${slot.quotaRemaining ?? 4} jatah` : 'Penuh'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="doctor-admin-card-footer">
                    <div className="doctor-admin-exp">
                      <span>{doc.experience || '8+ Tahun Pengalaman'}</span>
                      <span className="exp-dot">•</span>
                      <span>{doc.education || 'FK UI'}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-danger"
                      iconLeft={<Trash2 size={15} />}
                      onClick={() => handleDeleteDoctor(doc)}
                      title="Hapus dokter ini dari sistem"
                    >
                      Hapus Dokter
                    </Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    )}
  </div>

  {/* Doctor Add Modal */}
  {showAddDoctorModal && (
    <div className="admin-modal-backdrop" onClick={() => setShowAddDoctorModal(false)}>
      <div className="admin-modal-content doctor-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="doctor-modal-title-group">
            <div className="doctor-modal-icon">
              <Stethoscope size={20} />
            </div>
            <div>
              <h3 className="modal-title">Tambah Dokter & Atur Jadwal Sesi</h3>
              <p className="modal-sub">Lengkapi data dokter, tarif konsultasi, lantai & ruangan, kuota harian, serta ketersediaan sesi.</p>
            </div>
          </div>
          <button
            type="button"
            className="admin-modal-close"
            onClick={() => setShowAddDoctorModal(false)}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSaveDoctor} className="admin-modal-body doctor-modal-body">
          <div className="form-grid-2">
            <FormField
              label="Nama Lengkap Dokter *"
              placeholder="Contoh: dr. Hendra Wijaya, Sp.PD"
              value={doctorForm.name}
              onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
              required
            />
            <FormField
              label="Gelar & Spesialisasi Formal"
              placeholder="Contoh: Spesialis Penyakit Dalam Konsultan"
              value={doctorForm.title}
              onChange={(e) => setDoctorForm({ ...doctorForm, title: e.target.value })}
            />
          </div>

          <div className="form-grid-3">
            <FormField
              label="Pilih Poliklinik *"
              as="select"
              value={doctorForm.specialty}
              onChange={(e) => setDoctorForm({ ...doctorForm, specialty: e.target.value })}
              options={specialties.map(s => ({
                value: s.name,
                label: `${s.name} (${s.room})`
              }))}
            />
            <FormField
              label="Tarif / Harga Konsultasi *"
              placeholder="Contoh: Rp 350.000"
              value={doctorForm.fee}
              onChange={(e) => setDoctorForm({ ...doctorForm, fee: e.target.value })}
              iconLeft={<CreditCard size={16} />}
              required
            />
            <FormField
              label="Lantai & Nomor Ruangan *"
              placeholder="Contoh: Ruang 304, Lantai 3"
              value={doctorForm.clinicRoom}
              onChange={(e) => setDoctorForm({ ...doctorForm, clinicRoom: e.target.value })}
              iconLeft={<MapPin size={16} />}
              required
            />
          </div>

          <div className="form-grid-3">
            <FormField
              label="Total Jatah Pasien Ditangani *"
              type="number"
              min="1"
              max="100"
              placeholder="Contoh: 20"
              value={doctorForm.totalQuota}
              onChange={(e) => setDoctorForm({ ...doctorForm, totalQuota: e.target.value })}
              iconLeft={<Users size={16} />}
              helper="Kapasitas maksimal pasien per hari."
              required
            />
            <FormField
              label="Pengalaman Praktik"
              placeholder="Contoh: 8 Tahun"
              value={doctorForm.experience}
              onChange={(e) => setDoctorForm({ ...doctorForm, experience: e.target.value })}
            />
            <FormField
              label="Pendidikan / Almamater"
              placeholder="Contoh: Spesialis FK Univ. Indonesia"
              value={doctorForm.education}
              onChange={(e) => setDoctorForm({ ...doctorForm, education: e.target.value })}
            />
          </div>

          {/* Jadwal Available (Hari Praktik) */}
          <div className="doctor-form-section">
            <label className="form-section-label">
              <Calendar size={15} /> Jadwal Available / Hari Praktik Dokter * (Klik untuk memilih)
            </label>
            <div className="days-picker-pills">
              {ALL_DAYS.map(day => {
                const isSelected = doctorForm.days.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    className={`day-toggle-pill ${isSelected ? 'active' : ''}`}
                    onClick={() => handleToggleDay(day)}
                  >
                    {isSelected && <Check size={14} />}
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sesi Waktu Available */}
          <div className="doctor-form-section">
            <div className="section-label-row">
              <label className="form-section-label">
                <Clock size={15} /> Sesi Waktu Tersedia / Slot Konsultasi * ({doctorForm.selectedSlots.length} slot dipilih)
              </label>
              <span className="slots-quota-note">
                Jatah per slot: ~{Math.max(1, Math.ceil((parseInt(doctorForm.totalQuota, 10) || 20) / (doctorForm.selectedSlots.length || 1)))} pasien
              </span>
            </div>
            <div className="slots-picker-grid">
              {STANDARD_SLOTS.map(slot => {
                const isSelected = doctorForm.selectedSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    className={`slot-toggle-chip ${isSelected ? 'active' : ''}`}
                    onClick={() => handleToggleSlot(slot)}
                  >
                    {isSelected ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                    <span>{slot}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="doctor-modal-actions">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setShowAddDoctorModal(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              iconLeft={<Plus size={16} />}
            >
              Simpan Data Dokter
            </Button>
          </div>
        </form>
      </div>
    </div>
  )}

      {/* Ticket Modal Preview */}
      {previewTicket && (
        <div className="admin-modal-backdrop" onClick={() => setPreviewTicket(null)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Pratinjau E-Tiket Pasien</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setPreviewTicket(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="admin-modal-body">
              <TicketCard ticket={previewTicket} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;
