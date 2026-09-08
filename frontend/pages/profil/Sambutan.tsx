import React, { useState, useEffect } from 'react';
import { type ProfilYayasanAPI } from '../../types';

const API_URL = `http://localhost:5001/api/profil-yayasan/`;

const SambutanSkeleton: React.FC = () => (
    <div className="space-y-12 animate-pulse">
        {Array.from({ length: 2 }).map((_, index) => (
            <div key={index}>
                <div className="h-8 bg-neutral-200 rounded w-1/2 mb-2"></div>
                <div className="w-20 h-1 bg-neutral-200 mb-6"></div>
                <div className="prose prose-lg max-w-none">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-grow space-y-4">
                            <div className="h-4 bg-neutral-200 rounded w-full"></div>
                            <div className="h-4 bg-neutral-200 rounded w-full"></div>
                            <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
                        </div>
                        <div className="flex-shrink-0 text-center w-full md:w-56 mt-4 md:mt-0">
                            <div className="w-56 h-72 bg-neutral-200 rounded-lg mx-auto"></div>
                            <div className="mt-4 space-y-2">
                                <div className="h-5 bg-neutral-200 rounded w-3/4 mx-auto"></div>
                                <div className="h-4 bg-neutral-200 rounded w-1/2 mx-auto"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const StaticSambutan: React.FC<{ error?: string | null }> = ({ error }) => (
    <section>
        {error && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md" role="alert">
                <p className="font-bold">Gagal memuat data</p>
                <p>Menampilkan konten statis. Error: {error}</p>
            </div>
        )}
        <h2 className="font-heading text-3xl font-bold text-primary mb-2">Sambutan Kepala Sekolah</h2>
        <div className="w-20 h-1 bg-accent mb-6"></div>
        <div className="prose prose-lg max-w-none text-neutral-600">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-grow">
                    <p className="font-semibold text-xl text-neutral-800">Assalamu'alaikum Warahmatullahi Wabarakatuh,</p>
                    <p>
                        Segala puji bagi Allah SWT, Tuhan semesta alam, yang telah melimpahkan rahmat dan karunia-Nya kepada kita semua. Yayasan Pendidikan Islam SMK PKP 1 Jakarta Islamic School berkomitmen untuk mencetak generasi Rabbani yang tidak hanya unggul dalam bidang akademik, tetapi juga kokoh dalam aqidah dan mulia dalam akhlak.
                    </p>
                </div>
                <figure className="flex-shrink-0 text-center w-full md:w-56 not-prose mt-4 md:mt-0">
                    <img
                        src="http://localhost:5001/public/img/ketuayayasan.png"
                        alt="Foto Kepala Sekolah"
                        className="w-56 h-auto rounded-lg shadow-lg mx-auto"
                        loading="lazy"
                    />
                    <figcaption className="mt-4">
                        <p className="font-bold text-neutral-900">[Nama Kepala Sekolah]</p>
                        <p className="text-sm text-neutral-600">Kepala SMK PKP 1 Jakarta Islamic School</p>
                    </figcaption>
                </figure>
            </div>
        </div>
    </section>
);

const SambutanContent: React.FC<{ data: ProfilYayasanAPI }> = ({ data }) => {
    // Check if data.sambutan is available before splitting
    const paragraphs = (data.sambutan || "").split('\n').filter(p => p.trim() !== '');

    return (
        <section className="mb-12 last:mb-0">
            <h2 className="font-heading text-3xl font-bold text-primary mb-2">{data.subjudul}</h2>
            <div className="w-20 h-1 bg-accent mb-6"></div>
            <div className="prose prose-lg max-w-none text-neutral-600">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-grow">
                        {paragraphs.map((p, index) => (
                            <p key={index}>{p}</p>
                        ))}
                    </div>
                    {data.foto_url && (
                        <figure className="flex-shrink-0 text-center w-full md:w-56 not-prose mt-4 md:mt-0">
                            <img
                                src={data.foto_url}
                                alt={`Foto ${data.nama_ketua}`}
                                className="w-56 h-auto rounded-lg shadow-lg mx-auto"
                                loading="lazy"
                            />
                            <figcaption className="mt-4">
                                <p className="font-bold text-neutral-900">{data.nama_ketua}</p>
                                <p className="text-sm text-neutral-600">{data.jabatan}</p>
                            </figcaption>
                        </figure>
                    )}
                </div>
            </div>
        </section>
    );
};

const Sambutan: React.FC = () => {
    const [sambutanList, setSambutanList] = useState<ProfilYayasanAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSambutan = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`Gagal mengambil data: ${response.statusText} (status: ${response.status})`);
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setSambutanList(result.data);
                } else {
                    throw new Error('Format data API tidak valid atau data profil yayasan kosong.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan saat memuat data sambutan.');
                console.error('Error fetching sambutan:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSambutan();
    }, []);

    if (isLoading) {
        return <SambutanSkeleton />;
    }

    if (error || sambutanList.length === 0) {
        return <StaticSambutan error={error} />;
    }

    return (
        <div className="space-y-16">
            {sambutanList.map((data) => (
                <SambutanContent key={data.id} data={data} />
            ))}
        </div>
    );
};

export default Sambutan;