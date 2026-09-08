import React from 'react';
import { Link } from 'react-router-dom';
import { type Unit } from '../types';

interface CardUnitProps {
    unit: Unit;
}

// Map unit names to their route paths
// Includes both the renamed display names AND the original DB values as aliases
const unitPathMap: Record<string, string> = {
    // Current display names
    'Akuntansi':                '/unit/sdit',
    'Manajemen Perkantoran':    '/unit/smpit',
    'Rekayasa Perangkat Lunak': '/unit/smait',
    'Teknik Kendaraan Ringan':  '/unit/tkit1',
    'Teknik Komputer Jaringan': '/unit/smkit',
    'Desain Komunikasi Visual': '/unit/dkv',
    // Legacy DB values (original names still in jenjang_pendidikan table)
    'Administrasi Perkantoran':  '/unit/smpit',
    'Multimedia':                '/unit/smait',
    'Teknik Komputer & Jaringan':'/unit/smkit',
    'Bisnis Daring & Pemasaran': '/unit/tkit1',
};

// Map unit names to accent colors — covers both display names and DB aliases
const unitAccentMap: Record<string, { gradient: string; badge: string; text: string }> = {
    'Akuntansi': {
        gradient: 'from-accent to-amber-400',
        badge:    'bg-accent-light text-accent-dark border-accent/20',
        text:     'AK',
    },
    'Manajemen Perkantoran': {
        gradient: 'from-emerald-500 to-teal-400',
        badge:    'bg-emerald-50 text-emerald-700 border-emerald-200',
        text:     'MP',
    },
    // DB alias for Manajemen Perkantoran
    'Administrasi Perkantoran': {
        gradient: 'from-emerald-500 to-teal-400',
        badge:    'bg-emerald-50 text-emerald-700 border-emerald-200',
        text:     'MP',
    },
    'Rekayasa Perangkat Lunak': {
        gradient: 'from-secondary to-sky-400',
        badge:    'bg-secondary-light text-secondary border-secondary/15',
        text:     'RPL',
    },
    // DB alias for Rekayasa Perangkat Lunak
    'Multimedia': {
        gradient: 'from-secondary to-sky-400',
        badge:    'bg-secondary-light text-secondary border-secondary/15',
        text:     'RPL',
    },
    'Teknik Kendaraan Ringan': {
        gradient: 'from-violet-500 to-purple-400',
        badge:    'bg-violet-50 text-violet-700 border-violet-200',
        text:     'TKR',
    },
    // DB alias for Teknik Kendaraan Ringan
    'Bisnis Daring & Pemasaran': {
        gradient: 'from-violet-500 to-purple-400',
        badge:    'bg-violet-50 text-violet-700 border-violet-200',
        text:     'TKR',
    },
    'Teknik Komputer Jaringan': {
        gradient: 'from-primary to-secondary',
        badge:    'bg-primary-light text-primary border-primary/15',
        text:     'TKJ',
    },
    // DB alias for Teknik Komputer Jaringan
    'Teknik Komputer & Jaringan': {
        gradient: 'from-primary to-secondary',
        badge:    'bg-primary-light text-primary border-primary/15',
        text:     'TKJ',
    },
    'Desain Komunikasi Visual': {
        gradient: 'from-rose-500 to-pink-400',
        badge:    'bg-rose-50 text-rose-700 border-rose-200',
        text:     'DKV',
    },
};

const CardUnit: React.FC<CardUnitProps> = ({ unit }) => {
    const path   = unitPathMap[unit.name] || '/unit';
    const accent = unitAccentMap[unit.name] || {
        gradient: 'from-primary to-secondary',
        badge:    'bg-primary-light text-primary border-primary/15',
        text:     unit.name.charAt(0),
    };

    return (
        <Link to={path} className="group block">
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-card card-lift border border-neutral-100/80">

                {/* Image container */}
                <div className="relative overflow-hidden h-52">
                    <img
                        src={unit.img}
                        alt={unit.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${accent.gradient} opacity-0 group-hover:opacity-40 transition-opacity duration-300`} />

                    {/* Abbrev badge top-right */}
                    <div className={`absolute top-3 right-3 text-xs font-black px-2.5 py-1 rounded-xl border ${accent.badge}`}>
                        {accent.text}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <h3 className="font-heading font-bold text-neutral-900 text-base leading-snug group-hover:text-primary transition-colors duration-200">
                        {unit.name}
                    </h3>
                    <div className="mt-4 flex items-center justify-between">
                        <div className={`h-0.5 w-10 rounded-full bg-gradient-to-r ${accent.gradient} group-hover:w-16 transition-all duration-300`} />
                        <span className="flex items-center gap-1 text-xs font-semibold text-neutral-400 group-hover:text-primary transition-colors">
                            Selengkapnya
                            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Bottom color bar */}
                <div className={`h-1 w-full bg-gradient-to-r ${accent.gradient} group-hover:h-1.5 transition-all duration-300`} />
            </div>
        </Link>
    );
};

export default CardUnit;
