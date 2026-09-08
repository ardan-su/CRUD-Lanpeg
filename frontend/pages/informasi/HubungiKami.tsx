import React, { useState, useEffect } from 'react';
import { type HubungiKamiAPI } from '../../types';

const API_BASE_URL = 'http://localhost:5001';
const API_URL = `${API_BASE_URL}/api/hubungi_kami/`;

// Skeleton Component
const ContactCardSkeleton: React.FC = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-neutral-200 animate-pulse">
        <div className="h-6 bg-neutral-200 rounded w-1/2 mb-6"></div>
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                <div className="h-4 bg-neutral-200 rounded w-full"></div>
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
            </div>
        </div>
        <div className="mt-6 h-10 bg-neutral-200 rounded-full w-full"></div>
    </div>
);

// Card Component to display each contact unit
const ContactCard: React.FC<{ contact: HubungiKamiAPI }> = ({ contact }) => {
    const phones = contact.telepon?.split(',').map(p => p.trim()).filter(Boolean) || [];
    const emails = contact.email?.split(',').map(e => e.trim()).filter(Boolean) || [];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-accent flex flex-col h-full">
            <h3 className="font-heading text-2xl font-bold text-primary mb-4">{contact.nama_unit}</h3>
            <div className="space-y-3 text-neutral-700 text-sm flex-grow">
                <div>
                    <strong className="block">Alamat:</strong>
                    <p>{contact.alamat}</p>
                </div>
                {phones.length > 0 && (
                    <div>
                        <strong className="block">Telepon:</strong>
                        <ul className="list-inside">
                            {phones.map((phone, index) => (
                                <li key={index}>
                                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-primary hover:underline">{phone}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {emails.length > 0 && (
                    <div>
                        <strong className="block">Email:</strong>
                        <ul className="list-inside">
                            {emails.map((email, index) => (
                                <li key={index}>
                                    <a href={`mailto:${email}`} className="text-primary hover:underline">{email}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <a 
                href={contact.map_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-6 block w-full text-center bg-primary/10 hover:bg-primary/20 text-primary font-bold py-2 px-4 rounded-full transition-all duration-300"
            >
                Lihat Peta Lokasi &rarr;
            </a>
        </div>
    );
};

// Main component
const HubungiKami: React.FC = () => {
    const [contacts, setContacts] = useState<HubungiKamiAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContacts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`Gagal mengambil data: ${response.statusText}`);
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    const sortedData = result.data.sort((a, b) => a.id - b.id);
                    setContacts(sortedData);
                } else {
                    throw new Error('Format data API tidak valid atau data kosong.');
                }
            } catch (err: any) {
                setError(err.message || 'Terjadi kesalahan saat memuat informasi kontak.');
                console.error('Error fetching contact info:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchContacts();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    <ContactCardSkeleton />
                    <ContactCardSkeleton />
                    <ContactCardSkeleton />
                </div>
            );
        }

        if (error) {
            return (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-8 rounded-md text-center" role="alert">
                    <p className="font-bold">Gagal Memuat Informasi Kontak</p>
                    <p>{error}</p>
                </div>
            );
        }

        if (contacts.length === 0) {
            return (
                 <div className="text-center py-10 mt-8 text-neutral-500">
                    <p>Informasi kontak tidak tersedia saat ini.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {contacts.map(contact => (
                    <ContactCard key={contact.id} contact={contact} />
                ))}
            </div>
        );
    }

    return (
        <section id="hubungi-kami">
            <h2 className="font-heading text-3xl font-bold text-primary mb-2">Hubungi Kami</h2>
            <div className="w-20 h-1 bg-accent mb-6"></div>
            <p className="text-neutral-600 mb-8 max-w-prose">
                Jika Anda memiliki pertanyaan lebih lanjut, jangan ragu untuk menghubungi kami melalui informasi kontak di bawah ini sesuai dengan unit yang dituju. Tim kami akan dengan senang hati membantu Anda.
            </p>
            {renderContent()}
        </section>
    );
};

export default HubungiKami;