import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Berita from './informasi/Berita';
import BeritaDetail from './informasi/BeritaDetail';
import Majalah from './informasi/Majalah';
import MajalahDetail from './informasi/MajalahDetail';
import KolomGuru from './informasi/KolomGuru';
import KolomGuruDetail from './informasi/KolomGuruDetail';
import KolomSiswa from './informasi/KolomSiswa';
import KolomSiswaDetail from './informasi/KolomSiswaDetail';
import KolomAlumni from './informasi/KolomAlumni';
import KolomAlumniDetail from './informasi/KolomAlumniDetail';
import HubungiKami from './informasi/HubungiKami';

const Informasi: React.FC = () => {
    return (
        <div>
            {/* Page hero banner */}
            <div className="relative overflow-hidden py-16 md:py-24"
                style={{ background: 'linear-gradient(135deg, #0830BC 0%, #1a4fd8 60%, #397DE8 100%)' }}>
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 rounded-full mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        Info Terkini
                    </span>
                    <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-white">Informasi & Berita</h1>
                    <div className="mt-4 w-14 h-1.5 bg-accent rounded-full mx-auto" />
                    <p className="mt-5 max-w-2xl mx-auto text-lg text-white/75">Ikuti perkembangan terbaru, prestasi, dan pengumuman dari SMK PKP 1 Jakarta Islamic School.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <main className="w-full">
                    <Routes>
                        <Route index element={<Berita />} />
                        <Route path="berita" element={<Berita />} />
                        <Route path="berita/:slug" element={<BeritaDetail />} />
                        <Route path="majalah" element={<Majalah />} />
                        <Route path="majalah/:slug" element={<MajalahDetail />} />
                        <Route path="kolom-guru" element={<KolomGuru />} />
                        <Route path="kolom-guru/:slug" element={<KolomGuruDetail />} />
                        <Route path="kolom-siswa" element={<KolomSiswa />} />
                        <Route path="kolom-siswa/:slug" element={<KolomSiswaDetail />} />
                        <Route path="kolom-alumni" element={<KolomAlumni />} />
                        <Route path="kolom-alumni/:slug" element={<KolomAlumniDetail />} />
                        <Route path="hubungi-kami" element={<HubungiKami />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default Informasi;