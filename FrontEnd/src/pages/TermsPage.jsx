import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';
import './LegalPages.css';

export function TermsPage() {
  return (
    <div className="page-container legal-page">
      <div className="container legal-container">
        <div className="legal-back-nav">
          <Button as={Link} to="/" variant="ghost" size="sm" iconLeft={<ArrowLeft size={16} />}>
            Kembali ke Beranda
          </Button>
        </div>

        <div className="page-header">
          <span className="page-badge">Ketentuan Layanan</span>
          <h1 className="page-title">Syarat & Ketentuan Reservasi Antrean</h1>
          <p className="page-subtitle">
            Tata tertib pendaftaran digital, kehadiran di poliklinik, dan kebijakan pembatalan tiket RS Qless.
          </p>
        </div>

        <div className="legal-content-card">
          <section className="legal-section">
            <h2>1. Ketentuan Umum Reservasi</h2>
            <p>
              Dengan membuat janji temu melalui platform RS Qless, Anda menyetujui untuk memberikan data yang akurat, sah, dan sesuai dengan dokumen identitas resmi (KTP/SIM/Paspor).
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Kuota Antrean & Waktu Kehadiran</h2>
            <ul>
              <li>Nomor antrean diterbitkan secara otomatis berdasarkan urutan pendaftaran dan ketersediaan slot kuota dokter spesialis.</li>
              <li>Pasien diharapkan hadir di poliklinik minimal <strong>15 menit sebelum estimasi waktu panggilan</strong> tertera pada E-Tiket.</li>
              <li>Jika nomor antrean dipanggil sebanyak 3 (tiga) kali berturut-turut di layar dan pengeras suara tanpa konfirmasi kehadiran di loket, nomor antrean akan dilewati dan ditempatkan pada jeda 2 antrean berikutnya.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Pembatalan & Penjadwalan Ulang</h2>
            <p>
              Kami memahami adanya situasi tak terduga. Pembatalan atau perubahan jadwal konsultasi dapat dilakukan paling lambat <strong>2 jam sebelum jam sesi poliklinik dimulai</strong> tanpa dikenakan biaya administrasi apa pun.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Pasien Kategori Gawat Darurat (IGD)</h2>
            <p>
              Platform reservasi ini ditujukan khusus untuk poliklinik rawat jalan terencana. Bagi pasien dengan kondisi kegawatdaruratan medis (nyeri dada akut, sesak napas berat, trauma kepala, pendarahan), harap langsung menuju Instalasi Gawat Darurat (IGD) tanpa perlu memesan tiket antrean online.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Perubahan Jadwal Dokter Praktik</h2>
            <p>
              Dalam situasi darurat medis operasi cito atau tugas kedokteran mendadak, pihak rumah sakit berhak mengalihkan jadwal dokter dengan konfirmasi terlebih dahulu melalui pesan WhatsApp atau telepon resmi rumah sakit.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;
