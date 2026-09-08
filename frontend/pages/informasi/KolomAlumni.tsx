import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type KolomAlumniAPI } from '../../types';
import { ClipboardDocumentListIcon, UserIcon, AcademicCapIcon, ChevronRightIcon } from '../../components/icons';

const API_BASE_URL = 'http://localhost:5001';
const API_URL = `${API_BASE_URL}/api/kolom_alumni/`;
const STORAGE_URL = `${API_BASE_URL}/storage/kolom_alumni/`;

const AlumniCard: React.FC<{ alumni: KolomAlumniAPI }> = ({ alumni }) => {
    const getImageUrl = (imageName: string | null) => {
        if (!imageName) return `https://ui-avatars.com/api/?name=${alumni.nama_alumni.replace(' ', '+')}&background=1A6DB5&color=fff&size=256`;
        if (imageName.startsWith('http')) return imageName;
        return `${STORAGE_URL}${imageName}`;
    };

    const imageUrl = getImageUrl(alumni.gambar);
    const detailLink = `/informasi/kolom-alumni/${alumni.slug}`;

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full group">
            <div className="overflow-hidden h-64 relative bg-neutral-100">
                <Link to={detailLink} className="block w-full h-full">
                    <img src={imageUrl} alt={`Foto ${alumni.nama_alumni}`} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <h3 className="font-heading text-lg font-bold text-white mb-1 leading-tight truncate">
                            {alumni.judul}
                        </h3>
                    </div>
                </Link>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-sm text-neutral-500 mb-4 space-x-4">
                    <div className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-1.5 text-primary" />
                        <span className="font-medium text-gray-700">{alumni.nama_alumni}</span>
                    </div>
                    <div className="flex items-center">
                        <AcademicCapIcon className="h-4 w-4 mr-1.5 text-primary" />
                        <span>Angkatan {alumni.angkatan}</span>
                    </div>
                </div>

                <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3 flex-grow italic">
                    "{alumni.isi}"
                </p>
                
                <div className="mt-6 pt-4 border-t border-gray-100 text-right">
                    <Link to={detailLink} className="inline-flex items-center text-primary font-bold text-sm hover:underline">
                        Baca Kisah Lengkap <ChevronRightIcon className="h-4 w-4 ml-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

const KolomAlumni: React.FC = () => {
    const [alumniStories, setAlumniStories] = useState<KolomAlumniAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAlumni = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(API_URL);
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setAlumniStories(result.data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAlumni();
    }, []);

    return (
        <section id="kolom-alumni">
            <h2 className="font-heading text-3xl font-bold text-primary mb-2">Kolom Alumni</h2>
            <div className="w-20 h-1 bg-accent mb-6"></div>
            <p className="text-neutral-600 mb-10 max-w-prose">
                Jejak langkah dan kisah inspiratif dari para alumni SMK PKP 1 Jakarta Islamic School yang telah berkarya di berbagai bidang.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                    <div className="col-span-full text-center py-20">Memuat...</div>
                ) : alumniStories.length > 0 ? (
                    alumniStories.map(item => <AlumniCard key={item.id} alumni={item} />)
                ) : (
                    <div className="col-span-full text-center py-10 text-neutral-500">
                        <ClipboardDocumentListIcon className="h-12 w-12 mx-auto mb-2 text-neutral-300" />
                        <p>Belum ada kisah alumni.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default KolomAlumni;