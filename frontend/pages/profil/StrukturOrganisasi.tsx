import React, { useState, useEffect } from 'react';
import { type StrukturOrganisasiAPI } from '../../types';

// API URL for the foundation's organizational structure
const API_URL = `http://localhost:5001/api/profil_yayasan/struktur/`;

// --- Reusable UI Components ---

/**
 * A card component to display an individual member's information.
 */
const PersonCard: React.FC<{ person: StrukturOrganisasiAPI }> = ({ person }) => (
    <div className="text-center">
        <div className="bg-white p-2 rounded-lg shadow-lg border border-neutral-200 inline-block transform transition-transform duration-300 hover:scale-105">
            <img
                // The 'gambar' field from the new API provides a full URL, which is used directly.
                src={person.gambar}
                alt={person.nama}
                className="w-40 h-48 object-cover object-top rounded-md"
                loading="lazy"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    // Fallback to a UI avatar if the provided image URL fails to load.
                    target.src = `https://ui-avatars.com/api/?name=${person.nama.replace(/\s/g, '+')}&background=1A6DB5&color=fff&size=160&bold=true`;
                }}
            />
        </div>
        <h3 className="mt-4 font-bold text-neutral-900 text-base">{person.nama}</h3>
        <p className="text-sm text-neutral-600 max-w-[180px] mx-auto">{person.jabatan}</p>
    </div>
);

/**
 * A skeleton loader for the PersonCard to indicate loading state.
 */
const PersonCardSkeleton: React.FC = () => (
    <div className="text-center animate-pulse">
        <div className="bg-neutral-200 p-2 rounded-lg shadow-lg inline-block">
            <div className="w-40 h-48 rounded-md bg-neutral-300"></div>
        </div>
        <div className="mt-4 h-5 w-3/4 bg-neutral-200 rounded mx-auto"></div>
        <div className="mt-2 h-4 w-1/2 bg-neutral-200 rounded mx-auto"></div>
    </div>
);

/**
 * A component to render a titled section with a grid of members.
 */
const OrgSection: React.FC<{ title: string; members: StrukturOrganisasiAPI[]; showSeparator?: boolean }> = ({ title, members, showSeparator = true }) => {
    if (members.length === 0) return null;
    return (
        <div className="space-y-12">
            <div>
                <h3 className="font-heading text-2xl font-bold text-center text-primary mb-8">{title}</h3>
                <div className="flex flex-wrap justify-center gap-8">
                    {members.map(p => (
                        <PersonCard
                            key={p.id}
                            person={p}
                        />
                    ))}
                </div>
            </div>
            {showSeparator && (
                <div className="py-8">
                    <hr className="border-t-2 border-dashed border-neutral-200 w-1/2 mx-auto" />
                </div>
            )}
        </div>
    );
};

// --- Main Component ---

const StrukturOrganisasi: React.FC = () => {
    const [members, setMembers] = useState<StrukturOrganisasiAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStruktur = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`Gagal mengambil data: ${response.statusText} (Status: ${response.status})`);
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setMembers(result.data);
                } else {
                    throw new Error('Format data API tidak valid atau data kosong.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan saat memuat data.');
                console.error('Error fetching struktur organisasi:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStruktur();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-wrap justify-center gap-8">
                    {Array.from({ length: 10 }).map((_, i) => <PersonCardSkeleton key={i} />)}
                </div>
            );
        }

        if (error) {
            return (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md text-center" role="alert">
                    <p className="font-bold">Gagal Memuat Data Struktur Organisasi</p>
                    <p>{error}</p>
                </div>
            );
        }

        if (members.length === 0) {
            return (
                <div className="text-center py-10 text-neutral-500">
                    <p>Data struktur organisasi tidak tersedia saat ini.</p>
                </div>
            );
        }

        // Group members based on their roles from the API data.
        const pimpinan = members.filter(m =>
            m.jabatan.includes("Dewan") ||
            m.jabatan.includes("Ketua Yayasan") ||
            m.jabatan.includes("Bendahara") ||
            m.jabatan.startsWith("Kabid")
        );

        // Filter members who are NOT in the pimpinan group to display everyone else
        const others = members.filter(m => !pimpinan.includes(m));

        return (
            <>
                <OrgSection title="Pimpinan Yayasan" members={pimpinan} />
                <OrgSection title="Anggota & Staf Yayasan" members={others} showSeparator={false} />
            </>
        );
    };

    return (
        <section id="struktur-organisasi">
            <div className="text-center">
                <h2 className="font-heading text-3xl font-bold text-neutral-900 uppercase tracking-wider">Struktur Organisasi</h2>
                <div className="w-24 h-1 bg-primary my-4 mx-auto"></div>
            </div>

            <div className="mt-12">
                {renderContent()}
            </div>
        </section>
    );
};

export default StrukturOrganisasi;