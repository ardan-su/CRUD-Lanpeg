import { type NavLink, type Unit, type NewsArticle, type Testimonial, type SocialLink, type UsefulLink, type Feature, type HeroSlide } from './types';

// ─── Brand constants ──────────────────────────────────────────
export const SCHOOL_NAME       = 'SMK PKP 1 Jakarta Islamic School';
export const SCHOOL_SHORT      = 'SMK PKP 1 Jakarta';
export const SCHOOL_TAGLINE    = 'Mencetak Generasi Islami, Kompeten & Berdaya Saing Global';
export const API_BASE_URL      = 'http://localhost:5001';
export const SITE_BASE_URL     = 'http://localhost:3000';
// ─────────────────────────────────────────────────────────────

export const NAV_LINKS: NavLink[] = [
  { name: 'Beranda', path: '/' },
  {
    name: 'Profil', path: '/profil', dropdown: [
      { name: 'Sambutan Kepala Sekolah', path: '/profil/sambutan' },
      { name: 'Visi & Misi', path: '/profil/visi-misi' },
      { name: 'Sejarah Singkat', path: '/profil/sejarah' },
      { name: 'Struktur Organisasi', path: '/profil/struktur-organisasi' },
      { name: 'Kemitraan', path: '/profil/kemitraan' },
      { name: 'Program Kerja', path: '/profil/program-kerja' },
      { name: 'Komite Sekolah', path: '/profil/keluarga-firdaus' },
      { name: 'Prestasi', path: '/profil/prestasi' },
      { name: 'Fasilitas', path: '/profil/fasilitas' },
    ]
  },
  {
    name: 'Kejuruan', path: '/unit', dropdown: [
      { name: 'Semua Kejuruan', path: '/unit' },
      { name: 'Akuntansi', path: '/unit/sdit' },
      { name: 'Manajemen Perkantoran', path: '/unit/smpit' },
      { name: 'Rekayasa Perangkat Lunak', path: '/unit/smait' },
      { name: 'Teknik Kendaraan Ringan', path: '/unit/tkit1' },
      { name: 'Teknik Komputer Jaringan', path: '/unit/smkit' },
      { name: 'Desain Komunikasi Visual', path: '/unit/dkv' },
    ]
  },
  {
    name: 'Informasi', path: '/informasi', dropdown: [
      { name: 'Berita & Artikel', path: '/informasi/berita' },
      { name: 'Majalah Sekolah', path: '/informasi/majalah' },
      { name: 'Kolom Guru', path: '/informasi/kolom-guru' },
      { name: 'Kolom Siswa', path: '/informasi/kolom-siswa' },
      { name: 'Kolom Alumni', path: '/informasi/kolom-alumni' },
      { name: 'Hubungi Kami', path: '/informasi/hubungi-kami' },
    ]
  },
  { name: 'Pendaftaran', path: '/pendaftaran' },
  {
    name: 'Fitur', path: '/fitur', dropdown: [
      { name: 'Materi Ajar', path: '/fitur' },
      { name: 'E-Rapor', path: '/fitur' },
    ]
  },
];

export const UNIT_NAV_LINKS = [
  { name: 'Semua Kejuruan', path: '/unit', end: true },
  { name: 'Akuntansi', path: '/unit/sdit' },
  { name: 'Manajemen Perkantoran', path: '/unit/smpit' },
  { name: 'Rekayasa Perangkat Lunak', path: '/unit/smait' },
  { name: 'Teknik Kendaraan Ringan', path: '/unit/tkit1' },
  { name: 'Teknik Komputer Jaringan', path: '/unit/smkit' },
  { name: 'Desain Komunikasi Visual', path: '/unit/dkv' },
];

export const HERO_SLIDES_FALLBACK: HeroSlide[] = [
  {
    id: 1,
    judul: 'Selamat Datang di SMK PKP 1 Jakarta Islamic School',
    deskripsi: 'Mencetak lulusan yang berakhlak mulia, kompeten di bidang kejuruan, dan siap bersaing di era global.',
    gambar: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=1080&fit=crop&q=80',
    tombol_text: 'Pendaftaran Siswa Baru',
  },
  {
    id: 2,
    judul: 'Pendidikan Islami Berbasis Kompetensi',
    deskripsi: 'Kurikulum terintegrasi antara nilai-nilai Islam dan keahlian kejuruan untuk membekali siswa menghadapi dunia kerja.',
    gambar: 'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=1920&h=1080&fit=crop&q=80',
    tombol_text: 'Lihat Kejuruan',
  },
  {
    id: 3,
    judul: 'Raih Prestasi, Bangun Karakter',
    deskripsi: 'Lingkungan belajar yang kondusif, fasilitas lengkap, dan tenaga pendidik profesional untuk masa depan terbaik.',
    gambar: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&h=1080&fit=crop&q=80',
    tombol_text: 'Daftar Sekarang',
  },
];

export const SCHOOL_UNITS: Unit[] = [
  { name: 'Akuntansi',                 img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop', borderColor: 'border-primary' },
  { name: 'Manajemen Perkantoran',     img: 'https://images.unsplash.com/photo-1568602471322-7826d3a36c44?w=400&h=400&fit=crop', borderColor: 'border-accent' },
  { name: 'Rekayasa Perangkat Lunak',  img: 'https://images.unsplash.com/photo-1574717024682-1b3793a81cb9?w=400&h=400&fit=crop', borderColor: 'border-primary' },
  { name: 'Teknik Kendaraan Ringan',   img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop', borderColor: 'border-accent' },
  { name: 'Teknik Komputer Jaringan',  img: 'https://images.unsplash.com/photo-1581092921461-8a283962b944?w=400&h=400&fit=crop', borderColor: 'border-primary' },
  { name: 'Desain Komunikasi Visual',  img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=400&fit=crop', borderColor: 'border-accent' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Keluarga Budi Santoso',
    role: 'Orang Tua Siswa',
    text: 'Alhamdulillah, anak kami berkembang pesat baik secara akademik maupun akhlaknya. SMK PKP 1 Jakarta benar-benar sekolah yang peduli dengan karakter siswa.',
    image: 'https://picsum.photos/seed/parent1/100',
  },
  {
    name: 'Rina Marlina',
    role: 'Alumni SMK PKP 1 Jakarta, Angkatan 2023',
    text: 'Bersekolah di sini mengajarkan saya bukan hanya ilmu kejuruan, tetapi juga kedisiplinan dan nilai-nilai Islam yang saya bawa hingga ke dunia kerja.',
    image: 'https://picsum.photos/seed/alumni1/100',
  },
  {
    name: 'Pak Hendra Wijaya',
    role: 'Orang Tua Siswa',
    text: 'Fasilitas laboratorium komputer dan multimedia sangat mendukung. Guru-gurunya profesional dan sekolah sangat transparan dalam komunikasi dengan orang tua.',
    image: 'https://picsum.photos/seed/parent2/100',
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { name: 'YouTube', url: 'https://youtube.com', handle: 'SMK PKP 1 Jakarta', icon: 'youtube' },
  { name: 'Facebook', url: 'https://facebook.com', handle: 'SMK PKP 1 Jakarta Islamic School', icon: 'facebook' },
  { name: 'Instagram', url: 'https://instagram.com', handle: '@smkpkp1jakarta', icon: 'instagram' },
];

export const USEFUL_LINKS: UsefulLink[] = [
  { name: 'Beranda', path: '/' },
  { name: 'Profil Sekolah', path: '/profil/sambutan' },
  { name: 'Program Kejuruan', path: '/unit' },
  { name: 'Berita & Artikel', path: '/informasi/berita' },
  { name: 'Pendaftaran', path: '/pendaftaran' },
  { name: 'Login Admin', path: '/login' },
];
