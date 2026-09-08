import React, { useEffect } from 'react';
import { type BeritaArtikelAPI } from '../types';
import { XIcon, CalendarIcon } from './icons';

interface ArticleModalProps {
    article: BeritaArtikelAPI;
    onClose: () => void;
}

const formatDate = (dateString: string) => {
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

const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
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

    const contentParagraphs = article.deskripsi?.split('\n').filter(p => p.trim() !== '');

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 transition-opacity duration-300" 
            aria-modal="true" 
            role="dialog"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 flex justify-between items-center border-b sticky top-0 bg-white z-10 flex-shrink-0">
                    <h2 className="font-heading text-xl font-bold text-primary flex-1 pr-4">{article.judul}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-100" aria-label="Tutup">
                        <XIcon className="h-6 w-6 text-neutral-500" />
                    </button>
                </header>
                <div className="overflow-y-auto">
                    {article.gambar && <img src={article.gambar} alt={article.judul} className="w-full h-auto max-h-80 object-cover" />}
                    <div className="p-6">
                        <div className="flex items-center text-sm text-neutral-500 mb-4">
                            <CalendarIcon className="h-4 w-4 mr-1.5" />
                            <span>Diterbitkan: {formatDate(article.tanggal)}</span>
                        </div>
                        <article className="prose max-w-none text-neutral-700 text-justify">
                            {article.content_delta ? (
                                <div dangerouslySetInnerHTML={{ __html: typeof article.content_delta === 'string' ? article.content_delta : JSON.stringify(article.content_delta) }} />
                            ) : (
                                contentParagraphs?.map((p, index) => (
                                    <p key={index}>{p}</p>
                                ))
                            )}
                        </article>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleModal;