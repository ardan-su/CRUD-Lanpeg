#!/usr/bin/env node

/**
 * Batch Update Script for Admin Pages
 * This script applies the file upload fix pattern to multiple admin pages
 */

const fs = require('fs');
const path = require('path');

// List of files to update with their specific field names
const filesToUpdate = [
    // Informasi section
    { path: 'd:/project/alfidaa/pages/admin/informasi/BeritaAdmin.tsx', field: 'gambar', folder: 'berita' },
    { path: 'd:/project/alfidaa/pages/admin/informasi/KolomAlumniAdmin.tsx', field: 'foto', folder: 'kolom-alumni' },
    { path: 'd:/project/alfidaa/pages/admin/informasi/KolomSiswaAdmin.tsx', field: 'foto', folder: 'kolom-siswa' },
    { path: 'd:/project/alfidaa/pages/admin/informasi/KolomGuruAdmin.tsx', field: 'foto', folder: 'kolom-guru' },
    { path: 'd:/project/alfidaa/pages/admin/informasi/MajalahAdmin.tsx', field: 'cover', folder: 'majalah' },

    // Fitur section
    { path: 'd:/project/alfidaa/pages/admin/fitur/MateriAjarAdmin.tsx', field: 'image', folder: 'materi-ajar' },

    // Profil section
    { path: 'd:/project/alfidaa/pages/admin/profil/StrukturOrganisasiAdmin.tsx', field: 'gambar', folder: 'struktur' },
    { path: 'd:/project/alfidaa/pages/admin/profil/SambutanAdmin.tsx', field: 'foto', folder: 'sambutan' },
    { path: 'd:/project/alfidaa/pages/admin/profil/ProgramKerjaAdmin.tsx', field: 'gambar', folder: 'program-kerja' },
    { path: 'd:/project/alfidaa/pages/admin/profil/PrestasiAdmin.tsx', field: 'gambar', folder: 'prestasi' },
    { path: 'd:/project/alfidaa/pages/admin/profil/KemitraanAdmin.tsx', field: 'logo', folder: 'kemitraan' },
    { path: 'd:/project/alfidaa/pages/admin/profil/KeluargaFirdausAdmin.tsx', field: 'foto', folder: 'keluarga-firdaus' },
    { path: 'd:/project/alfidaa/pages/admin/profil/FasilitasAdmin.tsx', field: 'gambar', folder: 'fasilitas' },
];

console.log(`Total files to update: ${filesToUpdate.length}`);
console.log('Files:', filesToUpdate.map(f => path.basename(f.path)).join(', '));
