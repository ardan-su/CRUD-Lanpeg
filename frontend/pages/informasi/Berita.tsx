import React, { useState, useMemo, useEffect } from 'react';
import NewsCard from '../../components/NewsCard';
import { type NewsArticle, type BeritaArtikelAPI } from '../../types';
import { ChevronLeftIcon, ChevronRightIcon } from '../../components/icons';

const API_BASE_URL = 'http://localhost:5001';
const API_URL = `${API_BASE_URL}/api/berita-artikel/`;
const ITEMS_PER_PAGE = 18; // Jumlah berita per halaman (Updated to 18)

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

// Robust HTML stripper that handles encoded entities and JSON artifacts
const stripHtml = (html: string) => {
    if (!html) return "";
    
    let cleaned = html;
    
    // 1. Clean JSON artifacts
    cleaned = cleaned.replace(/\\r\\n/g, ' '); 
    cleaned = cleaned.replace(/\\n/g, ' ');
    cleaned = cleaned.replace(/\\"/g, '"');
    
    // 2. Decode entities (convert &lt;p&gt; to <p>)
    const txt = document.createElement("textarea");
    txt.innerHTML = cleaned;
    const decodedHtml = txt.value;

    // 3. Parse HTML and extract text content
    const doc = new DOMParser().parseFromString(decodedHtml, 'text/html');
    return doc.body.textContent || "";
};

const NewsCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse h-full">
        <div className="bg-neutral-200 h-48 w-full"></div>
        <div className="p-6">
            <div className="flex justify-between items-center mb-2">
                <div className="h-5 w-20 bg-neutral-200 rounded-full"></div>
                <div className="h-4 w-24 bg-neutral-200 rounded"></div>
            </div>
            <div className="h-6 bg-neutral-200 rounded w-3/4 mb-3"></div>
            <div className="space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-full"></div>
                <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
            </div>
        </div>
    </div>
);


const Berita: React.FC = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState('Semua');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`Gagal mengambil data: ${response.statusText}`);
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    const sortedArticles: BeritaArtikelAPI[] = result.data
                        .sort((a: BeritaArtikelAPI, b: BeritaArtikelAPI) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
                    
                    const formattedArticles = sortedArticles.map((item: BeritaArtikelAPI): NewsArticle => ({
                            id: item.id,
                            title: item.judul,
                            category: item.kategori,
                            date: formatDate(item.tanggal),
                            image: item.gambar,
                            slug: item.slug,
                            description: stripHtml(item.deskripsi) // Apply advanced stripping
                        }));
                    setArticles(formattedArticles);
                } else {
                    throw new Error('Format data API tidak valid.');
                }
            } catch (err: any) {
                console.error('Gagal mengambil data berita:', err);
                setArticles([]);
                setError(err.message || 'Terjadi kesalahan saat memuat berita.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, []);
    
    // Reset page to 1 when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    const categories = useMemo(() => {
        if (articles.length > 0) {
            return ['Semua', ...Array.from(new Set(articles.map(a => a.category)))];
        }
        return ['Semua'];
    }, [articles]);

    const filteredArticles = useMemo(() => {
        if (filter === 'Semua') {
            return articles;
        }
        return articles.filter(article => article.category === filter);
    }, [filter, articles]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentArticles = filteredArticles.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        // Scroll to top of section smoothly
        const section = document.getElementById('berita-artikel');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="berita-artikel">
             <h2 className="font-heading text-3xl font-bold text-primary mb-2">Berita & Artikel</h2>
            <div className="w-20 h-1 bg-accent mb-6"></div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                    <p className="font-bold">Gagal Memuat Data</p>
                    <p>{error}</p>
                </div>
            )}

            <div className="flex flex-wrap gap-2 mb-10">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setFilter(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === category 
                            ? 'bg-primary text-white' 
                            : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                    <>
                        <NewsCardSkeleton />
                        <NewsCardSkeleton />
                        <NewsCardSkeleton />
                    </>
                ) : currentArticles.length > 0 ? (
                    currentArticles.map(article => (
                        <NewsCard 
                            key={article.id} 
                            article={article} 
                            basePath="/informasi/berita"
                        />
                    ))
                ) : (
                    <div className="md:col-span-2 lg:col-span-3 text-center py-10 text-neutral-500">
                        <p>Tidak ada berita yang ditemukan untuk kategori ini.</p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {!isLoading && totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Previous Page"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                currentPage === page
                                    ? 'bg-primary text-white border border-primary'
                                    : 'bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-100'
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Next Page"
                    >
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>
            )}
        </section>
    );
};

export default Berita;