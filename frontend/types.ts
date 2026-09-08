
import React from 'react';

export interface NavLink {
  name: string;
  path: string;
  dropdown?: NavLink[];
}

export interface Unit {
  id?: number;
  name: string;
  img: string;
  borderColor: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  category: string;
  date: string;
  image: string;
  slug: string;
  description?: string; // Added description
}

export interface BeritaArtikelAPI {
  id: number;
  judul: string;
  gambar: string;
  kategori: string;
  tanggal: string;
  created_at: string;
  updated_at: string;
  deskripsi: string;
  slug: string;
  views?: number;
  content_delta?: any;
  meta_description?: string | null;
  status?: string;
}

export interface MajalahDigitalAPI {
  id: number;
  judul: string;
  deskripsi: string;
  cover_image: string | null;
  file_url: string | null;
  status: 'coming_soon' | 'published' | string;
  tanggal_rilis: string | null;
  created_at: string;
  updated_at?: string;
  slug: string;
}


export interface KolomGuruAPI {
  id: number;
  judul: string;
  konten: string;
  penulis: string;
  status: 'published' | 'draft' | string;
  tanggal: string;
  image: string | null;
  created_at: string;
  updated_at?: string;
  slug: string;
  views?: number;
}

export interface KolomSiswaAPI {
  id: number;
  judul: string;
  konten: string;
  nama_siswa: string;
  kelas?: string;
  kategori?: string;
  angkatan?: string;
  tahun_ajaran?: string;
  gambar: string | null;
  created_at: string;
  updated_at?: string;
  slug: string;
  views?: number;
}


export interface KolomAlumniAPI {
  id: number;
  nama_alumni: string;
  angkatan: string;
  judul: string;
  isi: string;
  gambar: string | null;
  created_at: string;
  updated_at: string;
  slug: string;
  views?: number;
}

export interface HubungiKamiAPI {
  id: number;
  nama_unit: string;
  alamat: string;
  telepon: string | null;
  email: string | null;
  map_url: string;
  created_at: string;
  updated_at: string;
}

export interface ProfilYayasanAPI {
  id: number;
  judul: string;
  deskripsi: string;
  subjudul: string;
  sambutan: string;
  nama_ketua: string;
  jabatan: string;
  foto_url: string;
  created_at: string;
  updated_at: string;
}

export interface VisiAPI {
  id: number;
  judul: string;
  deskripsi: string;
  visi: string;
  profil_id?: number; // Make optional if not always present
}


export interface MisiAPI {
  id: number;
  isi: string;
  nomor: number;
  profil_id: number;
}

export interface SejarahAPI {
    id: number;
    judul: string;
    deskripsi: string;
    created_at: string;
    updated_at: string;
}

export interface StrukturOrganisasiAPI {
  id: number;
  nama: string;
  jabatan: string;
  gambar: string;
  keterangan: string | null;
}

export interface KemitraanAPI {
    id: number;
    judul: string;
    deskripsi: string;
}

export interface KemitraanItemAPI {
    id: number;
    nama: string;
    icon: string;
    kemitraan_id: number;
}

export interface ProgramKerjaAPI {
  id: number;
  bidang: string;
  keterangan: string;
  created_at: string;
  updated_at: string;
}

export interface KeluargaBesarAPI {
  id: number;
  judul: string;
  deskripsi: string;
  gambar: string;
  created_at: string;
  updated_at: string;
}

export interface KomitePomgAPI {
  id: number;
  nama: string;
  jabatan: string;
  foto: string;
  unit: string;
  created_at: string;
  updated_at: string;
}

export interface PrestasiAPI {
  id: number;
  judul: string;
  jenjang: string;
  created_at: string;
  updated_at: string;
}

export interface PrestasiItemAPI {
  id: number;
  prestasi_id: number;
  deskripsi: string;
  gambar: string | null;
  created_at: string;
  updated_at: string;
}

export interface PrestasiGabungan extends PrestasiAPI {
    items: PrestasiItemAPI[];
}

export interface FasilitasSectionAPI {
  id: number;
  judul: string;
  deskripsi: string;
}

export interface FasilitasItemAPI {
  id: number;
  fasilitas_section_id: number;
  section_judul: string;
  gambar: string | null;
}

export interface Testimonial {
  name:string;
  role: string;
  text: string;
  image: string;
}

export interface SocialLink {
  name: string;
  url: string;
  handle: string;
  icon: 'youtube' | 'facebook' | 'instagram';
}

export interface UsefulLink {
    name: string;
    path: string;
}

export interface HeroSlide {
    id: number;
    judul: string;
    deskripsi: string;
    gambar: string;
    tombol_text: string;
}

export interface Feature {
    icon: React.FC<any>;
    title: string;
    description: string;
}

export interface JenjangPendidikan {
  id: number;
  judul: string | null;
  deskripsi: string | null;
  jenjang: string | null;
  nama_unit: string | null;
  image: string | null;
}

export interface ProgramSection {
    id: number;
    judul: string;
    deskripsi: string;
}

export interface ProgramUnggulan {
    id: number;
    deskripsi: string;
    image: string;
    section_id: number;
}

export interface PenerimaanSiswaBaru {
    id: number;
    judul: string;
    subjudul: string;
    sapaan: string;
    deskripsi: string;
    teks_tombol: string;
    link_tombol: string;
}

export interface MediaSosial {
    id: number;
    nama: string;
    username: string;
    link: string;
    icon: 'youtube' | 'facebook' | 'instagram';
}

export interface Pendaftar {
  id: number;
  nik: string | null;
  nisn: string | null;
  tempat_lahir: string | null;
  tanggal_lahir: string | null; // Keep as string for form input type='date'
  alamat_lengkap: string | null;
  nama_calon_siswa: string;
  asal_sekolah: string | null;
  alamat_asal_sekolah: string | null;
  unit_pilihan: string;
  nama_orang_tua_wali: string;
  no_wa: string;
  tahun_pelajaran: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProgramUnggulanAPI {
  id: number;
  judul: string;
  deskripsi: string;
  ikon: string;
  created_at: string;
  updated_at: string;
}

export interface MateriAjarAPI {
  id: number;
  judul: string;
  deskripsi: string;
  gambar: string;
  penulis: string;
  tanggal: string;
  tombol_link: string;
  tombol_teks: string;
  created_at: string;
  updated_at?: string; // Add this if the API might send it
}


export interface VisiMisiTujuanTkit1 {
  id: number;
  visi: string;
  misi: string;
  tujuan: string;
}

export interface VisiMisiTujuanTkit2 {
  id: number;
  visi: string;
  misi: string;
  tujuan: string;
}

export interface VisiMisiSasaranTkit2 {
  id: number;
  visi: string;
  misi: string;
  sasaran: string;
}

export interface VisiMisiSasaranSdit {
  id: number;
  deskripsi: string;
  tipe: 'Visi' | 'Misi' | 'Sasaran';
}

export interface VisiMisiSasaranSmait {
  id: number;
  deskripsi: string;
  tipe: 'Visi' | 'Misi' | 'Sasaran';
}

export interface VisiMisiSasaranSmkit {
  id: number;
  kategori: 'Visi' | 'Misi' | 'Sasaran' | string;
  deskripsi: string;
  created_at: string;
  updated_at: string;
}

export interface ProgramKejuruanSmkit {
  id: number;
  kategori: string;
  deskripsi: string;
  created_at: string;
  updated_at: string;
}

export interface StafSmkitAPI {
  id: number;
  nama: string;
  jabatan: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface PrestasiSmkit {
  id: number;
  juara: string;
  nama_kegiatan_lomba: string;
  no: number;
  tahun_pelajaran: string;
  created_at: string;
  updated_at: string;
}

export interface StrukturOrganisasiSmpit {
  id: number;
  nama: string;
  jabatan: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface PrestasiSmpit {
  no: number;
  tahun: string;
  jenis_lomba: string;
  hasil_lomba: string;
  penyelenggara: string;
  lingkup: string;
}

export interface KurikulumSdit {
  id: number;
  judul: string;
  deskripsi: string;
}

export interface ProgramUnggulanSdit {
  id: number;
  kategori: string;
  nama_program: string;
}

export interface StrukturOrganisasiSdit {
  id: number;
  nama: string;
  jabatan: string;
  foto: string;
  created_at: string;
  updated_at?: string; // Make optional
}


export interface PrestasiSdit {
  id: number;
  jenis_lomba: string;
  nama_siswa: string;
  prestasi: string | null;
  tanggal: string;
  tingkat: string;
  created_at: string;
  updated_at: string;
}

export interface KegiatanPembelajaranTkit2 {
  id: number;
  judul: string;
  deskripsi: string;
  kelompok: string;
}

export interface ProgramUnggulanTkit2 {
  id: number;
  nama_program: string;
  deskripsi: string | null;
  image: string;
}

export interface StrukturOrganisasiTkit1 {
  id: number;
  nama: string;
  jabatan: string;
  foto: string;
}

export interface StrukturOrganisasiTkit2 {
  id: number;
  nama: string;
  jabatan: string;
  foto: string;
}

export interface KurikulumSmait {
  id: number;
  deskripsi: string;
  kategori: string;
}

export interface ProgramUnggulanSmait {
  id: number;
  nama_program: string;
  deskripsi: string | null;
  image: string;
}

export interface StafSmait {
  id: number;
  nama: string;
  jabatan: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface PrestasiSmait {
  id: number;
  no: number;
  tgl: string;
  nama: string;
  event: string;
  penyelenggara: string;
  level: string;
  peringkat: string;
  score: string;
  created_at: string;
  updated_at: string;
}
