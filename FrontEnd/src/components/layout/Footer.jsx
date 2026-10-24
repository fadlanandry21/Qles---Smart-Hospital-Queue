import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Heart, 
  ArrowUpRight 
} from 'lucide-react';
import { hospitalInfo } from '../../data/hospitalData';
import './Footer.css';

export function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-top-accent" />
      <div className="container footer-container">
        {/* Main Footer Grid */}
        <div className="footer-grid">
          {/* Column 1: Hospital Brand & Mission */}
          <div className="footer-col footer-col-brand">
            <Link to="/" className="footer-brand">
              <div className="brand-icon-box">
                <Activity size={20} />
              </div>
              <div className="brand-text-group">
                <span className="brand-title">Qless</span>
                <span className="brand-subtitle">Smart Hospital Queue</span>
              </div>
            </Link>
            <p className="footer-description">
              Sistem antrean dan reservasi janji temu medis digital masa depan. Menghilangkan waktu tunggu konvensional dengan estimasi presisi dan pelayanan dokter terpadu.
            </p>
            <div className="footer-accreditation">
              <ShieldCheck size={18} className="accreditation-icon" />
              <span>{hospitalInfo.accreditation}</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Navigasi Utama</h4>
            <ul className="footer-links">
              <li><Link to="/">Beranda</Link></li>
              <li><Link to="/about">Tentang Kami</Link></li>
              <li><Link to="/doctors">Jadwal & Tim Dokter</Link></li>
              <li><Link to="/queue">Cek Antrean Real-Time</Link></li>
              <li><Link to="/gallery">Fasilitas & Galeri</Link></li>
              <li><Link to="/blog">Artikel & Berita Medis</Link></li>
              <li><Link to="/contact">Pusat Bantuan & Kontak</Link></li>
            </ul>
          </div>

          {/* Column 3: Poliklinik Unggulan */}
          <div className="footer-col">
            <h4 className="footer-heading">Layanan Poliklinik</h4>
            <ul className="footer-links">
              <li><Link to="/doctors?specialty=penyakit-dalam">Poli Penyakit Dalam</Link></li>
              <li><Link to="/doctors?specialty=anak">Poli Anak & Imunisasi</Link></li>
              <li><Link to="/doctors?specialty=gigi">Poli Gigi & Mulut</Link></li>
              <li><Link to="/doctors?specialty=jantung">Poli Jantung & Kardiovaskular</Link></li>
              <li><Link to="/doctors?specialty=mata">Poli Mata</Link></li>
              <li><Link to="/doctors?specialty=saraf">Poli Saraf & Neurologi</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Emergency */}
          <div className="footer-col">
            <h4 className="footer-heading">Kontak & Lokasi</h4>
            <div className="footer-contact-info">
              <div className="contact-item">
                <MapPin size={18} className="contact-icon" />
                <span>{hospitalInfo.address}</span>
              </div>
              <div className="contact-item emergency-highlight">
                <Phone size={18} className="contact-icon text-danger" />
                <div>
                  <strong>IGD & Darurat 24 Jam:</strong>
                  <p className="phone-number">{hospitalInfo.emergencyPhone}</p>
                </div>
              </div>
              <div className="contact-item">
                <Mail size={18} className="contact-icon" />
                <span>{hospitalInfo.email}</span>
              </div>
              <div className="contact-item">
                <Clock size={18} className="contact-icon" />
                <span>Poliklinik: {hospitalInfo.operatingHours.poliklinik}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom / Legal */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} RS Qless. Hak Cipta Dilindungi Undang-Undang.
          </p>
          <div className="footer-legal-links">
            <Link to="/privacy">Kebijakan Privasi</Link>
            <span className="legal-separator">•</span>
            <Link to="/terms">Syarat & Ketentuan Layanan</Link>
            <span className="legal-separator">•</span>
            <Link to="/login">Portal Pasien</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
