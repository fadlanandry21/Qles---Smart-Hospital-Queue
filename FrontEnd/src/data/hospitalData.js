export const hospitalInfo = {
  name: "RS Qless",
  tagline: "Smart Hospital Queue",
  subtitle: "Sistem antrean rumah sakit cerdas dan reservasi janji temu medis digital. Pantau nomor antrean langsung dari rumah, hadir tepat waktu, dan temui dokter spesialis pilihan Anda.",
  address: "Jl. Kesehatan Terpadu No. 88, Menteng, Jakarta Pusat 10350",
  phone: "(021) 5000-8899",
  emergencyPhone: "1500-753 (Darurat 24 Jam)",
  whatsapp: "+62 811-9876-5432",
  email: "layanan@qless.co.id",
  operatingHours: {
    igd: "24 Jam Setiap Hari",
    poliklinik: "Senin - Sabtu: 07:30 - 21:00 WIB",
    laboratorium: "Senin - Minggu: 06:00 - 22:00 WIB",
    farmasi: "24 Jam Setiap Hari"
  },
  accreditation: "Terakreditasi Paripurna KARS & Berstandar Layanan Internasional"
};

export const hospitalStats = [
  {
    id: "doctors",
    number: 150,
    suffix: "+",
    label: "Dokter Spesialis",
    description: "Dokter ahli berpengalaman & sub-spesialis teruji"
  },
  {
    id: "patients",
    number: 48500,
    suffix: "+",
    label: "Pasien Terlayani",
    description: "Tercatat dan terlayani dengan rekam medis digital"
  },
  {
    id: "waittime",
    number: 11,
    suffix: " Menit",
    label: "Rata-rata Waktu Tunggu",
    description: "70% lebih cepat berkat estimasi antrean presisi"
  },
  {
    id: "satisfaction",
    number: 99,
    suffix: "%",
    label: "Kepuasan Pasien",
    description: "Berdasarkan ulasan verifikasi pasien pasca kunjungan"
  }
];

export const specialties = [
  {
    id: "penyakit-dalam",
    name: "Poli Penyakit Dalam",
    code: "INT",
    iconName: "Stethoscope",
    doctorCount: 18,
    room: "Lantai 2, Ruang 201-206",
    description: "Diagnosa dan penanganan menyeluruh gangguan organ dalam dewasa dan lansia.",
    avgWaitTime: "10-15 menit"
  },
  {
    id: "anak",
    name: "Poli Anak & Tumbuh Kembang",
    code: "PED",
    iconName: "Baby",
    doctorCount: 14,
    room: "Lantai 2, Ruang 208-212 (Kids Zone)",
    description: "Pemeriksaan kesehatan bayi, anak, imunisasi terpadu, dan konsultasi gizi anak.",
    avgWaitTime: "8-12 menit"
  },
  {
    id: "gigi",
    name: "Poli Gigi & Bedah Mulut",
    code: "DEN",
    iconName: "Smile",
    doctorCount: 12,
    room: "Lantai 3, Ruang 301-304",
    description: "Perawatan konservasi gigi, ortodonsia, pembersihan karang gigi, dan estetika senyum.",
    avgWaitTime: "15-20 menit"
  },
  {
    id: "jantung",
    name: "Poli Jantung & Pembuluh Darah",
    code: "CAR",
    iconName: "HeartPulse",
    doctorCount: 10,
    room: "Lantai 3, Ruang 308-312",
    description: "Skrining EKG, ekokardiografi, treadmill stress test, dan manajemen hipertensi.",
    avgWaitTime: "12-18 menit"
  },
  {
    id: "mata",
    name: "Poli Mata (Ophthalmology)",
    code: "EYE",
    iconName: "Eye",
    doctorCount: 8,
    room: "Lantai 4, Ruang 401-404",
    description: "Pemeriksaan refraksi komputer, penanganan katarak modern, dan tes tekanan bola mata.",
    avgWaitTime: "10-14 menit"
  },
  {
    id: "saraf",
    name: "Poli Saraf (Neurologi)",
    code: "NEU",
    iconName: "Activity",
    doctorCount: 9,
    room: "Lantai 4, Ruang 406-408",
    description: "Konsultasi keluhan migrain, saraf terjepit, vertigo, pasca stroke, dan saraf perifer.",
    avgWaitTime: "12-16 menit"
  }
];

export const patientTestimonials = [
  {
    id: 1,
    name: "Hendra Wijaya",
    role: "Pasien Poli Penyakit Dalam",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "Sangat kagum dengan ketepatan waktu antreannya! Dari rumah dapat nomor B-014, dapat notifikasi estimasi jam 09:40. Sampai di RS langsung dipanggil dalam 5 menit.",
    date: "18 Oktober 2026"
  },
  {
    id: 2,
    name: "Dr. Siti Rahmawati",
    role: "Ibu Pasien Poli Anak",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "Bawa balita berobat biasanya bikin stres kalau harus nunggu berjam-jam. Dengan sistem Qless, anak saya tidak bosan karena kami datang tepat saat giliran masuk poli.",
    date: "14 Oktober 2026"
  },
  {
    id: 3,
    name: "Budi Santoso",
    role: "Pasien Poli Jantung",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "Sangat transparan. Monitor antreannya jelas, pendaftaran online via web sangat mudah dan langsung tersinkron dengan kartu BPJS serta rekam medis saya.",
    date: "9 Oktober 2026"
  }
];
