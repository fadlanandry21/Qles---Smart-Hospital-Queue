import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Heart, 
  Zap, 
  CheckCircle2, 
  CalendarPlus, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { hospitalStats } from '../data/hospitalData';
import Card, { CardBody } from '../components/common/Card';
import Counter from '../components/common/Counter';
import Button from '../components/common/Button';
import Reveal from '../components/common/Reveal';
import './AboutPage.css';

export function AboutPage() {
  const values = [
    {
      icon: <Zap size={24} />,
      title: "Kecepatan & Presisi Waktu",
      desc: "Menghormati waktu setiap pasien. Dengan algoritma estimasi cerdas, waktu tunggu berkurang drastis tanpa mengurangi ketelitian diagnosis."
    },
    {
      icon: <Heart size={24} />,
      title: "Pelayanan Empatik",
      desc: "Setiap tenaga medis dan staf mendampingi pasien dengan kehangatan, komunikasi jelas, dan kepedulian tulus."
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Integritas & Keselamatan",
      desc: "Kepatuhan penuh pada standar akreditasi KARS Paripurna, higienitas steril internasional, dan keamanan data rekam medis pasien."
    },
    {
      icon: <Sparkles size={24} />,
      title: "Inovasi Berkelanjutan",
      desc: "Mengadopsi teknologi diagnostik mutakhir dan digitalisasi layanan rumah sakit untuk kemudahan akses seluruh lapisan masyarakat."
    }
  ];

  const leaders = [
    {
      name: "dr. Hendra Kusumah, Sp.B, MARS",
      role: "Direktur Utama RS Qless",
      photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
      desc: "Pelopor manajemen rumah sakit digital dengan lebih dari 20 tahun dedikasi pada efisiensi layanan kesehatan publik."
    },
    {
      name: "dr. Adrian Pratama, Sp.PD, K-GEH",
      role: "Ketua Komite Medis & Konsultan Klinis",
      photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
      desc: "Memimpin standardisasi protokol klinis seluruh poliklinik spesialis untuk menjamin ketepatan diagnosa pasien."
    },
    {
      name: "Ns. Maya Anggraini, S.Kep, M.Kep",
      role: "Direktur Pelayanan Keperawatan & Pasien",
      photo: "https://images.unsplash.com/photo-1594824813580-2a813898124b?w=400&auto=format&fit=crop&q=80",
      desc: "Memastikan pengalaman setiap pasien rawat jalan dan rawat inap terlaksana dengan kenyamanan dan empati prima."
    }
  ];

  return (
    <div className="page-container about-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <span className="page-badge">Profil & Komitmen</span>
          <h1 className="page-title">Tentang RS Qless</h1>
          <p className="page-subtitle">
            Pelopor integrasi teknologi antrean digital dan pelayanan medis terpadu di Indonesia.
          </p>
        </div>

        {/* Story Section */}
        <section className="about-story-section">
          <div className="story-grid">
            <Reveal direction="right">
              <div className="story-content">
                <span className="section-tag">MISI KAMI</span>
                <h2 className="story-title">Mengembalikan Waktu Berharga Anda Bersama Keluarga</h2>
                <p className="story-p">
                  RS Qless didirikan dari satu kegelisahan bersama: mengapa pasien yang sedang tidak sehat harus menghabiskan waktu berjam-jam hanya untuk duduk di bangku antrean rumah sakit yang padat?
                </p>
                <p className="story-p">
                  Kami mengintegrasikan sistem antrean digital terpusat (Qless Engine) dengan rekam medis elektronik dan poliklinik spesialis unggulan. Pasien dapat memantau estimasi giliran secara real-time dari ponsel, hadir tepat waktu, dan langsung berkonsultasi dengan dokter pilihannya.
                </p>

                <div className="story-badges-list">
                  <div className="story-badge-item">
                    <CheckCircle2 size={18} className="text-success" />
                    <span>Sertifikasi Paripurna KARS Bintang 5</span>
                  </div>
                  <div className="story-badge-item">
                    <CheckCircle2 size={18} className="text-success" />
                    <span>Integrasi Rujukan BPJS & 30+ Asuransi Swasta</span>
                  </div>
                  <div className="story-badge-item">
                    <CheckCircle2 size={18} className="text-success" />
                    <span>Layanan Farmasi & Laboratorium 24 Jam</span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal direction="left">
              <div className="story-visual">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&auto=format&fit=crop&q=80"
                  alt="Fasilitas RS Qless"
                  className="story-main-img"
                />
                <div className="story-floating-stat">
                  <strong className="floating-stat-num">11 Menit</strong>
                  <span className="floating-stat-label">Rata-rata Waktu Tunggu Pasien</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Animated Stat Counters */}
        <section className="about-counters-section">
          <div className="about-counters-grid">
            {hospitalStats.map((stat, idx) => (
              <Reveal key={stat.id} direction="up" delay={idx * 100}>
                <div className="about-counter-card">
                  <div className="about-counter-num">
                    <Counter end={stat.number} suffix={stat.suffix} />
                  </div>
                  <strong className="about-counter-title">{stat.label}</strong>
                  <p className="about-counter-sub">{stat.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Core Values */}
        <section className="section about-values-section">
          <div className="section-header">
            <span className="section-tag">NILAI UTAMA KAMI</span>
            <h2 className="section-title">Prinsip Kerja & Integritas Pelayanan</h2>
            <p className="section-desc">
              Empat pilar yang menjadi landasan setiap langkah dokter, perawat, dan staf RS Qless.
            </p>
          </div>

          <div className="values-grid">
            {values.map((val, idx) => (
              <Reveal key={val.title} direction="up" delay={idx * 120}>
                <Card className="value-card">
                  <CardBody>
                    <div className="value-icon-box">{val.icon}</div>
                    <h3 className="value-card-title">{val.title}</h3>
                    <p className="value-card-desc">{val.desc}</p>
                  </CardBody>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Hospital Leadership */}
        <section className="section about-leadership-section">
          <div className="section-header">
            <span className="section-tag">DIREKSI & KOMITE MEDIS</span>
            <h2 className="section-title">Pimpinan Rumah Sakit</h2>
            <p className="section-desc">
              Profesional berintegritas yang memandu tata kelola klinis dan pelayanan mutu RS Qless.
            </p>
          </div>

          <div className="leadership-grid">
            {leaders.map((person, idx) => (
              <Reveal key={person.name} direction="up" delay={idx * 150}>
                <Card className="leader-card">
                  <div className="leader-photo-wrapper">
                    <img src={person.photo} alt={person.name} className="leader-photo" />
                  </div>
                  <CardBody className="leader-body">
                    <h3 className="leader-name">{person.name}</h3>
                    <span className="leader-role text-primary">{person.role}</span>
                    <p className="leader-desc">{person.desc}</p>
                  </CardBody>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="about-bottom-cta">
          <div className="about-cta-inner">
            <h2>Kesehatan Keluarga Anda, Lebih Terencana Hari Ini</h2>
            <p>Jadwalkan konsultasi dokter spesialis atau pantau antrean live sekarang.</p>
            <div className="about-cta-btns">
              <Button as={Link} to="/appointment" variant="primary" size="lg" iconLeft={<CalendarPlus size={18} />}>
                Buat Janji Kunjungan
              </Button>
              <Button as={Link} to="/doctors" variant="secondary" size="lg" iconRight={<ArrowRight size={18} />}>
                Lihat Jadwal Dokter
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
