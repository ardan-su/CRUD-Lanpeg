import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { type MajalahDigitalAPI } from '../../types';
import { CalendarIcon, ChevronLeftIcon, BookOpenIcon } from '../../components/icons';
import { updateMetaTags, resetMetaTags, stripHtml } from '../../lib/metaTags';
import { getCanonicalShareUrl } from '../../lib/shareLinks';

const API_BASE_URL = 'http://localhost:5001';
const API_URL = `${API_BASE_URL}/api/majalah_digital/`;
const STORAGE_URL = `${API_BASE_URL}/storage/majalah_digital/`;

const formatDate = (dateString: string | null) => {
    if (!dateString) return "Belum ditentukan";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Tanggal tidak valid";
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

const MajalahDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [magazine, setMagazine] = useState<MajalahDigitalAPI | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Share functions
    const shareToFacebook = () => {
        const url = encodeURIComponent(getCanonicalShareUrl(`/informasi/majalah/${magazine?.slug || slug || ''}`));
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
    };

    const shareToTwitter = () => {
        const url = encodeURIComponent(getCanonicalShareUrl(`/informasi/majalah/${magazine?.slug || slug || ''}`));
        const text = encodeURIComponent(magazine?.judul || 'Majalah Digital');
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
    };

    const shareToWhatsApp = () => {
        const shareUrl = getCanonicalShareUrl(`/informasi/majalah/${magazine?.slug || slug || ''}`);
        const text = encodeURIComponent(`${magazine?.judul || 'Majalah Digital'} - ${shareUrl}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    useEffect(() => {
        const fetchMagazine = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('Gagal mengambil data.');
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    const found = result.data.find((item: MajalahDigitalAPI) => item.slug === slug);
                    if (found) setMagazine(found);
                    else setError('Majalah tidak ditemukan.');
                } else {
                    throw new Error('Data tidak valid.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan.');
            } finally {
                setIsLoading(false);
            }
        };
        if (slug) fetchMagazine();

        return () => resetMetaTags();
    }, [slug]);

    // Update OG meta tags when magazine data is loaded
    useEffect(() => {
        if (magazine) {
            updateMetaTags({
                title: magazine.judul,
                description: stripHtml(magazine.deskripsi || '').substring(0, 200),
                image: magazine.cover_image,
                url: getCanonicalShareUrl(`/informasi/majalah/${magazine.slug}`),
            });
        }
    }, [magazine]);

    if (isLoading) {
        return <div className="text-center py-20 text-neutral-500">Memuat data majalah...</div>;
    }

    if (error || !magazine) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Majalah Tidak Ditemukan</h2>
                <Link to="/informasi/majalah" className="text-primary hover:underline">&larr; Kembali ke Daftar</Link>
            </div>
        );
    }

    const coverUrl = magazine.cover_image
        ? magazine.cover_image
        : `https://picsum.photos/seed/mag-${magazine.id}/400/565`;

    const fileUrl = magazine.file_url ? `${STORAGE_URL}${magazine.file_url}` : null;
    const isPublished = magazine.status === 'published';

    return (
        <article className="max-w-5xl mx-auto">
            <Link to="/informasi/majalah" className="inline-flex items-center text-neutral-500 hover:text-primary mb-8 font-medium">
                <ChevronLeftIcon className="h-5 w-5 mr-1" /> Kembali ke Daftar Majalah
            </Link>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 bg-neutral-100 relative">
                    <img
                        src={coverUrl}
                        alt={`Cover ${magazine.judul}`}
                        className="w-full h-full object-contain p-4"
                    />
                </div>
                <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col">
                    <div className="mb-6">
                        <h1 className="font-heading text-3xl md:text-4xl font-bold text-neutral-900 mb-4">{magazine.judul}</h1>
                        <div className="flex items-center text-neutral-500 text-sm">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            <span>Rilis: {formatDate(magazine.tanggal_rilis)}</span>
                            <span className="mx-3">•</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {isPublished ? 'TERBIT' : 'SEGERA'}
                            </span>
                        </div>
                    </div>

                    <div
                        className="prose text-neutral-600 mb-8 flex-grow prose-img:rounded-xl prose-img:shadow-lg prose-img:my-4 [&_img]:!max-w-full [&_img[style*='float']]:!mx-0 [&_img[style*='float']]:!my-0 after:content-[''] after:block after:clear-both"
                        dangerouslySetInnerHTML={{ __html: magazine.deskripsi || "" }}
                    />

                    <div className="pt-6 border-t border-neutral-100">
                        {isPublished && fileUrl ? (
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center bg-primary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-opacity-90 hover:scale-105 transition-all"
                            >
                                <BookOpenIcon className="h-5 w-5 mr-2" />
                                Baca Majalah Sekarang
                            </a>
                        ) : (
                            <button disabled className="bg-neutral-300 text-neutral-500 font-bold py-3 px-8 rounded-full cursor-not-allowed">
                                Belum Tersedia
                            </button>
                        )}
                        <p className="mt-4 text-xs text-neutral-400">
                            *Majalah akan dibuka di tab baru dalam format PDF atau flipbook.
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-neutral-200">
                        <h3 className="font-bold text-lg text-neutral-900 mb-4">Bagikan Majalah Ini</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={shareToFacebook}
                                className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </button>
                            <button
                                onClick={shareToTwitter}
                                className="bg-sky-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-sky-600 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                                Twitter
                            </button>
                            <button
                                onClick={shareToWhatsApp}
                                className="bg-green-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default MajalahDetail;
