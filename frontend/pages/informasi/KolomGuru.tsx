import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type KolomGuruAPI } from '../../types';
import { ClipboardDocumentListIcon, UserIcon, CalendarIcon, ChevronRightIcon } from '../../components/icons';

const API_BASE_URL = 'http://localhost:5001';
const API_URL = `${API_BASE_URL}/api/kolom_guru/`;

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Tanggal tidak valid";
    return date.toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric'
    });
};

const ArticleCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse h-full">
        <div className="bg-neutral-200 h-56 w-full"></div>
        <div className="p-6">
            <div className="h-6 bg-neutral-200 rounded w-3/4 mb-4"></div>
            <div className="flex space-x-4 mb-4">
                <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-full"></div>
                <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
            </div>
        </div>
    </div>
);

const ArticleCard: React.FC<{ article: KolomGuruAPI }> = ({ article }) => {
    const imageUrl = article.image || `https://picsum.photos/seed/guru${article.id}/800/400`;
    // Ensure konten is a string before splitting
    const summary = (article.konten || "").split('\n')[0].substring(0, 150) + '...';
    const detailLink = `/informasi/kolom-guru/${article.slug}`;

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full group">
            <div className="overflow-hidden h-56 relative">
                <Link to={detailLink} className="block w-full h-full">
                    <img 
                        src={imageUrl} 
                        alt={article.judul} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        loading="lazy" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                        <p className="text-xs font-bold bg-primary/80 px-2 py-1 rounded inline-block mb-1">Guru</p>
                    </div>
                </Link>
            </div>
            <div className="p-6 flex flex-col flex-grow relative">
                <h3 className="font-heading text-xl font-bold text-neutral-800 mb-2 group-hover:text-primary transition-colors leading-tight">
                    <Link to={detailLink}>
                        {article.judul}
                    </Link>
                </h3>
                
                <div className="flex items-center text-xs text-neutral-500 mb-4 space-x-4">
                    <div className="flex items-center">
                        <UserIcon className="h-3.5 w-3.5 mr-1.5 text-primary" />
                        <span>{article.penulis}</span>
                    </div>
                    <div className="flex items-center">
                        <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-primary" />
                        <span>{formatDate(article.tanggal)}</span>
                    </div>
                </div>

                <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3 flex-grow mb-4">
                    {summary}
                </p>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-end">
                    <Link to={detailLink} className="flex items-center text-primary font-semibold text-sm group-hover:underline">
                        Baca Selengkapnya <ChevronRightIcon className="h-4 w-4 ml-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

const KolomGuru: React.FC = () => {
    const [articles, setArticles] = useState<KolomGuruAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error(`Gagal mengambil data: ${response.statusText}`);
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    const publishedArticles = result.data
                        .filter((item: KolomGuruAPI) => item.status === 'published')
                        .sort((a: KolomGuruAPI, b: KolomGuruAPI) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
                    setArticles(publishedArticles);
                } else {
                    throw new Error('Format data API tidak valid.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchArticles();
    }, []);

    if (error) {
        return <div className="bg-red-50 p-4 rounded text-red-600 text-center font-bold">{error}</div>;
    }

    return (
        <section id="kolom-guru">
            <h2 className="font-heading text-3xl font-bold text-primary mb-2">Kolom Guru</h2>
            <div className="w-20 h-1 bg-accent mb-6"></div>
            <p className="text-neutral-600 mb-10 max-w-prose">
                Wadah bagi para guru kami untuk berbagi tulisan, pemikiran, dan inovasi dalam dunia pendidikan.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {isLoading ? (
                    <>
                        <ArticleCardSkeleton />
                        <ArticleCardSkeleton />
                    </>
                ) : articles.length > 0 ? (
                    articles.map(article => <ArticleCard key={article.id} article={article} />)
                ) : (
                    <div className="col-span-full text-center py-10 text-neutral-500">
                        <ClipboardDocumentListIcon className="h-12 w-12 mx-auto mb-2 text-neutral-300" />
                        <p>Belum ada tulisan.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default KolomGuru;