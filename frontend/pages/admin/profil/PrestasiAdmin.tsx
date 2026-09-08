import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Plus, Loader2, X, Trophy, AlertCircle, Upload } from 'lucide-react';
import { type PrestasiAPI, type PrestasiItemAPI } from '../../../types';
import { uploadFile } from '../../../lib/uploadHelper';

// --- API Configuration ---
const API_BASE_URL = "http://localhost:5001/api/profil_yayasan";
const PRESTASI_URL = `${API_BASE_URL}/prestasi/`;
const PRESTASI_ITEM_URL = `${API_BASE_URL}/prestasi-item/`;

// --- Type Definitions & Initial State ---
type FormState = Omit<PrestasiItemAPI, 'id' | 'created_at' | 'updated_at'>;

const initialFormState: FormState = {
    deskripsi: "",
    gambar: null,
    prestasi_id: 0,
};

// --- Form Modal Component ---
interface FormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: FormState;
    setFormData: React.Dispatch<React.SetStateAction<FormState>>;
    prestasiLevels: PrestasiAPI[];
    isEditing: boolean;
    isSubmitting: boolean;
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose, onSubmit, formData, setFormData, prestasiLevels, isEditing, isSubmitting }) => {
    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumberInput = type === 'number' || name === 'prestasi_id';
        setFormData(prev => ({ ...prev, [name]: isNumberInput ? parseInt(value, 10) : value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const url = await uploadFile(file, 'prestasi');
                setFormData(prev => ({ ...prev, gambar: url }));
            } catch (error: any) {
                console.error('Upload error:', error);
                alert('Gagal mengupload gambar: ' + error.message);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Prestasi' : 'Tambah Prestasi Baru'}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} className="text-gray-600" />
                    </button>
                </header>
                <form id="prestasi-form" onSubmit={onSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Unit Sekolah *</label>
                        <select name="prestasi_id" value={formData.prestasi_id} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary">
                            <option value={0} disabled>Pilih Unit Sekolah</option>
                            {prestasiLevels.map(level => (
                                <option key={level.id} value={level.id}>{level.judul}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Deskripsi Prestasi *</label>
                        <textarea name="deskripsi" rows={4} value={formData.deskripsi} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Gambar (Opsional)</label>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2">
                                <Upload size={18} />
                                <span>Pilih Gambar</span>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                            <span className="text-xs text-gray-500">Format: JPG, PNG.</span>
                        </div>
                        {formData.gambar && (
                            <div className="mt-2 p-2 border rounded-md inline-block relative">
                                <img src={formData.gambar} alt="Preview" className="h-32 w-auto object-contain rounded" />
                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, gambar: null }))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                    </div>
                </form>
                <footer className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-100">Batal</button>
                    <button type="submit" form="prestasi-form" disabled={isSubmitting || formData.prestasi_id === 0} className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2 hover:bg-opacity-90 disabled:bg-gray-400">
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                        {isEditing ? 'Simpan Perubahan' : 'Tambah Prestasi'}
                    </button>
                </footer>
            </div>
        </div>
    );
};


// --- Main Page Component ---
const PrestasiAdmin: React.FC = () => {
    // ... (No changes to main component logic)
    const [prestasiLevels, setPrestasiLevels] = useState<PrestasiAPI[]>([]);
    const [prestasiItems, setPrestasiItems] = useState<PrestasiItemAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PrestasiItemAPI | null>(null);
    const [formData, setFormData] = useState<FormState>(initialFormState);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const levelRes = await fetch(PRESTASI_URL, { headers: { Accept: 'application/json' } });
            if (!levelRes.ok) throw new Error('Gagal memuat kategori prestasi.');
            const levelResult = await levelRes.json();
            if (!levelResult.success || !Array.isArray(levelResult.data)) throw new Error('Format data kategori tidak valid.');

            setPrestasiLevels(levelResult.data);

            const itemPromises = levelResult.data.map((level: PrestasiAPI) =>
                fetch(`${PRESTASI_ITEM_URL}${level.id}`).then(res => res.json())
            );

            const itemResults = await Promise.all(itemPromises);
            const allItems = itemResults.flatMap(result => (result.success && Array.isArray(result.data)) ? result.data : []);
            setPrestasiItems(allItems);

        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = (item?: PrestasiItemAPI) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                deskripsi: item.deskripsi,
                gambar: item.gambar,
                prestasi_id: item.prestasi_id,
            });
        } else {
            setEditingItem(null);
            setFormData({
                ...initialFormState,
                prestasi_id: prestasiLevels[0]?.id || 0
            });
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
            const url = editingItem ? `${PRESTASI_ITEM_URL}${editingItem.id}` : PRESTASI_ITEM_URL;

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

            showNotification('success', `Prestasi berhasil ${editingItem ? 'diperbarui' : 'ditambahkan'}.`);
            handleCloseModal();
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus prestasi ini?')) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`${PRESTASI_ITEM_URL}${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (!res.ok || !result.success) throw new Error(result.message || 'Gagal menghapus prestasi.');
            showNotification('success', 'Prestasi berhasil dihapus.');
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
                    <p className="mt-2 text-gray-500">Memuat data prestasi...</p>
                </div>
            )
        }
        return (
            <div className="space-y-10">
                {prestasiLevels.map(level => {
                    const itemsForLevel = prestasiItems.filter(item => item.prestasi_id === level.id);
                    return (
                        <section key={level.id}>
                            <h2 className="text-xl font-bold text-gray-700 mb-4 border-l-4 border-primary pl-4">{level.judul}</h2>
                            {itemsForLevel.length === 0 ? (
                                <p className="text-sm text-gray-500 pl-5">Belum ada prestasi untuk unit ini.</p>
                            ) : (
                                <div className="space-y-3">
                                    {itemsForLevel.map(item => (
                                        <div key={item.id} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-white border border-gray-200 hover:shadow-sm">
                                            <p className="text-gray-700">{item.deskripsi}</p>
                                            <div className="flex-shrink-0 flex items-center gap-1">
                                                <button onClick={() => handleOpenModal(item)} className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-full"><Pencil size={16} /></button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )
                })}
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

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Kelola Prestasi</h1>
                    <p className="text-gray-500 mt-1">Tambah, edit, atau hapus data prestasi untuk setiap unit.</p>
                </div>
                <button onClick={() => handleOpenModal()} disabled={prestasiLevels.length === 0} className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-transform duration-300 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    <Plus className="w-5 h-5 mr-2" />
                    <span>Tambah Prestasi</span>
                </button>
            </div>

            {renderContent()}

            <FormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                prestasiLevels={prestasiLevels}
                isEditing={!!editingItem}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default PrestasiAdmin;