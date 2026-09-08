import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, School } from 'lucide-react';

const TKAdmin: React.FC = () => {
    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Manajemen Unit TK</h1>
                <p className="text-gray-500">Pilih unit TKIT yang ingin Anda kelola.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/admin/unit/tkit1" className="bg-white p-8 rounded-xl shadow-md border border-transparent hover:border-primary hover:shadow-lg transition-all group">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-red-100 text-red-600 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                                <School size={32} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Program SMK PKP 1</h2>
                                <p className="text-gray-500 text-sm mt-1">Kelola Visi Misi, Struktur, dan Konten.</p>
                            </div>
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-primary transition-colors" />
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default TKAdmin;