import React, { useState, useEffect } from 'react';
import { type KomitePomgAPI } from '../../types';
import { UsersIcon } from '../../components/icons';

const API_BASE_URL = 'http://localhost:5001';
const API_URL = `${API_BASE_URL}/api/komite-pomg/`;
const STORAGE_URL = `${API_BASE_URL}/storage/komite-pomg/`;

// Card Component for each member
const PersonCard: React.FC<{ person: KomitePomgAPI }> = ({ person }) => {
    // This function handles both absolute and relative image URLs from the API.
    const getImageUrl = (foto: string | null): string => {
        if (!foto) {
            // Return an invalid path to trigger the onError handler for an avatar fallback.
            return `invalid-image-${person.id}`;
        }
        if (foto.startsWith('http://') || foto.startsWith('https://')) {
            return foto; // It's a full URL, use it directly.
        }
        return `${STORAGE_URL}${foto}`; // It's a relative path, prepend the base storage URL.
    };

    const imgSrc = getImageUrl(person.foto);

    return (
        <div className="text-center group">
            <div className="bg-white p-2 rounded-lg shadow-lg border border-neutral-200 inline-block transform transition-transform duration-300 hover:scale-105">
                <img
                    src={imgSrc}
                    alt={`Foto ${person.nama}`}
                    className="w-40 h-48 object-cover object-top rounded-md"
                    loading="lazy"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://ui-avatars.com/api/?name=${person.nama.replace(/\s/g, '+')}&background=1A6DB5&color=fff&size=160`;
                    }}
                />
            </div>
            <h3 className="mt-4 font-bold text-neutral-900 text-base">{person.nama}</h3>
            <p className="text-sm text-neutral-600 max-w-[180px] mx-auto">{person.jabatan}</p>
        </div>
    );
};

// Skeleton for loading state
const SkeletonLoader: React.FC = () => (
    <div className="space-y-12">
        {Array.from({ length: 2 }).map((_, i) => (
             <div key={i}>
                <div className="h-7 w-1/2 bg-neutral-200 rounded mb-8 animate-pulse mx-auto"></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 justify-items-center">
                    {Array.from({ length: 5 }).map((_, j) => (
                        <div key={j} className="text-center animate-pulse">
                            <div className="bg-neutral-200 p-2 rounded-lg shadow-lg inline-block">
                                <div className="w-40 h-48 rounded-md bg-neutral-300"></div>
                            </div>
                            <div className="mt-4 h-5 w-3/4 bg-neutral-200 rounded mx-auto"></div>
                            <div className="mt-2 h-4 w-1/2 bg-neutral-200 rounded mx-auto"></div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

// The main component
const KeluargaFirdaus: React.FC = () => {
    const [members, setMembers] = useState<KomitePomgAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`Gagal mengambil data: ${response.statusText}`);
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setMembers(result.data);
                } else {
                    throw new Error('Format data API tidak valid atau data kosong.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan saat memuat data.');
                console.error('Error fetching data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const groupedMembers = members.reduce((acc, member) => {
        const unit = member.unit || 'Lainnya';
        if (!acc[unit]) {
            acc[unit] = [];
        }
        acc[unit].push(member);
        return acc;
    }, {} as Record<string, KomitePomgAPI[]>);
    
    // Define a specific order for the units
    const unitOrder = ['SMK PKP 1 Jakarta', 'Komite Sekolah', 'POMG'];
    const sortedUnits = Object.keys(groupedMembers).sort((a, b) => {
        const indexA = unitOrder.indexOf(a);
        const indexB = unitOrder.indexOf(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    const renderContent = () => {
        if (isLoading) {
            return <SkeletonLoader />;
        }

        if (error) {
            return (
                 <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md text-center" role="alert">
                    <p className="font-bold">Gagal Memuat Data</p>
                    <p>{error}</p>
                </div>
            );
        }

        if (sortedUnits.length === 0) {
            return (
                <div className="text-center py-10 text-neutral-500">
                    <UsersIcon className="h-12 w-12 text-neutral-400 mx-auto mb-2"/>
                    <p className="font-semibold">Data Komite Sekolah belum tersedia.</p>
                </div>
            );
        }

        return (
             <div className="space-y-16">
                {sortedUnits.map((unitName, index) => (
                    <div key={unitName}>
                        <h3 className="font-heading text-2xl font-bold text-center text-primary mb-8">{`Komite Sekolah / POMG — ${unitName}`}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 justify-items-center">
                            {groupedMembers[unitName].map(person => (
                                <PersonCard key={person.id} person={person} />
                            ))}
                        </div>
                         {index < sortedUnits.length - 1 && (
                            <div className="py-8 mt-8">
                                <hr className="border-t-2 border-dashed border-neutral-200" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <section id="komite-sekolah">
            <div className="text-center">
                <h2 className="font-heading text-3xl font-bold text-neutral-900 uppercase tracking-wider">Komite Sekolah & POMG</h2>
                <div className="w-24 h-1 bg-primary my-4 mx-auto"></div>
                <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
                    Mengenal lebih dekat para perwakilan orang tua murid yang tergabung dalam Komite Sekolah dan Persatuan Orang Tua Murid dan Guru (POMG) di setiap unit pendidikan SMK PKP 1 Jakarta.
                </p>
            </div>
            
            <div className="mt-12">
                {renderContent()}
            </div>
        </section>
    );
};

export default KeluargaFirdaus;