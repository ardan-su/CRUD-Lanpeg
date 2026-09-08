import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Save, AlertCircle } from 'lucide-react';
import { type PenerimaanSiswaBaru } from '../../../types';

// --- API Configuration ---
const API_URL = "http://localhost:5001/api/penerimaan-siswa-baru/";

// --- Type Definitions & Initial State ---
type FormState = Omit<PenerimaanSiswaBaru, 'id'>;

const initialFormState: FormState = {
  judul: "",
  subjudul: "",
  sapaan: "",
  deskripsi: "",
  teks_tombol: "",
  link_tombol: "",
};

// --- Main Page Component ---
const PendaftaranAdminBeranda: React.FC = () => {
    const [formData, setFormData] = useState<FormState>(initialFormState);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(API_URL, { headers: { Accept: 'application/json' } });
            if (!res.ok) throw new Error('Gagal memuat data dari server.');
            const result = await res.json();
            if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                const data = result.data[0];
                setFormData({
                    judul: data.judul,
                    subjudul: data.subjudul,
                    sapaan: data.sapaan,
                    deskripsi: data.deskripsi,
                    teks_tombol: data.teks_tombol,
                    link_tombol: data.link_tombol,
                });
                setEditingId(data.id);
            } else {
                showNotification('error', 'Tidak ada data pendaftaran yang ditemukan.');
            }
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingId) {
            showNotification('error', 'ID data tidak ditemukan untuk pembaruan.');
            return;
        }
        setIsSubmitting(true);
        try {
            const url = `${API_URL}${editingId}`;
            const res = await fetch(url, {
                method: 'PUT',
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await res.json();
            if (!res.ok || !result.success) {
                const errorMessages = result.data ? Object.values(result.data).flat().join(' ') : result.message;
                throw new Error(errorMessages || 'Gagal menyimpan data.');
            }
            showNotification('success', 'Data ajakan pendaftaran berhasil diperbarui.');
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderForm = () => {
        if (isLoading) {
            return (
                <div className="space-y-4 animate-pulse">
                    <div className="h-10 bg-gray-200 rounded-md w-full"></div>
                    <div className="h-10 bg-gray-200 rounded-md w-full"></div>
                    <div className="h-10 bg-gray-200 rounded-md w-full"></div>
                    <div className="h-24 bg-gray-200 rounded-md w-full"></div>
                    <div className="h-10 bg-gray-200 rounded-md w-full"></div>
                    <div className="h-10 bg-gray-200 rounded-md w-full"></div>
                </div>
            );
        }

        return (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Judul</label>
                    <input type="text" name="judul" value={formData.judul} onChange={handleChange} className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Subjudul</label>
                    <input type="text" name="subjudul" value={formData.subjudul} onChange={handleChange} className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Sapaan</label>
                    <input type="text" name="sapaan" value={formData.sapaan} onChange={handleChange} className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                    <textarea name="deskripsi" rows={4} value={formData.deskripsi} onChange={handleChange} className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Teks Tombol</label>
                        <input type="text" name="teks_tombol" value={formData.teks_tombol} onChange={handleChange} className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Link Tombol</label>
                        <input type="text" name="link_tombol" value={formData.link_tombol} onChange={handleChange} className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" placeholder="contoh: /pendaftaran" />
                    </div>
                </div>
                <div className="text-right">
                    <button type="submit" disabled={isSubmitting} className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400">
                        {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        );
    }

    return (
        <div className="relative max-w-4xl mx-auto">
            {notification && (
                <div className={`p-4 mb-4 rounded-md text-sm fixed top-24 right-8 z-[100] shadow-lg flex items-center ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} role="alert">
                    <AlertCircle className="w-5 h-5 mr-2"/>
                    {notification.message}
                </div>
            )}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Kelola Ajakan Pendaftaran</h1>
                <p className="text-gray-500 mt-1">Ubah konten yang ditampilkan pada seksi ajakan pendaftaran di halaman utama.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                {renderForm()}
            </div>
        </div>
    );
};

export default PendaftaranAdminBeranda;