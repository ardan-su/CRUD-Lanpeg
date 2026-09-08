import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { type KolomSiswaAPI } from '../../types';
import { ClipboardDocumentListIcon, UserIcon, CalendarIcon, ChevronRightIcon } from '../../components/icons';

const API_URL = 'http://localhost:5001/api/kolom_siswa/';

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Tanggal tidak valid";
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};

const getCategoryColor = (kategori?: string): string => {
    const colors: Record<string, string> = {
        'Jurnal': 'bg-blue-100 text-blue-800',
        'Cerpen': 'bg-purple-100 text-purple-800',
        'Puisi': 'bg-pink-100 text-pink-800',
        'Esai': 'bg-green-100 text-green-800',
        'Artikel': 'bg-yellow-100 text-yellow-800',
        'Opini': 'bg-orange-100 text-orange-800',
        'Resensi': 'bg-teal-100 text-teal-800',
        'Lainnya': 'bg-gray-100 text-gray-800',
    };
    return colors[kategori || ''] || 'bg-gray-100 text-gray-800';
};

const ArticleCard: React.FC<{ article: KolomSiswaAPI }> = ({ article }) => {
    const imageUrl = article.gambar || `https://picsum.photos/seed/siswa${article.id}/800/400`;
    // Strip HTML tags for summary
    const plainText = (article.konten || "").replace(/<[^>]+>/g, '');
    const summary = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
    const detailLink = `/informasi/kolom-siswa/${article.slug}`;

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full group">
            <div className="overflow-hidden h-56 relative">
                <Link to={detailLink} className="block w-full h-full">
                    <img src={imageUrl} alt={article.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    {article.kategori && (
                        <div className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full shadow-sm ${getCategoryColor(article.kategori)}`}>
                            {article.kategori}
                        </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        {article.kelas || 'Siswa'}
                    </div>
                </Link>
            </div>
            <div className="p-6 flex flex-col flex-grow relative">
                <h3 className="font-heading text-xl font-bold text-neutral-800 mb-2 group-hover:text-primary transition-colors leading-tight">
                    <Link to={detailLink}>
                        {article.judul}
                    </Link>
                </h3>
                
                <div className="flex flex-wrap items-center text-xs text-neutral-500 mb-4 gap-x-4 gap-y-1">
                    <div className="flex items-center">
                        <UserIcon className="h-3.5 w-3.5 mr-1.5 text-primary" />
                        <span>{article.nama_siswa}</span>
                    </div>
                    <div className="flex items-center">
                        <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-primary" />
                        <span>{formatDate(article.created_at)}</span>
                    </div>
                    {article.angkatan && (
                        <div className="flex items-center">
                            <svg className="h-3.5 w-3.5 mr-1.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                            <span>Angkatan {article.angkatan}</span>
                        </div>
                    )}
                </div>

                <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3 flex-grow mb-4">
                    {summary}
                </p>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-end">
                    <Link to={detailLink} className="flex items-center text-primary font-semibold text-sm group-hover:underline">
                        Baca Karya <ChevronRightIcon className="h-4 w-4 ml-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

const KolomSiswa: React.FC = () => {
    const [articles, setArticles] = useState<KolomSiswaAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterKategori, setFilterKategori] = useState('');
    const [filterAngkatan, setFilterAngkatan] = useState('');
    const [filterKelas, setFilterKelas] = useState('');

    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(API_URL);
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setArticles(result.data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArticles();
    }, []);

    // Extract unique values for filters
    const categories = useMemo(() => {
        return Array.from(new Set(articles.map(a => a.kategori).filter(Boolean) as string[])).sort();
    }, [articles]);

    const angkatanList = useMemo(() => {
        return Array.from(new Set(articles.map(a => a.angkatan).filter(Boolean) as string[])).sort().reverse();
    }, [articles]);

    const kelasList = useMemo(() => {
        return Array.from(new Set(articles.map(a => a.kelas).filter(Boolean) as string[])).sort();
    }, [articles]);

    // Filtered articles
    const filteredArticles = useMemo(() => {
        return articles.filter(a => {
            const matchKategori = !filterKategori || a.kategori === filterKategori;
            const matchAngkatan = !filterAngkatan || a.angkatan === filterAngkatan;
            const matchKelas = !filterKelas || a.kelas === filterKelas;
            return matchKategori && matchAngkatan && matchKelas;
        });
    }, [articles, filterKategori, filterAngkatan, filterKelas]);

    const hasFilters = categories.length > 0 || angkatanList.length > 0 || kelasList.length > 0;

    return (
        <section id="kolom-siswa">
            <h2 className="font-heading text-3xl font-bold text-primary mb-2">Kolom Siswa</h2>
            <div className="w-20 h-1 bg-accent mb-6"></div>
            <p className="text-neutral-600 mb-8 max-w-prose">
                Ruang kreativitas bagi siswa-siswi kami untuk menuangkan ide dan gagasan mereka dalam bentuk tulisan.
            </p>

            {/* Filters */}
            {!isLoading && hasFilters && (
                <div className="mb-8 space-y-4">
                    {/* Category chips */}
                    {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-sm font-medium text-neutral-500 mr-1">Kategori:</span>
                            <button
                                onClick={() => setFilterKategori('')}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${!filterKategori ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                Semua
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilterKategori(filterKategori === cat ? '' : cat)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${filterKategori === cat ? 'bg-primary text-white' : getCategoryColor(cat) + ' hover:opacity-80'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Dropdown filters */}
                    {(angkatanList.length > 0 || kelasList.length > 0) && (
                        <div className="flex flex-wrap gap-3">
                            {angkatanList.length > 0 && (
                                <select
                                    value={filterAngkatan}
                                    onChange={e => setFilterAngkatan(e.target.value)}
                                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:ring-2 focus:ring-primary focus:outline-none"
                                >
                                    <option value="">Semua Angkatan</option>
                                    {angkatanList.map(a => (
                                        <option key={a} value={a}>Angkatan {a}</option>
                                    ))}
                                </select>
                            )}
                            {kelasList.length > 0 && (
                                <select
                                    value={filterKelas}
                                    onChange={e => setFilterKelas(e.target.value)}
                                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:ring-2 focus:ring-primary focus:outline-none"
                                >
                                    <option value="">Semua Kelas</option>
                                    {kelasList.map(k => (
                                        <option key={k} value={k}>{k}</option>
                                    ))}
                                </select>
                            )}
                            {(filterKategori || filterAngkatan || filterKelas) && (
                                <button
                                    onClick={() => { setFilterKategori(''); setFilterAngkatan(''); setFilterKelas(''); }}
                                    className="text-xs text-red-600 hover:text-red-800 underline self-center"
                                >
                                    Reset Filter
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {isLoading ? (
                    <div className="col-span-full text-center py-20">Memuat...</div>
                ) : filteredArticles.length > 0 ? (
                    filteredArticles.map(article => <ArticleCard key={article.id} article={article} />)
                ) : (
                    <div className="col-span-full text-center py-10 text-neutral-500">
                        <ClipboardDocumentListIcon className="h-12 w-12 mx-auto mb-2 text-neutral-300" />
                        <p>{filterKategori || filterAngkatan || filterKelas ? 'Tidak ada karya yang sesuai filter.' : 'Belum ada karya siswa.'}</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default KolomSiswa;