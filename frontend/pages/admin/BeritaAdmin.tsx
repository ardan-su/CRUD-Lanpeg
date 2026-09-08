
import React, { useState } from 'react';
import { type BeritaArtikelAPI } from '../../types';
import { PlusIcon, PencilIcon, TrashIcon } from '../../components/icons';

// Dummy data for placeholder
const dummyArticles: BeritaArtikelAPI[] = [
    { id: 1, judul: "Kegiatan Class Meeting Meriahkan Akhir Semester", gambar: "", kategori: "Kegiatan Sekolah", tanggal: "2024-06-20", created_at: "2024-06-20T10:00:00Z", updated_at: "2024-06-20T10:00:00Z", slug: "kegiatan-class-meeting", deskripsi: "Deskripsi singkat..." },
    { id: 2, judul: "Siswa SDIT Raih Juara 1 Lomba Cerdas Cermat", gambar: "", kategori: "Prestasi", tanggal: "2024-06-18", created_at: "2024-06-18T14:30:00Z", updated_at: "2024-06-18T14:30:00Z", slug: "siswa-sdit-raih-juara-1", deskripsi: "Deskripsi singkat..." },
    { id: 3, judul: "Peringatan Isra Mi'raj di Lingkungan Sekolah", gambar: "", kategori: "Keagamaan", tanggal: "2024-06-15", created_at: "2024-06-15T09:00:00Z", updated_at: "2024-06-15T09:00:00Z", slug: "peringatan-isra-miraj", deskripsi: "Deskripsi singkat..." },
];


const BeritaAdmin: React.FC = () => {
    const [articles, setArticles] = useState<BeritaArtikelAPI[]>(dummyArticles);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEdit = (id: number) => {
        alert(`Fungsi Edit untuk artikel ID: ${id} akan diimplementasikan.`);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
            alert(`Fungsi Hapus untuk artikel ID: ${id} akan diimplementasikan.`);
            // Dummy logic: setArticles(articles.filter(a => a.id !== id));
        }
    };
    
    return (
        <div className="bg-gray-50 min-h-full p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Kelola Berita & Artikel</h1>
                        <p className="text-gray-500 mt-1">Tambah, edit, atau hapus berita yang ditampilkan di website.</p>
                    </div>
                    <button className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-transform duration-300 hover:scale-105">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        <span>Tambah Berita Baru</span>
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                     <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Terbit</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Aksi</th>
                                </tr>
                            </thead>
                             <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-700">
                                {isLoading ? (
                                    <tr><td colSpan={4} className="text-center py-10">Memuat data...</td></tr>
                                ) : error ? (
                                    <tr><td colSpan={4} className="text-center py-10 text-red-500">{error}</td></tr>
                                ) : (
                                    articles.map(article => (
                                        <tr key={article.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium">{article.judul}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {article.kategori}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{new Date(article.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center space-x-2">
                                                    <button onClick={() => handleEdit(article.id)} className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-full transition-colors"><PencilIcon className="w-5 h-5"/></button>
                                                    <button onClick={() => handleDelete(article.id)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"><TrashIcon className="w-5 h-5"/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                     </div>
                </div>

            </div>
        </div>
    );
};

export default BeritaAdmin;