import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { type KolomAlumniAPI } from '../../types';
import { ChevronLeftIcon, UserIcon, AcademicCapIcon, EyeIcon } from '../../components/icons';
import { updateMetaTags, resetMetaTags, stripHtml } from '../../lib/metaTags';
import { getCanonicalShareUrl } from '../../lib/shareLinks';

const API_BASE_URL = 'http://localhost:5001';
const API_URL = `${API_BASE_URL}/api/kolom_alumni/`;
const STORAGE_URL = `${API_BASE_URL}/storage/kolom_alumni/`;

const KolomAlumniDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [alumni, setAlumni] = useState<KolomAlumniAPI | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Share functions
    const shareToFacebook = () => {
        const url = encodeURIComponent(getCanonicalShareUrl(`/informasi/kolom-alumni/${alumni?.slug || slug || ''}`));
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
    };

    const shareToTwitter = () => {
        const url = encodeURIComponent(getCanonicalShareUrl(`/informasi/kolom-alumni/${alumni?.slug || slug || ''}`));
        const text = encodeURIComponent(alumni?.judul || 'Kisah Alumni');
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
    };

    const shareToWhatsApp = () => {
        const shareUrl = getCanonicalShareUrl(`/informasi/kolom-alumni/${alumni?.slug || slug || ''}`);
        const text = encodeURIComponent(`${alumni?.judul || 'Kisah Alumni'} - ${shareUrl}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    useEffect(() => {
        const fetchDetail = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('Network error');
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    const found = result.data.find((item: KolomAlumniAPI) => item.slug === slug);
                    if (found) setAlumni(found);
                    else setError('Kisah tidak ditemukan.');
                }
            } catch (err: any) {
                setError('Gagal memuat kisah.');
            } finally {
                setIsLoading(false);
            }
        };
        if (slug) fetchDetail();

        return () => resetMetaTags();
    }, [slug]);

    // Update OG meta tags when alumni data is loaded
    useEffect(() => {
        if (alumni) {
            const imageUrl = alumni.gambar
                ? (alumni.gambar.startsWith('http') ? alumni.gambar : `${STORAGE_URL}${alumni.gambar}`)
                : null;
            updateMetaTags({
                title: alumni.judul,
                description: stripHtml(alumni.isi || '').substring(0, 200),
                image: imageUrl,
                url: getCanonicalShareUrl(`/informasi/kolom-alumni/${alumni.slug}`),
            });
        }
    }, [alumni]);

    if (isLoading) return <div className="text-center py-20">Memuat...</div>;
    if (error || !alumni) return <div className="text-center py-20 text-red-500">{error || 'Tidak ditemukan'}</div>;

    const getImageUrl = (imageName: string | null) => {
        if (!imageName) return `https://ui-avatars.com/api/?name=${alumni.nama_alumni.replace(' ', '+')}&background=1A6DB5&color=fff&size=500`;
        if (imageName.startsWith('http')) return imageName;
        return `${STORAGE_URL}${imageName}`;
    };

    return (
        <article className="max-w-4xl mx-auto">
            <Link to="/informasi/kolom-alumni" className="inline-flex items-center text-neutral-500 hover:text-primary mb-6 transition-colors font-medium">
                <ChevronLeftIcon className="h-5 w-5 mr-1" /> Kembali ke Kolom Alumni
            </Link>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="relative h-64 md:h-80 bg-neutral-100">
                    <img
                        src={getImageUrl(alumni.gambar)}
                        alt={alumni.nama_alumni}
                        className="w-full h-full object-cover object-top opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white w-full">
                        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">{alumni.judul}</h1>
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-100 text-gray-600">
                        <div className="flex items-center">
                            <UserIcon className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-bold">{alumni.nama_alumni}</span>
                        </div>
                        <div className="flex items-center">
                            <AcademicCapIcon className="h-5 w-5 mr-2 text-primary" />
                            <span>Angkatan {alumni.angkatan}</span>
                        </div>
                        {alumni.views !== undefined && (
                            <div className="flex items-center ml-auto text-sm text-gray-400">
                                <EyeIcon className="h-4 w-4 mr-1.5" /> {alumni.views} Reads
                            </div>
                        )}
                    </div>

                    <div
                        className="prose prose-lg max-w-none text-neutral-700 italic leading-relaxed prose-img:rounded-xl prose-img:shadow-lg prose-img:my-4 [&_img]:!max-w-full [&_img[style*='float']]:!mx-0 [&_img[style*='float']]:!my-0 after:content-[''] after:block after:clear-both"
                        dangerouslySetInnerHTML={{ __html: alumni.isi || "" }}
                    />

                    <div className="mt-12 pt-8 border-t border-neutral-200">
                        <h3 className="font-bold text-lg text-neutral-900 mb-4">Bagikan Kisah Ini</h3>
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

export default KolomAlumniDetail;
