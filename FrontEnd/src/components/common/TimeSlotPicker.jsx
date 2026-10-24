import React from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import './TimeSlotPicker.css';

/**
 * Reusable TimeSlotPicker component for appointment booking:
 * - Groups slots by session (Pagi / Siang / Sore)
 * - Highlights available vs booked/full slots
 * - Single-click selection with keyboard accessibility
 */
export function TimeSlotPicker({
  slots = [],
  selectedSlot = null,
  onSelectSlot,
  disabled = false
}) {
  // Group slots into sessions if not already grouped
  const defaultSlots = [
    { time: "08:00 - 08:30", session: "Pagi", available: true, quotaRemaining: 3 },
    { time: "08:30 - 09:00", session: "Pagi", available: true, quotaRemaining: 2 },
    { time: "09:00 - 09:30", session: "Pagi", available: false, quotaRemaining: 0 },
    { time: "10:00 - 10:30", session: "Pagi", available: true, quotaRemaining: 1 },
    { time: "11:00 - 11:30", session: "Pagi", available: true, quotaRemaining: 4 },
    { time: "13:30 - 14:00", session: "Siang", available: true, quotaRemaining: 3 },
    { time: "14:00 - 14:30", session: "Siang", available: false, quotaRemaining: 0 },
    { time: "15:00 - 15:30", session: "Siang", available: true, quotaRemaining: 2 },
    { time: "16:00 - 16:30", session: "Siang", available: true, quotaRemaining: 2 },
    { time: "18:30 - 19:00", session: "Sore / Malam", available: true, quotaRemaining: 2 },
    { time: "19:00 - 19:30", session: "Sore / Malam", available: true, quotaRemaining: 1 }
  ];

  const currentSlots = slots.length > 0 ? slots : defaultSlots;

  // Group by session
  const grouped = currentSlots.reduce((acc, slot) => {
    const session = slot.session || (
      slot.time.startsWith('08') || slot.time.startsWith('09') || slot.time.startsWith('10') || slot.time.startsWith('11')
        ? 'Sesi Pagi (08:00 - 11:30)'
        : slot.time.startsWith('13') || slot.time.startsWith('14') || slot.time.startsWith('15') || slot.time.startsWith('16')
        ? 'Sesi Siang (13:00 - 16:30)'
        : 'Sesi Sore / Malam (18:00 - 20:00)'
    );
    if (!acc[session]) acc[session] = [];
    acc[session].push(slot);
    return acc;
  }, {});

  return (
    <div className="time-slot-picker">
      <div className="slot-picker-legend">
        <span className="legend-item">
          <span className="legend-dot available" /> Tersedia
        </span>
        <span className="legend-item">
          <span className="legend-dot limited" /> Sisa Sedikit
        </span>
        <span className="legend-item">
          <span className="legend-dot full" /> Penuh
        </span>
      </div>

      <div className="sessions-list">
        {Object.entries(grouped).map(([sessionName, sessionSlots]) => (
          <div key={sessionName} className="session-group">
            <h4 className="session-title">
              <Clock size={15} />
              <span>{sessionName}</span>
            </h4>

            <div className="slots-grid">
              {sessionSlots.map((slot) => {
                const isSelected = selectedSlot === slot.time;
                const isFull = !slot.available || slot.quotaRemaining === 0;
                const isLimited = slot.quotaRemaining > 0 && slot.quotaRemaining <= 2;

                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={isFull || disabled}
                    onClick={() => !isFull && onSelectSlot(slot.time)}
                    className={`time-slot-btn ${isSelected ? 'is-selected' : ''} ${
                      isFull ? 'is-full' : ''
                    } ${isLimited ? 'is-limited' : ''}`}
                    aria-pressed={isSelected}
                    title={
                      isFull
                        ? 'Slot waktu ini sudah penuh'
                        : isLimited
                        ? `Tersisa ${slot.quotaRemaining} kuota`
                        : 'Slot tersedia'
                    }
                  >
                    <span className="slot-time">{slot.time}</span>
                    <span className="slot-status">
                      {isSelected ? (
                        <span className="slot-selected-indicator">
                          <CheckCircle2 size={13} /> Terpilih
                        </span>
                      ) : isFull ? (
                        <span className="slot-badge-full">Penuh</span>
                      ) : isLimited ? (
                        <span className="slot-badge-limited">Sisa {slot.quotaRemaining}</span>
                      ) : (
                        <span className="slot-badge-avail">Tersedia</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimeSlotPicker;
