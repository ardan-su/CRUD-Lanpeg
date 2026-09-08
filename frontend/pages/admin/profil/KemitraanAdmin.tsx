import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Plus, Loader2, X, ShieldCheck, Upload } from 'lucide-react';
import { type KemitraanItemAPI } from '../../../types';
import { uploadFile } from '../../../lib/uploadHelper';

// --- API Configuration ---
const API_URL = "http://localhost:5001/api/profil_yayasan/kemitraan-item/";
const KEMITRAAN_ID = 1; // As specified in the prompt
const STORAGE_URL = "http://localhost:5001/storage/profil_yayasan/kemitraan/";

// --- Type Definitions & Initial State ---
type FormState = Omit<KemitraanItemAPI, 'id'>;

const initialFormState: FormState = {
    nama: "",
    icon: "",
    kemitraan_id: KEMITRAAN_ID,
};

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const url = await uploadFile(file, 'kemitraan');
                setFormData(prev => ({ ...prev, icon: url }));
            } catch (error: any) {
                console.error('Upload error:', error);
                alert('Gagal mengupload gambar: ' + error.message);
            }
        }
    };

    const getIconUrl = (iconName: string) => {
        if (!iconName) return '';
        if (iconName.startsWith('http')) return iconName;
        if (iconName.startsWith('data:image')) return iconName;
        return `${STORAGE_URL}${iconName}`;
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Mitra' : 'Tambah Mitra Baru'}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} className="text-gray-600" />
                    </button>
                </header>
                <form id="partner-form" onSubmit={onSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Nama Mitra *</label>
                        <input type="text" name="nama" value={formData.nama} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Logo Mitra *</label>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2">
                                <Upload size={18} />
                                <span>Pilih Logo</span>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                        </div>
                        {formData.icon && (
                            <div className="mt-2 p-2 border rounded-md inline-block bg-gray-50 relative">
                                <img
                                    src={getIconUrl(formData.icon)}
                                    alt="Preview"
                                    className="h-24 w-auto object-contain"
                                    onError={(e) => {
                                        const target = e.currentTarget;
                                        target.onerror = null;
                                        target.src = `https://via.placeholder.com/100?text=Error`;
                                    }}
                                />
                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, icon: '' }))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                    </div>
                </form>
                <footer className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-100">Batal</button>
                    <button type="submit" form="partner-form" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2 hover:bg-opacity-90 disabled:bg-gray-400">
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                        {isEditing ? 'Simpan Perubahan' : 'Tambah Mitra'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

// --- Card Component ---
const PartnerCard: React.FC<{ partner: KemitraanItemAPI; onEdit: () => void; onDelete: () => void; }> = ({ partner, onEdit, onDelete }) => {
    // ... (No changes to Card)
    const getIconUrl = (iconName: string) => {
        if (!iconName) return '';
        if (iconName.startsWith('http')) return iconName;
        return `${STORAGE_URL}${iconName}`;
    }

    const imageUrl = getIconUrl(partner.icon);

    return (
        <div className="bg-white rounded-lg shadow-md border p-4 flex flex-col items-center justify-center text-center group relative h-48">
            <img
                src={imageUrl}
                alt={partner.nama}
                className="max-h-24 max-w-full object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
                onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = `https://via.placeholder.com/150/CCCCCC/808080?text=Logo+Gagal`;
                }}
            />
            <h3 className="font-semibold text-gray-700 mt-4 text-sm">{partner.nama}</h3>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 rounded-lg">
                <button onClick={onEdit} className="p-3 bg-white/80 backdrop-blur-sm text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-full transition-all shadow-md scale-90 group-hover:scale-100">
                    <Pencil size={18} />
                </button>
                <button onClick={onDelete} className="p-3 bg-white/80 backdrop-blur-sm text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-all shadow-md scale-90 group-hover:scale-100">
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

// --- Main Page Component ---
const KemitraanAdmin: React.FC = () => {
    // ... (No changes to main component logic)
    const [partners, setPartners] = useState<KemitraanItemAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<KemitraanItemAPI | null>(null);
    const [formData, setFormData] = useState<FormState>(initialFormState);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}${KEMITRAAN_ID}`, { headers: { Accept: 'application/json' } });
            if (!res.ok) throw new Error('Gagal memuat data dari server.');
            const result = await res.json();
            if (result.success && Array.isArray(result.data)) {
                setPartners(result.data);
            } else {
                setPartners([]);
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

    const handleOpenModal = (item?: KemitraanItemAPI) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                nama: item.nama,
                icon: item.icon,
                kemitraan_id: item.kemitraan_id,
            });
        } else {
            setEditingItem(null);
            setFormData(initialFormState);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData(initialFormState);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const method = editingItem ? "PUT" : "POST";
            const url = editingItem ? `${API_URL}${editingItem.id}` : API_URL;

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

            showNotification('success', `Mitra berhasil ${editingItem ? 'diperbarui' : 'ditambahkan'}.`);
            handleCloseModal();
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus mitra ini?')) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (!res.ok || !result.success) throw new Error(result.message || 'Gagal menghapus mitra.');
            showNotification('success', 'Mitra berhasil dihapus.');
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderGrid = () => {
        if (isLoading) {
            return Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md border p-4 flex flex-col items-center justify-center text-center h-48 animate-pulse">
                    <div className="w-24 h-16 bg-gray-200 rounded-md"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 mt-4"></div>
                </div>
            ));
        }
        if (partners.length === 0) {
            return (
                <div className="col-span-full text-center py-16 text-gray-500">
                    <ShieldCheck className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="font-semibold">Belum ada mitra yang ditambahkan.</p>
                </div>
            );
        }
        return partners.map(partner => (
            <PartnerCard
                key={partner.id}
                partner={partner}
                onEdit={() => handleOpenModal(partner)}
                onDelete={() => handleDelete(partner.id)}
            />
        ));
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
                    <h1 className="text-3xl font-bold text-gray-800">Kelola Kemitraan</h1>
                    <p className="text-gray-500 mt-1">Tambah, edit, atau hapus mitra kerjasama.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-transform duration-300 hover:scale-105 self-start md:self-center">
                    <Plus className="w-5 h-5 mr-2" />
                    <span>Tambah Mitra</span>
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {renderGrid()}
            </div>

            <FormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                isEditing={!!editingItem}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default KemitraanAdmin;