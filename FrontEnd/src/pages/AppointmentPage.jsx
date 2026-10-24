import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  CalendarPlus, 
  CheckCircle2, 
  User, 
  Phone, 
  CreditCard, 
  Activity,
  AlertCircle
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';
import { useAuth } from '../context/AuthContext';
import Card, { CardBody, CardHeader, CardFooter } from '../components/common/Card';
import Button from '../components/common/Button';
import FormField from '../components/common/FormField';
import TimeSlotPicker from '../components/common/TimeSlotPicker';
import TicketCard from '../components/queue/TicketCard';
import Reveal from '../components/common/Reveal';
import './AppointmentPage.css';

export function AppointmentPage() {
  const [searchParams] = useSearchParams();
  const doctorParam = searchParams.get('doctor');
  const specialtyParam = searchParams.get('specialty');

  const { bookAppointment, doctors } = useQueue();
  const { user } = useAuth();

  const minBookingDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Selected State - Default empty as requested by user
  const [selectedDoctorId, setSelectedDoctorId] = useState(() => {
    if (doctorParam) return doctorParam;
    if (specialtyParam) {
      const matchDoc = doctors.find(d => d.specialtyId === specialtyParam);
      if (matchDoc) return matchDoc.id;
    }
    return ''; // Default kosong
  });

  const [selectedDate, setSelectedDate] = useState(minBookingDate);
  const [selectedSlot, setSelectedSlot] = useState('');

  // Patient Info State: Auto-fill if user is logged in, but remain flexible to edit
  const [formData, setFormData] = useState(() => ({
    patientName: user?.name || '',
    nik: user?.nik || '',
    phone: user?.phone || '',
    paymentMethod: 'BPJS Kesehatan',
    complaint: ''
  }));

  const [formErrors, setFormErrors] = useState({});
  const [confirmedTicket, setConfirmedTicket] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill from user profile when user logs in, without locking fields
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        patientName: prev.patientName || user.name || '',
        nik: prev.nik || user.nik || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user]);

  // Sync if URL search params change
  useEffect(() => {
    if (doctorParam) {
      setSelectedDoctorId(doctorParam);
    } else if (specialtyParam) {
      const doc = doctors.find(d => d.specialtyId === specialtyParam);
      if (doc) setSelectedDoctorId(doc.id);
    }
  }, [doctorParam, specialtyParam, doctors]);

  const activeDoctor = doctors.find(d => d.id === selectedDoctorId) || null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!selectedDoctorId || !activeDoctor) {
      errors.doctor = 'Harap pilih dokter spesialis terlebih dahulu';
    }
    if (!formData.patientName.trim()) {
      errors.patientName = 'Nama lengkap pasien wajib diisi';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Nomor WhatsApp aktif wajib diisi untuk notifikasi antrean';
    } else if (formData.phone.length < 9) {
      errors.phone = 'Nomor telepon tidak valid';
    }
    if (!formData.nik.trim()) {
      errors.nik = 'NIK / Nomor Rekam Medis wajib diisi';
    } else if (formData.nik.length < 10) {
      errors.nik = 'Nomor NIK minimal 16 digit atau No. RM terdaftar';
    }
    if (!selectedSlot) {
      errors.slot = 'Harap pilih salah satu slot waktu konsultasi';
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (!activeDoctor) return;

    setIsSubmitting(true);

    // Simulate instant secure booking calculation
    setTimeout(() => {
      const ticket = bookAppointment({
        patientName: formData.patientName,
        phone: formData.phone,
        nik: formData.nik,
        doctorName: activeDoctor.name,
        doctorId: activeDoctor.id,
        clinicName: activeDoctor.specialty,
        clinicId: activeDoctor.specialtyId,
        room: activeDoctor.clinicRoom,
        date: selectedDate,
        timeSlot: selectedSlot,
        paymentMethod: formData.paymentMethod,
        complaint: formData.complaint
      });

      setConfirmedTicket(ticket);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  return (
    <div className="page-container appointment-page">
      <div className="container">
        {/* State A: Booking Form */}
        {!confirmedTicket ? (
          <>
            <div className="page-header">
              <span className="page-badge">Formulir Reservasi Digital</span>
              <h1 className="page-title">Buat Janji Dokter & Ambil Nomor Antrean</h1>
              <p className="page-subtitle">
                Alur singkat 3 langkah: Pilih dokter, tentukan slot waktu, dan masukkan identitas. Nomor antrean dan estimasi jam panggilan langsung terbit.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="booking-form-grid" noValidate>
              {/* Left Column: Doctor Selection & Time Slot Picker */}
              <div className="booking-col-left">
                {/* Step 1: Doctor Choice */}
                <Card className="booking-card">
                  <CardHeader>
                    <div className="step-badge-row">
                      <span className="step-number">1</span>
                      <h2 className="step-title">Pilih Dokter & Poliklinik</h2>
                    </div>
                  </CardHeader>
                  <CardBody className="step-body">
                    <FormField
                      label="Dokter Spesialis"
                      id="doctor-select"
                      as="select"
                      value={selectedDoctorId}
                      onChange={(e) => {
                        setSelectedDoctorId(e.target.value);
                        if (formErrors.doctor) setFormErrors(prev => ({ ...prev, doctor: '' }));
                        setSelectedSlot('');
                      }}
                      options={[
                        { value: '', label: '-- Pilih Dokter Spesialis --' },
                        ...doctors.map(doc => ({
                          value: doc.id,
                          label: `${doc.name} (${doc.specialty})`
                        }))
                      ]}
                      required
                      error={formErrors.doctor}
                    />

                    {/* Active Doctor Snapshot */}
                    {activeDoctor && (
                      <div className="selected-doctor-snapshot">
                        <img
                          src={activeDoctor.photo}
                          alt={activeDoctor.name}
                          className="snapshot-avatar"
                        />
                        <div className="snapshot-info">
                          <strong className="snapshot-name">{activeDoctor.name}</strong>
                          <span className="snapshot-title">{activeDoctor.title}</span>
                          <div className="snapshot-meta">
                            <span className="snapshot-room">{activeDoctor.clinicRoom}</span>
                            <span className="snapshot-fee text-primary">{activeDoctor.fee}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>

                {/* Step 2: Date & TimeSlotPicker */}
                <Card className="booking-card">
                  <CardHeader>
                    <div className="step-badge-row">
                      <span className="step-number">2</span>
                      <h2 className="step-title">Pilih Tanggal & Slot Waktu Konsultasi</h2>
                    </div>
                  </CardHeader>
                  <CardBody className="step-body">
                    <FormField
                      label="Tanggal Kunjungan"
                      id="appointment-date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={minBookingDate}
                      helperText="Jadwal praktik buka Senin hingga Sabtu (08:00 - 20:30 WIB)"
                    />

                    <div className="timeslot-section">
                      <label className="form-label">
                        Pilih Jam Konsultasi
                        <span className="required-star">*</span>
                      </label>
                      {activeDoctor ? (
                        <TimeSlotPicker
                          slots={activeDoctor?.timeSlots || []}
                          selectedSlot={selectedSlot}
                          onSelectSlot={(slot) => {
                            setSelectedSlot(slot);
                            if (formErrors.slot) setFormErrors(prev => ({ ...prev, slot: '' }));
                          }}
                        />
                      ) : (
                        <div style={{
                          padding: '14px 16px',
                          backgroundColor: 'var(--bg)',
                          borderRadius: '10px',
                          border: '1px dashed var(--border)',
                          fontSize: '13px',
                          color: 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}>
                          <AlertCircle size={18} className="text-accent flex-shrink-0" />
                          <span>Silakan pilih dokter spesialis terlebih dahulu pada <strong>Langkah 1</strong> untuk menampilkan slot waktu konsultasi.</span>
                        </div>
                      )}
                      {formErrors.slot && (
                        <p className="form-error" role="alert">{formErrors.slot}</p>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Right Column: Patient Identity & Confirmation CTA */}
              <div className="booking-col-right">
                <Card className="booking-card sticky-sidebar" elevated>
                  <CardHeader>
                    <div className="step-badge-row">
                      <span className="step-number">3</span>
                      <h2 className="step-title">Data Identitas Pasien</h2>
                    </div>
                  </CardHeader>

                  <CardBody className="step-body">
                    {!user && (
                      <div className="quick-login-hint">
                        <span>Sudah pernah berobat?</span>
                        <Link to="/login" className="text-primary font-bold">
                          Masuk akun
                        </Link>
                        <span>agar data otomatis terisi.</span>
                      </div>
                    )}

                    <FormField
                      label="Nama Lengkap Pasien"
                      id="patientName"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      placeholder="Contoh: Budi Santoso"
                      required
                      error={formErrors.patientName}
                      iconLeft={<User size={16} />}
                    />

                    <FormField
                      label="Nomor WhatsApp / HP Aktif"
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0812-xxxx-xxxx"
                      required
                      error={formErrors.phone}
                      helperText="Penting: Notifikasi giliran antrean akan dikirim ke nomor ini"
                      iconLeft={<Phone size={16} />}
                    />

                    <FormField
                      label="NIK (KTP) / No. Rekam Medis"
                      id="nik"
                      name="nik"
                      value={formData.nik}
                      onChange={handleInputChange}
                      placeholder="16 digit NIK atau Nomor RM"
                      required
                      error={formErrors.nik}
                      iconLeft={<CreditCard size={16} />}
                    />

                    <FormField
                      label="Jenis Pembayaran"
                      id="paymentMethod"
                      name="paymentMethod"
                      as="select"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      options={[
                        { value: 'BPJS Kesehatan', label: 'BPJS Kesehatan (Rujukan FKTP)' },
                        { value: 'Asuransi Swasta / Korporasi', label: 'Asuransi Swasta / Korporasi' },
                        { value: 'Umum / Mandiri', label: 'Pembayaran Mandiri / Umum' }
                      ]}
                    />

                    <FormField
                      label="Keluhan Utama / Catatan Medis (Opsional)"
                      id="complaint"
                      name="complaint"
                      as="textarea"
                      rows={3}
                      value={formData.complaint}
                      onChange={handleInputChange}
                      placeholder="Tuliskan gejala singkat atau riwayat kontrol berkala..."
                    />

                    {/* Booking summary recap box */}
                    <div className="booking-summary-recap">
                      <h4 className="recap-title">Ringkasan Reservasi</h4>
                      <div className="recap-row">
                        <span>Poli:</span>
                        <strong>{activeDoctor ? activeDoctor.specialty : '-'}</strong>
                      </div>
                      <div className="recap-row">
                        <span>Dokter:</span>
                        <strong>{activeDoctor ? activeDoctor.name : 'Belum dipilih'}</strong>
                      </div>
                      <div className="recap-row">
                        <span>Slot:</span>
                        <strong>{selectedSlot || 'Belum dipilih'}</strong>
                      </div>
                    </div>
                  </CardBody>

                  <CardFooter className="booking-footer">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      loading={isSubmitting}
                      className="w-full"
                      iconRight={<CheckCircle2 size={18} />}
                    >
                      Konfirmasi & Terbitkan Antrean
                    </Button>
                    <p className="secure-badge-note">
                      Data Anda dilindungi enkripsi standar medis & UU PDP.
                    </p>
                  </CardFooter>
                </Card>
              </div>
            </form>
          </>
        ) : (
          /* State B: Instant Confirmation Screen with E-Ticket */
          <div className="booking-success-view">
            <Reveal direction="down">
              <div className="success-banner">
                <div className="success-icon-wrapper">
                  <CheckCircle2 size={40} className="success-check-icon" />
                </div>
                <h1 className="success-title">Reservasi Janji Temu Berhasil!</h1>
                <p className="success-desc">
                  Nomor antrean digital Anda telah aktif di sistem RS Qless (Smart Hospital Queue). Harap simpan atau cetak tiket di bawah ini.
                </p>
              </div>
            </Reveal>

            {/* Render Printable / Saveable E-Ticket Card */}
            <Reveal direction="up" delay={200}>
              <TicketCard ticket={confirmedTicket} />
            </Reveal>

            <Reveal direction="up" delay={300}>
              <div className="success-actions-bar">
                <Button
                  as={Link}
                  to="/queue"
                  variant="primary"
                  size="md"
                  iconLeft={<Activity size={18} />}
                >
                  Pantau Antrean Live Sekarang
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setConfirmedTicket(null);
                    setSelectedSlot('10:00 - 10:30');
                  }}
                  iconLeft={<CalendarPlus size={18} />}
                >
                  Buat Janji Lainnya
                </Button>

                <Button
                  as={Link}
                  to="/"
                  variant="ghost"
                  size="md"
                >
                  Kembali ke Beranda
                </Button>
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentPage;
