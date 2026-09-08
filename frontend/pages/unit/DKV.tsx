import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    ChevronLeftIcon, ChevronRightIcon,
    MapPinIcon, PhoneIcon, EnvelopeIcon,
    YouTubeIcon, FacebookIcon, InstagramIcon,
} from '../../components/icons';
import {
    type PenerimaanSiswaBaru,
    type HubungiKamiAPI,
    type MediaSosial as MediaSosialType,
} from '../../types';

// ─── Type Definitions ─────────────────────────────────────────────────────────
interface BannerDkv {
    id: number;
    judul: string;
    deskripsi: string;
    gambar: string;
    tombol_teks: string;
    tombol_link: string;
}

// ─── API Configuration ────────────────────────────────────────────────────────
const API_BASE_URL       = 'http://localhost:5001';
const BANNER_API_URL     = `${API_BASE_URL}/api/banner_dkv/`;
const BANNER_STORAGE_URL = `${API_BASE_URL}/storage/banner_dkv/`;
const PENDAFTARAN_API_URL = `${API_BASE_URL}/api/penerimaan-siswa-baru/`;
const KONTAK_API_URL     = `${API_BASE_URL}/api/hubungi_kami/1`;
const SOCIAL_API_URL     = `${API_BASE_URL}/api/media-sosial/`;

// ─── Fallback Data ────────────────────────────────────────────────────────────
const FALLBACK_SLIDE: BannerDkv = {
    id: 1,
    judul: 'Desain Komunikasi Visual',
    deskripsi: 'Mencetak desainer kreatif yang kompeten dan berakhlak mulia untuk menghadapi industri kreatif global.',
    gambar: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1920&h=1080&fit=crop&q=80',
    tombol_teks: 'Daftar Sekarang',
    tombol_link: '/pendaftaran',
};

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    youtube:   YouTubeIcon,
    facebook:  FacebookIcon,
    instagram: InstagramIcon,
};

// ─── Hero Slider ──────────────────────────────────────────────────────────────
const HeroSlider: React.FC = () => {
    const [slides, setSlides]             = useState<BannerDkv[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading]       = useState(true);
    const [error, setError]               = useState<string | null>(null);

    useEffect(() => {
        const fetchBanner = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(BANNER_API_URL);
                if (!response.ok) throw new Error('Gagal mengambil data banner dari server.');
                const result = await response.json();
                if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                    setSlides(result.data);
                } else {
                    throw new Error('Format data API tidak valid atau data kosong.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan tidak diketahui.');
                console.warn('API fetch failed, using fallback data:', err);
                setSlides([FALLBACK_SLIDE]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBanner();
    }, []);

    const nextSlide = useCallback(() => {
        if (slides.length <= 1) return;
        setCurrentIndex(prev => (prev + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = () => {
        if (slides.length <= 1) return;
        setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);
    };

    useEffect(() => {
        if (slides.length > 1) {
            const timer = setTimeout(nextSlide, 7000);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, nextSlide, slides.length]);

    if (isLoading) {
        return (
            <div className="relative h-[60vh] -mx-4 sm:-mx-6 lg:-mx-8 -mt-12 mb-12 bg-neutral-200 animate-pulse" aria-label="Loading hero banner">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-start justify-center">
                    <div className="h-12 w-96 bg-neutral-300 rounded mb-4" />
                    <div className="mt-4 h-6 w-96 bg-neutral-300 rounded" />
                    <div className="mt-2 h-6 w-80 bg-neutral-300 rounded" />
                    <div className="mt-8 h-12 w-48 bg-neutral-300 rounded-full" />
                </div>
            </div>
        );
    }

    if (slides.length === 0) {
        return (
            <div className="relative h-[60vh] w-full -mt-12 mb-12 bg-neutral-100 flex items-center justify-center">
                <p className="text-neutral-500">Banner tidak tersedia saat ini.</p>
            </div>
        );
    }

    const currentSlide = slides[currentIndex];
    const imageUrl = currentSlide.gambar?.startsWith('http')
        ? currentSlide.gambar
        : `${BANNER_STORAGE_URL}${currentSlide.gambar}`;
    const ButtonComponent: React.ElementType = currentSlide.tombol_link.startsWith('http') ? 'a' : Link;
    const buttonProps = ButtonComponent === 'a'
        ? { href: currentSlide.tombol_link, target: '_blank', rel: 'noopener noreferrer' }
        : { to: currentSlide.tombol_link };

    return (
        <div className="relative h-[60vh] w-full -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden text-neutral-800 -mt-12 mb-12">
            <div className="absolute inset-0 w-full h-full bg-white/30 z-10" />
            {slides.map((slide, index) => {
                const imgSrc = slide.gambar?.startsWith('http') ? slide.gambar : `${BANNER_STORAGE_URL}${slide.gambar}`;
                return (
                    <img
                        key={slide.id}
                        src={imgSrc}
                        alt={slide.judul}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                    />
                );
            })}
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full z-20 flex flex-col items-start justify-center">
                <h1 className="font-heading text-4xl md:text-6xl font-bold text-primary" style={{ textShadow: '1px 1px 3px rgba(255,255,255,0.7)' }}>
                    {currentSlide.judul}
                </h1>
                <p className="mt-4 max-w-lg text-lg md:text-xl font-medium text-neutral-700 bg-white/60 backdrop-blur-sm p-3 rounded-md shadow">
                    {currentSlide.deskripsi}
                </p>
                <div className="mt-8">
                    <ButtonComponent
                        {...buttonProps}
                        className="bg-primary hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-full transition-transform duration-300 hover:scale-105 shadow-lg"
                    >
                        {currentSlide.tombol_teks}
                    </ButtonComponent>
                </div>
            </div>
            {slides.length > 1 && (
                <>
                    <button onClick={prevSlide} className="absolute top-1/2 left-4 z-30 -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full transition-colors" aria-label="Slide sebelumnya">
                        <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <button onClick={nextSlide} className="absolute top-1/2 right-4 z-30 -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full transition-colors" aria-label="Slide berikutnya">
                        <ChevronRightIcon className="h-6 w-6" />
                    </button>
                </>
            )}
        </div>
    );
};

// ─── Tentang DKV ─────────────────────────────────────────────────────────────
const TentangSection: React.FC = () => (
    <section id="tentang-dkv" className="text-center">
        <h2 className="font-heading text-3xl font-bold text-neutral-900 uppercase tracking-wider">Tentang Program</h2>
        <div className="w-24 h-1 bg-primary my-4 mx-auto" />
        <div className="mt-8 grid md:grid-cols-2 gap-10 text-left">
            <div>
                <h3 className="font-heading text-xl font-bold text-primary mb-4">Tentang Jurusan DKV</h3>
                <p className="text-neutral-600 leading-relaxed">
                    Jurusan Desain Komunikasi Visual (DKV) di SMK PKP 1 Jakarta Islamic School membekali siswa
                    dengan kemampuan kreatif dan teknis di bidang desain grafis, ilustrasi digital, fotografi,
                    videografi, dan multimedia. Program ini dirancang untuk menyiapkan lulusan yang siap berkarir
                    di industri kreatif dengan landasan nilai-nilai Islami yang kuat.
                </p>
                <p className="text-neutral-600 leading-relaxed mt-4">
                    Siswa akan menguasai perangkat desain industri standar, mengembangkan portofolio profesional,
                    dan mendapatkan sertifikasi kompetensi yang diakui secara nasional.
                </p>
            </div>
            <div>
                <h3 className="font-heading text-xl font-bold text-primary mb-4">Prospek Karir</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                        'Desainer Grafis',
                        'Ilustrator Digital',
                        'UI/UX Designer',
                        'Fotografer & Videografer',
                        'Content Creator',
                        'Motion Graphic Designer',
                        'Art Director',
                        'Desainer Percetakan',
                    ].map(karir => (
                        <li key={karir} className="flex items-center gap-2 text-sm text-neutral-700">
                            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                            {karir}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </section>
);

// ─── Pendaftaran Section ──────────────────────────────────────────────────────
const PendaftaranSection: React.FC = () => {
    const [data, setData]           = useState<PenerimaanSiswaBaru | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError]         = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch(PENDAFTARAN_API_URL);
                if (!res.ok) throw new Error('Gagal mengambil data pendaftaran');
                const result = await res.json();
                if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                    setData(result.data[0]);
                } else {
                    throw new Error('Struktur data API tidak valid atau data kosong.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan tidak diketahui.');
                console.error('Gagal mengambil data pendaftaran:', err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const content = data || {
        judul: 'Penerimaan Siswa Baru',
        subjudul: "Assalamualaikum Warohmatullohi Wabarokatuh",
        sapaan: 'Bapak / Ibu Orang Tua / Wali Calon Siswa',
        deskripsi: 'SMK PKP 1 Jakarta Islamic School membuka Penerimaan Peserta Didik Baru. Bergabunglah dan raih masa depan di bidang Desain Komunikasi Visual.',
        teks_tombol: 'Daftar Sekarang',
        link_tombol: '/pendaftaran',
    };
    const linkPath = content.link_tombol === '#' ? '/pendaftaran' : content.link_tombol;

    return (
        <section
            className="relative bg-fixed bg-cover bg-center py-20 -mx-4 sm:-mx-6 lg:-mx-8"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1920&q=80')" }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-700 to-pink-600 opacity-90" />
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                {isLoading ? (
                    <div className="animate-pulse">
                        <div className="h-10 bg-white/30 rounded w-1/2 mx-auto mb-4" />
                        <div className="h-5 bg-white/30 rounded w-1/3 mx-auto mb-6" />
                        <div className="h-12 w-56 bg-white/30 rounded-full mx-auto" />
                    </div>
                ) : (
                    <>
                        {error && <p className="mb-4 text-yellow-300 bg-black/20 p-2 rounded-md">Gagal memuat data. Menampilkan informasi default.</p>}
                        <h2 className="font-heading text-4xl font-bold">{content.judul}</h2>
                        <p className="mt-4 text-lg">{content.subjudul}</p>
                        <p className="mt-2 text-lg">{content.sapaan}</p>
                        <p className="mt-4 max-w-3xl mx-auto">{content.deskripsi}</p>
                        <Link
                            to={linkPath}
                            className="inline-block mt-8 border-2 border-white text-white font-bold py-3 px-12 rounded-full transition-all duration-300 hover:scale-105 hover:bg-white hover:text-primary"
                        >
                            {content.teks_tombol}
                        </Link>
                    </>
                )}
            </div>
        </section>
    );
};

// ─── Kontak Section ───────────────────────────────────────────────────────────
const KontakSection: React.FC = () => {
    const [contact, setContact]     = useState<HubungiKamiAPI | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError]         = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch(KONTAK_API_URL);
                if (!res.ok) throw new Error(`Gagal mengambil data: ${res.statusText}`);
                const result = await res.json();
                if (result.success && result.data) {
                    setContact(result.data);
                } else {
                    throw new Error('Format data API tidak valid atau data kosong.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan saat memuat informasi kontak.');
                console.error('Error fetching contact info:', err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const fallbackContact: HubungiKamiAPI = {
        id: 1, nama_unit: 'SMK PKP 1 Jakarta',
        alamat: 'Jakarta, Indonesia',
        telepon: null, email: 'admin@smkpkp1jakarta.sch.id',
        map_url: '',
        created_at: '', updated_at: '',
    };

    if (isLoading) {
        return (
            <section id="kontak-kami" className="animate-pulse">
                <div className="text-center">
                    <div className="h-8 w-1/3 bg-neutral-200 rounded mx-auto" />
                    <div className="w-24 h-1 bg-neutral-200 my-4 mx-auto" />
                </div>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-neutral-100 rounded-xl shadow-lg p-6 h-60" />
                    ))}
                </div>
            </section>
        );
    }

    const data = error || !contact ? fallbackContact : contact;
    const phones = data.telepon?.split(',').map(p => p.trim()).filter(Boolean) || [];
    const emails = data.email?.split(',').map(e => e.trim()).filter(Boolean) || [];
    const embedUrl = data.alamat
        ? `https://maps.google.com/maps?q=${encodeURIComponent(data.alamat)}&output=embed&z=15`
        : '';

    return (
        <section id="kontak-kami">
            <div className="text-center">
                <h2 className="font-heading text-3xl font-bold text-neutral-900 uppercase tracking-wider">Kontak Kami</h2>
                <div className="w-24 h-1 bg-primary my-4 mx-auto" />
                <p className="max-w-3xl mx-auto text-neutral-600">
                    Kami selalu siap membantu. Silakan hubungi kami atau kunjungi lokasi kami.
                </p>
                {error && <p className="text-red-500 bg-red-50 p-2 rounded-md mt-4 max-w-xl mx-auto">Gagal memuat data kontak. ({error})</p>}
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-neutral-700">
                <div className="bg-white rounded-xl shadow-lg p-6 text-center flex flex-col items-center border-t-4 border-accent">
                    <div className="flex-shrink-0 bg-primary/10 text-primary rounded-full p-3 mb-4">
                        <MapPinIcon className="h-8 w-8" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 uppercase tracking-wider">Alamat</h3>
                    <p className="text-sm flex-grow">{data.alamat}</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 text-center flex flex-col items-center border-t-4 border-accent">
                    <div className="flex-shrink-0 bg-primary/10 text-primary rounded-full p-3 mb-4">
                        <PhoneIcon className="h-8 w-8" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 uppercase tracking-wider">Telepon</h3>
                    <div className="text-sm flex-grow">
                        {phones.length > 0 ? phones.map((p, i) => (
                            <a key={i} href={`tel:${p.replace(/\s/g, '')}`} className="block hover:text-primary transition-colors">{p}</a>
                        )) : <p className="text-neutral-500">-</p>}
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 text-center flex flex-col items-center border-t-4 border-accent">
                    <div className="flex-shrink-0 bg-primary/10 text-primary rounded-full p-3 mb-4">
                        <EnvelopeIcon className="h-8 w-8" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 uppercase tracking-wider">Email</h3>
                    <div className="text-sm flex-grow">
                        {emails.length > 0 ? emails.map((e, i) => (
                            <a key={i} href={`mailto:${e}`} className="block hover:text-primary transition-colors break-all">{e}</a>
                        )) : <p className="text-neutral-500">-</p>}
                    </div>
                </div>
            </div>
            {embedUrl && (
                <div className="mt-12 h-96 rounded-lg shadow-inner max-w-6xl mx-auto overflow-hidden border border-neutral-200">
                    <iframe
                        src={embedUrl}
                        width="100%" height="100%"
                        style={{ border: 0 }}
                        allowFullScreen loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Peta Lokasi"
                    />
                </div>
            )}
        </section>
    );
};

// ─── Media Sosial Section ─────────────────────────────────────────────────────
const MediaSosialSection: React.FC = () => {
    const [socials, setSocials]     = useState<MediaSosialType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const res = await fetch(SOCIAL_API_URL);
                if (!res.ok) throw new Error();
                const result = await res.json();
                if (result.success && Array.isArray(result.data)) setSocials(result.data);
                else throw new Error();
            } catch {
                setSocials([]);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    if (isLoading || socials.length === 0) return null;

    return (
        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 container mx-auto px-4">
            {socials.map(social => {
                const Icon = iconMap[social.icon as keyof typeof iconMap];
                return (
                    <a
                        key={social.id}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 p-6 bg-white rounded-xl shadow-lg border border-neutral-200 hover:border-primary hover:shadow-xl transition-all group"
                    >
                        {Icon && <Icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />}
                        <div>
                            <p className="font-bold text-neutral-800">{social.nama}</p>
                            <p className="text-sm text-neutral-500">{social.username}</p>
                        </div>
                    </a>
                );
            })}
        </section>
    );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const DKV: React.FC = () => (
    <div className="space-y-20">
        <HeroSlider />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
            <TentangSection />
        </div>
        <PendaftaranSection />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
            <KontakSection />
        </div>
        <MediaSosialSection />
    </div>
);

export default DKV;
