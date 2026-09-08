import React from 'react';
import { UserIcon, CalendarIcon } from './icons';
import { type MateriAjarAPI } from '../types';

const STORAGE_URL = 'http://localhost:5001/public/uploads/';

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Tanggal tidak valid";
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};

interface MateriCardProps {
    article: MateriAjarAPI;
    onReadClick: () => void;
}

const MateriCard: React.FC<MateriCardProps> = ({ article, onReadClick }) => {
    const getImageUrl = (gambar: string | null): string => {
        const fallbackUrl = `https://picsum.photos/seed/materi${article.id}/800/400`;
        if (!gambar) {
            return fallbackUrl;
        }
        // Check if the URL is absolute (like from Image Kit)
        if (gambar.startsWith('http://') || gambar.startsWith('https://')) {
            return gambar;
        }
        // Otherwise, treat it as a relative path
        return `${STORAGE_URL}${gambar}`;
    };

    const imageUrl = getImageUrl(article.gambar);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null; // Prevent infinite loop if fallback also fails
        target.src = `https://picsum.photos/seed/materi${article.id}/800/400`;
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-neutral-200/80 flex flex-col">
            <div className="overflow-hidden">
                <img 
                    src={imageUrl} 
                    alt={article.judul} 
                    className="w-full h-56 object-cover" 
                    loading="lazy"
                    onError={handleImageError} 
                />
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-heading font-bold text-xl text-neutral-900 mb-3 capitalize">{article.judul}</h3>
                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500 mb-4">
                    <div className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-1.5" />
                        <span>{article.penulis}</span>
                    </div>
                    <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1.5" />
                        <span>{formatDate(article.tanggal)}</span>
                    </div>
                </div>
                <p className="text-sm text-neutral-600 line-clamp-4 flex-grow">{article.deskripsi}</p>
                <div className="mt-6 text-right">
                    <button
                        onClick={onReadClick}
                        className="text-primary font-semibold border border-primary rounded-full px-5 py-2 text-sm hover:bg-primary/10 transition-colors"
                    >
                        Baca Selengkapnya
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MateriCard;
