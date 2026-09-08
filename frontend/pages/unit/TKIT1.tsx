import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, YouTubeIcon, FacebookIcon, InstagramIcon, MapPinIcon, PhoneIcon, EnvelopeIcon } from '../../components/icons';
import { type VisiMisiTujuanTkit1, type StrukturOrganisasiTkit1, type PenerimaanSiswaBaru, type HubungiKamiAPI, type MediaSosial as MediaSosialType } from '../../types';

// --- Type Definition ---
interface BannerTkit {
    id: number;
    judul: string;
    deskripsi: string;
    gambar: string;
    tombol_text: string;
    tombol_link: string;
    urutan?: number;
}

// --- API Configuration ---
const API_BASE_URL = 'http://localhost:5001';
const BANNER_API_URL = `${API_BASE_URL}/api/banner_tkit/`;
const VISI_MISI_API_URL = `${API_BASE_URL}/api/visi_misi_tujuan_tkit_1/`;
const STRUKTUR_API_URL = `${API_BASE_URL}/api/struktur_organisasi_tkit1/`;
const PENDAFTARAN_API_URL = `${API_BASE_URL}/api/penerimaan-siswa-baru/`;
const KONTAK_API_URL = `${API_BASE_URL}/api/hubungi_kami/1`;
const SOCIAL_API_URL = `${API_BASE_URL}/api/media-sosial/`;
const STORAGE_URL = `${API_BASE_URL}/storage/`;
const STRUKTUR_STORAGE_URL = `${API_BASE_URL}/storage/struktur_organisasi_tkit1/`;


// --- Fallback Data ---
const FALLBACK_SLIDE: BannerTkit = {
    id: 1,
    judul: 'TKIT AL Fidaa',
    deskripsi: 'Mewujudkan generasi Rabbani, yang tangguh, beriman, berilmu dan berakhlak mulia, cerdas, kreatif dan mandiri',
    gambar: 'http://localhost:5001/public/img/logo.png',
    tombol_text: 'Pendaftaran Murid Baru',
    tombol_link: '/pendaftaran'
};

const VisiMisiSkeleton: React.FC = () => (
    <div className="animate-pulse">
        <div className="h-9 w-3/4 bg-neutral-200 rounded mb-6 mx-auto"></div>
        <div className="bg-white rounded-lg shadow-md border p-4 space-y-2">
            <div className="h-12 bg-neutral-200 rounded"></div>
            <div className="h-12 bg-neutral-200 rounded"></div>
            <div className="h-12 bg-neutral-200 rounded"></div>
        </div>
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

const HeroSlider: React.FC = () => {
    const [slides, setSlides] = useState<BannerTkit[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBanner = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(BANNER_API_URL);
                if (!response.ok) {
                    throw new Error('Gagal mengambil data banner dari server.');
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                    const sortedSlides = result.data.sort((a: BannerTkit, b: BannerTkit) => (a.urutan || 0) - (b.urutan || 0));
                    setSlides(sortedSlides);
                } else {
                    throw new Error('Format data API tidak valid atau data kosong.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan tidak diketahui.');
                console.warn("API fetch failed, using fallback data:", err);
                setSlides([FALLBACK_SLIDE]); // Use fallback on error
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
    
    // --- Render Logic ---
    if (isLoading) {
        return (
            <div className="relative h-[60vh] w-full -mt-12 mb-12 bg-neutral-200 animate-pulse" aria-label="Loading hero banner">
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
            <div className="relative h-[60vh] w-full -mt-12 mb-12 bg-neutral-100 flex items-center justify-center">
                <p className="text-neutral-500">Banner tidak tersedia saat ini.</p>
            </div>
        );
    }

    const currentSlide = slides[currentIndex];

    return (
        <div className="relative h-[60vh] -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden text-neutral-800 -mt-12 mb-12">
            <div className="absolute inset-0 w-full h-full bg-white/30 z-10"></div>

            {slides.map((slide, index) => {
                // Smartly handle image URLs: use absolute URLs directly, prepend base URL for relative paths.
                const imageUrl = (slide.gambar && (slide.gambar.startsWith('http://') || slide.gambar.startsWith('https://')))
                    ? slide.gambar
                    : `${STORAGE_URL}banner/${slide.gambar}`;

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
                        <Link to={currentSlide.tombol_link} className="bg-primary hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-full transition-transform duration-300 hover:scale-105 shadow-lg">
                            {currentSlide.tombol_text}
                        </Link>
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
        <div className="bg-white p-2 rounded-lg shadow-lg border border-neutral-200 inline-block">
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

const StrukturOrganisasiSection: React.FC = () => {
    const [struktur, setStruktur] = useState<StrukturOrganisasiTkit1[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStruktur = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(STRUKTUR_API_URL);
                if (!response.ok) {
                    throw new Error(`Gagal mengambil data struktur organisasi (status: ${response.status})`);
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setStruktur(result.data);
                } else {
                    throw new Error('Format data API untuk struktur organisasi tidak valid.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan tidak diketahui.');
                console.error("Fetch error for TKIT1 Struktur Organisasi:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStruktur();
    }, []);

    const getImageUrl = (foto: string) => {
        if (!foto) {
            return ''; // Let the onError handler in PersonCard create an avatar
        }
        if (foto.startsWith('http://') || foto.startsWith('https://')) {
            return foto; // It's already a full URL
        }
        return `${STRUKTUR_STORAGE_URL}${foto}`; // It's a relative path
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-items-center">
                    {Array.from({ length: 4 }).map((_, index) => <PersonCardSkeleton key={index} />)}
                </div>
            );
        }

        if (error) {
            const fallbackStruktur: Person[] = [
                { name: 'Nenah Sunaenah, M.Pd', title: 'KEPALA TKIT AL FIDAA', imgSrc: 'https://picsum.photos/seed/nenah/200/240' },
                { name: 'Sugiarti, S.Pd', title: 'WAKASEK BID. KURIKULUM', imgSrc: 'https://picsum.photos/seed/sugiarti/200/240' },
                { name: 'Dwi Fitrianingsih, ST., S.Pd', title: 'WAKASEK BID. KESISWAAN', imgSrc: 'https://picsum.photos/seed/dwi-fitrianingsih/200/240' },
                { name: 'Umi Sarifah, A.Md', title: 'KOORDINATOR HUMASDA', imgSrc: 'https://picsum.photos/seed/umi/200/240' },
            ];
            return (
                <>
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md" role="alert">
                        <p className="font-bold">Gagal memuat data</p>
                        <p>Menampilkan data statis sebagai fallback. Error: {error}</p>
                    </div>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-items-center">
                        {fallbackStruktur.map(p => <PersonCard key={p.name} {...p} />)}
                    </div>
                </>
            );
        }

        if (struktur.length === 0) {
            return (
                <div className="mt-12 text-center py-10 text-neutral-500">
                    <p>Data struktur organisasi tidak tersedia saat ini.</p>
                </div>
            );
        }

        return (
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-items-center">
                {struktur.map(p => (
                    <PersonCard 
                        key={p.id} 
                        name={p.nama} 
                        title={p.jabatan} 
                        imgSrc={getImageUrl(p.foto)}
                    />
                ))}
            </div>
        );
    };

    return (
        <section id="struktur-organisasi" className="text-center">
            <h2 className="font-heading text-3xl font-bold text-neutral-900 uppercase tracking-wider">Struktur Organisasi</h2>
            <div className="w-24 h-1 bg-primary my-4 mx-auto"></div>
            {renderContent()}
        </section>
    );
};

const PendaftaranSection: React.FC = () => {
    const [data, setData] = useState<PenerimaanSiswaBaru | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(PENDAFTARAN_API_URL);
                if (!response.ok) {
                    throw new Error('Gagal mengambil data pendaftaran');
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                    setData(result.data[0]);
                } else {
                    throw new Error('Struktur data API tidak valid atau data kosong.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan tidak diketahui.');
                console.warn('Gagal mengambil data pendaftaran, akan menggunakan konten statis.', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const renderContent = () => {
        if (isLoading) {
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

        const content = data || {
            judul: "Penerimaan Siswa Baru",
            subjudul: "Assalamualaikum Warohmatullohi Wabarokatuh",
            sapaan: "Ayah dan Bunda/Ummi dan Abi",
            deskripsi: "Kami SMK PKP 1 Jakarta Islamic School membuka Kembali Penerimaan Peserta Didik Baru TP. 2022-2023. Dapatkan program - program unggulan yang berkesinambungan selama pembelajaran di TKIT- SDIT- SMPIT, SMAIT.",
            teks_tombol: "DAFTAR SEKARANG",
            link_tombol: "#"
        };
        
        const linkPath = content.link_tombol === '#' ? '/pendaftaran' : content.link_tombol;

        return (
             <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
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
        <section className="relative bg-fixed bg-cover bg-center py-20 -mx-4 sm:-mx-6 lg:-mx-8" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555532538-d21a23e51717?w=1920&q=80')" }}>
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-green-700 opacity-90"></div>
            {renderContent()}
        </section>
    );
};

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
                console.error('Error fetching contact info:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchContact();
    }, []);
    
    const generateEmbedUrl = (mapUrl: string | undefined): string => {
        if (!mapUrl) return '';
        if (contact?.alamat) {
            return `https://maps.google.com/maps?q=${encodeURIComponent(contact.alamat)}&output=embed&z=15`;
        }
        return `https://maps.google.com/maps?q=${encodeURIComponent(mapUrl)}&output=embed&z=15`;
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
        id: 1, nama_unit: 'TK, SD & SMP',
        alamat: 'Jalan Damai No.08 Rt 005/023, Setiamakar, Kec. Tambun Selatan, Kab. Bekasi Prov. Jawa Barat',
        telepon: '0877 8546 6513, (021)88350046',
        email: 'admin@smkpkp1jakarta.sch.id',
        map_url: 'https://maps.app.goo.gl/AHVqacHAh7CrCTE99',
        created_at: '', updated_at: ''
    };
    
    const data = error || !contact ? fallbackContact : contact;
    const phones = data.telepon?.split(',').map(p => p.trim()).filter(Boolean) || [];
    const emails = data.email?.split(',').map(e => e.trim()).filter(Boolean) || [];
    const embedUrl = generateEmbedUrl(data.map_url);

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
                    throw new Error('Gagal mengambil data media sosial');
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setSocials(result.data);
                } else {
                    throw new Error('Struktur data API tidak valid.');
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
                { id: 1, nama: 'Youtube', username: 'SMK PKP 1 Jakarta TV', link: 'https://youtube.com', icon: 'youtube' },
                { id: 2, nama: 'Facebook', username: 'SMK PKP 1 Jakarta', link: 'https://www.facebook.com/smkpkp1jakarta', icon: 'facebook' },
                { id: 3, nama: 'Instagram', username: '@smkpkp1jakarta', link: 'https://instagram.com', icon: 'instagram' },
            ];
            return (
                <>
                    <div className="container mx-auto px-4">
                        <p className="text-red-600 bg-red-100 p-2 rounded-md mb-8">Gagal memuat data. ({error})</p>
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


const TKIT1: React.FC = () => {
    const [visiMisiData, setVisiMisiData] = useState<VisiMisiTujuanTkit1 | null>(null);
    const [isVisiMisiLoading, setIsVisiMisiLoading] = useState(true);
    const [visiMisiError, setVisiMisiError] = useState<string | null>(null);

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
        
        // Use dynamic data if available, otherwise use static fallback
        const visiContent = hasError ? "“Sekolah Islam Terdepan Dalam Mencetak Generasi Berakhlak Mulia, Unggul, Dan Kompetitif”" : data!.visi;
        const misiContent = hasError ? "a. Menanamkan karakter dasar islam melalui praktek ajaran agama Islam sesuai perkembangan anak.\n     b. Menciptakan kondisi lingkungan bermain dan belajar yang menyenangkan, edukatif, kondusif, dan konstruktif.\n     c. Membekali anak dengan persiapan memasuki jenjang pendidikan tingkat dasar.\n     d. Memberikan pelayanan terbaik bagi siswa dan orang tua." : data!.misi;
        const tujuanContent = hasError ? "Aspek-aspek Pendidikan anak usia dini yang menjadi sasaran dari berbagai aktivitas di SMK PKP 1 Jakarta Islamic School diantaranya:\na.Pengembangan nilai-nilai agama dan moral\nb.Pengembangan sosial emosional\nc.Pengembangan bahasa\nd.Pengembangan kognitif\ne.Pengembangan fisik ( meliputi: motorik kasar, motorik halus, dan Kesehatan fisik )\nf.Pengembangan seni dan kreatifitas" : data!.tujuan;

        return (
            <div>
                <h2 className="font-heading text-3xl font-bold text-primary mb-6 text-left">Visi, Misi, dan Tujuan</h2>
                <div className="bg-white rounded-lg shadow-md border">
                    <AccordionItem title="Visi" defaultOpen>
                        <p className="italic">“{visiContent}”</p>
                    </AccordionItem>
                    <AccordionItem title="Misi">
                        {renderMultilineText(misiContent)}
                    </AccordionItem>
                    <AccordionItem title="Tujuan">
                        {renderMultilineText(tujuanContent)}
                    </AccordionItem>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-20">
            <HeroSlider />
            
            <section id="visi-misi" className="grid md:grid-cols-2 gap-12 items-center">
                {renderVisiMisiContent()}
                <div className="flex justify-center items-center">
                    <img src="http://localhost:5001/public/img/logo.png" alt="Logo SMK PKP 1 Jakarta" className="w-full max-w-sm"/>
                </div>
            </section>

            <StrukturOrganisasiSection />

            <PendaftaranSection />
            
            <KontakSection />

            <MediaSosialSection />

        </div>
    );
};

export default TKIT1;