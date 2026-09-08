import React, { useState, useEffect } from 'react';
import { type KemitraanAPI, type KemitraanItemAPI } from '../../types';
import { ClipboardDocumentListIcon, UserIcon, AcademicCapIcon, XIcon } from '../../components/icons';

const API_BASE_URL = 'http://localhost:5001';
// Main endpoint for the section title and description
const KEMITRAAN_API_URL = `${API_BASE_URL}/api/profil_yayasan/kemitraan/`;
// Base URL for partner item icons
const STORAGE_URL = `${API_BASE_URL}/storage/profil_yayasan/kemitraan/`;

// --- UI Components for different states ---

/**
 * Renders a skeleton loader while data is being fetched.
 */
const KemitraanSkeleton: React.FC = () => (
    <section id="kemitraan" className="animate-pulse" aria-label="Loading partnership data">
        <div className="h-8 bg-neutral-200 rounded w-1/3 mb-2"></div>
        <div className="w-20 h-1 bg-neutral-200 mb-6"></div>
        <div className="prose prose-lg max-w-none space-y-4">
            <div className="h-4 bg-neutral-200 rounded w-full"></div>
            <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
        </div>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center">
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-24 h-24 bg-neutral-200 rounded-lg"></div>
                    <div className="h-4 bg-neutral-200 rounded w-20"></div>
                </div>
            ))}
        </div>
    </section>
);

/**
 * Renders a static fallback view for error states or when API data is unavailable.
 */
const StaticKemitraan: React.FC<{ error?: string | null }> = ({ error }) => (
    <section id="kemitraan">
        {error && (
            <div className="bg-orange-50 border-l-4 border-orange-400 text-orange-800 p-4 mb-6 rounded-md" role="alert">
                <p className="font-bold">Informasi Tidak Dapat Dimuat</p>
                <p>Kami mengalami kendala saat mengambil data kemitraan. Sebagai gantinya, kami menampilkan informasi umum. Error: {error}</p>
            </div>
        )}
        <h2 className="font-heading text-3xl font-bold text-primary mb-2">Kemitraan</h2>
        <div className="w-20 h-1 bg-accent mb-6"></div>
        <div className="prose prose-lg max-w-none text-neutral-600 space-y-4">
            <p>Untuk meningkatkan mutu pelayanan, kami menjalin kemitraan strategis dengan berbagai lembaga dan institusi terkemuka di bidang pendidikan, teknologi, dan pengembangan sumber daya manusia.</p>
        </div>
        <div className="mt-10 text-center py-12 px-6 bg-neutral-100 rounded-xl">
            <ClipboardDocumentListIcon className="h-12 w-12 text-neutral-400 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-neutral-700">Mitra Kami</h3>
            <p className="text-neutral-500 max-w-md mx-auto">Daftar lengkap mitra kami akan segera ditampilkan di sini. Kami bekerja sama dengan para ahli untuk memberikan yang terbaik.</p>
        </div>
    </section>
);

// --- Main Page Component ---

const Kemitraan: React.FC = () => {
    const [kemitraanData, setKemitraanData] = useState<KemitraanAPI | null>(null);
    const [items, setItems] = useState<KemitraanItemAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Step 1: Fetch the main partnership section data.
                const kemitraanRes = await fetch(KEMITRAAN_API_URL);
                if (!kemitraanRes.ok) {
                    throw new Error(`Gagal mengambil data utama kemitraan (status: ${kemitraanRes.status})`);
                }
                const kemitraanResult = await kemitraanRes.json();
                const mainData = kemitraanResult.data?.[0];

                if (!kemitraanResult.success || !mainData) {
                    throw new Error('Data utama kemitraan tidak valid atau tidak ditemukan.');
                }
                setKemitraanData(mainData);

                // Step 2: Use the ID from the main data to fetch the specific partner items.
                const kemitraanId = mainData.id;
                if (!kemitraanId) {
                    console.warn("Kemitraan ID not found, cannot fetch partner items.");
                    setItems([]);
                    return;
                }

                const itemsApiUrl = `${API_BASE_URL}/api/profil_yayasan/kemitraan-item/${kemitraanId}`;

                const itemsRes = await fetch(itemsApiUrl);
                if (!itemsRes.ok) {
                    console.warn(`Gagal mengambil daftar item kemitraan (status: ${itemsRes.status})`);
                    setItems([]);
                } else {
                    const itemsResult = await itemsRes.json();
                    if (itemsResult.success && Array.isArray(itemsResult.data)) {
                        setItems(itemsResult.data);
                    } else {
                        console.warn('Data item kemitraan tidak valid atau kosong.');
                        setItems([]);
                    }
                }
            } catch (err: any) {
                // This catch block handles failures from the primary KEMITRAAN_API_URL fetch.
                setError(err.message || 'Terjadi kesalahan yang tidak diketahui saat mengambil data.');
                console.error("Fetch error for Kemitraan data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <KemitraanSkeleton />;
    }
    
    // If the main data fetch failed, show the fallback.
    if (error || !kemitraanData) {
        return <StaticKemitraan error={error} />;
    }

    // Main render when data is available
    return (
        <section id="kemitraan">
            <h2 className="font-heading text-3xl font-bold text-primary mb-2">{kemitraanData.judul}</h2>
            <div className="w-20 h-1 bg-accent mb-6"></div>
            <div className="prose prose-lg max-w-none text-neutral-600 space-y-4">
                <p>{kemitraanData.deskripsi}</p>
            </div>
            
            {items.length > 0 ? (
                 <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center">
                    {items.map(item => (
                        <div key={item.id} className="text-center transition-transform duration-300 hover:scale-110" title={item.nama}>
                            <img 
                                src={`${STORAGE_URL}${item.icon}`}
                                alt={item.nama}
                                className="h-24 mx-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mt-10 text-center py-10 text-neutral-500 bg-neutral-50 rounded-lg">
                    <ClipboardDocumentListIcon className="h-12 w-12 text-neutral-400 mx-auto mb-2" />
                    <p className="font-semibold">Informasi Mitra Belum Tersedia</p>
                    <p className="text-sm">Kami sedang memperbarui daftar mitra kami.</p>
                </div>
            )}
        </section>
    );
};

export default Kemitraan;