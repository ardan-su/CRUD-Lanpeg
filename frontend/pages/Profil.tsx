import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Sambutan from './profil/Sambutan';
import VisiMisi from './profil/VisiMisi';
import Sejarah from './profil/Sejarah';
import StrukturOrganisasi from './profil/StrukturOrganisasi';
import Kemitraan from './profil/Kemitraan';
import ProgramKerja from './profil/ProgramKerja';
import KeluargaFirdaus from './profil/KeluargaFirdaus';
import Prestasi from './profil/Prestasi';
import Fasilitas from './profil/Fasilitas';

const Profil: React.FC = () => {
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
                        Tentang Kami
                    </span>
                    <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-white">Profil Sekolah</h1>
                    <div className="mt-4 w-14 h-1.5 bg-accent rounded-full mx-auto" />
                    <p className="mt-5 max-w-2xl mx-auto text-lg text-white/75">Mengenal lebih dekat landasan, sejarah, dan cita-cita luhur kami dalam dunia pendidikan Islam.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <main className="bg-white p-6 sm:p-10 rounded-3xl shadow-card border border-neutral-100 min-h-[500px]">
                    <Routes>
                        <Route path="/" element={<Navigate to="sambutan" replace />} />
                        <Route path="sambutan" element={<Sambutan />} />
                        <Route path="visi-misi" element={<VisiMisi />} />
                        <Route path="sejarah" element={<Sejarah />} />
                        <Route path="struktur-organisasi" element={<StrukturOrganisasi />} />
                        <Route path="kemitraan" element={<Kemitraan />} />
                        <Route path="program-kerja" element={<ProgramKerja />} />
                        <Route path="keluarga-firdaus" element={<KeluargaFirdaus />} />
                        <Route path="prestasi" element={<Prestasi />} />
                        <Route path="fasilitas" element={<Fasilitas />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default Profil;