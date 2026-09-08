import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, YouTubeIcon, FacebookIcon, InstagramIcon, MapPinIcon, PhoneIcon, EnvelopeIcon } from '../../components/icons';
import { type VisiMisiSasaranSmait, type KurikulumSmait, type ProgramUnggulanSmait, type StafSmait, type PrestasiSmait, type PenerimaanSiswaBaru, type HubungiKamiAPI, type MediaSosial as MediaSosialType } from '../../types';

// --- Type Definition ---
interface BannerSmait {
    id: number;
    judul: string;
    deskripsi: string;
    gambar: string;
    tombol_teks: string;
    tombol_link: string;
}

// --- API Configuration ---
const API_BASE_URL = 'http://localhost:5001';
const API_URL = `${API_BASE_URL}/api/banner_smait/`;
const VISI_MISI_API_URL = `${API_BASE_URL}/api/visi-misi-sasaran-smait/`;
const KURIKULUM_API_URL = `${API_BASE_URL}/api/kurikulum-smait/`;
const PROGRAM_UNGGULAN_API_URL = `${API_BASE_URL}/api/program-unggulan-smait/`;
const STAF_API_URL = `${API_BASE_URL}/api/staf-smait/`;
const PRESTASI_API_URL = `${API_BASE_URL}/api/prestasi-smait/`;
const PENDAFTARAN_API_URL = `${API_BASE_URL}/api/penerimaan-siswa-baru/`;
const KONTAK_API_URL = `${API_BASE_URL}/api/hubungi_kami/3`;
const SOCIAL_API_URL = `${API_BASE_URL}/api/media-sosial/`;
const STORAGE_URL = `${API_BASE_URL}/storage/banner_smait/`;
const STAF_STORAGE_URL = `${API_BASE_URL}/storage/staf_smait/`;

// --- Fallback Data ---
const FALLBACK_SLIDE: BannerSmait = {
    id: 1,
    judul: 'SMK PKP 1 Jakarta Islamic School',
    deskripsi: 'Terdepan dalam membentuk insan taqwa yang cerdas, cendikia, berakhlaq mulia, berjiwa leadership dan entrepreneurship',
    gambar: 'http://localhost:5001/public/img/BG5.png',
    tombol_teks: 'Pendaftaran Siswa Baru',
    tombol_link: '/pendaftaran'
};

const HeroSlider: React.FC = () => {
    const [slides, setSlides] = useState<BannerSmait[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBanner = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(API_URL);
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
                        <div className="h-12 w-96 bg-neutral-300 rounded mb-4"></div>
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
                    <button onClick={prevSlide} className="absolute top-1/2 left-4 z-30 -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full transition-colors"><ChevronLeftIcon className="h-6 w-6"/></button>
                    <button onClick={nextSlide} className="absolute top-1/2 right-4 z-30 -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full transition-colors"><ChevronRightIcon className="h-6 w-6"/></button>
                </>
            )}
        </div>
    );
};

const AccordionItem: React.FC<{ title: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void; }> = ({ title, children, isOpen, onToggle }) => {
    return (
        <div className="border-b last:border-b-0">
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center text-left p-4 hover:bg-neutral-50"
                aria-expanded={isOpen}
            >
                <h3 className="font-bold text-xl text-neutral-800">{title}</h3>
                <ChevronDownIcon className={`h-6 w-6 text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="p-4 pt-0 bg-white text-neutral-600 prose max-w-none">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

const VisiMisiSection: React.FC = () => {
    const [data, setData] = useState<VisiMisiSasaranSmait[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openAccordion, setOpenAccordion] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(VISI_MISI_API_URL);
                if (!response.ok) {
                    throw new Error('Gagal mengambil data dari server.');
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setData(result.data);
                } else {
                    throw new Error('Format data API tidak valid.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan tidak diketahui.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const renderMultilineText = (text: string | undefined) => {
        if (!text) return null;
        return text.split('\n').filter(line => line.trim()).map((line, index) => {
            const cleanedLine = line.trim().replace(/^[a-zA-Z]\.\s*/, '');
            return <p key={index} className="mb-2 last:mb-0">{cleanedLine}</p>;
        });
    };

    if (isLoading) {
        return (
            <div className="grid md:grid-cols-2 gap-12 items-center animate-pulse">
                <div>
                    <div className="h-9 w-3/4 bg-neutral-200 rounded mb-6"></div>
                    <div className="bg-white rounded-lg shadow-md border p-4 space-y-2">
                        <div className="h-12 bg-neutral-200 rounded"></div>
                        <div className="h-12 bg-neutral-200 rounded"></div>
                        <div className="h-12 bg-neutral-200 rounded"></div>
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <div className="w-full max-w-sm h-96 bg-neutral-200 rounded-lg"></div>
                </div>
            </div>
        );
    }
    
    const hasError = !!error || data.length === 0;
    const visi = data.find(d => d.tipe === 'Visi') || { deskripsi: "Terdepan dalam membentuk insan taqwa yang cerdas, cendikia, berakhlaq mulia, berjiwa leadership, entrepreneurship." };
    const misi = data.find(d => d.tipe === 'Misi') || { deskripsi: "Konten misi akan ditampilkan di sini." };
    const sasaran = data.find(d => d.tipe === 'Sasaran') || { deskripsi: "Konten sasaran akan ditampilkan di sini." };

    const accordionItems = [
        { tipe: 'Visi', deskripsi: visi.deskripsi },
        { tipe: 'Misi', deskripsi: misi.deskripsi },
        { tipe: 'Sasaran', deskripsi: sasaran.deskripsi }
    ];

    return (
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="font-heading text-3xl font-bold text-primary mb-6">Visi, Misi, dan Sasaran</h2>
                {hasError && <p className="text-red-500 bg-red-50 p-3 mb-4 rounded-md">Gagal memuat data. Menampilkan konten default.</p>}
                <div className="bg-white rounded-lg shadow-md border">
                    {accordionItems.map(item => (
                        <AccordionItem
                            key={item.tipe}
                            title={item.tipe}
                            isOpen={openAccordion === item.tipe}
                            onToggle={() => setOpenAccordion(openAccordion === item.tipe ? '' : item.tipe)}
                        >
                            {item.tipe === 'Visi' 
                                ? <p className="italic">“{item.deskripsi}”</p> 
                                : renderMultilineText(item.deskripsi)
                            }
                        </AccordionItem>
                    ))}
                </div>
            </div>
            <div className="flex justify-center items-center">
                <img src="http://localhost:5001/public/img/logo.png" alt="Logo SMK PKP 1 Jakarta" className="w-full max-w-sm"/>
            </div>
        </div>
    );
};

const KurikulumSection: React.FC = () => {
    const [data, setData] = useState<KurikulumSmait[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(KURIKULUM_API_URL);
                if (!response.ok) {
                    throw new Error('Gagal mengambil data kurikulum dari server.');
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setData(result.data);
                } else {
                    throw new Error('Format data API kurikulum tidak valid.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan tidak diketahui.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const parseDescriptionToList = (description: string): string[] => {
        return (description || "").split(/[\n\r]|\s{2,}/)
            .map(item => item.trim())
            .filter(Boolean);
    };

    if (isLoading) {
        return (
            <section id="kurikulum" className="text-center animate-pulse">
                <div className="h-8 w-1/3 bg-neutral-200 rounded mx-auto"></div>
                <div className="w-24 h-1 bg-neutral-200 my-4 mx-auto"></div>
                <div className="mt-8 max-w-3xl mx-auto p-6 bg-neutral-100 rounded-lg">
                    <div className="h-4 bg-neutral-200 rounded w-full"></div>
                </div>
                <div className="mt-8 grid md:grid-cols-2 gap-8">
                    <div className="bg-neutral-100 p-6 rounded-lg h-64"></div>
                    <div className="bg-neutral-100 p-6 rounded-lg h-64"></div>
                </div>
            </section>
        );
    }
    
    const intro = data.find(d => d.kategori.toLowerCase().includes("kurikulum smait"));
    const ekstrakurikuler = data.find(d => d.kategori.toLowerCase().includes("ekstrakurikuler"));
    const others = data.filter(d => d.id !== intro?.id && d.id !== ekstrakurikuler?.id);

    return (
        <section id="kurikulum" className="text-center">
            <h2 className="font-heading text-3xl font-bold text-neutral-900 uppercase tracking-wider">Kurikulum</h2>
            <div className="w-24 h-1 bg-primary my-4 mx-auto"></div>

            {error && <p className="text-red-500 bg-red-50 p-3 mb-4 rounded-md max-w-3xl mx-auto">Gagal memuat data. ({error})</p>}
            
            <div className="mt-8 max-w-3xl mx-auto p-6 bg-neutral-50 rounded-lg border-t-4 border-accent text-left">
                <p className="text-neutral-700 text-center">{intro?.deskripsi || "Informasi kurikulum belum tersedia."}</p>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-8">
                {others.map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-lg shadow-md text-left">
                        <h3 className="font-bold text-xl text-primary mb-4">{item.kategori}</h3>
                        <ul className="space-y-2">
                            {parseDescriptionToList(item.deskripsi).map((detail, index) => (
                                <li key={index} className="flex items-start text-neutral-600">
                                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                    <span>{detail}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {ekstrakurikuler && (
                 <div className="mt-8 bg-white p-6 rounded-lg shadow-md text-left">
                    <h3 className="font-bold text-xl text-primary mb-4">{ekstrakurikuler.kategori}</h3>
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {parseDescriptionToList(ekstrakurikuler.deskripsi).map((detail, index) => (
                            <div key={index} className="bg-neutral-50 p-3 rounded-md text-neutral-700 text-center font-medium">
                                {detail}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

const Card: React.FC<{ program: ProgramUnggulanSmait }> = ({ program }) => (
    <div className="text-center p-4 group transition-transform duration-300 hover:-translate-y-2">
        <div className="w-28 h-28 rounded-full mx-auto mb-4 bg-white p-2 shadow-lg flex items-center justify-center transition-shadow group-hover:shadow-xl">
            <img
                src={program.image}
                alt={program.nama_program}
                className="w-full h-full object-contain"
                loading="lazy"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'http://localhost:5001/public/img/logo.png';
                }}
            />
        </div>
        <h3 className="font-bold text-neutral-900 text-base min-h-[40px] flex items-center justify-center group-hover:text-primary transition-colors">{program.nama_program}</h3>
        <div className="w-12 h-0.5 bg-accent mx-auto mt-2"></div>
    </div>
);

const ProgramCardSkeleton: React.FC = () => (
    <div className="text-center p-4 animate-pulse">
        <div className="w-28 h-28 rounded-full mx-auto mb-4 bg-neutral-200"></div>
        <div className="h-5 w-3/4 bg-neutral-200 rounded mx-auto"></div>
        <div className="w-12 h-0.5 bg-neutral-200 mx-auto mt-2"></div>
    </div>
);

const ProgramUnggulanSection: React.FC = () => {
    const [programs, setPrograms] = useState<ProgramUnggulanSmait[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(PROGRAM_UNGGULAN_API_URL);
                if (!response.ok) {
                    throw new Error('Gagal mengambil data program unggulan.');
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    const sortedData = result.data.sort((a: ProgramUnggulanSmait, b: ProgramUnggulanSmait) => a.id - b.id);
                    setPrograms(sortedData);
                } else {
                    throw new Error('Format data API tidak valid.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan tidak diketahui.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-y-8">
                    {Array.from({ length: 6 }).map((_, index) => <ProgramCardSkeleton key={index} />)}
                </div>
            );
        }

        if (error) {
            return (
                <div className="mt-12 text-center p-6 bg-red-50 text-red-700 rounded-lg">
                    <h3 className="font-bold">Terjadi Kesalahan</h3>
                    <p>{error}</p>
                </div>
            );
        }

        if (programs.length === 0) {
            return <p className="mt-12 text-neutral-500">Saat ini belum ada program unggulan yang dapat ditampilkan.</p>;
        }

        return (
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-y-8">
                {programs.map(program => <Card key={program.id} program={program} />)}
            </div>
        );
    };

    return (
        <section id="program-unggulan" className="text-center bg-neutral-50 -mx-4 sm:-mx-6 lg:-mx-8 py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="font-heading text-3xl font-bold text-neutral-900 uppercase tracking-wider">Program Unggulan</h2>
                <div className="w-24 h-1 bg-primary my-4 mx-auto"></div>
                {renderContent()}
            </div>
        </section>
    );
};

const PersonCardSkeleton: React.FC = () => (
    <div className="text-center group animate-pulse">
        <div className="bg-neutral-200 p-2 rounded-lg shadow-lg inline-block">
            <div className="w-48 h-56 rounded-md bg-neutral-300"></div>
        </div>
        <div className="mt-4 h-5 w-3/4 bg-neutral-200 rounded mx-auto"></div>
        <div className="mt-2 h-4 w-1/2 bg-neutral-200 rounded mx-auto"></div>
    </div>
);

const PersonCard: React.FC<{ person: StafSmait }> = ({ person }) => (
    <div className="text-center group">
        <div className="bg-white p-2 rounded-lg shadow-lg border border-neutral-200 inline-block">
            <img 
                src={person.image || `https://ui-avatars.com/api/?name=${person.nama.replace(/\s/g, '+')}&background=1A6DB5&color=fff&size=192`}
                alt={person.nama} 
                className="w-48 h-56 object-cover object-top rounded-md transition-transform duration-300 group-hover:scale-105" 
                loading="lazy" 
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; 
                    target.src = `https://ui-avatars.com/api/?name=${person.nama.replace(/\s/g, '+')}&background=1A6DB5&color=fff&size=192`;
                }}
            />
        </div>
        <h3 className="mt-4 font-bold text-neutral-900 text-lg">{person.nama}</h3>
        <p className="text-sm text-neutral-600">{person.jabatan}</p>
    </div>
);

const StrukturOrganisasiSection: React.FC = () => {
    const [staff, setStaff] = useState<StafSmait[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(STAF_API_URL);
                if (!response.ok) {
                    throw new Error('Gagal mengambil data staf dari server.');
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setStaff(result.data);
                } else {
                    throw new Error('Format data API staf tidak valid.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan tidak diketahui.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10 justify-items-center">
                    {Array.from({ length: 10 }).map((_, i) => <PersonCardSkeleton key={i} />)}
                </div>
            );
        }

        if (error) {
            return (
                 <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md text-center" role="alert">
                    <p className="font-bold">Gagal Memuat Data</p>
                    <p>{error}</p>
                </div>
            );
        }

        if (staff.length === 0) {
            return (
                <div className="text-center py-10 text-neutral-500">
                    <p>Data struktur organisasi tidak tersedia saat ini.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10 justify-items-center">
                {staff.map(person => (
                    <PersonCard key={person.id} person={person} />
                ))}
            </div>
        );
    };

    return (
        <section id="struktur-organisasi" className="text-center">
            <h2 className="font-heading text-3xl font-bold text-neutral-900 uppercase tracking-wider">Struktur Organisasi</h2>
            <div className="w-24 h-1 bg-primary my-4 mx-auto"></div>
            <div className="mt-12">
                {renderContent()}
            </div>
        </section>
    );
};

const PrestasiSection: React.FC = () => {
    const [prestasi, setPrestasi] = useState<PrestasiSmait[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(PRESTASI_API_URL);
                if (!response.ok) {
                    throw new Error('Gagal mengambil data prestasi.');
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    const sortedData = result.data.sort((a: PrestasiSmait, b: PrestasiSmait) => 
                        new Date(b.tgl).getTime() - new Date(a.tgl).getTime()
                    );
                    setPrestasi(sortedData);
                } else {
                    throw new Error('Format data API tidak valid.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan saat memuat data.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const renderTableBody = () => {
        if (isLoading) {
            return (
                <>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index} className="animate-pulse">
                            <td className="p-3"><div className="h-4 bg-neutral-200 rounded w-1/2 mx-auto"></div></td>
                            <td className="p-3"><div className="h-4 bg-neutral-200 rounded w-2/3"></div></td>
                            <td className="p-3"><div className="h-4 bg-neutral-200 rounded w-1/2"></div></td>
                            <td className="p-3"><div className="h-4 bg-neutral-200 rounded w-full"></div></td>
                            <td className="p-3"><div className="h-4 bg-neutral-200 rounded w-1/2"></div></td>
                            <td className="p-3"><div className="h-4 bg-neutral-200 rounded w-1/3"></div></td>
                            <td className="p-3"><div className="h-4 bg-neutral-200 rounded w-1/4"></div></td>
                            <td className="p-3"><div className="h-4 bg-neutral-200 rounded w-1/4"></div></td>
                        </tr>
                    ))}
                </>
            );
        }

        if (error) {
            return (
                <tr>
                    <td colSpan={8} className="p-8 text-center text-red-600">
                        Gagal memuat data prestasi. <br/> {error}
                    </td>
                </tr>
            );
        }

        if (prestasi.length === 0) {
            return (
                <tr>
                    <td colSpan={8} className="p-8 text-center text-neutral-500">
                        Belum ada data prestasi yang dapat ditampilkan.
                    </td>
                </tr>
            );
        }

        return (
            <>
                {prestasi.map((item, index) => (
                    <tr key={item.id} className={`border-b border-neutral-200 hover:bg-primary/5 ${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50/70'}`}>
                        <td className="p-3 text-center">{index + 1}</td>
                        <td className="p-3">{new Date(item.tgl).toLocaleDateString('id-ID')}</td>
                        <td className="p-3">{item.nama}</td>
                        <td className="p-3">{item.event}</td>
                        <td className="p-3">{item.penyelenggara}</td>
                        <td className="p-3 text-center">{item.level}</td>
                        <td className="p-3 font-semibold text-center">{item.peringkat}</td>
                        <td className="p-3 text-center">{item.score || '-'}</td>
                    </tr>
                ))}
            </>
        );
    };

    return (
        <section id="prestasi" className="text-center">
            <h2 className="font-heading text-3xl font-bold text-neutral-900 uppercase tracking-wider">Prestasi</h2>
            <div className="w-24 h-1 bg-primary my-4 mx-auto"></div>
            <div className="mt-8 overflow-x-auto bg-white rounded-lg shadow-md border">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-primary text-white">
                        <tr>
                            <th className="p-3 font-semibold text-center w-12">NO</th>
                            <th className="p-3 font-semibold">TANGGAL</th>
                            <th className="p-3 font-semibold">NAMA SISWA</th>
                            <th className="p-3 font-semibold">EVENT LOMBA</th>
                            <th className="p-3 font-semibold">PENYELENGGARA</th>
                            <th className="p-3 font-semibold text-center">LEVEL</th>
                            <th className="p-3 font-semibold text-center">PERINGKAT</th>
                            <th className="p-3 font-semibold text-center">SCORE</th>
                        </tr>
                    </thead>
                    <tbody className="text-neutral-600">
                        {renderTableBody()}
                    </tbody>
                </table>
            </div>
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
                    <div className="space-y-2 mt-4 max-w-3xl mx-auto">
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
            deskripsi: "SMK PKP 1 Jakarta Islamic School membuka Penerimaan Peserta Didik Baru. Bergabunglah bersama kami dan raih masa depan dengan bekal keahlian kejuruan dan nilai-nilai Islami yang kuat.",
            teks_tombol: "DAFTAR SEKARANG",
            link_tombol: "/pendaftaran"
        };

        const hasError = !!error || !data;
        const linkPath = content.link_tombol === '#' ? '/pendaftaran' : content.link_tombol;

        return (
             <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                {hasError && <p className="mb-4 text-yellow-300 bg-black/20 p-2 rounded-md">Gagal memuat data. Menampilkan informasi default.</p>}
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
                if (!response.ok) throw new Error(`Gagal mengambil data: ${response.statusText}`);
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
        id: 3, nama_unit: 'SMAIT & SMKIT',
        alamat: 'Jl. Permata RT 02 RW 10, Kp. Bulu, Ds. Setiamekar, Kec. Tambun Selatan, Kab. Bekasi',
        telepon: '[Nomor Telepon]', email: 'admin@smkpkp1jakarta.sch.id',
        map_url: 'https://maps.app.goo.gl/LFZM9anRHiMMk9G77',
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
                {error && <p className="text-red-500 bg-red-50 p-2 rounded-md mt-6 max-w-xl mx-auto">Gagal memuat data kontak. Menampilkan informasi default. ({error})</p>}
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
                    <iframe src={embedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`Peta Lokasi ${data.nama_unit}`} className="rounded-lg shadow-md"></iframe>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-neutral-500">
                        <p>Peta tidak dapat ditampilkan.</p>
                        <a href={data.map_url} target="_blank" rel="noopener noreferrer" className="mt-2 text-primary hover:underline">Buka di Google Maps</a>
                    </div>
                )}
            </div>
        </section>
    );
};

const MediaSosialSection: React.FC = () => {
    const [socials, setSocials] = useState<MediaSosialType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const SOCIAL_API_URL = `${API_BASE_URL}/api/media-sosial/`;

    const iconMap = {
        youtube: YouTubeIcon,
        facebook: FacebookIcon,
        instagram: InstagramIcon,
    };

    useEffect(() => {
        const fetchSocials = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(SOCIAL_API_URL);
                if (!response.ok) throw new Error('Gagal mengambil data media sosial');
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setSocials(result.data);
                } else {
                    throw new Error('Struktur data API tidak valid.');
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSocials();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                 <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 container mx-auto px-4 animate-pulse">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="text-center">
                            <div className="w-20 h-20 bg-neutral-200 rounded-full mx-auto mb-4"></div>
                            <div className="h-6 w-1/2 bg-neutral-200 mx-auto rounded mb-2"></div>
                            <div className="h-4 w-3/4 bg-neutral-200 mx-auto rounded"></div>
                        </div>
                    ))}
                </div>
            );
        }
        
        const fallbackSocials: MediaSosialType[] = [
            { id: 1, nama: 'YouTube', username: 'SMK PKP 1 Jakarta TV', link: '#', icon: 'youtube' },
            { id: 2, nama: 'Facebook', username: 'SMK PKP 1 Jakarta', link: '#', icon: 'facebook' },
            { id: 3, nama: 'Instagram', username: '@smkpkp1jakarta', link: '#', icon: 'instagram' },
        ];
        
        const dataToRender = error || socials.length === 0 ? fallbackSocials : socials;

        return (
            <>
                {error && <p className="container mx-auto px-4 text-red-600 bg-red-100 p-2 rounded-md mb-8 max-w-md">Gagal memuat data. ({error})</p>}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 container mx-auto px-4">
                    {dataToRender.map(social => {
                        const Icon = iconMap[social.icon as keyof typeof iconMap];
                        return (
                            <a key={social.id} href={social.link} target="_blank" rel="noopener noreferrer" className="block group">
                                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-white shadow-lg mx-auto mb-4 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    {Icon && <Icon className="h-10 w-10"/>}
                                </div>
                                <h3 className="font-bold text-xl">{social.nama}</h3>
                                <p className="text-neutral-600 group-hover:text-primary">{social.username}</p>
                            </a>
                        );
                    })}
                </div>
            </>
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

const SMAIT: React.FC = () => {
    return (
        <div className="space-y-24">
            <HeroSlider />
            
            <section id="visi-misi">
                <VisiMisiSection />
            </section>

            <KurikulumSection />

            <ProgramUnggulanSection />

            <StrukturOrganisasiSection />
            
            <PrestasiSection />

            <PendaftaranSection />
            
            <KontakSection />

            <MediaSosialSection />
        </div>
    );
};

export default SMAIT;
