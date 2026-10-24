import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, FileText, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import './LegalPages.css';

export function PrivacyPage() {
  return (
    <div className="page-container legal-page">
      <div className="container legal-container">
        <div className="legal-back-nav">
          <Button as={Link} to="/" variant="ghost" size="sm" iconLeft={<ArrowLeft size={16} />}>
            Kembali ke Beranda
          </Button>
        </div>

        <div className="page-header">
          <span className="page-badge">Keamanan & Kepatuhan Data</span>
          <h1 className="page-title">Kebijakan Privasi & Perlindungan Data Pasien</h1>
          <p className="page-subtitle">
            Terakhir diperbarui: 20 Oktober 2026. Kepatuhan penuh terhadap UU Perlindungan Data Pribadi (UU PDP No. 27/2022) dan Permenkes tentang Rekam Medis Elektronik.
          </p>
        </div>

        <div className="legal-content-card">
          <section className="legal-section">
            <h2>1. Pendahuluan</h2>
            <p>
              RS Qless berkomitmen melindungi privasi, kerahasiaan riwayat kesehatan, dan data pribadi setiap pasien yang menggunakan aplikasi web antrean dan reservasi digital kami. Dokumen Kebijakan Privasi ini menerangkan bagaimana kami mengumpulkan, mengelola, menyimpan, serta menjaga kerahasiaan data Anda.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Informasi yang Kami Kumpulkan</h2>
            <p>Saat Anda membuat janji temu atau mengambil nomor antrean, kami mengumpulkan data yang diperlukan demi keselamatan pasien (patient safety) dan kelancaran administrasi:</p>
            <ul>
              <li><strong>Identitas Pribadi:</strong> Nama lengkap, Nomor Induk Kependudukan (NIK), tanggal lahir, jenis kelamin.</li>
              <li><strong>Informasi Kontak:</strong> Nomor WhatsApp/HP aktif dan alamat email untuk pengiriman tiket dan pengingat antrean.</li>
              <li><strong>Data Penjaminan Medis:</strong> Nomor kartu BPJS Kesehatan, nomor polis asuransi swasta, atau surat rujukan FKTP.</li>
              <li><strong>Informasi Medis Singkat:</strong> Keluhan utama yang disampaikan saat pendaftaran untuk membantu triase awal poliklinik spesialis.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Penggunaan dan Perlindungan Data</h2>
            <p>Data pribadi Anda hanya digunakan untuk:</p>
            <ul>
              <li>Menghasilkan kode reservasi dan nomor antrean poliklinik secara presisi.</li>
              <li>Mengirimkan notifikasi estimasi giliran loket pelayanan ke ponsel Anda.</li>
              <li>Sinkronisasi dengan Rekam Medis Elektronik (RME) yang hanya dapat diakses oleh dokter dan tenaga medis pemeriksa Anda.</li>
            </ul>
            <p>
              Kami tidak pernah menjual, menyewakan, atau memindahtangankan data kesehatan Anda kepada pihak ketiga mana pun tanpa persetujuan tertulis eksplisit dari Anda, kecuali diwajibkan oleh peraturan perundang-undangan Republik Indonesia.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Keamanan Enkripsi</h2>
            <p>
              Seluruh transmisi data antara peramban (browser) Anda dan server kami dilindungi oleh enkripsi TLS 1.3 256-bit berstandar rumah sakit internasional. Basis data kami disimpan di pusat data tier-3 dengan kontrol akses berlapis.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Hak Pasien atas Data</h2>
            <p>
              Anda berhak meminta salinan riwayat kunjungan antrean, memperbarui nomor kontak, atau meminta penghapusan akun non-rekam medis dengan menghubungi Petugas Perlindungan Data kami melalui email: <strong>privasi@qless.co.id</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPage;
