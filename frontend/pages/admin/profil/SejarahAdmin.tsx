import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Plus, Loader2, X, BookOpen } from 'lucide-react';
import { type SejarahAPI } from '../../../types';

// --- API Configuration ---
const API_URL = "http://localhost:5001/api/profil_yayasan/sejarah/";

// --- Type Definitions & Initial State ---
type FormState = Omit<SejarahAPI, 'id' | 'created_at' | 'updated_at'>;

const initialFormState: FormState = {
  judul: "",
  deskripsi: "",
};

// --- Helper Functions ---
const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "Tanggal tidak diketahui";
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    } catch (e) {
        return "Tanggal tidak valid";
    }
}

// --- Form Modal Component ---
interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: FormState;
  setFormData: React.Dispatch<React.SetStateAction<FormState>>;
  isEditing: boolean;
  isSubmitting: boolean;
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose, onSubmit, formData, setFormData, isEditing, isSubmitting }) => {
  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Sejarah' : 'Tambah Sejarah Baru'}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </header>
        <form id="sejarah-form" onSubmit={onSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Judul *</label>
            <input type="text" name="judul" value={formData.judul} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Deskripsi Sejarah *</label>
            <textarea name="deskripsi" rows={12} value={formData.deskripsi} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
          </div>
        </form>
         <footer className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-100">Batal</button>
          <button
            type="submit"
            form="sejarah-form"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2 hover:bg-opacity-90 disabled:bg-gray-400"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            {isEditing ? 'Simpan Perubahan' : 'Tambah Sejarah'}
          </button>
        </footer>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const SejarahAdmin: React.FC = () => {
    const [sejarahData, setSejarahData] = useState<SejarahAPI | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<FormState>(initialFormState);

    const isEditing = !!sejarahData;

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
                setSejarahData(result.data[0]);
            } else {
                setSejarahData(null); // No data found
            }
        } catch (err: any) {
            showNotification('error', err.message);
            setSejarahData(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = () => {
        if (sejarahData) {
            setFormData({
                judul: sejarahData.judul,
                deskripsi: sejarahData.deskripsi,
            });
        } else {
            setFormData(initialFormState);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData(initialFormState);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const method = isEditing ? "PUT" : "POST";
            const url = isEditing ? `${API_URL}${sejarahData!.id}` : API_URL;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await res.json();
            if (!res.ok || !result.success) {
                const errorMessages = result.data ? Object.values(result.data).flat().join(' ') : result.message;
                throw new Error(errorMessages || 'Gagal menyimpan data.');
            }

            showNotification('success', `Sejarah berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}.`);
            handleCloseModal();
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!sejarahData || !window.confirm('Apakah Anda yakin ingin menghapus data sejarah ini? Tindakan ini tidak dapat diurungkan.')) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}${sejarahData.id}`, { method: 'DELETE' });
            const result = await res.json();
            if (!res.ok || !result.success) throw new Error(result.message || 'Gagal menghapus data.');
            showNotification('success', 'Data sejarah berhasil dihapus.');
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-center py-16">
                    <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
                    <p className="mt-2 text-gray-500">Memuat data sejarah...</p>
                </div>
            );
        }
        if (!sejarahData) {
            return (
                <div className="text-center py-16 text-gray-500 border-2 border-dashed rounded-lg">
                    <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="font-semibold">Belum ada data sejarah.</p>
                    <p className="text-sm mt-1 mb-4">Silakan tambahkan konten sejarah singkat yayasan.</p>
                    <button onClick={handleOpenModal} className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-transform duration-300 hover:scale-105 mx-auto">
                        <Plus className="w-5 h-5 mr-2" />
                        <span>Tambah Sejarah</span>
                    </button>
                </div>
            );
        }
        return (
             <div className="bg-white rounded-lg shadow-md border overflow-hidden group relative">
                <div className="p-6">
                    <h3 className="font-bold text-gray-800 text-xl mb-2">{sejarahData.judul}</h3>
                    <p className="text-xs text-gray-400 mb-4">Terakhir diperbarui: {formatDate(sejarahData.updated_at)}</p>
                    <div className="prose max-w-none text-gray-600 whitespace-pre-wrap">
                        {sejarahData.deskripsi}
                    </div>
                </div>
                 <div className="absolute top-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={handleOpenModal} className="p-2 bg-white text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-full transition-colors shadow-md"><Pencil size={18} /></button>
                    <button onClick={handleDelete} className="p-2 bg-white text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors shadow-md"><Trash2 size={18} /></button>
                </div>
            </div>
        );
    };

    return (
        <div className="relative">
            {notification && (
                <div className={`p-4 mb-4 rounded-md text-sm fixed top-24 right-8 z-[100] shadow-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} role="alert">
                    {notification.message}
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Kelola Sejarah Singkat</h1>
                    <p className="text-gray-500 mt-1">Kelola konten untuk halaman sejarah yayasan.</p>
                </div>
            </div>

            {renderContent()}

            <FormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default SejarahAdmin;
