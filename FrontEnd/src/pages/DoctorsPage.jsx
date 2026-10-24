import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Clock, 
  Star, 
  CalendarPlus, 
  Stethoscope, 
  ChevronRight
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';
import { specialties } from '../data/hospitalData';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import FormField from '../components/common/FormField';
import Reveal from '../components/common/Reveal';
import './DoctorsPage.css';

export function DoctorsPage() {
  const { doctors } = useQueue();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSpecialty = searchParams.get('specialty') || 'all';

  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty);
  const [searchQuery, setSearchQuery] = useState('');

  const filterCategories = [
    { id: 'all', label: 'Semua Spesialis' },
    ...specialties.map(s => ({ id: s.id, label: s.name }))
  ];

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchSpecialty =
        selectedSpecialty === 'all' || doc.specialtyId === selectedSpecialty;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        doc.name.toLowerCase().includes(q) ||
        doc.title.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q);

      return matchSpecialty && matchSearch;
    });
  }, [selectedSpecialty, searchQuery]);

  const handleSpecialtyChange = (specId) => {
    setSelectedSpecialty(specId);
    if (specId === 'all') {
      searchParams.delete('specialty');
    } else {
      searchParams.set('specialty', specId);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="page-container doctors-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <span className="page-badge">Tim Medis & Spesialis</span>
          <h1 className="page-title">Jadwal Praktik & Tim Dokter Rumah Sakit</h1>
          <p className="page-subtitle">
            Pilih dokter spesialis sesuai kebutuhan medis Anda. Arahkan kursor pada kartu dokter untuk melihat rekam jejak, STR, dan langsung jadwalkan janji temu digital.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="doctors-filter-bar">
          <div className="doctor-search-box">
            <FormField
              placeholder="Cari nama dokter atau subspesialisasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              iconLeft={<Search size={18} />}
            />
          </div>

          <div className="specialty-tabs-scroll">
            {filterCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`filter-tab-btn ${selectedSpecialty === cat.id ? 'active' : ''}`}
                onClick={() => handleSpecialtyChange(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results summary */}
        <div className="doctors-result-count">
          Menampilkan <strong>{filteredDoctors.length} dokter spesialis</strong>
          {searchQuery && ` untuk pencarian "${searchQuery}"`}
        </div>

        {/* Doctors Grid with Hover-Reveal */}
        {filteredDoctors.length === 0 ? (
          <div className="no-doctors-found">
            <Stethoscope size={48} className="no-doc-icon" />
            <h3>Dokter Tidak Ditemukan</h3>
            <p>Tidak ada jadwal dokter yang cocok dengan kriteria pencarian Anda.</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSelectedSpecialty('all');
                setSearchQuery('');
              }}
            >
              Reset Filter Pencarian
            </Button>
          </div>
        ) : (
          <div className="doctors-main-grid">
            {filteredDoctors.map((doc, idx) => (
              <Reveal key={doc.id} direction="up" delay={(idx % 6) * 100}>
                <div className="doctor-card-interactive" tabIndex={0}>
                  {/* Photo with hover reveal details */}
                  <div className="doctor-image-wrapper">
                    <img
                      src={doc.photo}
                      alt={doc.name}
                      className="doctor-image"
                      loading="lazy"
                    />

                    <div className="doctor-rating-pill">
                      <Star size={13} className="star-icon" />
                      <span>{doc.rating} ({doc.reviewsCount})</span>
                    </div>

                    {/* UX Interaction: Hover-reveal details */}
                    <div className="doctor-hover-details">
                      <div className="hover-detail-item">
                        <span className="hover-label">Pengalaman Medis:</span>
                        <strong className="hover-value">{doc.experience} Praktik</strong>
                      </div>

                      <div className="hover-detail-item">
                        <span className="hover-label">Riwayat Pendidikan:</span>
                        <span className="hover-value small">{doc.education}</span>
                      </div>

                      <div className="hover-detail-item">
                        <span className="hover-label">Nomor STR Konsil:</span>
                        <span className="hover-value monospace">{doc.strNumber}</span>
                      </div>

                      <div className="hover-detail-item">
                        <span className="hover-label">Biaya Konsultasi:</span>
                        <strong className="hover-value text-accent">{doc.fee}</strong>
                      </div>

                      <Button
                        as={Link}
                        to={`/appointment?doctor=${doc.id}`}
                        variant="primary"
                        size="sm"
                        className="w-full hover-cta-btn"
                        iconRight={<CalendarPlus size={14} />}
                      >
                        Pilih Jadwal & Buat Janji
                      </Button>
                    </div>
                  </div>

                  {/* Doctor Info Body */}
                  <div className="doctor-card-info">
                    <div className="doctor-badges-row">
                      <Badge variant="primary" size="sm">
                        {doc.specialty}
                      </Badge>
                      <span className="doctor-room-tag">{doc.clinicRoom}</span>
                    </div>

                    <h2 className="doctor-card-name">{doc.name}</h2>
                    <p className="doctor-card-sub">{doc.title}</p>

                    <p className="doctor-card-bio">{doc.bio}</p>

                    <div className="doctor-card-schedule-footer">
                      <div className="schedule-days-pill">
                        <Clock size={13} />
                        <span>Hari: {doc.days.join(', ')}</span>
                      </div>
                      <Link
                        to={`/appointment?doctor=${doc.id}`}
                        className="mobile-direct-book-link"
                      >
                        Buat Janji <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorsPage;
