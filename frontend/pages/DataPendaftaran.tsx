import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type Pendaftar } from '../types';
import { ClipboardDocumentListIcon } from '../components/icons';

const API_BASE_URL = 'http://localhost:5001';
const API_URL = `${API_BASE_URL}/api/pendaftaran_siswa_baru/`;

const TableSkeleton: React.FC = () => (
    <>
        {Array.from({ length: 8 }).map((_, index) => (
            <tr key={index} className="animate-pulse">
                <td className="px-5 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                <td className="px-5 py-4 whitespace-nowrap"><div className="space-y-2"><div className="h-3 bg-gray-200 rounded w-full"></div><div className="h-3 bg-gray-200 rounded w-full"></div></div></td>
                <td className="px-5 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                <td className="px-5 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                <td className="px-5 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                <td className="px-5 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                <td className="px-5 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                <td className="px-5 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
            </tr>
        ))}
    </>
);


const DataPendaftaran: React.FC = () => {
    const [pendaftar, setPendaftar] = useState<Pendaftar[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    // Urutkan data dari yang terbaru
                    const sortedData = result.data.sort((a: Pendaftar, b: Pendaftar) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                    setPendaftar(sortedData);
                } else {
                    throw new Error('Format data dari API tidak sesuai.');
                }
            } catch (e) {
                setError("Gagal memuat data pendaftar. Mungkin ada masalah dengan server atau koneksi Anda.");
                console.error("Gagal mengambil data pendaftar:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };
    
    const formatDateOnly = (dateString: string | null) => {
        if (!dateString) return '-';
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric', month: 'long', day: 'numeric',
        };
        const date = new Date(dateString);
        // Check if the date is valid. An invalid date from the DB might be '0000-00-00'
        if (isNaN(date.getTime()) || date.getFullYear() < 1900) {
            return '-';
        }
        return date.toLocaleDateString('id-ID', options);
    }

    return (
        <div className="bg-neutral-50 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-primary">Data Pendaftaran Siswa Baru</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-600">Berikut adalah daftar calon siswa yang telah mengisi formulir pendaftaran.</p>
                     <div className="mt-6">
                         <Link to="/pendaftaran" className="inline-block bg-accent text-white hover:bg-opacity-90 font-semibold py-2 px-6 rounded-full transition-all duration-300 hover:scale-105">
                            + Tambah Pendaftar Baru
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md text-center" role="alert">
                        <p className="font-bold">Gagal Memuat Data</p>
                        <p>{error}</p>
                    </div>
                )}
                
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Calon Siswa</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIK / NISN</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tempat, Tgl Lahir</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asal Sekolah</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Pilihan</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Ortu / Wali</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. WhatsApp</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Daftar</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-800">
                                {loading ? (
                                    <TableSkeleton />
                                ) : pendaftar.length > 0 ? (
                                    pendaftar.map((item, index) => (
                                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-primary">{item.nama_calon_siswa}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-xs">
                                                    <span className="font-semibold text-gray-500">NIK:</span> {item.nik || '-'}
                                                </div>
                                                <div className="text-xs">
                                                    <span className="font-semibold text-gray-500">NISN:</span> {item.nisn || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {`${item.tempat_lahir || ''}${item.tempat_lahir && item.tanggal_lahir ? ', ' : ''}${formatDateOnly(item.tanggal_lahir)}`}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.asal_sekolah || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.unit_pilihan}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.nama_orang_tua_wali}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.no_wa}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{formatDate(item.created_at)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="text-center py-10">
                                            <div className="flex flex-col items-center text-gray-500">
                                                <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mb-2"/>
                                                <p className="font-semibold">Belum ada data pendaftar.</p>
                                                <p className="text-sm">Silakan isi formulir untuk menambahkan data baru.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DataPendaftaran;