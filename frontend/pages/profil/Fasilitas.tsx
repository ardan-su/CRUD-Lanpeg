import React, { useState, useEffect } from 'react';
import { XIcon, ClipboardDocumentListIcon } from '../../components/icons';
import { type FasilitasItemAPI } from '../../types';

// API Configuration
const API_BASE_URL = 'http://localhost:5001';
const API_URL = `${API_BASE_URL}/api/fasilitas_item/`;

// --- Helper Components ---

// Modal component for viewing images
const ImageModal: React.FC<{ imageUrl: string; onClose: () => void }> = ({ imageUrl, onClose }) => {
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

    return (
        <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 transition-opacity duration-300" 
            onClick={onClose} 
            role="dialog" 
            aria-modal="true"
        >
            <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
                <img 
                    src={imageUrl} 
                    alt="Tampilan fasilitas diperbesar" 
                    className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
                />
                <button 
                    onClick={onClose} 
                    className="absolute -top-3 -right-3 bg-white text-neutral-800 rounded-full p-2 shadow-lg hover:bg-neutral-200" 
                    aria-label="Tutup"
                >
                    <XIcon className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
};

// Card component for each facility image
const FacilityImageCard: React.FC<{ item: FasilitasItemAPI; onClick: () => void }> = ({ item, onClick }) => {
    // API provides full URL, use it directly.
    const imageUrl = item.gambar;
    if (!imageUrl) return null; // Don't render if there's no image URL.

    return (
        <div className="group aspect-w-1 aspect-h-1">
            <button 
                onClick={onClick}
                className="w-full h-full bg-neutral-100 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
                <img 
                    src={imageUrl} 
                    alt={`Fasilitas ${item.id}`} 
                    className="w-full h-full object-cover" 
                    loading="lazy"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        (target.parentNode as HTMLElement).style.display = 'none'; // Hide the parent button if image fails
                    }}
                />
            </button>
        </div>
    );
};


// Skeleton Component for loading state
const FasilitasSkeleton: React.FC = () => (
    <div className="animate-pulse">
        <div className="h-8 bg-neutral-200 rounded w-1/3 mb-2"></div>
        <div className="w-20 h-1 bg-neutral-200 mb-6"></div>
        <div className="prose prose-lg max-w-none space-y-4">
            <div className="h-4 bg-neutral-200 rounded w-full"></div>
            <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
        </div>
        <div className="not-prose mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="aspect-w-1 aspect-h-1 bg-neutral-200 rounded-lg"></div>
            ))}
        </div>
    </div>
);

// --- Main Component ---
const Fasilitas: React.FC = () => {
    const [items, setItems] = useState<FasilitasItemAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('Gagal mengambil data galeri fasilitas.');
                
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    // Filter out items that do not have an image URL
                    const validItems = result.data.filter((item: FasilitasItemAPI) => item.gambar && typeof item.gambar === 'string');
                    setItems(validItems);
                } else {
                    throw new Error("Format data tidak valid.");
                }

            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan yang tidak diketahui.');
                console.error("Fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    if (isLoading) {
        return <FasilitasSkeleton />;
    }
    
    return (
        <section id="fasilitas">
            <h2 className="font-heading text-3xl font-bold text-primary mb-2">Galeri Fasilitas</h2>
            <div className="w-20 h-1 bg-accent mb-6"></div>
            <div className="prose prose-lg max-w-none text-neutral-600 space-y-4">
                <p>Kami menyediakan berbagai fasilitas yang lengkap dan modern untuk mendukung proses belajar mengajar yang efektif, nyaman, dan menyenangkan bagi seluruh siswa.</p>
                
                {error && (
                    <div className="not-prose bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                        <p className="font-bold">Gagal memuat galeri</p>
                        <p>{error}</p>
                    </div>
                )}
                
                {items.length > 0 ? (
                    <div className="not-prose mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {items.map(item => (
                             item.gambar && <FacilityImageCard 
                                key={item.id} 
                                item={item} 
                                onClick={() => handleImageClick(item.gambar!)} 
                             />
                        ))}
                    </div>
                ) : !error ? (
                    <div className="not-prose mt-8 text-center py-12 px-6 bg-neutral-50 rounded-xl">
                        <ClipboardDocumentListIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-neutral-600">Galeri Sedang Diperbarui</h3>
                        <p className="text-neutral-500 max-w-md mx-auto">Daftar fasilitas sedang dalam proses pembaruan. Silakan kembali lagi nanti.</p>
                    </div>
                ) : null}
            </div>
            
            {selectedImage && (
                <ImageModal imageUrl={selectedImage} onClose={handleCloseModal} />
            )}
        </section>
    );
};

export default Fasilitas;