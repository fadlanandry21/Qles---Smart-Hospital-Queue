import React from 'react';
import { Users, Clock, Stethoscope } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../common/Card';
import Badge from '../common/Badge';
import './QueueComponents.css';

export function LiveQueueCard({ clinic }) {
  const isServing = clinic.status === 'serving';

  return (
    <Card className="live-queue-card" elevated>
      <CardHeader className="live-queue-header">
        <div className="queue-clinic-title-row">
          <div className="clinic-badge-group">
            <span className="clinic-counter-tag">{clinic.counter}</span>
            <h3 className="clinic-name">{clinic.clinicName}</h3>
          </div>
          <Badge
            variant={isServing ? 'success' : 'accent'}
            pulse={isServing}
            size="sm"
          >
            {isServing ? 'Sedang Melayani' : 'Istirahat / Jeda'}
          </Badge>
        </div>
        <p className="queue-active-doctor">
          <Stethoscope size={14} className="doctor-icon" />
          <span>{clinic.activeDoctor}</span>
        </p>
      </CardHeader>

      <CardBody className="live-queue-body">
        {/* Main Display: Current Calling Number */}
        <div className="queue-numbers-display">
          <div className="current-call-block">
            <span className="call-label">NOMOR SEDANG DILAYANI</span>
            <div className="big-ticket-number">{clinic.currentNumber}</div>
            <span className="last-called-time">Dipanggil pukul {clinic.lastCalledAt}</span>
          </div>

          <div className="next-call-block">
            <span className="call-label">NOMOR BERIKUTNYA</span>
            <div className="next-ticket-number">{clinic.nextNumber}</div>
            <span className="people-queue-count">
              <Users size={13} /> {clinic.totalWaiting} pasien dalam antrean
            </span>
          </div>
        </div>

        {/* Wait time estimate pill */}
        <div className="queue-estimate-strip">
          <div className="estimate-item">
            <Clock size={15} className="estimate-icon" />
            <span>Estimasi Waktu Tunggu: <strong>~{clinic.totalWaiting * clinic.avgServiceTimeMinutes} menit</strong></span>
          </div>
          <span className="estimate-dot">•</span>
          <span className="estimate-per-patient">{clinic.avgServiceTimeMinutes} mnt/pasien</span>
        </div>
      </CardBody>
    </Card>
  );
}

export default LiveQueueCard;
