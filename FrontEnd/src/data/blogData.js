export const blogCategories = ["Semua", "Tips Sehat", "Teknologi Medis", "Pelayanan Pasien", "Gaya Hidup"];

export const blogArticles = [
  {
    id: "panduan-antrean-digital-efisien",
    title: "Panduan Cerdas: Cara Berobat ke Poliklinik Spesialis Tanpa Perlu Antre Berjam-jam",
    slug: "panduan-antrean-digital-efisien",
    category: "Pelayanan Pasien",
    featured: true,
    author: {
      name: "dr. Adrian Pratama, Sp.PD",
      role: "Ketua Komite Medis RS Qless",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
    },
    date: "20 Oktober 2026",
    readTime: "4 menit baca",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80",
    excerpt: "Dulu berobat ke rumah sakit identik dengan bangun subuh untuk mengambil nomor karcis. Sekarang, dengan sistem estimasi digital Qless, Anda cukup datang 15 menit sebelum waktu konsultasi.",
    content: `
      <p>Bagi sebagian besar masyarakat, pengalaman berkunjung ke rumah sakit sering kali diwarnai kecemasan bukan hanya terhadap keluhan fisik, melainkan juga waktu tunggu yang melelahkan. Berdasarkan riset kepuasan publik, waktu tunggu rata-rata di fasilitas kesehatan konvensional dapat mencapai 90 hingga 180 menit.</p>
      
      <h3>1. Manfaatkan Reservasi Dini & Pemilihan Slot Waktu Presisi</h3>
      <p>Melalui portal RS Qless, Anda dapat melihat ketersediaan jadwal dokter spesialis secara real-time hingga 14 hari ke depan. Pilihlah slot waktu (misal: 09:30 - 10:00). Sistem secara otomatis menghitung kuota pelayanan sehingga tidak terjadi penumpukan pasien di ruang tunggu.</p>

      <h3>2. Pantau Nomor Antrean Secara Real-Time Melalui Ponsel</h3>
      <p>Setelah reservasi terkonfirmasi, Anda akan memperoleh kode booking dan tautan pemantau antrean. Anda dapat mengecek dari kantor atau rumah: loket mana yang sedang melayani nomor berapa. Ketika giliran Anda tersisa 3 nomor lagi, Anda akan menerima pesan notifikasi pengingat.</p>

      <h3>3. Siapkan Kelengkapan Dokumen Sebelum Keberangkatan</h3>
      <p>Bagi pasien BPJS Kesehatan, pastikan surat rujukan FKTP masih dalam masa berlaku 90 hari. Sementara untuk pasien asuransi swasta atau mandiri, verifikasi data telah tersimpan di akun Anda sehingga proses registrasi di kiosk mandiri selesai dalam waktu kurang dari 30 detik.</p>
    `,
    tags: ["Antrean Digital", "Poliklinik", "Smart Hospital", "Tips Pasien"]
  },
  {
    id: "skrining-jantung-dini",
    title: "5 Gejala Awal Penyakit Jantung yang Sering Diabaikan Usia Produktif",
    slug: "skrining-jantung-dini",
    category: "Tips Sehat",
    featured: false,
    author: {
      name: "dr. Farhan Baskoro, Sp.JP(K)",
      role: "Spesialis Jantung & Pembuluh Darah",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80"
    },
    date: "17 Oktober 2026",
    readTime: "5 menit baca",
    coverImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80",
    excerpt: "Nyeri dada bukan satu-satunya tanda bahaya. Rasa mudah lelah saat aktivitas ringan dan sesak napas saat berbaring patut diwaspadai sejak usia 30-an.",
    content: `
      <p>Serangan jantung kini tidak lagi identik hanya dengan usia lanjut. Data epidemiologi menunjukkan peningkatan kasus kardiovaskular pada usia di bawah 45 tahun akibat gaya hidup kurang aktif, stres berkepanjangan, dan pola makan tinggi kolesterol.</p>
      <p>Pemeriksaan elektrokardiogram (EKG) rutin setahun sekali sangat direkomendasikan jika Anda memiliki riwayat keluarga dengan penyakit jantung koroner atau hipertensi.</p>
    `,
    tags: ["Kesehatan Jantung", "Gaya Hidup", "Pencegahan"]
  },
  {
    id: "menjaga-imunitas-anak-pancaroba",
    title: "Panduan Menjaga Daya Tahan Tubuh Anak di Tengah Musim Pancaroba",
    slug: "menjaga-imunitas-anak-pancaroba",
    category: "Tips Sehat",
    featured: false,
    author: {
      name: "dr. Anisa Larasati, Sp.A",
      role: "Spesialis Anak & Tumbuh Kembang",
      avatar: "https://images.unsplash.com/photo-1594824813580-2a813898124b?w=150&auto=format&fit=crop&q=80"
    },
    date: "12 Oktober 2026",
    readTime: "3 menit baca",
    coverImage: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80",
    excerpt: "Perubahan cuaca ekstrem memicu lonjakan kasus batuk pilek dan infeksi saluran pernapasan pada balita. Berikut langkah preventif dokter anak.",
    content: `
      <p>Sistem imun balita masih dalam fase pembentukan dan adaptasi. Kunci utama menjaga vitalitas si kecil adalah hidrasi cukup, nutrisi kaya zink dan vitamin C dari buah asli, serta memastikan jadwal imunisasi dasar dan ulangan terpenuhi tepat waktu.</p>
    `,
    tags: ["Kesehatan Anak", "Imunisasi", "Parenting"]
  },
  {
    id: "kebersihan-gigi-dan-kesehatan-tubuh",
    title: "Mengapa Karang Gigi yang Menumpuk Berbahaya bagi Kesehatan Jantung & Pembuluh Darah?",
    slug: "kebersihan-gigi-dan-kesehatan-tubuh",
    category: "Gaya Hidup",
    featured: false,
    author: {
      name: "drg. Rayhan Wirawan, Sp.KG",
      role: "Spesialis Konservasi Gigi",
      avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80"
    },
    date: "8 Oktober 2026",
    readTime: "4 menit baca",
    coverImage: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80",
    excerpt: "Bakteri pada plak dan gusi yang meradang dapat memasuki aliran darah dan memicu respons inflamasi sistemik pada pembuluh darah.",
    content: `
      <p>Banyak orang menganggap karang gigi hanyalah masalah estetika atau bau mulut semata. Padahal, gingivitis dan periodontitis kronis berkaitan erat dengan risiko aterosklerosis melalui jalur mediator sitokin inflamasi.</p>
    `,
    tags: ["Poli Gigi", "Dental Care", "Preventif"]
  },
  {
    id: "revolusi-rekam-medis-elektronik",
    title: "Transformasi Digital RS: Bagaimana Rekam Medis Terpadu Mempercepat Diagnosis Dokter",
    slug: "revolusi-rekam-medis-elektronik",
    category: "Teknologi Medis",
    featured: false,
    author: {
      name: "dr. Dimas Setiawan, Sp.N",
      role: "Spesialis Saraf & Tim Digitalisasi",
      avatar: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=150&auto=format&fit=crop&q=80"
    },
    date: "3 Oktober 2026",
    readTime: "5 menit baca",
    coverImage: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80",
    excerpt: "Tidak ada lagi berkas rekam medis hilang atau tertinggal. Seluruh riwayat laboratorium, radiologi, dan resep dokter tersimpan aman dan terenkripsi.",
    content: `
      <p>Interoperabilitas data medis pasien menjamin keselamatan pasien (patient safety). Dokter di poli spesialis mana pun dapat dengan cepat meninjau riwayat alergi obat, riwayat pemeriksaan laboratorium minggu lalu, tanpa meminta pasien mengulang tes yang tidak perlu.</p>
    `,
    tags: ["Rekam Medis", "Smart Hospital", "Teknologi"]
  }
];
