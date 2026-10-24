import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  MessageSquare
} from 'lucide-react';
import { hospitalInfo } from '../data/hospitalData';
import Card, { CardBody, CardHeader } from '../components/common/Card';
import Button from '../components/common/Button';
import FormField from '../components/common/FormField';
import Reveal from '../components/common/Reveal';
import './ContactPage.css';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Pertanyaan Jadwal Dokter',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSent, setIsSent] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const faqs = [
    {
      q: "Bagaimana cara membatalkan atau mengubah jadwal janji temu dokter?",
      a: "Anda dapat membatalkan atau menjadwal ulang paling lambat 2 jam sebelum jam konsultasi melalui menu 'Cek Status Tiket' atau menghubungi layanan pelanggan WhatsApp kami di 0811-9876-5432."
    },
    {
      q: "Apakah saya bisa mendaftar dengan kartu BPJS Kesehatan secara online?",
      a: "Bisa. Pada saat pengisian formulir reservasi, pilih opsi pembayaran 'BPJS Kesehatan' dan masukkan nomor rujukan FKTP yang masih aktif. Check-in mandiri di kiosk lantai 1 saat tiba di RS."
    },
    {
      q: "Kapan saya harus tiba di rumah sakit setelah reservasi?",
      a: "Kami sarankan tiba 15 menit sebelum estimasi waktu panggilan Anda. Pantau nomor loket secara real-time melalui halaman 'Antrean Live' kami."
    },
    {
      q: "Apakah instalasi gawat darurat (IGD) memerlukan reservasi antrean online?",
      a: "Tidak. Pasien kondisi darurat/kegawatdaruratan medis langsung dilayani 24 jam tanpa perlu reservasi tiket. Hubungi ambulans darurat di hotline 1500-753."
    }
  ];

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
    if (!formData.email.trim()) {
      newErrors.email = 'Alamat email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.message.trim()) newErrors.message = 'Pesan atau pertanyaan wajib diisi';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSent(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'Pertanyaan Jadwal Dokter',
      message: ''
    });
  };

  return (
    <div className="page-container contact-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <span className="page-badge">Smart Hospital Queue</span>
          <h1 className="page-title">Hubungi RS Qless</h1>
          <p className="page-subtitle">
            Pusat bantuan pelanggan, informasi jadwal poliklinik, rujukan asuransi, serta kontak darurat 24 jam.
          </p>
        </div>

        {/* 1. Info Cards (UX Requirement: Info Cards + Message Form) */}
        <div className="contact-info-cards-grid">
          <Reveal direction="up" delay={100}>
            <Card className="contact-info-card">
              <CardBody>
                <div className="info-card-icon-box">
                  <MapPin size={22} />
                </div>
                <h3 className="info-card-title">Alamat & Lokasi</h3>
                <p className="info-card-text">{hospitalInfo.address}</p>
                <span className="info-card-sub">Sayap Barat Menteng, Akses MRT & Busway 3 Menit</span>
              </CardBody>
            </Card>
          </Reveal>

          <Reveal direction="up" delay={200}>
            <Card className="contact-info-card emergency-border">
              <CardBody>
                <div className="info-card-icon-box danger">
                  <Phone size={22} />
                </div>
                <h3 className="info-card-title">Kontak Darurat 24 Jam</h3>
                <p className="info-card-text text-danger font-bold">{hospitalInfo.emergencyPhone}</p>
                <span className="info-card-sub">Layanan Ambulans & Dokter Jaga IGD Siaga</span>
              </CardBody>
            </Card>
          </Reveal>

          <Reveal direction="up" delay={300}>
            <Card className="contact-info-card">
              <CardBody>
                <div className="info-card-icon-box">
                  <Mail size={22} />
                </div>
                <h3 className="info-card-title">Email & WhatsApp</h3>
                <p className="info-card-text">{hospitalInfo.email}</p>
                <span className="info-card-sub">WA Antrean: {hospitalInfo.whatsapp}</span>
              </CardBody>
            </Card>
          </Reveal>

          <Reveal direction="up" delay={400}>
            <Card className="contact-info-card">
              <CardBody>
                <div className="info-card-icon-box">
                  <Clock size={22} />
                </div>
                <h3 className="info-card-title">Jam Pelayanan Poli</h3>
                <p className="info-card-text">{hospitalInfo.operatingHours.poliklinik}</p>
                <span className="info-card-sub">Laboratorium & Apotek Buka 24 Jam</span>
              </CardBody>
            </Card>
          </Reveal>
        </div>

        {/* 2. Message Form & Interactive Map / FAQs */}
        <div className="contact-main-grid">
          {/* Left Form */}
          <div className="contact-form-column">
            <Card elevated className="contact-form-card">
              <CardHeader>
                <h2 className="form-card-title">Kirimkan Pesan atau Keluhan</h2>
                <p className="form-card-sub">Tim staf layanan pelanggan kami akan merespons dalam waktu maksimal 2 jam kerja.</p>
              </CardHeader>

              <CardBody>
                {isSent ? (
                  <div className="message-success-feedback">
                    <CheckCircle2 size={44} className="text-success" />
                    <h3>Pesan Berhasil Terkirim!</h3>
                    <p>Terima kasih atas pesan Anda. Staf kami akan segera menghubungi Anda melalui email atau WhatsApp terdaftar.</p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsSent(false)}
                    >
                      Kirim Pesan Lainnya
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="message-form-body" noValidate>
                    <div className="form-row-2">
                      <FormField
                        label="Nama Lengkap"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Nama Anda"
                        required
                        error={errors.name}
                      />
                      <FormField
                        label="Alamat Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="nama@email.com"
                        required
                        error={errors.email}
                      />
                    </div>

                    <div className="form-row-2">
                      <FormField
                        label="Nomor Telepon / WhatsApp"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="0812-xxxx-xxxx"
                      />
                      <FormField
                        label="Kategori Pertanyaan"
                        name="subject"
                        as="select"
                        value={formData.subject}
                        onChange={handleInputChange}
                        options={[
                          { value: 'Pertanyaan Jadwal Dokter', label: 'Jadwal & Kuota Dokter' },
                          { value: 'Bantuan Antrean Digital', label: 'Bantuan Antrean Digital' },
                          { value: 'Klaim Asuransi & BPJS', label: 'Klaim Asuransi & BPJS' },
                          { value: 'Kritik & Saran Pelayanan', label: 'Kritik & Saran Pelayanan' }
                        ]}
                      />
                    </div>

                    <FormField
                      label="Isi Pesan / Pertanyaan"
                      name="message"
                      as="textarea"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tuliskan pertanyaan atau kendala yang Anda hadapi secara detail..."
                      required
                      error={errors.message}
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      iconLeft={<Send size={16} />}
                      className="w-full"
                    >
                      Kirimkan Pertanyaan
                    </Button>
                  </form>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Right FAQ Accordion */}
          <div className="contact-faq-column">
            <h2 className="faq-section-title">Pertanyaan Sering Diajukan (FAQ)</h2>
            <div className="faq-accordion-list">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className={`faq-item-box ${isOpen ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className="faq-question-btn"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {isOpen && (
                      <div className="faq-answer-panel">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Live Chat Box */}
            <Card className="quick-chat-box">
              <CardBody className="quick-chat-body">
                <MessageSquare size={24} className="text-primary" />
                <div>
                  <h4 className="quick-chat-title">Butuh Respon Cepat?</h4>
                  <p className="quick-chat-desc">Hubungi staf WhatsApp Customer Care 24 Jam.</p>
                </div>
                <a
                  href={`https://wa.me/6281198765432`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-accent"
                >
                  Chat WhatsApp
                </a>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
