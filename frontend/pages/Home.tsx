import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import CardUnit from '../components/CardUnit';
import NewsCard from '../components/NewsCard';
import ArticleModal from '../components/ArticleModal';
import {
    SCHOOL_UNITS, SOCIAL_LINKS, HERO_SLIDES_FALLBACK,
    API_BASE_URL,
} from '../constants';
import {
    YouTubeIcon, FacebookIcon, InstagramIcon,
    ChevronLeftIcon, ChevronRightIcon,
    HeartIcon, AcademicCapIcon, UsersIcon, BookOpenIcon,
    GlobeAltIcon, ShieldCheckIcon, SparklesIcon,
    LightBulbIcon, ScaleIcon, ComputerDesktopIcon,
} from '../components/icons';
import {
    type Unit, type HeroSlide as HeroSlideType, type ProfilYayasanAPI,
    type JenjangPendidikan, type ProgramSection, type ProgramUnggulan,
    type NewsArticle, type PenerimaanSiswaBaru, type MediaSosial,
    type BeritaArtikelAPI,
} from '../types';

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    youtube:   YouTubeIcon,
    facebook:  FacebookIcon,
    instagram: InstagramIcon,
};

/* ─── useReveal hook ─────────────────────────────────────────────────────── */
function useReveal(delay = 0) {
    const ref = useRef<HTMLElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.classList.add('reveal');
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); } },
            { threshold: 0.1 }
        );
        observer.observe(el);
        if (delay) (el as HTMLElement).style.transitionDelay = `${delay}ms`;
        return () => observer.disconnect();
    }, [delay]);
    return ref;
}

/* ─── Section Heading ────────────────────────────────────────────────────── */
const SectionHeading: React.FC<{
    badge: string;
    title: string;
    subtitle?: string;
    center?: boolean;
    light?: boolean;
}> = ({ badge, title, subtitle, center = true, light = false }) => (
    <div className={`mb-12 md:mb-16 ${center ? 'text-center' : ''}`}>
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 rounded-full mb-5
            ${light
                ? 'bg-white/15 text-white border border-white/25'
                : 'bg-primary-light text-primary border border-primary/10'}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${light ? 'bg-accent' : 'bg-accent'}`} />
            {badge}
        </span>
        <h2 className={`font-heading text-3xl md:text-4xl lg:text-[2.6rem] font-extrabold leading-tight
            ${light ? 'text-white' : 'text-neutral-900'}`}>
            {title}
        </h2>
        <div className={`mt-4 mx-auto w-14 h-1 rounded-full bg-accent ${center ? 'mx-auto' : ''}`} />
        {subtitle && (
            <p className={`mt-5 max-w-2xl leading-relaxed text-base md:text-lg ${center ? 'mx-auto' : ''}
                ${light ? 'text-white/75' : 'text-neutral-600'}`}>
                {subtitle}
            </p>
        )}
    </div>
);

/* ─── Hero Slider ─────────────────────────────────────────────────────────── */
const HeroSlider: React.FC = () => {
    const [slides, setSlides]             = useState<HeroSlideType[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading]       = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const res  = await fetch(`${API_BASE_URL}/api/slider/`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                if (data.success && Array.isArray(data.data) && data.data.length > 0) {
                    setSlides(data.data);
                } else throw new Error();
            } catch {
                setSlides(HERO_SLIDES_FALLBACK);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const goTo = useCallback((idx: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(idx);
        setTimeout(() => setIsTransitioning(false), 800);
    }, [isTransitioning]);

    const nextSlide = useCallback(() => {
        if (slides.length === 0) return;
        goTo((currentIndex + 1) % slides.length);
    }, [slides.length, currentIndex, goTo]);

    const prevSlide = () => {
        if (slides.length === 0) return;
        goTo((currentIndex - 1 + slides.length) % slides.length);
    };

    useEffect(() => {
        if (slides.length > 1) {
            const t = setTimeout(nextSlide, 6000);
            return () => clearTimeout(t);
        }
    }, [currentIndex, nextSlide, slides.length]);

    const getImageUrl = (gambar: string) => {
        if (!gambar) return HERO_SLIDES_FALLBACK[0].gambar;
        if (gambar.startsWith('http')) return gambar;
        return `${API_BASE_URL}/storage/slider/${gambar}`;
    };

    if (isLoading) {
        return (
            <section className="relative w-full h-screen flex items-center justify-center bg-primary overflow-hidden">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-blue-gradient opacity-90" />
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(57,125,232,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(8,48,188,0.4) 0%, transparent 50%)',
                }} />
                <div className="relative z-10 flex flex-col items-center gap-5">
                    <div className="w-14 h-14 rounded-full border-4 border-accent border-t-transparent animate-spin" />
                    <p className="text-white/70 font-medium text-sm tracking-wide">Memuat...</p>
                </div>
            </section>
        );
    }

    const currentSlide = slides[currentIndex] || HERO_SLIDES_FALLBACK[0];

    return (
        <section className="relative w-full h-screen min-h-[600px] overflow-hidden" aria-label="Hero slider">
            {/* Background slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
                        ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img
                        src={getImageUrl(slide.gambar)}
                        alt={slide.judul}
                        className="w-full h-full object-cover"
                        loading={index === 0 ? 'eager' : 'lazy'}
                    />
                </div>
            ))}

            {/* Multi-layer overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-transparent to-transparent z-10" />

            {/* Decorative geometric shapes */}
            <div className="absolute top-24 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-accent/10 rounded-full blur-2xl z-10 pointer-events-none" />

            {/* Content */}
            <div className="relative z-20 h-full flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        {/* Badge */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                SMK PKP 1 Jakarta Islamic School
                            </div>
                        </div>

                        {/* Title */}
                        <h1
                            key={currentIndex}
                            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] font-extrabold text-white leading-[1.1] drop-shadow-xl"
                            style={{ animation: 'heroTextIn 0.7s cubic-bezier(.4,0,.2,1) both' }}
                        >
                            {currentSlide.judul}
                        </h1>

                        {/* Gold accent line */}
                        <div className="mt-6 w-20 h-1.5 bg-accent rounded-full" />

                        {/* Description */}
                        <p
                            key={`desc-${currentIndex}`}
                            className="mt-6 text-white/85 text-lg md:text-xl leading-relaxed max-w-2xl"
                            style={{ animation: 'heroTextIn 0.7s 0.15s cubic-bezier(.4,0,.2,1) both' }}
                        >
                            {currentSlide.deskripsi}
                        </p>

                        {/* CTAs */}
                        <div
                            className="mt-10 flex flex-wrap gap-4"
                            style={{ animation: 'heroTextIn 0.7s 0.3s cubic-bezier(.4,0,.2,1) both' }}
                        >
                            <Link
                                to="/pendaftaran"
                                className="inline-flex items-center gap-2.5 bg-accent hover:bg-accent-dark text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-gold-glow text-sm sm:text-base"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                {currentSlide.tombol_text || 'Daftar Sekarang'}
                            </Link>
                            <Link
                                to="/unit"
                                className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/50 hover:border-white text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-300 text-sm sm:text-base"
                            >
                                Lihat Kejuruan
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </div>

                        {/* Slide indicators */}
                        {slides.length > 1 && (
                            <div className="mt-12 flex items-center gap-3">
                                {slides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goTo(index)}
                                        className={`rounded-full transition-all duration-400
                                            ${index === currentIndex
                                                ? 'w-10 h-2.5 bg-accent'
                                                : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'}`}
                                        aria-label={`Slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Nav arrows */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-4 md:left-8 z-30 -translate-y-1/2
                            w-11 h-11 flex items-center justify-center
                            bg-white/10 hover:bg-white/25 backdrop-blur-sm
                            border border-white/20 rounded-xl
                            text-white transition-all duration-200 hover:scale-105"
                        aria-label="Slide sebelumnya"
                    >
                        <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-4 md:right-8 z-30 -translate-y-1/2
                            w-11 h-11 flex items-center justify-center
                            bg-white/10 hover:bg-white/25 backdrop-blur-sm
                            border border-white/20 rounded-xl
                            text-white transition-all duration-200 hover:scale-105"
                        aria-label="Slide berikutnya"
                    >
                        <ChevronRightIcon className="h-5 w-5" />
                    </button>
                </>
            )}

            {/* Scroll hint */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/50">
                <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
                <div className="w-px h-10 bg-white/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-white/60 animate-bounce" />
                </div>
            </div>

            <style>{`
                @keyframes heroTextIn {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
};

/* ─── Stats Bar ───────────────────────────────────────────────────────────── */
const StatsBar: React.FC = () => {
    const ref = useReveal() as React.RefObject<HTMLElement>;
    const stats = [
        { value: '6+',    label: 'Program Kejuruan', icon: '🎓' },
        { value: '1988',  label: 'Tahun Berdiri',     icon: '🏫' },
        { value: '1000+', label: 'Siswa Aktif',       icon: '👥' },
        { value: '100%',  label: 'Lulusan Bersertifikat', icon: '📜' },
    ];

    return (
        <section
            ref={ref as React.RefObject<HTMLDivElement>}
            className="relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0830BC 0%, #1a4fd8 60%, #397DE8 100%)' }}
        >
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />

            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
                    {stats.map((stat, i) => (
                        <div
                            key={stat.label}
                            className="text-center group"
                            style={{ transitionDelay: `${i * 80}ms` }}
                        >
                            <div className="text-3xl mb-2">{stat.icon}</div>
                            <p className="font-heading font-black text-4xl md:text-5xl text-accent leading-none">
                                {stat.value}
                            </p>
                            <p className="text-white/75 text-sm mt-2 font-medium leading-snug">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ─── Sambutan Section ────────────────────────────────────────────────────── */
const SambutanSection: React.FC = () => {
    const [data, setData]           = useState<ProfilYayasanAPI | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const leftRef  = useReveal(0)  as React.RefObject<HTMLElement>;
    const rightRef = useReveal(150) as React.RefObject<HTMLElement>;

    useEffect(() => {
        (async () => {
            try {
                const res    = await fetch(`${API_BASE_URL}/api/profil-yayasan/`);
                const result = await res.json();
                if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                    setData(result.data[0]);
                }
            } catch { /* use fallback */ }
            finally { setIsLoading(false); }
        })();
    }, []);

    const d = data || {
        subjudul:   'Sambutan Kepala Sekolah',
        sambutan:   'Selamat datang di SMK PKP 1 Jakarta Islamic School — sekolah vokasi berbasis Technopreneurship yang mengedepankan nilai-nilai Islami. Kami berkomitmen mencetak lulusan yang tidak hanya kompeten secara kejuruan, tetapi juga berakhlak mulia dan siap menghadapi tantangan dunia kerja.',
        foto_url:   'https://images.unsplash.com/photo-1568602471322-7826d3a36c44?w=600&h=700&fit=crop&q=80',
        nama_ketua: 'Yosep Saifulloh, S.T',
        jabatan:    'Kepala SMK PKP 1 Jakarta Islamic School',
    };

    if (isLoading) {
        return (
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-pulse">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-4">
                        <div className="h-6 bg-neutral-200 rounded-full w-32" />
                        <div className="h-10 bg-neutral-200 rounded-xl w-3/4" />
                        <div className="h-1.5 bg-neutral-200 rounded-full w-16" />
                        <div className="space-y-2.5 mt-4">
                            {[1,2,3,4].map(i => <div key={i} className="h-4 bg-neutral-200 rounded" />)}
                        </div>
                    </div>
                    <div className="h-[480px] bg-neutral-200 rounded-3xl" />
                </div>
            </section>
        );
    }

    return (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

                {/* Text side */}
                <div
                    ref={leftRef as React.RefObject<HTMLDivElement>}
                    className="reveal-left order-2 md:order-1"
                >
                    <span className="inline-flex items-center gap-1.5 bg-primary-light text-primary text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 rounded-full mb-5 border border-primary/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        Sambutan
                    </span>
                    <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-neutral-900 leading-tight">
                        {d.subjudul}
                    </h2>
                    <div className="mt-4 w-14 h-1 bg-accent rounded-full" />
                    <p className="mt-6 text-neutral-600 leading-relaxed text-base md:text-lg">{d.sambutan}</p>

                    {/* Signature block */}
                    <div className="mt-8 flex items-center gap-4 p-4 bg-primary-light rounded-2xl border border-primary/10">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-blue-glow/30">
                            <span className="text-white font-bold text-lg">
                                {d.nama_ketua?.charAt(0) || 'K'}
                            </span>
                        </div>
                        <div>
                            <p className="font-bold text-neutral-900 text-sm">{d.nama_ketua}</p>
                            <p className="text-neutral-500 text-xs mt-0.5">{d.jabatan}</p>
                        </div>
                    </div>

                    <Link
                        to="/profil/sambutan"
                        className="inline-flex items-center gap-2.5 mt-8 bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-200 hover:scale-105 text-sm shadow-card"
                    >
                        Baca Selengkapnya
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>

                {/* Image side */}
                <div
                    ref={rightRef as React.RefObject<HTMLDivElement>}
                    className="reveal-right order-1 md:order-2 relative"
                >
                    {/* Decorative bg shape */}
                    <div className="absolute -inset-4 bg-primary-light rounded-3xl -rotate-3 z-0" />
                    <div className="absolute -inset-2 bg-secondary/10 rounded-3xl rotate-1 z-0" />

                    <div className="relative z-10 rounded-3xl overflow-hidden shadow-card-hover border-4 border-white">
                        <img
                            src={d.foto_url}
                            alt={d.nama_ketua}
                            className="w-full object-cover object-top max-h-[480px]"
                            loading="lazy"
                        />
                        {/* Overlay badge */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent p-6">
                            <p className="font-bold text-white text-base">{d.nama_ketua}</p>
                            <p className="text-white/70 text-xs mt-0.5">{d.jabatan}</p>
                        </div>
                    </div>

                    {/* Floating accent */}
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent rounded-2xl shadow-gold-glow flex items-center justify-center z-20">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ─── Program Kejuruan Section ────────────────────────────────────────────── */
const UnitPendidikanSection: React.FC = () => {
    const [title, setTitle]           = useState('');
    const [description, setDescription] = useState('');
    const [units, setUnits]           = useState<Unit[]>([]);
    const [isLoading, setIsLoading]   = useState(true);
    const sectionRef = useReveal() as React.RefObject<HTMLElement>;

    useEffect(() => {
        (async () => {
            try {
                const res    = await fetch(`${API_BASE_URL}/api/jenjang-pendidikan/`);
                const result = await res.json();
                if (result.success && Array.isArray(result.data)) {
                    const header   = result.data.find((d: JenjangPendidikan) => d.judul);
                    const unitData = result.data.filter((d: JenjangPendidikan) => d.nama_unit);
                    setTitle(header?.judul || 'PROGRAM KEJURUAN');
                    setDescription(header?.deskripsi || 'Program kejuruan unggulan SMK PKP 1 Jakarta Islamic School.');
                    const combined = SCHOOL_UNITS.map(su => {
                        const match = unitData.find((u: JenjangPendidikan) => u.nama_unit === su.name);
                        return { ...su, img: match?.image || su.img };
                    });
                    setUnits(combined.length > 0 ? combined : SCHOOL_UNITS);
                } else throw new Error();
            } catch {
                setTitle('PROGRAM KEJURUAN');
                setDescription('SMK PKP 1 Jakarta Islamic School menyediakan program kejuruan unggulan yang dirancang untuk membekali siswa dengan keahlian profesional dan nilai-nilai Islami.');
                setUnits(SCHOOL_UNITS);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    if (isLoading) {
        return (
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
                    <div className="text-center mb-14 space-y-4">
                        <div className="h-7 bg-neutral-200 rounded-full w-1/2 mx-auto" />
                        <div className="w-14 h-1.5 bg-neutral-200 rounded-full mx-auto" />
                        <div className="h-5 bg-neutral-200 rounded w-3/4 mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="bg-neutral-100 rounded-3xl h-72 animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            ref={sectionRef as React.RefObject<HTMLDivElement>}
            className="reveal py-6 bg-white"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    badge="Kejuruan Kami"
                    title={title || 'PROGRAM KEJURUAN'}
                    subtitle={description}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {units.map((unit, i) => (
                        <div key={unit.name} style={{ transitionDelay: `${i * 80}ms` }}>
                            <CardUnit unit={unit} />
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link
                        to="/unit"
                        className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 px-8 rounded-xl text-sm transition-all duration-200 hover:scale-105"
                    >
                        Lihat Semua Kejuruan
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
};

/* ─── Program Unggulan Section ────────────────────────────────────────────── */
const ProgramUnggulanSection: React.FC = () => {
    const [sectionData, setSectionData] = useState<ProgramSection | null>(null);
    const [programs, setPrograms]       = useState<ProgramUnggulan[]>([]);
    const [isLoading, setIsLoading]     = useState(true);
    const [hasError, setHasError]       = useState(false);
    const sectionRef = useReveal() as React.RefObject<HTMLElement>;

    const programIconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
        'bpi.jpeg': HeartIcon, 'unggul2.jpeg': AcademicCapIcon,
        users: UsersIcon, quran: BookOpenIcon, language: GlobeAltIcon,
        'check-circle': ShieldCheckIcon, laptop: ComputerDesktopIcon,
        lightbulb: LightBulbIcon, hands: ScaleIcon, default: SparklesIcon,
    };

    useEffect(() => {
        (async () => {
            try {
                const [sRes, pRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/program-section/`),
                    fetch(`${API_BASE_URL}/api/program-unggulan/`),
                ]);
                if (!sRes.ok || !pRes.ok) throw new Error();
                const sResult = await sRes.json();
                const pResult = await pRes.json();
                if (sResult.success && sResult.data.length > 0) setSectionData(sResult.data[0]);
                else throw new Error();
                if (pResult.success && Array.isArray(pResult.data)) setPrograms(pResult.data);
                else throw new Error();
            } catch {
                setHasError(true);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const fallbackPrograms: ProgramUnggulan[] = [
        { id: 1, section_id: 0, image: 'heart',        deskripsi: 'Pembinaan keislaman terpadu melalui Bina Pribadi Islami (BPI) dan pembiasaan ibadah harian.' },
        { id: 2, section_id: 0, image: 'book',         deskripsi: 'Kurikulum Merdeka Belajar yang diintegrasikan dengan nilai-nilai keislaman dan kompetensi kejuruan.' },
        { id: 3, section_id: 0, image: 'users',        deskripsi: 'Tenaga pengajar bersertifikat dengan pengalaman industri yang relevan di bidangnya.' },
        { id: 4, section_id: 0, image: 'quran',        deskripsi: 'Program Tahfizh Al-Qur\'an terstruktur dengan target yang terukur setiap semester.' },
        { id: 5, section_id: 0, image: 'language',     deskripsi: 'Program Bahasa Inggris dan Bahasa Arab aktif untuk mendukung daya saing global.' },
        { id: 6, section_id: 0, image: 'check-circle', deskripsi: 'Fasilitas laboratorium lengkap dan magang industri untuk pengalaman kerja nyata.' },
    ];

    const displayPrograms = hasError ? fallbackPrograms : programs;
    const sectionTitle    = hasError ? 'PROGRAM UNGGULAN' : sectionData?.judul;
    const sectionDesc     = hasError
        ? 'SMK PKP 1 Jakarta Islamic School dirancang dengan konsep pendidikan kejuruan berbasis nilai Islami yang komprehensif.'
        : sectionData?.deskripsi;

    const cardBgColors = [
        'bg-primary-light border-primary/15',
        'bg-secondary-light border-secondary/15',
        'bg-accent-light border-accent/20',
        'bg-primary-light border-primary/15',
        'bg-secondary-light border-secondary/15',
        'bg-accent-light border-accent/20',
    ];
    const iconBgColors = [
        'bg-primary text-white',
        'bg-secondary text-white',
        'bg-accent text-white',
        'bg-primary text-white',
        'bg-secondary text-white',
        'bg-accent text-white',
    ];

    if (isLoading) {
        return (
            <section className="py-20" style={{ background: 'linear-gradient(180deg, #EEF2FF 0%, #F8FAFB 100%)' }}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
                    <div className="text-center mb-14 space-y-4">
                        <div className="h-7 bg-neutral-200 rounded-full w-1/3 mx-auto" />
                        <div className="w-14 h-1.5 bg-neutral-200 rounded-full mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-3xl h-40 animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            ref={sectionRef as React.RefObject<HTMLDivElement>}
            className="reveal py-6"
            style={{ background: 'linear-gradient(180deg, #EEF2FF 0%, #F8FAFB 100%)' }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading badge="Keunggulan" title={sectionTitle || 'PROGRAM UNGGULAN'} subtitle={sectionDesc} />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayPrograms.map((program, i) => {
                        const isUrl     = program.image?.startsWith('http');
                        const IconComp  = !isUrl ? (programIconMap[program.image] || programIconMap.default) : null;
                        const bgClass   = cardBgColors[i % cardBgColors.length];
                        const iconClass = iconBgColors[i % iconBgColors.length];
                        return (
                            <div
                                key={program.id}
                                className={`group rounded-3xl border p-7 card-lift ${bgClass} bg-white/80 backdrop-blur-sm`}
                                style={{ transitionDelay: `${i * 60}ms` }}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-sm ${iconClass} group-hover:scale-110 transition-transform duration-200`}>
                                    {isUrl ? (
                                        <img src={program.image} alt="Ikon" className="h-8 w-8 object-contain" />
                                    ) : IconComp ? (
                                        <IconComp className="h-7 w-7" />
                                    ) : (
                                        <SparklesIcon className="h-7 w-7" />
                                    )}
                                </div>
                                <p className="text-neutral-700 text-sm leading-relaxed">{program.deskripsi}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

/* ─── Berita Section ──────────────────────────────────────────────────────── */
const stripHtml = (html: string) => {
    if (!html) return '';
    const cleaned = html.replace(/\\r\\n/g, ' ').replace(/\\n/g, ' ').replace(/\\"/g, '"');
    const txt     = document.createElement('textarea');
    txt.innerHTML = cleaned;
    const doc     = new DOMParser().parseFromString(txt.value, 'text/html');
    return doc.body.textContent || '';
};

const NewsCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-3xl overflow-hidden animate-pulse shadow-card">
        <div className="bg-neutral-200 h-52 w-full" />
        <div className="p-6 space-y-3">
            <div className="h-4 bg-neutral-200 rounded-full w-24" />
            <div className="h-5 bg-neutral-200 rounded-lg w-3/4" />
            <div className="h-4 bg-neutral-200 rounded w-full" />
            <div className="h-4 bg-neutral-200 rounded w-5/6" />
        </div>
    </div>
);

const BeritaSection: React.FC = () => {
    const [articles, setArticles]         = useState<NewsArticle[]>([]);
    const [fullArticles, setFullArticles] = useState<BeritaArtikelAPI[]>([]);
    const [isLoading, setIsLoading]       = useState(true);
    const [error, setError]               = useState<string | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<BeritaArtikelAPI | null>(null);
    const sectionRef = useReveal() as React.RefObject<HTMLElement>;

    const formatDate = (ds: string) =>
        new Date(ds).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res    = await fetch(`${API_BASE_URL}/api/berita-artikel/`);
                if (!res.ok) throw new Error();
                const result = await res.json();
                if (result.success && Array.isArray(result.data)) {
                    const sorted: BeritaArtikelAPI[] = [...result.data].sort(
                        (a: BeritaArtikelAPI, b: BeritaArtikelAPI) =>
                            new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
                    );
                    setFullArticles(sorted);
                    setArticles(sorted.map((item: BeritaArtikelAPI): NewsArticle => ({
                        id:          item.id,
                        title:       item.judul,
                        category:    item.kategori,
                        date:        formatDate(item.tanggal),
                        image:       item.gambar,
                        slug:        item.slug,
                        description: stripHtml(item.deskripsi),
                    })));
                } else throw new Error();
            } catch {
                setError('Tidak dapat memuat berita saat ini. Silakan coba lagi nanti.');
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return (
        <section
            ref={sectionRef as React.RefObject<HTMLDivElement>}
            className="reveal py-6 bg-white"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading badge="Info Terkini" title="BERITA & ARTIKEL" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => <NewsCardSkeleton key={i} />)
                    ) : error ? (
                        <div className="md:col-span-3 text-center py-16 bg-primary-light rounded-3xl border border-primary/10">
                            <div className="text-5xl mb-4">📰</div>
                            <p className="font-bold text-neutral-700 text-lg">Berita belum tersedia</p>
                            <p className="text-neutral-500 text-sm mt-2">{error}</p>
                        </div>
                    ) : (
                        articles.slice(0, 3).map((article, i) => (
                            <div key={article.id} style={{ transitionDelay: `${i * 100}ms` }}>
                                <NewsCard
                                    article={article}
                                    onReadMore={() => {
                                        const full = fullArticles.find(a => a.id === article.id);
                                        if (full) setSelectedArticle(full);
                                    }}
                                />
                            </div>
                        ))
                    )}
                </div>

                <div className="text-center mt-12">
                    <Link
                        to="/informasi/berita"
                        className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 px-8 rounded-xl text-sm transition-all duration-200 hover:scale-105"
                    >
                        Lihat Semua Berita & Artikel
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
            </div>
            {selectedArticle && (
                <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
            )}
        </section>
    );
};

/* ─── Pendaftaran CTA Section ─────────────────────────────────────────────── */
const PendaftaranSection: React.FC = () => {
    const [data, setData]           = useState<PenerimaanSiswaBaru | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const sectionRef = useReveal() as React.RefObject<HTMLElement>;

    useEffect(() => {
        (async () => {
            try {
                const res    = await fetch(`${API_BASE_URL}/api/penerimaan-siswa-baru/`);
                const result = await res.json();
                if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                    setData(result.data[0]);
                }
            } catch { /* use fallback */ }
            finally { setIsLoading(false); }
        })();
    }, []);

    const content = data || {
        judul:       'Penerimaan Siswa Baru',
        subjudul:    'Assalamu\'alaikum Warahmatullahi Wabarakatuh',
        sapaan:      'Bapak / Ibu Orang Tua / Wali Calon Siswa',
        deskripsi:   'SMK PKP 1 Jakarta Islamic School membuka Penerimaan Peserta Didik Baru. Bergabunglah bersama kami dan raih masa depan dengan bekal keahlian kejuruan dan nilai-nilai Islami yang kuat.',
        teks_tombol: 'Daftar Sekarang',
        link_tombol: '/pendaftaran',
    };

    return (
        <section
            ref={sectionRef as React.RefObject<HTMLDivElement>}
            className="reveal relative overflow-hidden"
        >
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80')" }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(8,48,188,0.95) 0%, rgba(57,125,232,0.90) 100%)' }} />

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-20 w-64 h-64 bg-accent/10 rounded-full translate-y-1/3 pointer-events-none" />

            {/* Dotted pattern overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
            }} />

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                <div className="max-w-3xl mx-auto text-center text-white">
                    {isLoading ? (
                        <div className="animate-pulse space-y-5">
                            <div className="h-7 bg-white/20 rounded-full w-32 mx-auto" />
                            <div className="h-12 bg-white/20 rounded-xl w-2/3 mx-auto" />
                            <div className="h-5 bg-white/20 rounded w-1/2 mx-auto" />
                            <div className="h-14 bg-white/20 rounded-xl w-48 mx-auto mt-6" />
                        </div>
                    ) : (
                        <>
                            <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/40 text-accent text-xs font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                PPDB {new Date().getFullYear()}
                            </div>

                            <h2 className="font-heading text-4xl md:text-5xl font-extrabold leading-tight">
                                {content.judul}
                            </h2>

                            <div className="mt-5 w-14 h-1.5 bg-accent rounded-full mx-auto" />

                            <p className="mt-6 text-white/80 text-base md:text-lg">{content.subjudul}</p>
                            <p className="mt-2 text-white/60 text-sm">{content.sapaan}</p>
                            <p className="mt-5 text-white/85 leading-relaxed text-base md:text-lg max-w-2xl mx-auto">{content.deskripsi}</p>

                            <div className="mt-10 flex flex-wrap gap-4 justify-center">
                                <Link
                                    to={content.link_tombol === '#' ? '/pendaftaran' : content.link_tombol}
                                    className="inline-flex items-center gap-2.5 bg-accent hover:bg-accent-dark text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 hover:scale-105 shadow-gold-glow text-base"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    {content.teks_tombol}
                                </Link>
                                <Link
                                    to="/data-pendaftaran"
                                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border-2 border-white/40 hover:border-white/70 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 text-base backdrop-blur-sm"
                                >
                                    Cek Status Pendaftaran
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

/* ─── Media Sosial Section ────────────────────────────────────────────────── */
const MediaSosialSection: React.FC = () => {
    const [socials, setSocials]     = useState<MediaSosial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const sectionRef = useReveal() as React.RefObject<HTMLElement>;

    useEffect(() => {
        (async () => {
            try {
                const res    = await fetch(`${API_BASE_URL}/api/media-sosial/`);
                const result = await res.json();
                if (result.success && Array.isArray(result.data)) setSocials(result.data);
                else throw new Error();
            } catch {
                setSocials(SOCIAL_LINKS.map((s, i) => ({
                    id: i + 1, nama: s.name, username: s.handle, link: s.url, icon: s.icon,
                })));
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const socialGradients: Record<string, string> = {
        youtube:   'from-red-500 to-red-600',
        facebook:  'from-blue-600 to-blue-700',
        instagram: 'from-pink-500 via-purple-500 to-indigo-500',
    };

    return (
        <section
            ref={sectionRef as React.RefObject<HTMLDivElement>}
            className="reveal py-6 bg-white"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading badge="Ikuti Kami" title="MEDIA SOSIAL" subtitle="Tetap terhubung dan ikuti perkembangan terbaru SMK PKP 1 Jakarta Islamic School." />

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-48 bg-neutral-100 rounded-3xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {socials.map((social, i) => {
                            const Icon     = iconMap[social.icon];
                            const gradient = socialGradients[social.icon] || 'from-primary to-secondary';
                            return (
                                <a
                                    key={social.id}
                                    href={social.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative rounded-3xl overflow-hidden card-lift border border-neutral-100 bg-white shadow-card"
                                    style={{ transitionDelay: `${i * 100}ms` }}
                                >
                                    {/* Gradient top stripe */}
                                    <div className={`h-2 w-full bg-gradient-to-r ${gradient}`} />

                                    <div className="p-8 flex flex-col items-center text-center">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5
                                            bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                                            {Icon && <Icon className="h-8 w-8 text-white" />}
                                        </div>
                                        <h3 className="font-heading font-bold text-xl text-neutral-900 mb-1">
                                            {social.nama}
                                        </h3>
                                        <p className="text-neutral-500 text-sm mb-5 group-hover:text-primary transition-colors">
                                            {social.username}
                                        </p>
                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-primary to-secondary px-4 py-2 rounded-full">
                                            Kunjungi
                                            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </span>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

/* ─── Page ────────────────────────────────────────────────────────────────── */
const Home: React.FC = () => (
    <div className="overflow-x-hidden">
        <HeroSlider />
        <div className="space-y-24 md:space-y-32 pb-24">
            <StatsBar />
            <SambutanSection />
            <UnitPendidikanSection />
            <ProgramUnggulanSection />
            <BeritaSection />
            <PendaftaranSection />
            <MediaSosialSection />
        </div>
    </div>
);

export default Home;
