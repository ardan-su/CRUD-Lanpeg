import React, { useState, useEffect } from 'react';
import CardUnit from '../../components/CardUnit';
import { type Unit, type JenjangPendidikan } from '../../types';

const API_URL = `http://localhost:5001/api/jenjang-pendidikan/`;

// --- UI Components for different states ---

/**
 * Renders a skeleton loader for a CardUnit component.
 */
const CardUnitSkeleton: React.FC = () => (
    <div className="bg-white rounded-2xl shadow-lg h-[280px] animate-pulse">
        <div className="p-4 bg-neutral-100 h-[200px] rounded-t-2xl">
            <div className="w-full h-full rounded-lg bg-neutral-200"></div>
        </div>
        <div className="p-6">
            <div className="h-6 w-3/4 bg-neutral-200 rounded mx-auto"></div>
        </div>
    </div>
);

/**
 * The main component that fetches and displays educational units.
 */
const UnitLanding: React.FC = () => {
    const [units, setUnits] = useState<Unit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUnits = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`Gagal mengambil data dari server (status: ${response.status})`);
                }
                const result = await response.json();
                if (!result.success || !Array.isArray(result.data)) {
                    throw new Error('Format data API tidak valid atau tidak ditemukan.');
                }
                
                // Define border colors to be applied cyclically, similar to the original static data
                const borderColors = [
                    'border-red-400', 
                    'border-orange-400', 
                    'border-purple-400', 
                    'border-blue-400', 
                    'border-green-400', 
                    'border-pink-400'
                ];

                // Filter out the header/description object and map the rest to the Unit type
                const unitsFromApi = result.data
                    .filter((item: JenjangPendidikan) => item.nama_unit)
                    .map((item: JenjangPendidikan, index: number): Unit => ({
                        id: item.id,
                        name: item.nama_unit!,
                        img: item.image || `https://picsum.photos/seed/unit${item.id}/400/400`, // Fallback image
                        borderColor: borderColors[index % borderColors.length]
                    }));

                setUnits(unitsFromApi);

            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan yang tidak diketahui.');
                console.error("Fetch error for Jenjang Pendidikan:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUnits();
    }, []);

    // --- Render logic based on state ---

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {Array.from({ length: 6 }).map((_, index) => <CardUnitSkeleton key={index} />)}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 px-6 bg-red-50 rounded-xl border border-red-200 text-red-700">
                <h3 className="text-lg font-bold">Gagal Memuat Data</h3>
                <p className="mt-2 text-sm">{error}</p>
            </div>
        );
    }

    if (units.length === 0) {
        return (
             <div className="text-center py-12 px-6 bg-neutral-100 rounded-xl border border-neutral-200 text-neutral-600">
                <h3 className="text-lg font-bold">Tidak Ada Unit Tersedia</h3>
                <p className="mt-2 text-sm">Saat ini belum ada data unit pendidikan yang dapat ditampilkan.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {units.map(unit => (
                <CardUnit key={unit.id ?? unit.name} unit={unit} />
            ))}
        </div>
    );
};

export default UnitLanding;
