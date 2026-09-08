import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type MajalahDigitalAPI } from '../../types';
import { ClipboardDocumentListIcon, CalendarIcon, ChevronRightIcon } from '../../components/icons';

const API_BASE_URL = 'http://localhost:5001';
const API_URL = `${API_BASE_URL}/api/majalah_digital/`;

const formatDate = (dateString: string | null): string | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return "Tanggal tidak valid";
    }
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};

const MajalahCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse h-full">
        <div className="bg-neutral-200 h-80 w-full"></div>
        <div className="p-6">
            <div className="h-6 bg-neutral-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-full"></div>
                <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
            </div>
        </div>
    </div>
);

const MajalahCard: React.FC<{ magazine: MajalahDigitalAPI }> = ({ magazine }) => {
    const coverUrl = magazine.cover_image 
        ? magazine.cover_image
        : `https://picsum.photos/seed/mag-${magazine.id}/400/565`;
    
    const releaseDate = formatDate(magazine.tanggal_rilis);
    const detailLink = `/informasi/majalah/${magazine.slug}`;

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col group h-full">
            <div className="overflow-hidden relative h-96 bg-neutral-100">
                <Link to={detailLink} className="block w-full h-full">
                    <img 
                        src={coverUrl} 
                        alt={`Cover ${magazine.judul}`} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                        loading="lazy" 
                    />
                </Link>
                 {magazine.status === 'coming_soon' && (
                    <div className="absolute top-4 right-4 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10">
                        SEGERA HADIR
                    </div>
                )}
            </div>
            <div className="p-6 flex flex-col flex-grow relative">
                <h3 className="font-heading text-xl font-bold text-neutral-800 mb-2 group-hover:text-primary transition-colors">
                    <Link to={detailLink}>
                        {magazine.judul}
                    </Link>
                </h3>
                {releaseDate && 
                    <div className="flex items-center text-sm text-neutral-500 mb-3">
                        <CalendarIcon className="h-4 w-4 mr-1.5 text-neutral-400" />
                        <span>Rilis: {releaseDate}</span>
                    </div>
                }
                <p className="text-neutral-600 text-sm line-clamp-3 mb-4 flex-grow">{magazine.deskripsi || "Deskripsi majalah."}</p>
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link to={detailLink} className="flex items-center text-primary font-semibold text-sm group-hover:underline">
                        Lihat Detail <ChevronRightIcon className="h-4 w-4 ml-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

const Majalah: React.FC = () => {
    const [magazines, setMagazines] = useState<MajalahDigitalAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMagazines = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`Gagal mengambil data: ${response.statusText}`);
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    const sortedData = result.data.sort((a: any, b: any) => 
                        new Date(b.tanggal_rilis || 0).getTime() - new Date(a.tanggal_rilis || 0).getTime()
                    );
                    setMagazines(sortedData);
                } else {
                    throw new Error('Format data API tidak valid.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan saat memuat majalah.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchMagazines();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <MajalahCardSkeleton />
                    <MajalahCardSkeleton />
                    <MajalahCardSkeleton />
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

        if (magazines.length === 0) {
            return (
                <div className="text-center py-10 text-neutral-500">
                    <ClipboardDocumentListIcon className="h-12 w-12 text-neutral-400 mx-auto mb-2"/>
                    <p className="font-semibold">Belum ada majalah yang tersedia.</p>
                    <p className="text-sm">Silakan kembali lagi nanti.</p>
                </div>
            );
        }
        
        return (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
                {magazines.map(magazine => (
                    <MajalahCard 
                        key={magazine.id} 
                        magazine={magazine} 
                    />
                ))}
            </div>
        );
    };

    return (
        <section id="majalah">
            <h2 className="font-heading text-3xl font-bold text-primary mb-2">Majalah Digital</h2>
            <div className="w-20 h-1 bg-accent mb-6"></div>
            {renderContent()}
        </section>
    );
};

export default Majalah;