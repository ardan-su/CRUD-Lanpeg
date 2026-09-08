import React from 'react';
import { Link } from 'react-router-dom';
import { SOCIAL_LINKS, USEFUL_LINKS, SCHOOL_NAME } from '../constants';
import { YouTubeIcon, FacebookIcon, InstagramIcon } from './icons';

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    youtube:   YouTubeIcon,
    facebook:  FacebookIcon,
    instagram: InstagramIcon,
};

const socialColors: Record<string, string> = {
    youtube:   'hover:bg-red-500',
    facebook:  'hover:bg-blue-600',
    instagram: 'hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600',
};

const Footer: React.FC = () => {
    return (
        <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #0B1F60 0%, #061488 40%, #0830BC 100%)' }}>

            {/* Decorative shapes */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/3 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/8 rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
            }} />

            {/* ── Main body ── */}
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

                    {/* Col 1 — Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 border border-white/20 group-hover:bg-white/15 transition-colors shrink-0">
                                <span className="text-white font-black text-sm leading-none">PKP</span>
                            </div>
                            <div>
                                <p className="font-heading font-bold text-base text-white leading-tight">SMK PKP 1 Jakarta</p>
                                <p className="text-white/50 text-xs mt-0.5">Islamic School</p>
                            </div>
                        </Link>

                        <p className="text-white/60 text-sm leading-relaxed mb-6">
                            Mencetak generasi muda yang berakhlak mulia, kompeten di bidang kejuruan, dan siap bersaing di era global.
                        </p>

                        {/* Social icons */}
                        <div className="flex items-center gap-2.5">
                            {SOCIAL_LINKS.map(social => {
                                const Icon   = iconMap[social.icon];
                                const hColor = socialColors[social.icon] || 'hover:bg-primary';
                                return (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.name}
                                        className={`flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all duration-200 hover:scale-110 hover:border-transparent ${hColor}`}
                                    >
                                        {Icon && <Icon className="h-4.5 w-4.5" />}
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Col 2 — Quick Links */}
                    <div>
                        <h4 className="font-heading font-bold text-sm uppercase tracking-[0.12em] text-white mb-6 flex items-center gap-2">
                            <span className="w-6 h-0.5 bg-accent rounded-full" />
                            Tautan Cepat
                        </h4>
                        <ul className="space-y-3">
                            {USEFUL_LINKS.map(link => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="flex items-center gap-2.5 text-white/60 hover:text-white transition-colors text-sm font-medium group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent/60 group-hover:bg-accent transition-colors shrink-0" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3 — Kejuruan */}
                    <div>
                        <h4 className="font-heading font-bold text-sm uppercase tracking-[0.12em] text-white mb-6 flex items-center gap-2">
                            <span className="w-6 h-0.5 bg-accent rounded-full" />
                            Program Kejuruan
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'Akuntansi',                 path: '/unit/sdit' },
                                { name: 'Manajemen Perkantoran',     path: '/unit/smpit' },
                                { name: 'Rekayasa Perangkat Lunak',  path: '/unit/smait' },
                                { name: 'Teknik Kendaraan Ringan',   path: '/unit/tkit1' },
                                { name: 'Teknik Komputer Jaringan',  path: '/unit/smkit' },
                                { name: 'Desain Komunikasi Visual',  path: '/unit/dkv' },
                            ].map(p => (
                                <li key={p.name}>
                                    <Link
                                        to={p.path}
                                        className="flex items-center gap-2.5 text-white/60 hover:text-white transition-colors text-sm font-medium group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-secondary/60 group-hover:bg-secondary transition-colors shrink-0" />
                                        {p.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4 — Contact */}
                    <div>
                        <h4 className="font-heading font-bold text-sm uppercase tracking-[0.12em] text-white mb-6 flex items-center gap-2">
                            <span className="w-6 h-0.5 bg-accent rounded-full" />
                            Kontak Kami
                        </h4>
                        <address className="not-italic space-y-4 text-white/60 text-sm">
                            <div className="flex gap-3 items-start">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 shrink-0 mt-0.5">
                                    <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                                <p className="leading-relaxed">Jalan Raya PKP, Kelurahan Kelapa Dua Wetan, Kecamatan Ciracas, Jakarta Timur</p>
                            </div>
                            <div className="flex gap-3 items-center">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 shrink-0">
                                    <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                                    </svg>
                                </div>
                                <p>(021) 8700113</p>
                            </div>
                            <div className="flex gap-3 items-center">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 shrink-0">
                                    <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                                    </svg>
                                </div>
                                <a href="mailto:admin@smkpkp1jakarta.sch.id" className="hover:text-white transition-colors">
                                    admin@smkpkp1jakarta.sch.id
                                </a>
                            </div>
                        </address>

                        {/* CTA */}
                        <Link
                            to="/pendaftaran"
                            className="inline-flex items-center gap-2 mt-6 bg-accent hover:bg-accent-dark text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all duration-200 hover:scale-105 shadow-gold-glow/50"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Daftar Sekarang
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Divider ── */}
            <div className="relative border-t border-white/10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-white/40 text-xs">
                        © {new Date().getFullYear()} {SCHOOL_NAME}. Hak Cipta Dilindungi.
                    </p>
                    <p className="text-white/30 text-xs">
                        Powered by Tim ngangongango
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
