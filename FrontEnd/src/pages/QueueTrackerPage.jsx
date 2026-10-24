import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  RotateCw, 
  CalendarPlus, 
  AlertCircle
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';
import LiveQueueCard from '../components/queue/LiveQueueCard';
import TicketCard from '../components/queue/TicketCard';
import FormField from '../components/common/FormField';
import Button from '../components/common/Button';
import Card, { CardBody } from '../components/common/Card';
import Badge from '../components/common/Badge';

import './QueueTrackerPage.css';

export function QueueTrackerPage() {
  const { queues, findTicket } = useQueue();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedTicket, setSearchedTicket] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setHasSearched(true);
    const result = findTicket(searchQuery);
    setSearchedTicket(result);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="page-container queue-tracker-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <span className="page-badge">Live Monitor</span>
          <h1 className="page-title">Papan Antrean Poliklinik & Pelacakan Tiket</h1>
          <p className="page-subtitle">
            Pantau pergerakan antrean loket poliklinik secara transparan atau cari nomor antrean Anda dengan kode reservasi.
          </p>
        </div>

        {/* Search Ticket Bar */}
        <div className="ticket-tracker-search-section">
          <Card className="tracker-search-card" elevated>
            <CardBody>
              <form onSubmit={handleSearch} className="tracker-search-form">
                <div className="search-input-col">
                  <FormField
                    placeholder="Masukkan Kode Booking (contoh: QLS-8821) atau No. Tiket (A-027)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    iconLeft={<Search size={18} />}
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  iconLeft={<Search size={16} />}
                >
                  Cek Status Tiket
                </Button>
              </form>

              <div className="sample-codes-hint">
                <span className="hint-label">Coba kode demo:</span>
                <button
                  type="button"
                  className="hint-code-btn"
                  onClick={() => {
                    setSearchQuery('QLS-8821');
                    setSearchedTicket(findTicket('QLS-8821'));
                    setHasSearched(true);
                  }}
                >
                  QLS-8821 (Poli Penyakit Dalam)
                </button>
                <button
                  type="button"
                  className="hint-code-btn"
                  onClick={() => {
                    setSearchQuery('QLS-4412');
                    setSearchedTicket(findTicket('QLS-4412'));
                    setHasSearched(true);
                  }}
                >
                  QLS-4412 (Poli Anak)
                </button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* If searched ticket found, show personalized patient status banner */}
        {hasSearched && (
          <div className="search-result-display">
            {searchedTicket ? (
              <div className="patient-active-status-card">
                <div className="active-status-header">
                  <div className="status-badge-title">
                    <Badge variant="success" pulse size="md">
                      Tiket Ditemukan
                    </Badge>
                    <h3>Halo, {searchedTicket.patientName}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchedTicket(null);
                      setHasSearched(false);
                      setSearchQuery('');
                    }}
                  >
                    Tutup Hasil
                  </Button>
                </div>

                <div className="active-ticket-stats-grid">
                  <div className="ticket-stat-box">
                    <span className="stat-box-label">Nomor Antrean Anda</span>
                    <strong className="stat-box-value primary">{searchedTicket.ticketNumber}</strong>
                  </div>
                  <div className="ticket-stat-box">
                    <span className="stat-box-label">Poliklinik Tujuan</span>
                    <strong className="stat-box-value">{searchedTicket.clinicName}</strong>
                    <span className="stat-box-sub">{searchedTicket.room}</span>
                  </div>
                  <div className="ticket-stat-box">
                    <span className="stat-box-label">Sisa Antrean di Depan</span>
                    <strong className="stat-box-value accent">{searchedTicket.peopleAhead} Pasien</strong>
                    <span className="stat-box-sub">Diperkirakan dipanggil {searchedTicket.estimatedCall}</span>
                  </div>
                </div>

                <div className="active-ticket-actions">
                  <TicketCard ticket={searchedTicket} />
                </div>
              </div>
            ) : (
              <div className="ticket-not-found-banner">
                <AlertCircle size={24} className="text-danger" />
                <div>
                  <strong>Tiket Tidak Ditemukan</strong>
                  <p>Kode reservasi atau nomor antrean "{searchQuery}" tidak ditemukan pada jadwal aktif hari ini.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hospital Counters Live Grid Header */}
        <div className="counters-section-header">
          <div className="counters-title-group">
            <h2 className="counters-title">Status Loket Pelayanan Poliklinik</h2>
            <span className="counters-live-tag">
              <span className="live-dot" /> Diperbarui Real-Time
            </span>
          </div>

          <div className="counters-controls">
            <Button
              variant="secondary"
              size="sm"
              iconLeft={<RotateCw size={14} className={isRefreshing ? 'spin-anim' : ''} />}
              onClick={handleRefresh}
            >
              Segarkan Layar
            </Button>
          </div>
        </div>

        {/* Live Counters Grid */}
        <div className="counters-cards-grid">
          {queues.map((clinic, idx) => (
            <div key={clinic.clinicId} className="queue-card-animate" style={{ animationDelay: `${idx * 80}ms` }}>
              <LiveQueueCard
                clinic={clinic}
              />
            </div>
          ))}
        </div>

        {/* Bottom Booking CTA */}
        <div className="queue-page-bottom-cta">
          <Card className="cta-highlight-card">
            <CardBody className="cta-highlight-body">
              <div className="cta-highlight-info">
                <h3>Belum Punya Nomor Antrean Hari Ini?</h3>
                <p>Ambil antrean digital sebelum kuota harian dokter spesialis penuh.</p>
              </div>
              <Button as={Link} to="/appointment" variant="primary" size="lg" iconLeft={<CalendarPlus size={18} />}>
                Daftar & Ambil Antrean Sekarang
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default QueueTrackerPage;
