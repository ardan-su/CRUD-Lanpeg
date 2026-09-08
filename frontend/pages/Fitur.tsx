import React, { useState, useEffect } from 'react';
import MateriCard from '../components/MateriCard';
import { type MateriAjarAPI } from '../types';
import { ClipboardDocumentListIcon, XIcon, UserIcon, CalendarIcon } from '../components/icons';

const API_URL = `http://localhost:5001/api/materi_ajar/`;
const STORAGE_URL = 'http://localhost:5001/storage/materi_ajar/';

// --- Helper Functions ---
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Tanggal tidak valid";
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};

const MateriCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse border border-neutral-200/80">
        <div className="bg-neutral-200 h-56 w-full"></div>
        <div className="p-6">
            <div className="h-6 bg-neutral-200 rounded w-3/4 mb-4"></div>
            <div className="flex items-center space-x-4 mb-4">
                <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-full"></div>
                <div className="h-4 bg-neutral-200 rounded w-full"></div>
                <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
            </div>
            <div className="flex justify-end mt-6">
                <div className="h-10 w-28 bg-neutral-200 rounded-full"></div>
            </div>
        </div>
    </div>
);

const MateriModal: React.FC<{ article: MateriAjarAPI; onClose: () => void }> = ({ article, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [onClose]);

    const getImageUrl = (gambar: string | null): string => {
        const fallbackUrl = `https://picsum.photos/seed/materi-modal${article.id}/1200/600`;
        if (!gambar) return fallbackUrl;
        if (gambar.startsWith('http://') || gambar.startsWith('https://')) return gambar;
        return `${STORAGE_URL}${gambar}`;
    };
    
    const imageUrl = getImageUrl(article.gambar);
    // Ensure deskripsi is not null/undefined before splitting
    const contentParagraphs = (article.deskripsi || "").split('\n').filter(p => p.trim() !== '');

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null;
        target.src = `https://picsum.photos/seed/materi-modal${article.id}/1200/600`;
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 transition-opacity duration-300" 
            aria-modal="true" 
            role="dialog"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 flex justify-between items-center border-b sticky top-0 bg-white z-10 flex-shrink-0">
                    <h2 className="font-heading text-xl font-bold text-primary flex-1 pr-4 capitalize">{article.judul}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-100" aria-label="Tutup">
                        <XIcon className="h-6 w-6 text-neutral-500" />
                    </button>
                </header>
                <div className="overflow-y-auto">
                    <img 
                        src={imageUrl} 
                        alt={article.judul} 
                        className="w-full h-auto max-h-80 object-cover"
                        onError={handleImageError}
                    />
                    <div className="p-6">
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500 mb-6">
                            <div className="flex items-center">
                                <UserIcon className="h-4 w-4 mr-1.5 text-neutral-400" />
                                <span>Oleh: {article.penulis}</span>
                            </div>
                            <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-1.5 text-neutral-400" />
                                <span>{formatDate(article.tanggal)}</span>
                            </div>
                        </div>
                        <article className="prose max-w-none text-neutral-700 text-justify">
                            {contentParagraphs.map((p, index) => <p key={index}>{p}</p>)}
                        </article>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MateriAjar: React.FC = () => {
    const [materi, setMateri] = useState<MateriAjarAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMateri, setSelectedMateri] = useState<MateriAjarAPI | null>(null);

    useEffect(() => {
        const fetchMateri = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`Gagal mengambil data dari server (status: ${response.status})`);
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    const sortedData = result.data.sort((a: MateriAjarAPI, b: MateriAjarAPI) => 
                        new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
                    );
                    setMateri(sortedData);
                } else {
                    throw new Error('Format data API tidak valid atau tidak ditemukan.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan yang tidak diketahui.');
                console.error("Fetch error for Materi Ajar:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMateri();
    }, []);

    const handleReadMore = (item: MateriAjarAPI) => {
        setSelectedMateri(item);
    };

    const handleCloseModal = () => {
        setSelectedMateri(null);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, index) => <MateriCardSkeleton key={index} />)}
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-12 px-6 bg-red-50 rounded-xl border border-red-200 text-red-700">
                    <h3 className="text-lg font-bold">Gagal Memuat Data</h3>
                    <p className="mt-2 text-sm">{error}</p>
                </div>
            );
        }

        if (materi.length === 0) {
            return (
                <div className="text-center py-12 px-6 bg-neutral-100 rounded-xl border border-neutral-200 text-neutral-600">
                     <ClipboardDocumentListIcon className="h-12 w-12 text-neutral-400 mx-auto mb-2"/>
                    <h3 className="text-lg font-bold">Materi Belum Tersedia</h3>
                    <p className="mt-2 text-sm">Saat ini belum ada materi ajar yang dapat ditampilkan.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {materi.map(item => (
                    <MateriCard key={item.id} article={item} onReadClick={() => handleReadMore(item)} />
                ))}
            </div>
        );
    };
    
    return (
        <div className="bg-neutral-50 min-h-[calc(100vh-80px)]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="text-center mb-12">
                    <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-primary">Materi Ajar</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-neutral-600">Kumpulan rangkuman materi, modul, dan bahan ajar yang disusun oleh para guru untuk mendukung proses belajar siswa.</p>
                </header>

                <main>
                    {renderContent()}
                </main>

                {selectedMateri && <MateriModal article={selectedMateri} onClose={handleCloseModal} />}
            </div>
        </div>
    );
};

export default MateriAjar;