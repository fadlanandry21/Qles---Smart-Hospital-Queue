import React, { useState } from 'react';
import { 
  Printer, 
  Copy, 
  Check, 
  Clock, 
  Calendar, 
  MapPin, 
  User, 
  CreditCard, 
  Activity, 
  AlertCircle 
} from 'lucide-react';
import Card, { CardBody, CardHeader, CardFooter } from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import './QueueComponents.css';

export function TicketCard({ ticket, onPrint }) {
  const [copied, setCopied] = useState(false);

  if (!ticket) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(ticket.bookingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="ticket-card-wrapper">
      <Card className="e-ticket-card" elevated>
        {/* Top Ticket Header */}
        <CardHeader className="e-ticket-header">
          <div className="ticket-header-top">
            <div className="ticket-brand">
              <div className="brand-icon-box sm">
                <Activity size={16} />
              </div>
              <span className="ticket-brand-name">RS Qless</span>
            </div>
            {ticket.status === 'pending' ? (
              <Badge variant="accent" size="sm">
                Menunggu Konfirmasi Loket
              </Badge>
            ) : ticket.status === 'serving' ? (
              <Badge variant="success" pulse size="sm">
                Sedang Dipanggil di Loket
              </Badge>
            ) : ticket.status === 'completed' ? (
              <Badge variant="secondary" size="sm">
                Selesai Dilayani
              </Badge>
            ) : ticket.status === 'cancelled' ? (
              <Badge variant="danger" size="sm">
                Antrean Dibatalkan
              </Badge>
            ) : (
              <Badge variant="primary" pulse size="sm">
                Diterima & Siap Dipanggil
              </Badge>
            )}
          </div>

          <div className="ticket-code-row">
            <div>
              <span className="code-label">KODE RESERVASI</span>
              <div className="booking-code-text">{ticket.bookingCode}</div>
            </div>
            <button
              type="button"
              className="copy-code-btn"
              onClick={handleCopy}
              title="Salin Kode Reservasi"
            >
              {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
              <span>{copied ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>
        </CardHeader>

        {/* Big Ticket Number Banner */}
        <div className="ticket-number-banner">
          <span className="number-banner-label">NOMOR ANTREAN POLIKLINIK</span>
          <div className="main-ticket-digit">{ticket.ticketNumber}</div>
          <div className="ticket-room-info">
            <MapPin size={14} />
            <span>{ticket.room || 'Lantai 2 Poliklinik Terpadu'}</span>
          </div>
        </div>

        {/* Ticket Details Body */}
        <CardBody className="e-ticket-body">
          <div className="ticket-info-grid">
            <div className="info-cell">
              <span className="info-cell-label">Nama Pasien</span>
              <strong className="info-cell-value">{ticket.patientName}</strong>
            </div>

            <div className="info-cell">
              <span className="info-cell-label">Poli / Spesialisasi</span>
              <strong className="info-cell-value">{ticket.clinicName}</strong>
            </div>

            <div className="info-cell">
              <span className="info-cell-label">Dokter Konsultan</span>
              <strong className="info-cell-value">{ticket.doctorName}</strong>
            </div>

            <div className="info-cell">
              <span className="info-cell-label">Jadwal & Slot Waktu</span>
              <div className="info-cell-value with-icon">
                <Clock size={14} className="text-primary" />
                <span>{ticket.timeSlot}</span>
              </div>
            </div>

            <div className="info-cell">
              <span className="info-cell-label">Estimasi Panggilan</span>
              <div className="info-cell-value text-accent font-bold">
                {ticket.estimatedCall || 'Menyesuaikan antrean'}
              </div>
            </div>

            <div className="info-cell">
              <span className="info-cell-label">Metode Pembayaran</span>
              <div className="info-cell-value with-icon">
                <CreditCard size={14} />
                <span>{ticket.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Barcode Mock for Verification */}
          <div className="ticket-barcode-box">
            <div className="barcode-bars" aria-hidden="true">
              {[4, 2, 6, 3, 2, 5, 8, 3, 6, 2, 4, 3, 7, 2, 5, 3, 6, 4, 3, 5, 7, 2, 4, 6].map((w, i) => (
                <div key={i} className="barcode-line" style={{ width: `${w}px` }} />
              ))}
            </div>
            <span className="barcode-number">*{ticket.bookingCode}*</span>
          </div>

          <div className="ticket-notice-box">
            <AlertCircle size={15} className="notice-icon" />
            <p>
              Harap tiba di poliklinik 15 menit sebelum estimasi waktu panggilan. Pindai kode ini di kiosk mandiri lantai 1 untuk check-in kehadiran.
            </p>
          </div>
        </CardBody>

        <CardFooter className="e-ticket-footer">
          <Button
            variant="secondary"
            size="md"
            iconLeft={<Printer size={16} />}
            onClick={handlePrint}
            className="w-full"
          >
            Cetak / Simpan E-Tiket (PDF)
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default TicketCard;
