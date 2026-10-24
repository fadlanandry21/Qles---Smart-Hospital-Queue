import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  CalendarPlus, 
  Activity, 
  Clock, 
  ArrowRight, 
  Search, 
  BellRing, 
  CheckCircle, 
  Star, 
  Sparkles,
  Stethoscope,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { hospitalInfo, hospitalStats, specialties, patientTestimonials } from '../data/hospitalData';
import { useQueue } from '../context/QueueContext';
import Button from '../components/common/Button';
import Card, { CardBody, CardFooter } from '../components/common/Card';
import Badge from '../components/common/Badge';
import Counter from '../components/common/Counter';
import Reveal from '../components/common/Reveal';
import LiveQueueCard from '../components/queue/LiveQueueCard';
import './HomePage.css';

export function HomePage() {
  const { queues, doctors } = useQueue();
  const location = useLocation();
  const [accessDeniedToast, setAccessDeniedToast] = useState(false);

  useEffect(() => {
    if (location.state?.accessDenied) {
      setAccessDeniedToast(true);
      const timer = setTimeout(() => setAccessDeniedToast(false), 4500);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const featuredDoctors = (doctors || []).slice(0, 3);
  const topClinics = specialties.slice(0, 4);

  return (
    <div className="home-page">
      {/* Access Denied Toast */}
      {accessDeniedToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99999,
          backgroundColor: '#ef4444',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '14px',
          fontWeight: 600
        }}>
          <ShieldAlert size={20} />
          <span>Akses Ditolak: Halaman tersebut khusus Administrator Rumah Sakit. Anda sedang aktif sebagai Akun Pasien.</span>
        </div>
      )}
      {/* 1. Hero Section */}
      <section className="hero-section">
        {/* Modern Hospital Blurred Hero Backdrop */}
        <div className="hero-backdrop-container" aria-hidden="true">
          <img
            src="/images/hospital-hero.jpg"
            alt="RS Qless Modern Hospital"
            className="hero-backdrop-image"
          />
          <div className="hero-backdrop-overlay" />
        </div>

        <div className="container hero-container">
          <div className="hero-grid">
            {/* Hero Left Content */}
            <div className="hero-content">
              <Reveal direction="down" delay={100}>
                <div className="hero-badge">
                  <Sparkles size={14} className="hero-badge-icon" />
                  <span>Sistem Antrean Medis Digital Generasi Baru</span>
                </div>
              </Reveal>

              <Reveal direction="up" delay={200}>
                <h1 className="hero-title">
                  Kesehatan Anda Prioritas Kami, <span className="text-primary-gradient">Tanpa Antre Berjam-jam</span>
                </h1>
              </Reveal>

              <Reveal direction="up" delay={300}>
                <p className="hero-description">
                  {hospitalInfo.subtitle}
                </p>
              </Reveal>

              <Reveal direction="up" delay={400}>
                <div className="hero-cta-group">
                  <Button
                    as={Link}
                    to="/appointment"
                    variant="primary"
                    size="lg"
                    iconLeft={<CalendarPlus size={18} />}
                  >
                    Buat Janji Dokter Sekarang
                  </Button>
                  <Button
                    as={Link}
                    to="/queue"
                    variant="secondary"
                    size="lg"
                    iconLeft={<Activity size={18} />}
                  >
                    Pantau Antrean Live
                  </Button>
                </div>
              </Reveal>

              <Reveal direction="up" delay={500}>
                <div className="hero-highlights">
                  <div className="highlight-item">
                    <CheckCircle size={16} className="text-success" />
                    <span>BPJS & Asuransi Swasta</span>
                  </div>
                  <div className="highlight-item">
                    <CheckCircle size={16} className="text-success" />
                    <span>Notifikasi Estimasi WhatsApp</span>
                  </div>
                  <div className="highlight-item">
                    <CheckCircle size={16} className="text-success" />
                    <span>Check-in Mandiri Kiosk</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Hero Right: Live Interactive Queue Monitor Card */}
            <div className="hero-visual">
              <Reveal direction="left" delay={300}>
                <div className="hero-queue-card-wrapper">
                  <div className="queue-card-header-bar">
                    <div className="live-indicator">
                      <span className="live-dot" />
                      <span>MONITOR ANTREAN HARI INI</span>
                    </div>
                    <Link to="/queue" className="view-all-link">
                      Semua Loket <ArrowRight size={13} />
                    </Link>
                  </div>

                  <LiveQueueCard
                    clinic={queues[0]}
                  />

                  <div className="hero-quick-search-box">
                    <span className="quick-search-label">Punya Nomor / Kode Reservasi?</span>
                    <Link to="/queue" className="quick-search-btn">
                      <Search size={15} />
                      <span>Cek Posisi Antrean Saya</span>
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Animated Stats Section */}
      <section className="stats-section section-alt">
        <div className="container">
          <div className="stats-grid">
            {hospitalStats.map((stat, idx) => (
              <Reveal key={stat.id} direction="up" delay={idx * 100}>
                <div className="stat-card">
                  <div className="stat-number-wrapper">
                    <Counter end={stat.number} suffix={stat.suffix} />
                  </div>
                  <h3 className="stat-label">{stat.label}</h3>
                  <p className="stat-desc">{stat.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Poliklinik & Layanan Spesialis Unggulan */}
      <section className="section specialties-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">POLIKLINIK & SPESIALISASI</span>
            <h2 className="section-title">Layanan Medis Terpadu & Berstandar Tinggi</h2>
            <p className="section-desc">
              Pilih poliklinik tujuan Anda untuk melihat jadwal dokter spesialis dan waktu rata-rata pelayanan antrean.
            </p>
          </div>

          <div className="specialties-grid">
            {topClinics.map((spec, idx) => (
              <Reveal key={spec.id} direction="up" delay={idx * 100}>
                <Card interactive className="specialty-card">
                  <CardBody>
                    <div className="specialty-icon-row">
                      <div className="specialty-icon-box">
                        <Stethoscope size={22} />
                      </div>
                      <Badge variant="primary" size="sm">
                        {spec.doctorCount} Dokter Aktif
                      </Badge>
                    </div>

                    <h3 className="specialty-name">{spec.name}</h3>
                    <p className="specialty-desc">{spec.description}</p>

                    <div className="specialty-meta">
                      <div className="meta-row">
                        <Clock size={14} className="text-accent" />
                        <span>Estimasi Tunggu: <strong>{spec.avgWaitTime}</strong></span>
                      </div>
                    </div>
                  </CardBody>
                  <CardFooter className="specialty-footer">
                    <Button
                      as={Link}
                      to={`/appointment?specialty=${spec.id}`}
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      iconRight={<ArrowRight size={14} />}
                    >
                      Pilih Poliklinik Ini
                    </Button>
                  </CardFooter>
                </Card>
              </Reveal>
            ))}
          </div>

          <div className="section-cta-center">
            <Button as={Link} to="/doctors" variant="secondary" size="md" iconRight={<ChevronRight size={16} />}>
              Lihat Seluruh 8 Poliklinik & Tim Dokter
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Featured Doctors (Hover-Reveal Details) */}
      <section className="section doctors-preview-section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">TIM MEDIS PROFESIONAL</span>
            <h2 className="section-title">Dokter Spesialis Pilihan Terbaik</h2>
            <p className="section-desc">
              Konsultasikan keluhan medis Anda dengan dokter spesialis berpengalaman di RS Qless.
            </p>
          </div>

          <div className="doctors-grid">
            {featuredDoctors.map((doc, idx) => (
              <Reveal key={doc.id} direction="up" delay={idx * 150}>
                <div className="doctor-card-interactive">
                  <div className="doctor-image-wrapper">
                    <img src={doc.photo} alt={doc.name} className="doctor-image" loading="lazy" />
                    <div className="doctor-rating-pill">
                      <Star size={13} className="star-icon" />
                      <span>{doc.rating} ({doc.reviewsCount})</span>
                    </div>

                    {/* Hover-reveal overlay container */}
                    <div className="doctor-hover-details">
                      <div className="hover-detail-item">
                        <span className="hover-label">Pengalaman:</span>
                        <strong className="hover-value">{doc.experience}</strong>
                      </div>
                      <div className="hover-detail-item">
                        <span className="hover-label">Pendidikan:</span>
                        <span className="hover-value small">{doc.education}</span>
                      </div>
                      <div className="hover-detail-item">
                        <span className="hover-label">No. STR:</span>
                        <span className="hover-value monospace">{doc.strNumber}</span>
                      </div>
                      <Button
                        as={Link}
                        to={`/appointment?doctor=${doc.id}`}
                        variant="primary"
                        size="sm"
                        className="w-full hover-cta-btn"
                        iconRight={<CalendarPlus size={14} />}
                      >
                        Pilih & Buat Janji
                      </Button>
                    </div>
                  </div>

                  <div className="doctor-card-info">
                    <Badge variant="primary" size="sm" className="doctor-spec-badge">
                      {doc.specialty}
                    </Badge>
                    <h3 className="doctor-card-name">{doc.name}</h3>
                    <p className="doctor-card-sub">{doc.title}</p>
                    <div className="doctor-card-schedule">
                      <Clock size={13} className="text-muted" />
                      <span>{doc.days.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="section-cta-center">
            <Button as={Link} to="/doctors" variant="primary" size="md" iconRight={<ArrowRight size={16} />}>
              Cari & Jadwalkan Janji Dokter Lainnya
            </Button>
          </div>
        </div>
      </section>

      {/* 5. Key Flow Benefits / Why Qless */}
      <section className="section benefits-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">KEUNGGULAN SISTEM ANTREAN</span>
            <h2 className="section-title">Bagaimana Qless Mengubah Pengalaman Berobat Anda</h2>
            <p className="section-desc">
              Tiga langkah mudah untuk pelayanan kesehatan yang cepat, nyaman, dan transparan.
            </p>
          </div>

          <div className="benefits-grid">
            <Reveal direction="up" delay={100}>
              <Card className="benefit-card">
                <CardBody>
                  <div className="benefit-number">01</div>
                  <div className="benefit-icon-box">
                    <CalendarPlus size={24} />
                  </div>
                  <h3 className="benefit-title">Reservasi Online Cepat</h3>
                  <p className="benefit-desc">
                    Pilih dokter spesialis dan slot waktu yang pas dalam waktu kurang dari 2 menit tanpa antre loket karcis fisik.
                  </p>
                </CardBody>
              </Card>
            </Reveal>

            <Reveal direction="up" delay={200}>
              <Card className="benefit-card">
                <CardBody>
                  <div className="benefit-number">02</div>
                  <div className="benefit-icon-box">
                    <BellRing size={24} />
                  </div>
                  <h3 className="benefit-title">Pantau Antrean Live</h3>
                  <p className="benefit-desc">
                    Cek nomor antrean berjalan dari rumah atau kantor. Dapatkan notifikasi saat antrean Anda tersisa 3 pasien lagi.
                  </p>
                </CardBody>
              </Card>
            </Reveal>

            <Reveal direction="up" delay={300}>
              <Card className="benefit-card">
                <CardBody>
                  <div className="benefit-number">03</div>
                  <div className="benefit-icon-box">
                    <CheckCircle size={24} />
                  </div>
                  <h3 className="benefit-title">Hadir Tepat Waktu & Dilayani</h3>
                  <p className="benefit-desc">
                    Tiba di RS 15 menit sebelum estimasi. Masuk ke ruang konsultasi dokter tanpa penat menunggu di ruang tunggu.
                  </p>
                </CardBody>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="section testimonials-section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">TESTIMONI PASIEN</span>
            <h2 className="section-title">Apa Kata Pasien Kami</h2>
            <p className="section-desc">
              Pengalaman nyata pasien yang telah merasakan kemudahan berobat dengan sistem antrean Qless.
            </p>
          </div>

          <div className="testimonials-grid">
            {patientTestimonials.map((item, idx) => (
              <Reveal key={item.id} direction="up" delay={idx * 150}>
                <Card className="testimonial-card">
                  <CardBody>
                    <div className="testimonial-rating">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} size={15} className="star-filled" />
                      ))}
                    </div>
                    <p className="testimonial-comment">"{item.comment}"</p>
                    <div className="testimonial-author">
                      <img src={item.avatar} alt={item.name} className="author-avatar" />
                      <div className="author-details">
                        <strong className="author-name">{item.name}</strong>
                        <span className="author-role">{item.role}</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA Banner */}
      <section className="cta-banner-section">
        <div className="container">
          <div className="cta-banner-box">
            <div className="cta-banner-content">
              <span className="cta-pill-tag">Pelayanan Pasien 24/7</span>
              <h2 className="cta-banner-title">Siap Berkonsultasi Tanpa Antrean Melelahkan?</h2>
              <p className="cta-banner-desc">
                Dapatkan nomor antrean digital Anda sekarang juga. Jadwal dokter spesialis tersedia hingga 14 hari ke depan.
              </p>
              <div className="cta-banner-buttons">
                <Button as={Link} to="/appointment" variant="primary" size="lg" iconLeft={<CalendarPlus size={18} />}>
                  Buat Janji Kunjungan
                </Button>
                <Button as={Link} to="/queue" variant="secondary" size="lg" iconLeft={<Activity size={18} />}>
                  Lihat Semua Antrean
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
