import React, { useState, useEffect } from 'react';
import { type SejarahAPI } from '../../types';

const API_BASE_URL = 'http://localhost:5001/api/profil_yayasan/sejarah/';

const SejarahSkeleton: React.FC = () => (
    <section id="sejarah" className="animate-pulse">
        <div className="h-8 bg-neutral-200 rounded w-1/2 mb-2"></div>
        <div className="w-20 h-1 bg-neutral-200 mb-6"></div>
        <div className="prose prose-lg max-w-none space-y-4">
            <div className="h-4 bg-neutral-200 rounded w-full"></div>
            <div className="h-4 bg-neutral-200 rounded w-full"></div>
            <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
            <div className="h-4 bg-neutral-200 rounded w-full"></div>
            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
        </div>
    </section>
);

const StaticSejarah: React.FC<{ error?: string | null }> = ({ error }) => (
    <section id="sejarah">
        {error && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md" role="alert">
                <p className="font-bold">Gagal memuat data</p>
                <p>Menampilkan konten statis. Error: {error}</p>
            </div>
        )}
        <h2 className="font-heading text-3xl font-bold text-primary mb-2">Sejarah Singkat</h2>
        <div className="w-20 h-1 bg-accent mb-6"></div>
        <div className="prose prose-lg max-w-none text-neutral-600 space-y-4 text-justify">
            <p>
                SMK PKP 1 Jakarta Islamic School merupakan Sekolah Menengah Kejuruan Islam yang
                berkomitmen mencetak lulusan berkualitas di Jakarta. Dengan semangat pengabdian
                dan dedikasi, sekolah ini hadir untuk menjawab kebutuhan masyarakat akan
                pendidikan kejuruan berbasis nilai-nilai Islami.
            </p>
            <p>
                [Konten sejarah sekolah akan diperbarui. Silakan update melalui panel admin &rarr; Profil &rarr; Sejarah Singkat.]
            </p>
            <p>
                Sejak berdiri, SMK PKP 1 Jakarta Islamic School terus berkembang dengan fasilitas
                yang semakin lengkap, tenaga pendidik yang berpengalaman, dan program kejuruan
                yang relevan dengan kebutuhan dunia kerja saat ini.
            </p>
        </div>
    </section>
);

const Sejarah: React.FC = () => {
    const [sejarahData, setSejarahData] = useState<SejarahAPI | null>(null);
    const [isLoading, setIsLoading]     = useState(true);
    const [error, setError]             = useState<string | null>(null);

    useEffect(() => {
        const fetchSejarah = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(API_BASE_URL);
                if (!response.ok) throw new Error(`Gagal mengambil data: ${response.statusText}`);
                const result = await response.json();
                if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                    setSejarahData(result.data[0]);
                } else {
                    throw new Error('Format data API tidak valid atau data kosong.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan saat memuat sejarah.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSejarah();
    }, []);

    if (isLoading)        return <SejarahSkeleton />;
    if (error || !sejarahData) return <StaticSejarah error={error} />;

    const paragraphs = (sejarahData.deskripsi || '').split('\n').filter(p => p.trim() !== '');

    return (
        <section id="sejarah">
            <h2 className="font-heading text-3xl font-bold text-primary mb-2">{sejarahData.judul}</h2>
            <div className="w-20 h-1 bg-accent mb-6"></div>
            <div className="prose prose-lg max-w-none text-neutral-600 space-y-4 text-justify">
                {paragraphs.map((p, index) => <p key={index}>{p}</p>)}
            </div>
        </section>
    );
};

export default Sejarah;
