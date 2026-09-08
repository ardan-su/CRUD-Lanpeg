import React, { useState, useEffect } from 'react';
import { type VisiAPI, type MisiAPI } from '../../types';

const API_BASE_URL = 'http://localhost:5001/api/profil-yayasan/';
const VISI_API_URL = `${API_BASE_URL}visi/`;
const MISI_API_URL = `${API_BASE_URL}misi/`;

const VisiMisiSkeleton: React.FC = () => (
    <section id="visi-misi" className="space-y-12 animate-pulse">
        <div className="text-center">
            <div className="h-4 bg-neutral-200 rounded w-1/4 mx-auto"></div>
            <div className="h-10 bg-neutral-200 rounded w-1/3 mx-auto my-4"></div>
            <div className="space-y-3 max-w-3xl mx-auto">
                <div className="h-6 bg-neutral-200 rounded w-full"></div>
                <div className="h-6 bg-neutral-200 rounded w-5/6 mx-auto"></div>
            </div>
        </div>
        <div className="text-center mt-12">
            <div className="h-4 bg-neutral-200 rounded w-1/4 mx-auto"></div>
            <div className="h-10 bg-neutral-200 rounded w-1/3 mx-auto my-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="text-center">
                        <div className="h-20 w-20 bg-neutral-200 rounded-full mx-auto"></div>
                        <div className="mt-4 space-y-2">
                            <div className="h-4 bg-neutral-200 rounded w-full"></div>
                            <div className="h-4 bg-neutral-200 rounded w-5/6 mx-auto"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const StaticVisiMisi: React.FC<{ error?: string | null }> = ({ error }) => {
    const staticMissions = [
        "Peningkatan dan pengembangan SDM yang terlibat dalam bidang pendidikan kesehatan ekonomi dan telekomunikasi",
        "Peningkatan sarana dan pengelolaan/manajemen bidang pendidikan kesehatan ekonomi dan telekomunikasi berbasis teknologi informasi",
        "Terjalinnya mitra kerja dengan dunia usaha dan pemerintahan dalam bidang pendidikan ekonomi kesehatan dan telekomunikasi",
        "Peningkatan jaringan kelembagaan dan bisnis dalam bidang pendidikan ekonomi kesehatan dan dan Telekomunikasi."
    ];
    return (
        <section id="visi-misi" className="space-y-12">
             {error && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md" role="alert">
                    <p className="font-bold">Gagal memuat data</p>
                    <p>Menampilkan konten statis. Error: {error}</p>
                </div>
            )}
            <div className="text-center">
                <p className="text-sm uppercase tracking-widest text-neutral-500">SMK PKP 1 Jakarta Islamic School</p>
                <h2 className="font-heading text-4xl font-bold my-4 text-neutral-900">Visi</h2>
                <blockquote className="text-2xl italic text-neutral-700 max-w-3xl mx-auto">
                    "Lembaga yang berdedikasi dan profesional dalam mewujudkan insan Kamil yang sehat sejahtera dan berwawasan global"
                </blockquote>
            </div>
            <div className="text-center mt-12">
                <p className="text-sm uppercase tracking-widest text-neutral-500">SMK PKP 1 Jakarta Islamic School</p>
                <h2 className="font-heading text-4xl font-bold my-4 text-neutral-900">Misi</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
                    {staticMissions.map((mission, index) => (
                        <div key={index} className="text-center p-4 rounded-lg transition-transform duration-300 hover:scale-105 hover:bg-neutral-50">
                            <p className="text-7xl font-bold text-neutral-200">{index + 1}</p>
                            <p className="mt-2 text-neutral-600">{mission}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const VisiMisi: React.FC = () => {
    const [visiData, setVisiData] = useState<VisiAPI | null>(null);
    const [misiData, setMisiData] = useState<MisiAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [visiRes, misiRes] = await Promise.all([
                    fetch(VISI_API_URL),
                    fetch(MISI_API_URL)
                ]);

                if (!visiRes.ok || !misiRes.ok) {
                    throw new Error('Gagal mengambil data dari server. Salah satu endpoint gagal.');
                }

                const visiResult = await visiRes.json();
                const misiResult = await misiRes.json();

                if (visiResult.success && Array.isArray(visiResult.data) && visiResult.data.length > 0) {
                    setVisiData(visiResult.data[0]);
                } else {
                    throw new Error('Data Visi tidak valid atau kosong.');
                }

                if (misiResult.success && Array.isArray(misiResult.data)) {
                    setMisiData(misiResult.data.sort((a, b) => a.nomor - b.nomor));
                } else {
                    // It's possible for misi to be empty, so don't throw an error here.
                    setMisiData([]);
                }

            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan yang tidak diketahui.');
                console.error("Fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <VisiMisiSkeleton />;
    }

    if (error || !visiData) {
        return <StaticVisiMisi error={error} />;
    }

    return (
        <section id="visi-misi" className="space-y-12">
            <div className="text-center">
                <p className="text-sm uppercase tracking-widest text-neutral-500">{visiData.judul}</p>
                <h2 className="font-heading text-4xl font-bold my-4 text-neutral-900">Visi</h2>
                <blockquote className="text-2xl italic text-neutral-700 max-w-3xl mx-auto">
                    "{visiData.visi}"
                </blockquote>
            </div>

            {misiData.length > 0 && (
                <div className="text-center mt-12">
                    <p className="text-sm uppercase tracking-widest text-neutral-500">{visiData.judul}</p>
                    <h2 className="font-heading text-4xl font-bold my-4 text-neutral-900">Misi</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
                        {misiData.map((misi) => (
                            <div key={misi.id} className="text-center p-4 rounded-lg transition-transform duration-300 hover:scale-105 hover:bg-neutral-50">
                                <p className="text-7xl font-bold text-primary/10">{misi.nomor}</p>
                                <p className="mt-2 text-neutral-600">{misi.isi}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default VisiMisi;