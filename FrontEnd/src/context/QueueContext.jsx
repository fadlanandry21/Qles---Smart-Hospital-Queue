import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialQueueState, sampleTickets } from '../data/queueData';
import { doctorsList } from '../data/doctorsData';
import { 
  departmentsApi, 
  doctorsApi, 
  appointmentsApi, 
  adminApi 
} from '../utils/api';

const QueueContext = createContext(null);

const DATA_VERSION = 'v2.2-2026-qless';

export function QueueProvider({ children }) {
  const [queues, setQueues] = useState(() => {
    try {
      const version = localStorage.getItem('qless_data_version');
      if (version !== DATA_VERSION) {
        localStorage.removeItem('qless_queues');
        localStorage.removeItem('qless_tickets');
        localStorage.removeItem('qless_doctors');
        localStorage.setItem('qless_data_version', DATA_VERSION);
        return initialQueueState;
      }
      const saved = localStorage.getItem('qless_queues');
      return saved ? JSON.parse(saved) : initialQueueState;
    } catch {
      return initialQueueState;
    }
  });

  const [tickets, setTickets] = useState(() => {
    try {
      const version = localStorage.getItem('qless_data_version');
      if (version !== DATA_VERSION) {
        return sampleTickets;
      }
      const saved = localStorage.getItem('qless_tickets');
      return saved ? JSON.parse(saved) : sampleTickets;
    } catch {
      return sampleTickets;
    }
  });

  const [doctors, setDoctors] = useState(() => {
    try {
      const version = localStorage.getItem('qless_data_version');
      if (version !== DATA_VERSION) {
        return doctorsList;
      }
      const saved = localStorage.getItem('qless_doctors');
      return saved ? JSON.parse(saved) : doctorsList;
    } catch {
      return doctorsList;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('qless_queues', JSON.stringify(queues));
  }, [queues]);

  useEffect(() => {
    localStorage.setItem('qless_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('qless_doctors', JSON.stringify(doctors));
  }, [doctors]);

  // Load real backend data on mount
  useEffect(() => {
    let isMounted = true;

    async function syncFromBackend() {
      try {
        // 1. Fetch departments
        const deptRes = await departmentsApi.getAll().catch(() => null);
        if (isMounted && deptRes && deptRes.success && deptRes.data?.length > 0) {
          setQueues(deptRes.data.map(d => ({
            clinicId: d.id,
            databaseId: d.databaseId,
            clinicName: d.name,
            code: d.code,
            prefix: d.prefix,
            counter: d.counter,
            room: d.room,
            currentNumber: d.currentNumber || `${d.prefix}-001`,
            nextNumber: d.nextNumber || `${d.prefix}-002`,
            totalWaiting: d.totalWaiting || 0,
            avgServiceTimeMinutes: d.avgServiceTimeMinutes || 12,
            status: d.status || 'serving',
            lastCalledAt: d.lastCalledAt || '08:30 WIB',
            doctorCount: d.doctorCount || 1,
            description: d.description
          })));
        }

        // 2. Fetch doctors
        const docRes = await doctorsApi.getAll().catch(() => null);
        if (isMounted && docRes && docRes.success && docRes.data?.length > 0) {
          setDoctors(docRes.data);
        }

        // 3. Fetch appointments
        const appRes = await appointmentsApi.getAll().catch(() => null);
        if (isMounted && appRes && appRes.success && appRes.data?.length > 0) {
          setTickets(appRes.data);
        }
      } catch (err) {
        console.warn('Backend sync note:', err);
      }
    }

    syncFromBackend();
    return () => { isMounted = false; };
  }, []);

  /**
   * Book a new appointment & generate an instant digital queue ticket
   */
  const bookAppointment = async (data) => {
    const randomCodeNum = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `QLS-${randomCodeNum}`;
    
    // Find clinic prefix
    const clinic = queues.find(q => q.clinicId === data.clinicId) || queues[0];
    const prefix = clinic ? clinic.prefix : "A";
    
    const currentTicketCount = tickets.filter(t => t.clinicId === data.clinicId).length;
    const ticketSequence = (clinic ? parseInt(clinic.currentNumber.split('-')[1], 10) : 20) + currentTicketCount + 1;
    const ticketNumber = `${prefix}-${String(ticketSequence).padStart(3, '0')}`;
    
    const waitingAhead = clinic ? clinic.totalWaiting + 1 : 3;
    const estimatedMinutesWait = waitingAhead * (clinic ? clinic.avgServiceTimeMinutes : 12);
    
    const now = new Date();
    const estTime = new Date(now.getTime() + estimatedMinutesWait * 60000);
    const formattedEstTime = `${String(estTime.getHours()).padStart(2, '0')}:${String(estTime.getMinutes()).padStart(2, '0')} WIB`;

    const newTicket = {
      bookingCode,
      ticketNumber,
      patientName: data.patientName,
      nik: data.nik || "3171052408900001",
      phone: data.phone,
      doctorName: data.doctorName,
      doctorId: data.doctorId,
      clinicName: data.clinicName,
      clinicId: data.clinicId,
      room: data.room || "Ruang Konsultasi Terpadu",
      date: data.date || "Hari Ini",
      timeSlot: data.timeSlot,
      estimatedCall: formattedEstTime,
      status: "pending",
      callCount: 0,
      peopleAhead: waitingAhead - 1,
      paymentMethod: data.paymentMethod || "Umum / Mandiri",
      notes: data.complaint || "Pemeriksaan dan konsultasi dokter",
      createdAt: new Date().toISOString()
    };

    setTickets(prev => [newTicket, ...prev]);

    // Update queue totalWaiting
    setQueues(prev => prev.map(q => {
      if (q.clinicId === data.clinicId) {
        return {
          ...q,
          totalWaiting: q.totalWaiting + 1
        };
      }
      return q;
    }));

    // Send to BackEnd Laravel
    try {
      const res = await appointmentsApi.create({
        clinic_id: data.clinicId,
        doctor_id: data.doctorId,
        patient_name: data.patientName,
        patient_phone: data.phone,
        nik: data.nik,
        date: data.date,
        time_slot: data.timeSlot,
        payment_method: data.paymentMethod,
        complaint: data.complaint
      });
      if (res && res.success && res.data) {
        // Update local ticket with backend database ID
        setTickets(prev => prev.map(t => t.bookingCode === bookingCode ? { ...t, id: res.data.id } : t));
      }
    } catch (e) {
      console.warn('Backend appointment store note:', e);
    }

    return newTicket;
  };

  /**
   * Admin / Staff Action: Accept a pending queue ticket
   */
  const acceptTicket = async (bookingCode) => {
    const ticket = tickets.find(t => t.bookingCode === bookingCode);

    setTickets(prev => prev.map(t => {
      if (t.bookingCode === bookingCode) {
        return {
          ...t,
          status: 'waiting',
          callCount: 0,
          acceptedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        };
      }
      return t;
    }));

    if (ticket?.id && typeof ticket.id === 'number') {
      try {
        await adminApi.acceptTicket(ticket.id);
      } catch (e) {
        console.warn('API accept ticket error:', e);
      }
    }
  };

  /**
   * Admin / Staff Action: Call patient (can be called MULTIPLE times!)
   * Does NOT move to serving yet. Only increments callCount and updates time/sound.
   */
  const callPatient = async (bookingCode) => {
    const ticket = tickets.find(t => t.bookingCode === bookingCode);
    if (!ticket) return;

    const currentCalls = ticket.callCount || 0;
    const nextCallCount = currentCalls + 1;
    const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    // Update ticket state: remains in 'waiting' with callCount incremented
    setTickets(prev => prev.map(t => {
      if (t.bookingCode === bookingCode) {
        return {
          ...t,
          status: 'waiting',
          isCalled: true,
          callCount: nextCallCount,
          calledAt: nowStr
        };
      }
      return t;
    }));

    // Update clinic display
    setQueues(prev => prev.map(clinic => {
      if (clinic.clinicId === ticket.clinicId) {
        return {
          ...clinic,
          currentNumber: ticket.ticketNumber,
          lastCalledAt: nowStr
        };
      }
      return clinic;
    }));

    // Call backend API if database ID available
    if (ticket.id && typeof ticket.id === 'number') {
      try {
        await adminApi.callPatient(ticket.id);
      } catch (e) {
        console.warn('API call patient note:', e);
      }
    }

    // Audio chime / voice announcement
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const callText = nextCallCount > 1
          ? `Panggilan ke-${nextCallCount}. Nomor antrean, ${ticket.ticketNumber.replace('-', ' ')}, atas nama ${ticket.patientName}, silakan menuju ${ticket.room}`
          : `Nomor antrean, ${ticket.ticketNumber.replace('-', ' ')}, atas nama ${ticket.patientName}, silakan menuju ${ticket.room}`;

        const utterance = new SpeechSynthesisUtterance(callText);
        utterance.lang = 'id-ID';
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Silently continue if audio blocked
      }
    }
  };

  /**
   * Admin / Staff Action: Move to serving (Sedang Dilayani)
   * This is explicitly triggered when patient enters consultation room.
   */
  const servePatient = async (bookingCode) => {
    const ticket = tickets.find(t => t.bookingCode === bookingCode);
    if (!ticket) return;

    const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    setTickets(prev => prev.map(t => {
      if (t.bookingCode === bookingCode) {
        return {
          ...t,
          status: 'serving',
          servingAt: nowStr
        };
      }
      return t;
    }));

    // Decrease clinic total waiting
    setQueues(prev => prev.map(clinic => {
      if (clinic.clinicId === ticket.clinicId) {
        return {
          ...clinic,
          totalWaiting: Math.max(0, clinic.totalWaiting - 1)
        };
      }
      return clinic;
    }));

    if (ticket.id && typeof ticket.id === 'number') {
      try {
        await adminApi.servePatient(ticket.id);
      } catch (e) {
        console.warn('API serve patient note:', e);
      }
    }
  };

  /**
   * Admin / Staff Action: Mark consultation as completed
   */
  const completeTicket = async (bookingCode) => {
    const ticket = tickets.find(t => t.bookingCode === bookingCode);
    const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    setTickets(prev => prev.map(t => {
      if (t.bookingCode === bookingCode) {
        return {
          ...t,
          status: 'completed',
          completedAt: nowStr
        };
      }
      return t;
    }));

    if (ticket?.id && typeof ticket.id === 'number') {
      try {
        await adminApi.completeTicket(ticket.id);
      } catch (e) {
        console.warn('API complete ticket note:', e);
      }
    }
  };

  /**
   * Admin / Staff Action: Cancel or skip ticket
   */
  const cancelTicket = async (bookingCode, reason = 'Pasien tidak hadir setelah panggilan') => {
    const ticket = tickets.find(t => t.bookingCode === bookingCode);

    setTickets(prev => prev.map(t => {
      if (t.bookingCode === bookingCode) {
        return {
          ...t,
          status: 'cancelled',
          cancelReason: reason
        };
      }
      return t;
    }));

    if (ticket?.id && typeof ticket.id === 'number') {
      try {
        await adminApi.cancelTicket(ticket.id, reason);
      } catch (e) {
        console.warn('API cancel ticket note:', e);
      }
    }
  };

  /**
   * Find ticket by booking code or ticket number
   */
  const findTicket = (searchQuery) => {
    if (!searchQuery) return null;
    const q = searchQuery.trim().toUpperCase();
    return tickets.find(t => 
      t.bookingCode.toUpperCase() === q || 
      t.ticketNumber.toUpperCase() === q
    ) || null;
  };

  /**
   * Delete an existing ticket permanently
   */
  const deleteTicket = async (bookingCode) => {
    const ticket = tickets.find(t => t.bookingCode === bookingCode);
    setTickets(prev => prev.filter(t => t.bookingCode !== bookingCode));

    if (ticket?.id && typeof ticket.id === 'number') {
      try {
        await adminApi.deleteTicket(ticket.id);
      } catch (e) {
        console.warn('API delete ticket note:', e);
      }
    }
  };

  /**
   * Admin: Add a new Doctor
   */
  const addDoctor = async (doctorData) => {
    const newId = `doc-${Date.now()}`;
    const newDoctor = {
      id: newId,
      name: doctorData.name,
      title: doctorData.title || `Spesialis ${doctorData.specialty}`,
      specialty: doctorData.specialty,
      specialtyId: doctorData.specialtyId || doctorData.specialty.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      fee: doctorData.fee || 'Rp 300.000',
      clinicRoom: doctorData.clinicRoom || 'Ruang Konsultasi Terpadu',
      experience: doctorData.experience || '5 Tahun',
      education: doctorData.education || 'FK Universitas Indonesia',
      photo: doctorData.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      reviewsCount: 1,
      days: doctorData.days || ['Senin', 'Rabu', 'Jumat'],
      timeSlots: doctorData.timeSlots || [
        { time: '08:00 - 08:30', quota: 5, booked: 0 },
        { time: '08:30 - 09:00', quota: 5, booked: 0 },
        { time: '09:00 - 09:30', quota: 5, booked: 0 }
      ],
      bio: doctorData.bio || 'Dokter spesialis berpengalaman di RS Qless.'
    };

    setDoctors(prev => [newDoctor, ...prev]);

    try {
      await adminApi.addDoctor(doctorData);
    } catch (e) {
      console.warn('API add doctor note:', e);
    }
    return newDoctor;
  };

  /**
   * Admin: Delete Doctor
   */
  const deleteDoctor = async (doctorId) => {
    const doc = doctors.find(d => d.id === doctorId);
    setDoctors(prev => prev.filter(d => d.id !== doctorId));

    if (doc?.databaseId) {
      try {
        await adminApi.deleteDoctor(doc.databaseId);
      } catch (e) {
        console.warn('API delete doctor note:', e);
      }
    }
  };

  /**
   * Reset data to initial state
   */
  const resetDemoData = () => {
    localStorage.removeItem('qless_queues');
    localStorage.removeItem('qless_tickets');
    localStorage.removeItem('qless_doctors');
    setQueues(initialQueueState);
    setTickets(sampleTickets);
    setDoctors(doctorsList);
  };

  return (
    <QueueContext.Provider
      value={{
        queues,
        tickets,
        doctors,
        bookAppointment,
        acceptTicket,
        callPatient,
        servePatient,
        completeTicket,
        cancelTicket,
        findTicket,
        deleteTicket,
        addDoctor,
        deleteDoctor,
        resetDemoData
      }}
    >
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
}
