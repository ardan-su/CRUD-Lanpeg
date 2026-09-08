
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import UnitLanding from './unit/UnitLanding';
import TK from './unit/TK';
import TKIT1 from './unit/TKIT1';
import SDIT from './unit/SDIT';
import SMPIT from './unit/SMPIT';
import SMAIT from './unit/SMAIT';
import SMKIT from './unit/SMKIT';
import DKV from './unit/DKV';


const Unit: React.FC = () => {
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
            Kejuruan Kami
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-white">Program Kejuruan</h1>
          <div className="mt-4 w-14 h-1.5 bg-accent rounded-full mx-auto" />
          <p className="mt-5 max-w-2xl mx-auto text-lg text-white/75">Mengenal lebih dekat setiap jurusan yang kami tawarkan di SMK PKP 1 Jakarta Islamic School.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Routes>
          <Route index element={<UnitLanding />} />
          <Route path="tk" element={<TK />} />
          <Route path="tkit1" element={<TKIT1 />} />
          <Route path="sdit" element={<SDIT />} />
          <Route path="smpit" element={<SMPIT />} />
          <Route path="smait" element={<SMAIT />} />
          <Route path="smkit" element={<SMKIT />} />
          <Route path="dkv"   element={<DKV />} />
        </Routes>
      </div>
    </div>
  );
};

export default Unit;
