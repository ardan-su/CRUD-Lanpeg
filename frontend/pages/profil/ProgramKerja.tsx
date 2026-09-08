import React, { useState, useEffect } from 'react';
import { type ProgramKerjaAPI } from '../../types';

const API_URL = `http://localhost:5001/api/program-kerja/`;

// Skeleton Component for loading state
const ProgramCardSkeleton: React.FC = () => (
    <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
        <div className="h-6 w-1/3 bg-neutral-200 rounded mb-3"></div>
        <div className="space-y-2">
            <div className="h-4 w-full bg-neutral-200 rounded"></div>
            <div className="h-4 w-5/6 bg-neutral-200 rounded"></div>
        </div>
    </div>
);

// Static Fallback Component for error or empty state
const StaticProgramKerja: React.FC<{ error?: string | null }> = ({ error }) => (
    <section id="program-kerja">
        {error && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md" role="alert">
                <p className="font-bold">Gagal memuat data</p>
                <p>Menampilkan konten statis. Error: {error}</p>
            </div>
        )}
        <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-neutral-900 uppercase tracking-wider">Program Kerja</h2>
            <div className="w-24 h-1 bg-primary my-4 mx-auto"></div>
        </div>
        <div className="mt-12 max-w-3xl mx-auto space-y-4">
            {["BIDANG : KESISWAAN", "BIDANG : PEMBINAAN", "BIDANG : QUR-AN"].map((area, index) => (
                <div key={index} className="bg-white p-5 rounded-lg shadow-md w-full">
                    <p className="font-body font-semibold text-lg text-neutral-700 tracking-wide">{area}</p>
                </div>
            ))}
        </div>
    </section>
);

const ProgramKerja: React.FC = () => {
    const [programs, setPrograms] = useState<ProgramKerjaAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrograms = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`Gagal mengambil data: ${response.statusText}`);
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setPrograms(result.data);
                } else {
                    throw new Error('Format data API tidak valid atau data kosong.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan saat memuat data.');
                console.error('Error fetching program kerja:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPrograms();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="mt-12 max-w-4xl mx-auto space-y-6">
                    <ProgramCardSkeleton />
                    <ProgramCardSkeleton />
                    <ProgramCardSkeleton />
                </div>
            );
        }

        if (error || programs.length === 0) {
            return <StaticProgramKerja error={error} />;
        }

        return (
            <div className="mt-12 max-w-4xl mx-auto space-y-6">
                {programs.map(program => (
                    <div key={program.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary hover:shadow-xl transition-shadow duration-300">
                        <h3 className="font-heading text-2xl font-bold text-primary">{program.bidang}</h3>
                        <p className="mt-2 text-neutral-600 leading-relaxed">{program.keterangan}</p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <section id="program-kerja">
            <div className="text-center">
                <h2 className="font-heading text-3xl font-bold text-neutral-900 uppercase tracking-wider">Program Kerja</h2>
                <div className="w-24 h-1 bg-primary my-4 mx-auto"></div>
                <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
                    Program kerja kami terstruktur dalam berbagai bidang untuk memastikan pengembangan siswa yang holistik dan terarah.
                </p>
            </div>
            {renderContent()}
        </section>
    );
};

export default ProgramKerja;