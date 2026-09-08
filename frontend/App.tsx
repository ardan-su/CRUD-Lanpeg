import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Auth
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

// Layouts
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLayout from './pages/admin/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Profil from './pages/Profil';
import Unit from './pages/Unit';
import Informasi from './pages/Informasi';
import Pendaftaran from './pages/Pendaftaran';
import DataPendaftaran from './pages/DataPendaftaran';
import Fitur from './pages/Fitur';
import Login from './pages/Login';

// Admin Pages - Dashboard & Beranda
import DashboardAdmin from './pages/admin/DashboardAdmin';
import SambutanAdminBeranda from './pages/admin/beranda/SambutanAdmin';
import UnitPendidikanAdmin from './pages/admin/beranda/UnitPendidikanAdmin';
import ProgramUnggulanAdmin from './pages/admin/beranda/ProgramUnggulanAdmin';
import BeritaAdminBeranda from './pages/admin/beranda/BeritaAdmin';
import PendaftaranAdminBeranda from './pages/admin/beranda/PendaftaranAdminBeranda';
import MediaSosialAdminBeranda from './pages/admin/beranda/MediaSosialAdmin';
import SliderAdmin from './pages/admin/SliderAdmin';

// Admin Pages - Profil
import VisiMisiAdmin from './pages/admin/profil/VisiMisiAdmin';
import SejarahAdmin from './pages/admin/profil/SejarahAdmin';
import StrukturOrganisasiAdmin from './pages/admin/profil/StrukturOrganisasiAdmin';
import KemitraanAdmin from './pages/admin/profil/KemitraanAdmin';
import ProgramKerjaAdmin from './pages/admin/profil/ProgramKerjaAdmin';
import KeluargaFirdausAdmin from './pages/admin/profil/KeluargaFirdausAdmin';
import PrestasiAdmin from './pages/admin/profil/PrestasiAdmin';
import FasilitasAdmin from './pages/admin/profil/FasilitasAdmin';

// Admin Pages - Unit
import TKAdmin from './pages/admin/unit/TKAdmin';
import TKIT1Admin from './pages/admin/unit/TKIT1Admin';
import SDITAdmin from './pages/admin/unit/SDITAdmin';
import SMPITAdmin from './pages/admin/unit/SMPITAdmin';
import SMAITAdmin from './pages/admin/unit/SMAITAdmin';
import SMKITAdmin from './pages/admin/unit/SMKITAdmin';

// Admin Pages - Informasi
import BeritaAdmin from './pages/admin/informasi/BeritaAdmin';
import MajalahAdmin from './pages/admin/informasi/MajalahAdmin';
import KolomGuruAdmin from './pages/admin/informasi/KolomGuruAdmin';
import KolomSiswaAdmin from './pages/admin/informasi/KolomSiswaAdmin';
import KolomAlumniAdmin from './pages/admin/informasi/KolomAlumniAdmin';
import HubungiKamiAdmin from './pages/admin/informasi/HubungiKamiAdmin';

// Admin Pages - Lainnya
import PendaftaranAdmin from './pages/admin/PendaftaranAdmin';
import MateriAjarAdmin from './pages/admin/fitur/MateriAjarAdmin';


// Wrapper component for all public-facing pages
// Header is fixed, so we add pt-[var(--header-h)] to non-hero pages.
// The Home page handles its own top-spacing (hero sits behind the header deliberately).
const PublicPages = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">
      <Routes>
        {/* Home: hero overlaps fixed header — no extra top padding needed */}
        <Route path="/" element={<Home />} />
        {/* All other pages need top padding so content isn't hidden behind fixed header */}
        <Route path="/profil/*" element={<div className="pt-20"><Profil /></div>} />
        <Route path="/unit/*" element={<div className="pt-20"><Unit /></div>} />
        <Route path="/informasi/*" element={<div className="pt-20"><Informasi /></div>} />
        <Route path="/pendaftaran" element={<div className="pt-20"><Pendaftaran /></div>} />
        <Route path="/data-pendaftaran" element={<div className="pt-20"><DataPendaftaran /></div>} />
        <Route path="/fitur" element={<div className="pt-20"><Fitur /></div>} />
      </Routes>
    </main>
    <Footer />
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardAdmin />} />

              {/* Beranda Section Routes */}
              <Route path="beranda" element={<DashboardAdmin />} />
              <Route path="beranda/sambutan" element={<SambutanAdminBeranda />} />
              <Route path="beranda/unit-pendidikan" element={<UnitPendidikanAdmin />} />
              <Route path="beranda/program-unggulan" element={<ProgramUnggulanAdmin />} />
              <Route path="beranda/berita" element={<BeritaAdminBeranda />} />
              <Route path="beranda/pendaftaran" element={<PendaftaranAdminBeranda />} />
              <Route path="beranda/media-sosial" element={<MediaSosialAdminBeranda />} />
              <Route path="slider" element={<SliderAdmin />} />

              {/* Profil Routes */}
              <Route path="profil">
                <Route index element={<Navigate to="/admin/profil/visi-misi" replace />} />
                <Route path="sambutan" element={<SambutanAdminBeranda />} />
                <Route path="visi-misi" element={<VisiMisiAdmin />} />
                <Route path="sejarah" element={<SejarahAdmin />} />
                <Route path="struktur-organisasi" element={<StrukturOrganisasiAdmin />} />
                <Route path="kemitraan" element={<KemitraanAdmin />} />
                <Route path="program-kerja" element={<ProgramKerjaAdmin />} />
                <Route path="keluarga-firdaus" element={<KeluargaFirdausAdmin />} />
                <Route path="prestasi" element={<PrestasiAdmin />} />
                <Route path="fasilitas" element={<FasilitasAdmin />} />
              </Route>

              {/* Unit Routes */}
              <Route path="unit">
                <Route index element={<Navigate to="/admin/unit/tk" replace />} />
                <Route path="tk" element={<TKAdmin />} />
                <Route path="tkit1" element={<TKIT1Admin />} />
                <Route path="sdit" element={<SDITAdmin />} />
                <Route path="smpit" element={<SMPITAdmin />} />
                <Route path="smait" element={<SMAITAdmin />} />
                <Route path="smkit" element={<SMKITAdmin />} />
              </Route>

              {/* Informasi Routes */}
              <Route path="informasi">
                <Route index element={<Navigate to="/admin/informasi/berita" replace />} />
                <Route path="berita" element={<BeritaAdmin />} />
                <Route path="majalah" element={<MajalahAdmin />} />
                <Route path="kolom-guru" element={<KolomGuruAdmin />} />
                <Route path="kolom-siswa" element={<KolomSiswaAdmin />} />
                <Route path="kolom-alumni" element={<KolomAlumniAdmin />} />
                <Route path="hubungi-kami" element={<HubungiKamiAdmin />} />
              </Route>

              {/* Pendaftaran Routes */}
              <Route path="pendaftaran" element={<PendaftaranAdmin />} />

              {/* Fitur Routes */}
              <Route path="fitur">
                <Route index element={<Navigate to="/admin/fitur/materi-ajar" replace />} />
                <Route path="materi-ajar" element={<MateriAjarAdmin />} />
              </Route>
            </Route>
          </Route>

          {/* Public Routes Fallback */}
          <Route path="/*" element={<PublicPages />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
