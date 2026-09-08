import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, YouTubeIcon, FacebookIcon, InstagramIcon, MapPinIcon, PhoneIcon, EnvelopeIcon } from '../../components/icons';
import { type VisiMisiSasaranTkit2, type KegiatanPembelajaranTkit2, type ProgramUnggulanTkit2, type StrukturOrganisasiTkit2, type PenerimaanSiswaBaru, type HubungiKamiAPI, type MediaSosial as MediaSosialType } from '../../types';

// --- Type Definition ---
interface BannerTkit2 {
    id: number;
    judul: string;
    deskripsi: string;
    gambar: string;
    tombol_teks: string;
    tombol_link: string;
}

// --- API Configuration ---
const API_BASE_URL = 'http://localhost:5001';
const BANNER_API_URL = `${API_BASE_URL}/api/banner_tkit_2/`;
const VISI_MISI_API_URL = `${API_BASE_URL}/api/visi_misi_sasaran_tkit2/`;
const KEGIATAN_PEMBELAJARAN_API_URL = `${API_BASE_URL}/api/kegiatan_pembelajaran_tkit2/`;
const PROGRAM_UNGGULAN_API_URL = `${API_BASE_URL}/api/program_unggulan_tkit_2/`;
const STRUKTUR_API_URL = `${API_BASE_URL}/api/struktur_organisasi_tkit2/`;
const PENDAFTARAN_API_URL = `${API_BASE_URL}/api/penerimaan-siswa-baru/`;
const KONTAK_API_URL = `${API_BASE_URL}/api/hubungi_kami/2`;
const SOCIAL_API_URL = `${API_BASE_URL}/api/media-sosial/`;
const STORAGE_URL = `${API_BASE_URL}/storage/banner_tkit_2/`;
const STRUKTUR_STORAGE_URL = `${API_BASE_URL}/storage/struktur_organisasi_tkit2/`;

// --- Fallback Data ---
const FALLBACK_SLIDE: BannerTkit2 = {
    id: 1,
    judul: 'TKIT AL FIDAA 2',
    deskripsi: 'Lembaga Pendidikan anak usia dini yang mengutamakan pendidikan karakter sebagai pondasi dasar yang dikemas dalam nuansa islami sehingga diharapkan seluruh siswa dapat memilki karakter yang mulia, cerdas dan mandiri.',
    gambar: 'http://localhost:5001/public/img/BG2.png',
    tombol_teks: 'Registrasi',
    tombol_link: '/pendaftaran'
};

const HeroSlider: React.FC = () => {
    const [slides, setSlides] = useState<BannerTkit2[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBanner = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(BANNER_API_URL);
                if (!response.ok) {
                    throw new Error('Gagal mengambil data banner dari server.');
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                    setSlides(result.data);
                } else {
                    throw new Error('Format data API tidak valid atau data kosong.');
                }
            } catch (err: any) {
                console.warn("API fetch failed, using fallback data:", err);
                setSlides([FALLBACK_SLIDE]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBanner();
    }, []);

    const nextSlide = useCallback(() => {
        if (slides.length <= 1) return;
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = () => {
        if (slides.length <= 1) return;
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    useEffect(() => {
        if (slides.length > 1) {
            const timer = setTimeout(nextSlide, 7000);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, nextSlide, slides.length]);

    if (isLoading) {
        return (
            <div className="relative h-[60vh] w-full -mx-4 sm:-mx-6 lg:-mx-8 -mt-12 mb-12 bg-neutral-200 animate-pulse" aria-label="Loading hero banner">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex flex-col items-start justify-center h-full">
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-full bg-neutral-300"></div>
                            <div className="h-12 w-64 bg-neutral-300 rounded"></div>
                        </div>
                        <div className="mt-4 h-6 w-96 bg-neutral-300 rounded"></div>
                        <div className="mt-2 h-6 w-80 bg-neutral-300 rounded"></div>
                        <div className="mt-8 h-12 w-48 bg-neutral-300 rounded-full"></div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (slides.length === 0) {
        return (
             <div className="relative h-[60vh] w-full -mx-4 sm:-mx-6 lg:-mx-8 -mt-12 mb-12 bg-neutral-100 flex items-center justify-center">
                <p className="text-neutral-500">Banner tidak tersedia saat ini.</p>
            </div>
        );
    }

    const currentSlide = slides[currentIndex];
    const ButtonComponent: React.ElementType = currentSlide.tombol_link.startsWith('http') ? 'a' : Link;
    const buttonProps = ButtonComponent === 'a' 
        ? { href: currentSlide.tombol_link, target: '_blank', rel: 'noopener noreferrer' }
        : { to: currentSlide.tombol_link };


    return (
        <div className="relative h-[60vh] w-full -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden text-neutral-800 -mt-12 mb-12">
            <div className="absolute inset-0 w-full h-full bg-white/30 z-10"></div>

            {slides.map((slide, index) => {
                const imageUrl = (slide.gambar && (slide.gambar.startsWith('http://') || slide.gambar.startsWith('https://')))
                    ? slide.gambar
                    : `${STORAGE_URL}${slide.gambar}`;

                return (
                    <img
                        key={slide.id}
                        src={imageUrl}
                        alt={slide.judul}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                    />
                );
            })}
            
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full z-20">
                <div className="flex flex-col items-start justify-center h-full">
                    <div className="flex items-center gap-4">
                        <h1 className="font-heading text-4xl md:text-6xl font-bold text-primary" style={{ textShadow: '1px 1px 3px rgba(255,255,255,0.7)' }}>
                            {currentSlide.judul}
                        </h1>
                    </div>
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
            </div>
            
             {slides.length > 1 && (
                <>
                    <button onClick={prevSlide} className="absolute top-1/2 left-4 z-30 -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full transition-colors" aria-label="Previous slide">
                        <ChevronLeftIcon className="h-6 w-6"/>
                    </button>
                    <button onClick={nextSlide} className="absolute top-1/2 right-4 z-30 -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full transition-colors" aria-label="Next slide">
                        <ChevronRightIcon className="h-6 w-6"/>
                    </button>
                </>
            )}
        </div>
    );
}

interface Person {
    name: string;
    title: string;
    imgSrc: string;
}

const PersonCardSkeleton: React.FC = () => (
    <div className="text-center group animate-pulse">
        <div className="bg-neutral-200 p-2 rounded-lg shadow-lg inline-block">
            <div className="w-48 h-56 rounded-md bg-neutral-300"></div>
        </div>
        <div className="mt-4 h-5 w-3/4 bg-neutral-200 rounded mx-auto"></div>
        <div className="mt-2 h-4 w-1/2 bg-neutral-200 rounded mx-auto"></div>
    </div>
);

const PersonCard: React.FC<Person> = ({ name, title, imgSrc }) => (
    <div className="text-center group">
        <div className="bg-orange-400 p-2 rounded-lg shadow-lg border border-neutral-200 inline-block">
            <img 
                src={imgSrc} 
                alt={name} 
                className="w-48 h-56 object-cover object-top rounded-md transition-transform duration-300 group-hover:scale-105" 
                loading="lazy"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; 
                    target.src = `https://ui-avatars.com/api/?name=${name.replace(/\s/g, '+')}&background=1A6DB5&color=fff&size=192`;
                }}
            />
        </div>
        <h3 className="mt-4 font-bold text-neutral-900 text-lg">{name}</h3>
        <p className="text-sm text-neutral-600">{title}</p>
    </div>
);

const ProgramCardSkeleton: React.FC = () => (
    <div className="text-center animate-pulse">
        <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-neutral-200"></div>
        <div className="h-5 w-3/4 bg-neutral-200 rounded mx-auto"></div>
        <div className="h-4 w-1/2 bg-neutral-200 rounded mx-auto mt-2"></div>
    </div>
);

const ProgramCard: React.FC<{ program: ProgramUnggulanTkit2 }> = ({ program }) => (
    <div className="text-center flex flex-col items-center group">
        <img 
            src={program.image} 
            alt={program.nama_program} 
            className="w-24 h-24 rounded-full mx-auto mb-4 bg-white p-2 shadow-lg object-contain transition-transform duration-300 group-hover:scale-110" 
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null; 
                target.src = `http://localhost:5001/public/img/logo.png`;
            }}
        />
        <h3 className="font-bold text-neutral-900 text-lg flex-grow group-hover:text-primary transition-colors">{program.nama_program}</h3>
        {/* Fixed height to ensure alignment even with varying description lengths */}
        <p className="text-sm text-neutral-600 h-12 px-2">{program.deskripsi}</p>
    </div>
);


const AccordionItem: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b last:border-b-0">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex justify-between items-center text-left p-4 hover:bg-neutral-50"
                aria-expanded={isOpen}
            >
                <h3 className="font-bold text-xl text-neutral-800">{title}</h3>
                <ChevronDownIcon className={`h-6 w-6 text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
                <div className="p-4 bg-white text-neutral-600">
                    {children}
                </div>
            </div>
        </div>
    );
};

const VisiMisiSkeleton: React.FC = () => (
    <div className="animate-pulse bg-white p-4 rounded-lg shadow-md border">
        <div className="h-8 w-1/3 bg-neutral-200 rounded mb-6 mx-auto"></div>
        <div className="space-y-4">
            <div className="h-12 bg-neutral-200 rounded"></div>
            <div className="h-12 bg-neutral-200 rounded"></div>
            <div className="h-12 bg-neutral-200 rounded"></div>
        </div>
    </div>
);

const KontakSection: React.FC = () => {
    const [contact, setContact] = useState<HubungiKamiAPI | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContact = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(KONTAK_API_URL);
                if (!response.ok) {
                    throw new Error(`Gagal mengambil data: ${response.statusText}`);
                }
                const result = await response.json();
                if (result.success && result.data) {
                    setContact(result.data);
                } else {
                    throw new Error('Format data API tidak valid atau data kosong.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan saat memuat informasi kontak.');
                console.error('Error fetching contact info for TKIT2:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchContact();
    }, []);

    const generateEmbedUrl = (mapUrl: string | undefined, address: string | undefined): string => {
        if (!address && !mapUrl) return '';
        if (address) {
            return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&z=15`;
        }
        return `https://maps.google.com/maps?q=${encodeURIComponent(mapUrl!)}&output=embed&z=15`;
    };

    if (isLoading) {
        return (
            <section id="kontak-kami" className="animate-pulse">
                <div className="text-center">
                    <div className="h-8 w-1/3 bg-neutral-200 rounded mx-auto"></div>
                    <div className="w-24 h-1 bg-neutral-200 my-4 mx-auto"></div>
                    <div className="h-5 w-3/4 bg-neutral-200 rounded mx-auto max-w-3xl"></div>
                </div>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-neutral-100 rounded-xl shadow-lg p-6 flex flex-col items-center border-t-4 border-neutral-200 h-60">
                            <div className="flex-shrink-0 bg-neutral-200 rounded-full p-3 mb-4 h-16 w-16"></div>
                            <div className="h-5 w-1/3 bg-neutral-200 rounded mb-2"></div>
                            <div className="h-4 w-full bg-neutral-200 rounded"></div>
                        </div>
                    ))}
                </div>
                <div className="mt-12 h-96 bg-neutral-200 rounded-lg shadow-inner max-w-6xl mx-auto"></div>
            </section>
        );
    }

    const fallbackContact: HubungiKamiAPI = {
        id: 2,
        nama_unit: 'SMK PKP 1 Jakarta Islamic School',
        alamat: 'Jl. Perum Bumi Sentosa Asri Bl. 003 / Rw. 015 Desa, Jejalenjaya, Kec. Tambun Utara, Kab. Bekasi - Jawa Barat 17510',
        telepon: '021-8839005',
        email: 'admin@smkpkp1jakarta.sch.id',
        map_url: 'https://maps.app.goo.gl/nYJq7YYwcLVT46Nf9',
        created_at: '',
        updated_at: ''
    };
    
    const data = error || !contact ? fallbackContact : contact;
    const phones = data.telepon?.split(',').map(p => p.trim()).filter(Boolean) || [];
    const emails = data.email?.split(',').map(e => e.trim()).filter(Boolean) || [];
    const embedUrl = generateEmbedUrl(data.map_url, data.alamat);

    return (
        <section id="kontak-kami">
            <div className="text-center">
                <h2 className="font-heading text-3xl font-bold text-neutral-900 uppercase tracking-wider">Kontak Kami</h2>
                <div className="w-24 h-1 bg-primary my-4 mx-auto"></div>
                <p className="max-w-3xl mx-auto text-neutral-600">
                    Kami selalu siap membantu. Silakan hubungi kami melalui informasi di bawah ini atau kunjungi lokasi kami.
                </p>
                {error && <p className="text-red-500 bg-red-50 p-2 rounded-md mt-4 max-w-xl mx-auto">Gagal memuat data kontak. Menampilkan informasi default. ({error})</p>}
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
                        {phones.length > 0 ? phones.map((phone, i) => (
                            <p key={i}><a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-primary">{phone}</a></p>
                        )) : <p>-</p>}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 text-center flex flex-col items-center border-t-4 border-accent">
                    <div className="flex-shrink-0 bg-primary/10 text-primary rounded-full p-3 mb-4">
                        <EnvelopeIcon className="h-8 w-8" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 uppercase tracking-wider">Email</h3>
                    <div className="text-sm flex-grow">
                        {emails.length > 0 ? emails.map((email, i) => (
                            <p key={i}><a href={`mailto:${email}`} className="hover:text-primary break-all">{email}</a></p>
                        )) : <p>-</p>}
                    </div>
                </div>
            </div>

            <div className="mt-12 h-96 bg-neutral-200 rounded-lg shadow-inner max-w-6xl mx-auto">
                 {embedUrl ? (
                    <iframe
                        src={embedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Peta Lokasi ${data.nama_unit}`}
                        className="rounded-lg shadow-md"
                    ></iframe>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-neutral-500">
                        <p>Peta tidak dapat ditampilkan.</p>
                        <a href={data.map_url} target="_blank" rel="noopener noreferrer" className="mt-2 text-primary hover:underline">
                            Buka di Google Maps
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
};

const iconMap = {
    youtube: YouTubeIcon,
    facebook: FacebookIcon,
    instagram: InstagramIcon,
};

const MediaSosialSection: React.FC = () => {
    const [socials, setSocials] = useState<MediaSosialType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSocials = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(SOCIAL_API_URL);
                if (!response.ok) {
                    throw new Error('Gagal mengambil data media sosial dari server.');
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setSocials(result.data);
                } else {
                    throw new Error('Format data API tidak valid atau data kosong.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan tidak diketahui.');
                console.error("Fetch error for social media:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSocials();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 container mx-auto px-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="text-center animate-pulse">
                            <div className="w-20 h-20 bg-neutral-200 rounded-full mx-auto mb-4"></div>
                            <div className="h-6 w-1/2 bg-neutral-200 mx-auto rounded mb-2"></div>
                            <div className="h-4 w-3/4 bg-neutral-200 mx-auto rounded"></div>
                        </div>
                    ))}
                </div>
            );
        }

        if (error) {
            const fallbackSocials: MediaSosialType[] = [
                { id: 1, nama: 'YouTube', username: 'SMK PKP 1 Jakarta TV', link: 'https://youtube.com', icon: 'youtube' },
                { id: 2, nama: 'Facebook', username: 'SMK PKP 1 Jakarta', link: 'https://www.facebook.com/smkpkp1jakarta', icon: 'facebook' },
                { id: 3, nama: 'Instagram', username: '@smkpkp1jakarta', link: 'https://instagram.com', icon: 'instagram' },
            ];
            return (
                <>
                    <div className="container mx-auto px-4">
                        <p className="text-red-600 bg-red-100 p-2 rounded-md mb-8 max-w-md mx-auto">Gagal memuat data. Menampilkan informasi default. ({error})</p>
                    </div>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 container mx-auto px-4">
                        {fallbackSocials.map(social => {
                            const Icon = iconMap[social.icon];
                            return (
                                <a key={social.id} href={social.link} target="_blank" rel="noopener noreferrer" className="block group">
                                    <div className="flex items-center justify-center h-20 w-20 rounded-full bg-white shadow-lg mx-auto mb-4 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <Icon className="h-10 w-10"/>
                                    </div>
                                    <h3 className="font-bold text-xl">{social.nama}</h3>
                                    <p className="text-neutral-600 group-hover:text-primary">{social.username}</p>
                                </a>
                            )
                        })}
                    </div>
                </>
            );
        }
        
        if (socials.length === 0) {
            return (
                <div className="mt-12 text-center text-neutral-500">
                    <p>Informasi media sosial tidak tersedia.</p>
                </div>
            );
        }

        return (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 container mx-auto px-4">
                {socials.map(social => {
                    const Icon = iconMap[social.icon];
                    return (
                        <a key={social.id} href={social.link} target="_blank" rel="noopener noreferrer" className="block group">
                            <div className="flex items-center justify-center h-20 w-20 rounded-full bg-white shadow-lg mx-auto mb-4 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <Icon className="h-10 w-10"/>
                            </div>
                            <h3 className="font-bold text-xl">{social.nama}</h3>
                            <p className="text-neutral-600 group-hover:text-primary">{social.username}</p>
                        </a>
                    );
                })}
            </div>
        );
    };

    return (
        <section id="media-sosial" className="text-center bg-neutral-50 -mx-4 sm:-mx-6 lg:-mx-8 py-20">
            <h2 className="font-heading text-3xl font-bold text-neutral-900 uppercase tracking-wider">Media Sosial</h2>
            <div className="w-24 h-1 bg-primary my-4 mx-auto"></div>
            {renderContent()}
        </section>
    );
};

const TKIT2: React.FC = () => {
    const [visiMisiData, setVisiMisiData] = useState<VisiMisiSasaranTkit2 | null>(null);
    const [isVisiMisiLoading, setIsVisiMisiLoading] = useState(true);
    const [visiMisiError, setVisiMisiError] = useState<string | null>(null);

    const [kegiatanData, setKegiatanData] = useState<KegiatanPembelajaranTkit2 | null>(null);
    const [isKegiatanLoading, setIsKegiatanLoading] = useState(true);
    const [kegiatanError, setKegiatanError] = useState<string | null>(null);

    const [programUnggulan, setProgramUnggulan] = useState<ProgramUnggulanTkit2[]>([]);
    const [isProgramLoading, setIsProgramLoading] = useState(true);
    const [programError, setProgramError] = useState<string | null>(null);
    
    const [struktur, setStruktur] = useState<StrukturOrganisasiTkit2[]>([]);
    const [isStrukturLoading, setIsStrukturLoading] = useState(true);
    const [strukturError, setStrukturError] = useState<string | null>(null);

    const [pendaftaranData, setPendaftaranData] = useState<PenerimaanSiswaBaru | null>(null);
    const [isPendaftaranLoading, setIsPendaftaranLoading] = useState(true);
    const [pendaftaranError, setPendaftaranError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVisiMisi = async () => {
            setIsVisiMisiLoading(true);
            setVisiMisiError(null);
            try {
                const response = await fetch(VISI_MISI_API_URL);
                if (!response.ok) throw new Error('Gagal mengambil data visi & misi.');
                
                const result = await response.json();
                if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                    setVisiMisiData(result.data[0]);
                } else {
                    throw new Error('Format data API tidak valid.');
                }
            } catch (err: any) {
                setVisiMisiError(err.message || 'Terjadi kesalahan.');
            } finally {
                setIsVisiMisiLoading(false);
            }
        };
        fetchVisiMisi();
    }, []);

    useEffect(() => {
        const fetchKegiatan = async () => {
            setIsKegiatanLoading(true);
            setKegiatanError(null);
            try {
                const response = await fetch(KEGIATAN_PEMBELAJARAN_API_URL);
                if (!response.ok) {
                    throw new Error('Gagal mengambil data kegiatan pembelajaran.');
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                    setKegiatanData(result.data[0]);
                } else {
                    throw new Error('Format data API tidak valid atau data kosong.');
                }
            } catch (err: any) {
                setKegiatanError(err.message || 'Terjadi kesalahan.');
                console.error("Fetch error for Kegiatan Pembelajaran TKIT2:", err);
            } finally {
                setIsKegiatanLoading(false);
            }
        };
        fetchKegiatan();
    }, []);

    useEffect(() => {
        const fetchProgram = async () => {
            setIsProgramLoading(true);
            setProgramError(null);
            try {
                const response = await fetch(PROGRAM_UNGGULAN_API_URL);
                if (!response.ok) {
                    throw new Error('Gagal mengambil data program unggulan.');
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    const sortedData = result.data.sort((a: ProgramUnggulanTkit2, b: ProgramUnggulanTkit2) => a.id - b.id);
                    setProgramUnggulan(sortedData);
                } else {
                    throw new Error('Format data API program unggulan tidak valid.');
                }
            } catch (err: any) {
                setProgramError(err.message || 'Terjadi kesalahan.');
                console.error("Fetch error for Program Unggulan TKIT2:", err);
            } finally {
                setIsProgramLoading(false);
            }
        };
        fetchProgram();
    }, []);
    
    useEffect(() => {
        const fetchStruktur = async () => {
            setIsStrukturLoading(true);
            setStrukturError(null);
            try {
                const response = await fetch(STRUKTUR_API_URL);
                if (!response.ok) {
                    throw new Error('Gagal mengambil data struktur organisasi.');
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    const sortedData = result.data.sort((a: StrukturOrganisasiTkit2, b: StrukturOrganisasiTkit2) => a.id - b.id);
                    setStruktur(sortedData);
                } else {
                    throw new Error('Format data API struktur organisasi tidak valid.');
                }
            } catch (err: any) {
                setStrukturError(err.message || 'Terjadi kesalahan.');
                console.error("Fetch error for Struktur Organisasi TKIT2:", err);
            } finally {
                setIsStrukturLoading(false);
            }
        };
        fetchStruktur();
    }, []);

    useEffect(() => {
        const fetchPendaftaran = async () => {
            setIsPendaftaranLoading(true);
            setPendaftaranError(null);
            try {
                const response = await fetch(PENDAFTARAN_API_URL);
                if (!response.ok) {
                    throw new Error('Gagal mengambil data pendaftaran.');
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                    setPendaftaranData(result.data[0]);
                } else {
                    throw new Error('Format data API pendaftaran tidak valid.');
                }
            } catch (err: any) {
                setPendaftaranError(err.message || 'Terjadi kesalahan.');
                console.error("Fetch error for Pendaftaran TKIT2:", err);
            } finally {
                setIsPendaftaranLoading(false);
            }
        };
        fetchPendaftaran();
    }, []);

    const getImageUrl = (foto: string) => {
        if (!foto) {
            return ''; // Let the onError handler in PersonCard create an avatar
        }
        if (foto.startsWith('http://') || foto.startsWith('https://')) {
            return foto;
        }
        return `${STRUKTUR_STORAGE_URL}${foto}`;
    };

    const renderMultilineText = (text: string) => {
        return (text || "").split('\n').filter(line => line.trim()).map((line, index) => (
            <p key={index} className="mb-2 last:mb-0">{line.trim()}</p>
        ));
    };

    const renderVisiMisiContent = () => {
        if (isVisiMisiLoading) {
            return <VisiMisiSkeleton />;
        }
        
        const data = visiMisiData;
        const hasError = !!visiMisiError || !data;
        
        const visiContent = hasError ? "Mewujudkan generasi Islam yang tangguh, cerdas, mandiri, kreatif, dan inovatif serta memiliki akhlak yang mulia" : data!.visi;
        const misiContent = hasError ? "a. Menanamkan karakter dasar islam melalui praktek ajaran agama Islam sesuai perkembangan anak\n\nb. Menciptakan kondisi lingkungan bermain dan belajar yang menyenangkan, edukatif, kondusif, dan konstruktif\n\nc. Membekali anak dengan persiapan memasuki jenjang pendidikan tingkat dasar\n\nd. Memberikan pelayanan terbaik bagi siswa dan orang tua" : data!.misi;
        const sasaranContent = hasError ? "Aspek-aspek Pendidikan anak usia dini yang menjadi sasaran dari berbagai aktivitas di SMK PKP 1 Jakarta Islamic School diantaranya:\n\na. Pengembangan nilai-nilai agama dan moral\nb. Pengembangan sosial emosional\nc. Pengembangan bahasa\nd. Pengembangan kognitif\ne. Pengembangan fisik ( meliputi: motorik kasar, motorik halus, dan Kesehatan fisik )\nf. Pengembangan seni dan kreatifitas" : data!.sasaran;

        return (
            <div>
                <h2 className="font-heading text-3xl font-bold text-primary mb-6 text-left">Visi, Misi, dan Sasaran</h2>
                <div className="bg-white rounded-lg shadow-md border">
                    <AccordionItem title="Visi">
                        <p className="italic">“{visiContent}”</p>
                    </AccordionItem>
                    <AccordionItem title="Misi">
                        {renderMultilineText(misiContent)}
                    </AccordionItem>
                    <AccordionItem title="Sasaran">
                        {renderMultilineText(sasaranContent)}
                    </AccordionItem>
                </div>
            </div>
        );
    };
    
    const renderKegiatanPembelajaranContent = () => {
        if (isKegiatanLoading) {
            return (
                <div className="mt-8 max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg animate-pulse">
                    <div className="h-7 w-1/3 bg-neutral-200 rounded mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-5 w-full bg-neutral-200 rounded"></div>
                        <div className="h-5 w-3/4 bg-neutral-200 rounded mt-4"></div>
                        <div className="h-5 w-3/4 bg-neutral-200 rounded"></div>
                        <div className="h-5 w-3/4 bg-neutral-200 rounded"></div>
                        <div className="h-5 w-full bg-neutral-200 rounded mt-4"></div>
                    </div>
                </div>
            );
        }
    
        const content = kegiatanData || {
            id: 1,
            judul: "TKIT AL FIDAA 2",
            deskripsi: "Kegiatan pembelajaran di TKIT AL FIDAA 2 memiliki tiga kelompok belajar yaitu :",
            kelompok: "a. Kelompok Bermain (usia 3-4 tahun)\n\rb. TK A (usia 4-5 tahun)\n\rc. TK B (usia 5-6 tahun)\n\r\n\nDengan menggunakan model pembelajaran sentra dan memprioritaskan nilai karakter dan pembiasaan di kegiatan sehari-hari."
        };
    
        const parts = (content.kelompok || "").split(/\n\s*\n/);
        const listItemsText = parts[0] || '';
        const finalParagraph = parts.slice(1).join('\n').trim();
        const listItems = listItemsText.split('\n').map(l => l.trim()).filter(Boolean);
    
        return (
            <>
                {kegiatanError && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md" role="alert">
                        <p className="font-bold">Gagal memuat data</p>
                        <p>Menampilkan konten statis. Error: {kegiatanError}</p>
                    </div>
                )}
                <div className="mt-8 max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg text-left text-neutral-700">
                    <h3 className="font-bold text-xl text-primary mb-4">{content.judul}</h3>
                    <div className="space-y-2">
                        <p>{content.deskripsi}</p>
                        {listItems.map((item, idx) => (
                            <p key={idx}>{item}</p>
                        ))}
                        {finalParagraph && <p className="mt-4">{finalParagraph}</p>}
                    </div>
                </div>
            </>
        );
    };

    const renderProgramUnggulanContent = () => {
        if (isProgramLoading) {
            return (
                <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
                    {Array.from({ length: 5 }).map((_, index) => <ProgramCardSkeleton key={index} />)}
                </div>
            );
        }

        if (programError) {
            return (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-6 rounded-md max-w-4xl mx-auto text-left" role="alert">
                    <p className="font-bold">Gagal memuat data program unggulan</p>
                    <p>Terjadi kesalahan saat mengambil data dari server. Silakan coba lagi nanti. Error: {programError}</p>
                </div>
            );
        }

        if (programUnggulan.length === 0) {
            return (
                <div className="mt-12 text-center py-10 text-neutral-500">
                    <p>Informasi program unggulan belum tersedia.</p>
                </div>
            );
        }

        return (
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-stretch">
                {programUnggulan.map(p => (
                    <ProgramCard key={p.id} program={p} />
                ))}
            </div>
        );
    };

    const renderPendaftaranSection = () => {
        if (isPendaftaranLoading) {
            return (
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white animate-pulse">
                    <div className="h-10 bg-white/30 rounded w-1/2 mx-auto mb-4"></div>
                    <div className="h-5 bg-white/30 rounded w-1/3 mx-auto mb-2"></div>
                    <div className="h-5 bg-white/30 rounded w-1/4 mx-auto mb-4"></div>
                    <div className="space-y-2 max-w-3xl mx-auto">
                        <div className="h-4 bg-white/30 rounded w-full"></div>
                        <div className="h-4 bg-white/30 rounded w-full"></div>
                        <div className="h-4 bg-white/30 rounded w-5/6 mx-auto"></div>
                    </div>
                    <div className="h-12 w-56 bg-white/30 rounded-full mt-8 mx-auto"></div>
                </div>
            );
        }

        const content = pendaftaranData || {
            judul: "Penerimaan Siswa Baru",
            subjudul: "Assalamualaikum Warohmatullohi Wabarokatuh",
            sapaan: "Ayah dan Bunda/Ummi dan Abi???",
            deskripsi: "Kami SMK PKP 1 Jakarta Islamic School membuka Kembali Penerimaan Peserta Didik Baru. Dapatkan program - program unggulan yang berkesinambungan selama pembelajaran di sini.",
            teks_tombol: "DAFTAR SEKARANG",
            link_tombol: "/pendaftaran"
        };
        
        const linkPath = content.link_tombol === '#' ? '/pendaftaran' : content.link_tombol;

        return (
             <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                {pendaftaranError && (
                     <p className="mb-4 text-yellow-300 bg-black/20 p-2 rounded-md">Gagal memuat data. Menampilkan informasi default.</p>
                )}
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
            </div>
        );
    };
    
    return (
        <div className="space-y-24">
            <HeroSlider />
            
            <section id="visi-misi" className="grid md:grid-cols-2 gap-12 items-center">
                {renderVisiMisiContent()}
                <div className="flex justify-center items-center">
                    <img src="http://localhost:5001/public/img/logo.png" alt="Logo SMK PKP 1 Jakarta" className="w-full max-w-sm"/>
                </div>
            </section>
            
            <section id="kegiatan-pembelajaran" className="bg-neutral-50 -mx-4 sm:-mx-6 lg:-mx-8 py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="font-heading text-3xl font-bold text-neutral-900 uppercase tracking-wider">Kegiatan Pembelajaran</h2>
                        <div className="w-24 h-1 bg-primary my-4 mx-auto"></div>
                    </div>
                    {renderKegiatanPembelajaranContent()}
                </div>
            </section>

            <section id="program-unggulan" className="text-center">
                <h2 className="font-heading text-3xl font-bold text-neutral-900 uppercase tracking-wider">Program Unggulan</h2>
                <div className="w-24 h-1 bg-primary my-4 mx-auto"></div>
                {renderProgramUnggulanContent()}
            </section>

            <section id="struktur-organisasi" className="text-center">
                <h2 className="font-heading text-3xl font-bold text-neutral-900 uppercase tracking-wider">Struktur Organisasi</h2>
                <div className="w-24 h-1 bg-primary my-4 mx-auto"></div>
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 justify-items-center">
                     {isStrukturLoading ? (
                        Array.from({ length: 4 }).map((_, index) => <PersonCardSkeleton key={index} />)
                    ) : strukturError ? (
                        (() => {
                            const fallbackStruktur: Person[] = [
                                { name: 'Is Nuryati, S.Pd.I', title: 'KEPALA TKIT AL FIDAA 2', imgSrc: 'https://picsum.photos/seed/is-nuryati/200/240' },
                                { name: 'Sri Ayu Rahmadani', title: 'STAFF TU', imgSrc: 'https://picsum.photos/seed/sri-ayu/200/240' },
                                { name: 'Hermin Dwi Narni,S.Pd', title: 'GURU', imgSrc: 'https://picsum.photos/seed/hermin-dwi/200/240' },
                                { name: 'Intan Meidyawati,S.Pd', title: 'GURU', imgSrc: 'https://picsum.photos/seed/intan-meidyawati/200/240' },
                            ];
                            return (
                                <>
                                    <div className="col-span-full bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md" role="alert">
                                        <p className="font-bold">Gagal memuat data</p>
                                        <p>Menampilkan data statis. Error: {strukturError}</p>
                                    </div>
                                    {fallbackStruktur.map(p => <PersonCard key={p.name} {...p} />)}
                                </>
                            );
                        })()
                    ) : struktur.length > 0 ? (
                        struktur.map(p => (
                            <PersonCard 
                                key={p.id} 
                                name={p.nama} 
                                title={p.jabatan} 
                                imgSrc={getImageUrl(p.foto)}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 text-neutral-500">
                            <p>Data struktur organisasi tidak tersedia saat ini.</p>
                        </div>
                    )}
                </div>
            </section>

             <section className="relative bg-fixed bg-cover bg-center py-20 -mx-4 sm:-mx-6 lg:-mx-8" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555532538-d21a23e51717?w=1920&q=80')" }}>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-green-700 opacity-90"></div>
                {renderPendaftaranSection()}
            </section>
            
            <KontakSection />

            <MediaSosialSection />

        </div>
    );
};

export default TKIT2;