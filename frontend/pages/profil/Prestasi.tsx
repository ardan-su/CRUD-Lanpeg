import React, { useState, useEffect } from 'react';
import { type PrestasiAPI, type PrestasiItemAPI, type PrestasiGabungan } from '../../types';
import { TrophyIcon } from '../../components/icons';

const API_BASE_URL = 'http://localhost:5001';
const PRESTASI_API_URL = `${API_BASE_URL}/api/profil_yayasan/prestasi/`;
const PRESTASI_ITEM_API_URL = `${API_BASE_URL}/api/profil_yayasan/prestasi-item/`;
const STORAGE_URL = `${API_BASE_URL}/storage/`;

// Skeleton component for loading state
const PrestasiSkeleton: React.FC = () => (
    <section id="prestasi" className="animate-pulse">
        <div className="h-8 bg-neutral-200 rounded w-1/3 mb-2"></div>
        <div className="w-20 h-1 bg-neutral-200 mb-6"></div>
        <div className="space-y-10">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                    <div className="h-7 w-1/2 bg-neutral-200 rounded mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 w-full bg-neutral-200 rounded"></div>
                        <div className="h-4 w-5/6 bg-neutral-200 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

// Static fallback component
const StaticPrestasi: React.FC<{ error?: string | null }> = ({ error }) => {
    const staticData = {
        'TKIT AL FIDAA': ['Juara 1 lomba sholat berjamaah', 'Juara 1 lomba hafalan quran'],
        'SDIT AL FIDAA': ['Juara 1 MTQ tingkat Kabupaten', 'Juara 3 OSN IPA Kecamatan'],
        'SMP IT AL FIDAA': ['Juara 2 lomba story telling se-jabodetabek', 'Juara 1 lomba speech contest'],
    };
    return (
         <section id="prestasi">
            {error && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md" role="alert">
                    <p className="font-bold">Gagal memuat data</p>
                    <p>Menampilkan konten statis. Error: {error}</p>
                </div>
            )}
            <h2 className="font-heading text-3xl font-bold text-primary mb-2">Prestasi</h2>
            <div className="w-20 h-1 bg-accent mb-6"></div>
            <div className="space-y-10">
                {Object.entries(staticData).map(([jenjang, achievements]) => (
                    <div key={jenjang}>
                        <h3 className="font-body text-2xl font-bold text-neutral-800 mb-4">{jenjang}</h3>
                        <div className="space-y-2">
                            {achievements.map((item, index) => (
                                <p key={index} className="text-neutral-600 flex items-start">
                                    <TrophyIcon className="h-5 w-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                                    <span>{item}</span>
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

// Component for a single achievement section
const AchievementSection: React.FC<{ data: PrestasiGabungan }> = ({ data }) => {
    const [visibleImages, setVisibleImages] = useState<string[]>([]);

    useEffect(() => {
        const images = data.items.map(item => item.gambar).filter(Boolean) as string[];
        setVisibleImages(images.slice(0, 2)); // Show first 2 images by default
    }, [data]);

    return (
        <div>
            <h3 className="font-body text-2xl font-bold text-neutral-800 mb-4">{data.judul}</h3>
            <div className="space-y-3">
                {data.items.map(item => (
                    <p key={item.id} className="text-neutral-600 flex items-start">
                         <TrophyIcon className="h-5 w-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                         <span>{item.deskripsi}</span>
                    </p>
                ))}
            </div>
            {visibleImages.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-4">
                    {visibleImages.map((gambar, index) => (
                        <img 
                            key={index} 
                            src={`${STORAGE_URL}${gambar}`} 
                            alt={`Dokumentasi Prestasi ${data.judul}`} 
                            className="w-full sm:w-1/2 md:w-1/3 max-w-xs h-auto rounded-lg shadow-md object-cover" 
                            loading="lazy"
                        />
                    ))}
                </div>
            )}
        </div>
    );
};


const Prestasi: React.FC = () => {
    const [prestasi, setPrestasi] = useState<PrestasiGabungan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllPrestasi = async () => {
            setIsLoading(true);
            try {
                // 1. Fetch the list of jenjang (levels)
                const jenjangRes = await fetch(PRESTASI_API_URL);
                if (!jenjangRes.ok) throw new Error('Gagal mengambil daftar jenjang prestasi.');
                const jenjangResult = await jenjangRes.json();
                if (!jenjangResult.success || !Array.isArray(jenjangResult.data)) {
                    throw new Error('Format data jenjang tidak valid.');
                }
                const jenjangList: PrestasiAPI[] = jenjangResult.data;

                // 2. Fetch all prestasi items for each jenjang concurrently
                const itemPromises = jenjangList.map(jenjang =>
                    fetch(`${PRESTASI_ITEM_API_URL}${jenjang.id}`).then(res => res.json())
                );
                const itemResults = await Promise.all(itemPromises);

                // 3. Combine jenjang data with its items
                const combinedData = jenjangList.map((jenjang, index) => {
                    const itemsResult = itemResults[index];
                    return {
                        ...jenjang,
                        items: (itemsResult.success && Array.isArray(itemsResult.data)) ? itemsResult.data : []
                    };
                });

                setPrestasi(combinedData);

            } catch (err: any) {
                setError(err.message || "Terjadi kesalahan saat memuat data prestasi.");
                console.error("Fetch Prestasi Error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllPrestasi();
    }, []);

    if (isLoading) {
        return <PrestasiSkeleton />;
    }

    if (error || prestasi.length === 0) {
        return <StaticPrestasi error={error} />;
    }

    return (
        <section id="prestasi">
            <h2 className="font-heading text-3xl font-bold text-primary mb-2">Prestasi</h2>
            <div className="w-20 h-1 bg-accent mb-6"></div>
            
            <div className="space-y-12">
                {prestasi
                    .filter(p => p.items.length > 0) // Only show levels that have achievements
                    .map(data => (
                        <AchievementSection key={data.id} data={data} />
                    ))}
            </div>
        </section>
    );
};

export default Prestasi;