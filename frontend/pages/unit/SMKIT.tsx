import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, YouTubeIcon, FacebookIcon, InstagramIcon, MapPinIcon, PhoneIcon, EnvelopeIcon } from '../../components/icons';
import { type VisiMisiSasaranSmkit, type ProgramKejuruanSmkit, type StafSmkitAPI, type PrestasiSmkit, type PenerimaanSiswaBaru, type HubungiKamiAPI, type MediaSosial as MediaSosialType } from '../../types';

// --- Type Definition ---
interface BannerSmkit {
    id: number;
    judul: string;
    deskripsi: string;
    gambar: string;
    tombol_teks: string;
    tombol_link: string;
}

// --- API Configuration ---
const API_BASE_URL = 'http://localhost:5001';
const BANNER_API_URL = `${API_BASE_URL}/api/banner_smkit/`;
const BANNER_STORAGE_URL = `${API_BASE_URL}/storage/banner_smkit/`;
const VISI_MISI_API_URL = `${API_BASE_URL}/api/visi-misi-sasaran-smkit/`;
const PROGRAM_KEJURUAN_API_URL = `${API_BASE_URL}/api/program-kejuruan-smkit/`;
const STAF_API_URL = `${API_BASE_URL}/api/staf-smkit/`;
const PRESTASI_API_URL = `${API_BASE_URL}/api/prestasi-smkit/`;


// --- Fallback Data ---
const FALLBACK_SLIDE: BannerSmkit = {
    id: 1,
    judul: 'SMK PKP 1 Jakarta Islamic School',
    deskripsi: 'Terdepan dalam membentuk insan taqwa yang cerdas, cendikia, berakhlak mulia dan berjiwa leadership yang memiliki kompetensi dan daya saing tinggi.',
    gambar: 'http://localhost:5001/public/img/BG6.png',
    tombol_teks: 'Pendaftaran Murid Baru',
    tombol_link: '/pendaftaran'
};


const HeroSlider: React.FC = () => {
    const [slides, setSlides] = useState<BannerSmkit[]>([]);
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
                    : `${BANNER_STORAGE_URL}${slide.gambar}`;
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
}

const AccordionItem: React.FC<{ title: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void; }> = ({ title, children, isOpen, onToggle }) => {
    return (
        <div className="border-b border-neutral-200 last:border-b-0">
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center text-left p-5 font-semibold text-lg text-neutral-800 hover:bg-neutral-50 transition-colors duration-200"
                aria-expanded={isOpen}
            >
                <span>{title}</span>
                <ChevronDownIcon className={`h-5 w-5 text-neutral-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="px-5 pb-5 text-neutral-600 prose max-w-none">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

const parseDescriptionToList = (text: string) => {
    return text.split('\n')
        .map(item => item.trim().replace(/^[a-z][.)]\s*/, ''))
        .filter(item => item.trim() !== '');
};

const VisiMisiSkeleton: React.FC = () => (
    <div className="animate-pulse">
        <div className="h-9 w-3/4 bg-neutral-200 rounded mb-6"></div>
        <div className="bg-white rounded-xl shadow-lg border">
            <div className="p-5 border-b border-neutral-200 h-[70px]">
                <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
            </div>
            <div className="p-5 h-[70px]">
                <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
            </div>
        </div>
    </div>
);

const VisiMisiSection: React.FC = () => {
    const [data, setData] = useState<VisiMisiSasaranSmkit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openAccordion, setOpenAccordion] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(VISI_MISI_API_URL);
                if (!response.ok) throw new Error('Gagal mengambil data dari server.');
                
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    const filteredAndSortedData = result.data
                        .filter((item: VisiMisiSasaranSmkit) => item.kategori !== 'Sasaran')
                        .sort((a: VisiMisiSasaranSmkit, b: VisiMisiSasaranSmkit) => {
                            const order = { 'Visi': 1, 'Misi': 2 };
                            return (order[a.kategori as keyof typeof order] || 99) - (order[b.kategori as keyof typeof order] || 99);
                        });
                    setData(filteredAndSortedData);
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

    if (isLoading) {
        return <VisiMisiSkeleton />;
    }

    const hasError = !!error || data.length === 0;

    const fallbackItems = [
        { id: 1, kategori: 'Visi', deskripsi: "Terdepan dalam membentuk insan taqwa yang cerdas, cendikia, berakhlak mulia, berjiwa leadership, entrepreneurship.", created_at: '', updated_at: '' },
        { id: 2, kategori: 'Misi', deskripsi: "a. Penanaman dan aplikasi nilai-nilai akhlak Islami.\nb. Melaksanakan proses pembelajaran berbasis teknologi informasi.", created_at: '', updated_at: '' }
    ];

    const dataToRender = hasError ? fallbackItems : data;

    return (
        <div>
            <h2 className="font-heading text-3xl font-bold text-primary mb-6">Visi dan Misi</h2>
            {hasError && <p className="text-red-500 bg-red-50 p-3 mb-4 rounded-md">Gagal memuat data. Menampilkan konten default. {error && `(${error})`}</p>}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border">
                {dataToRender.map(item => (
                    <AccordionItem
                        key={item.kategori}
                        title={item.kategori}
                        isOpen={openAccordion === item.kategori}
                        onToggle={() => setOpenAccordion(openAccordion === item.kategori ? '' : item.kategori)}
                    >
                        {item.kategori === 'Visi' ? (
                            <blockquote className="italic text-lg">“{item.deskripsi}”</blockquote>
                        ) : (
                            <ol className="list-decimal pl-5 space-y-2">
                                {parseDescriptionToList(item.deskripsi).map((listItem, index) => (
                                    <li key={index}>{listItem}</li>
                                ))}
                            </ol>
                        )}
                    </AccordionItem>
                ))}
            </div>
        </div>
    );
};

const ProgramKejuruanSection: React.FC = () => {
    const [programs, setPrograms] = useState<ProgramKejuruanSmkit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrograms = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(PROGRAM_KEJURUAN_API_URL);
                if (!response.ok) {
                    throw new Error(`Gagal mengambil data dari server: ${response.statusText}`);
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setPrograms(result.data);
                } else {
                    throw new Error('Format data API tidak valid atau tidak ada data program kejuruan.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan tidak diketahui.');
                console.error("Error fetching program kejuruan SMKIT:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPrograms();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="mt-8 max-w-4xl mx-auto p-6 bg-neutral-100 rounded-lg animate-pulse">
                    <div className="h-7 w-1/3 bg-neutral-200 rounded mb-6 mx-auto"></div>
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-5 bg-neutral-200 rounded"></div>
                        ))}
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="mt-8 max-w-4xl mx-auto p-6 bg-red-50 text-red-700 rounded-lg text-center">
                    <p className="font-bold">Gagal memuat program kejuruan.</p>
                    <p>{error}</p>
                </div>
            );
        }
        
        if (programs.length === 0) {
             return (
                <div className="mt-8 max-w-4xl mx-auto p-6 bg-neutral-100 text-neutral-600 rounded-lg text-center">
                    <p>Informasi program kejuruan tidak tersedia saat ini.</p>
                </div>
            );
        }

        return (
            <>
                {programs.map(program => (
                    <div key={program.id} className="mt-8 max-w-4xl mx-auto p-6 bg-neutral-50 rounded-lg border-t-4 border-accent text-left">
                        <h3 className="font-bold text-xl text-primary mb-4 text-center">{program.kategori}</h3>
                        <ol className="list-decimal pl-5 space-y-2 text-neutral-700">
                            {parseDescriptionToList(program.deskripsi).map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ol>
                    </div>
                ))}
            </>
        );
    };
    
    return (
        <section id="program-kejuruan" className="text-center">
            <h2 className="font-heading text-3xl font-bold text-neutral-900 uppercase tracking-wider">Program Kejuruan</h2>
            <div className="w-24 h-1 bg-primary my-4 mx-auto"></div>
            {renderContent()}
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

const PersonCard: React.FC<{ person: StafSmkitAPI }> = ({ person }) => (
    <div className="text-center group">
        <div className="bg-white p-2 rounded-lg shadow-lg border border-neutral-200 inline-block relative">
             <img 
                src={person.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.nama)}&background=1A6DB5&color=fff&size=192`}
                alt={person.nama} 
                className="w-48 h-56 object-cover object-top rounded-md transition-transform duration-300 group-hover:scale-105" 
                loading="lazy" 
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; 
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.nama)}&background=1A6DB5&color=fff&size=192`;
                }}
            />
            <img src="https://picsum.photos/seed/smkit-logo/40" alt="logo" className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white p-0.5" />
        </div>
        <h3 className="mt-4 font-bold text-neutral-900 text-lg">{person.nama}</h3>
        <p className="text-sm text-neutral-600">{person.jabatan}</p>
    </div>
);

const OrgSubSection: React.FC<{ title: string; members: StafSmkitAPI[]; showSeparator?: boolean }> = ({ title, members, showSeparator = true }) => {
    if (members.length === 0) return null;
    return (
        <div>
            <h3 className="font-heading text-2xl font-bold text-center text-primary mb-8">{title}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 justify-items-center">
                {members.map(p => <PersonCard key={p.id} person={p} />)}
            </div>
            {showSeparator && (
                <div className="py-12">
                    <hr className="border-t-2 border-dashed border-neutral-200" />
                </div>
            )}
        </div>
    );
};

const StrukturOrganisasiSection: React.FC = () => {
    const [staff, setStaff] = useState<StafSmkitAPI[]>([]);
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
                console.error("API fetch error for Staf SMKIT:", err);
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
        
        const pimpinanRoles = ["Kepala Sekolah", "Wakasek Kurikulum", "Wakasek Kesiswaan"];
        const manajemenRoles = ["Kajur Multimedia", "Koordinator Kurikulum", "PJ Lomba & Guru"];
        const stafRoles = ["Staff TU"];
        
        const pimpinan = staff.filter(m => pimpinanRoles.includes(m.jabatan.trim()))
            .sort((a,b) => pimpinanRoles.indexOf(a.jabatan.trim()) - pimpinanRoles.indexOf(b.jabatan.trim()));

        const manajemen = staff.filter(m => manajemenRoles.includes(m.jabatan.trim()));
        const stafTU = staff.filter(m => stafRoles.includes(m.jabatan.trim()));
        const guru = staff.filter(m => 
            !pimpinanRoles.includes(m.jabatan.trim()) &&
            !manajemenRoles.includes(m.jabatan.trim()) &&
            !stafRoles.includes(m.jabatan.trim())
        );

        return (
            <div className="space-y-12">
                <OrgSubSection title="Pimpinan Sekolah" members={pimpinan} />
                <OrgSubSection title="Manajemen Jurusan & Koordinator" members={manajemen} />
                <OrgSubSection title="Staf Administrasi" members={stafTU} />
                <OrgSubSection title="Guru Pengajar" members={guru} showSeparator={false} />
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
    const [prestasi, setPrestasi] = useState<{[key: string]: PrestasiSmkit[]}>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(PRESTASI_API_URL);
                if (!response.ok) {
                    throw new Error(`Gagal mengambil data: ${response.statusText}`);
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    // Group data by 'tahun_pelajaran'
                    const groupedData = result.data.reduce((acc: {[key: string]: PrestasiSmkit[]}, item: PrestasiSmkit) => {
                        const year = item.tahun_pelajaran;
                        if (!acc[year]) {
                            acc[year] = [];
                        }
                        acc[year].push(item);
                        // Sort items within each year by 'no'
                        acc[year].sort((a, b) => a.no - b.no);
                        return acc;
                    }, {});

                    setPrestasi(groupedData);
                } else {
                    throw new Error('Format data API tidak valid atau data kosong.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan saat memuat data.');
                console.error('Error fetching prestasi SMKIT:', err);
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
                    {Array.from({ length: 10 }).map((_, index) => (
                        <tr key={index} className="animate-pulse">
                            <td className="p-3"><div className="h-4 bg-neutral-200 rounded w-1/2 mx-auto"></div></td>
                            <td className="p-3"><div className="h-4 bg-neutral-200 rounded w-full"></div></td>
                            <td className="p-3"><div className="h-4 bg-neutral-200 rounded w-2/3"></div></td>
                        </tr>
                    ))}
                </>
            );
        }

        if (error) {
            return (
                <tr>
                    <td colSpan={3} className="p-8 text-center text-red-600">
                        Gagal memuat data prestasi. <br/> {error}
                    </td>
                </tr>
            );
        }
        
        const sortedYears = Object.keys(prestasi).sort((a, b) => {
            const yearA = parseInt(a.split('-')[0].replace(/\D/g, ''), 10);
            const yearB = parseInt(b.split('-')[0].replace(/\D/g, ''), 10);
            return yearB - yearA;
        });

        if (sortedYears.length === 0) {
            return (
                <tr>
                    <td colSpan={3} className="p-8 text-center text-neutral-500">
                        Belum ada data prestasi yang dapat ditampilkan.
                    </td>
                </tr>
            );
        }

        return (
            <>
                {sortedYears.map(year => (
                    <React.Fragment key={year}>
                        <tr className="bg-primary/10">
                            <td colSpan={3} className="p-3 font-bold text-primary text-center">
                                {year}
                            </td>
                        </tr>
                        {prestasi[year].map((item, index) => (
                            <tr key={item.id} className={`border-b border-neutral-200 hover:bg-primary/10 ${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50/70'}`}>
                                <td className="p-3 text-center">{item.no}</td>
                                <td className="p-3">{item.nama_kegiatan_lomba}</td>
                                <td className="p-3">{item.juara}</td>
                            </tr>
                        ))}
                    </React.Fragment>
                ))}
            </>
        );
    };

    return (
        <section id="prestasi" className="text-center">
            <h2 className="font-heading text-3xl font-bold text-neutral-900 uppercase tracking-wider">Prestasi</h2>
            <div className="w-24 h-1 bg-primary my-4 mx-auto"></div>
            <p className="max-w-3xl mx-auto text-neutral-600 mb-8">
                Dengan semangat kompetisi yang tinggi, siswa-siswi SMK PKP 1 Jakarta berhasil menorehkan berbagai pencapaian gemilang dalam berbagai ajang lomba kejuruan dan umum.
            </p>
            <div className="mt-8 overflow-x-auto bg-white rounded-lg shadow-md border">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-primary text-white">
                        <tr>
                            <th className="p-3 font-semibold text-center w-16">NO</th>
                            <th className="p-3 font-semibold">NAMA LOMBA / KEGIATAN</th>
                            <th className="p-3 font-semibold">JUARA</th>
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
    const PENDAFTARAN_API_URL = `${API_BASE_URL}/api/penerimaan-siswa-baru/`;

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
                console.error('Gagal mengambil data pendaftaran:', err);
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
            deskripsi: "Kami SMK PKP 1 Jakarta Islamic School membuka Kembali Penerimaan Peserta Didik Baru. Dapatkan program - program unggulan yang berkesinambungan selama pembelajaran di sini.",
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
    const KONTAK_API_URL = `${API_BASE_URL}/api/hubungi_kami/3`;

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
    
    const generateEmbedUrl = (mapUrl: string | undefined, address: string | undefined): string => {
        if (!address && !mapUrl) return '';
        if (address) {
            return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&z=15`;
        }
        if(mapUrl){
             const coordsRegex = /@?(-?\d+\.\d+),(-?\d+\.\d+)/;
            const match = mapUrl.match(coordsRegex);
            if (match && match[1] && match[2]) {
                return `https://maps.google.com/maps?q=${match[1]},${match[2]}&z=15&output=embed&t=m`;
            }
            return `https://maps.google.com/maps?q=${encodeURIComponent(mapUrl)}&z=15&output=embed&t=m`;
        }
        return '';
    };

    if (isLoading) {
        return (
            <section id="kontak-kami" className="text-center animate-pulse">
                <div className="h-8 w-1/3 bg-neutral-200 rounded mx-auto"></div>
                <div className="w-24 h-1 bg-neutral-200 my-4 mx-auto"></div>
                <div className="h-5 w-3/4 bg-neutral-200 rounded mx-auto max-w-3xl"></div>
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
    const embedUrl = generateEmbedUrl(data.map_url, data.alamat);

    return (
        <section id="kontak-kami" className="text-center">
            <h2 className="font-heading text-3xl font-bold text-neutral-900 uppercase tracking-wider">Kontak Kami</h2>
            <div className="w-24 h-1 bg-primary my-4 mx-auto"></div>
            <p className="max-w-3xl mx-auto text-neutral-600">
                Kami selalu siap membantu. Silakan hubungi kami melalui informasi di bawah ini atau kunjungi lokasi kami.
            </p>
            {error && <p className="text-red-500 bg-red-50 p-2 rounded-md mt-6 max-w-xl mx-auto">Gagal memuat data kontak. Menampilkan informasi default. ({error})</p>}
            
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


const SMKIT: React.FC = () => {
    return (
        <div className="space-y-24">
            <HeroSlider />
            
            <section id="visi-misi" className="grid md:grid-cols-2 gap-12 items-center">
                <VisiMisiSection />
                <div className="flex justify-center items-center">
                    <img src="http://localhost:5001/public/img/logo.png" alt="Logo SMK PKP 1 Jakarta" className="w-full max-w-sm"/>
                </div>
            </section>

             <ProgramKejuruanSection />

            <StrukturOrganisasiSection />

            <PrestasiSection />

            <PendaftaranSection />
            
            <KontakSection />

            <MediaSosialSection />

        </div>
    );
};

export default SMKIT;