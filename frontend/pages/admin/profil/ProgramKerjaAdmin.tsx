import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Plus, Loader2, X, Sparkles, Upload } from 'lucide-react';
import { type ProgramUnggulanAPI } from '../../../types';
import { uploadFile } from '../../../lib/uploadHelper';

// --- API Configuration ---
const API_URL = "http://localhost:5001/api/profil_yayasan/program-unggulan/";
const STORAGE_URL = "http://localhost:5001/storage/profil_yayasan/program_unggulan/";

// --- Type Definitions & Initial State ---
type FormState = Omit<ProgramUnggulanAPI, 'id' | 'created_at' | 'updated_at'>;

const initialFormState: FormState = {
    judul: "",
    deskripsi: "",
    ikon: "",
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const url = await uploadFile(file, 'program-unggulan');
                setFormData(prev => ({ ...prev, ikon: url }));
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
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Program Unggulan' : 'Tambah Program Baru'}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} className="text-gray-600" />
                    </button>
                </header>
                <form id="program-form" onSubmit={onSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Judul Program *</label>
                        <input type="text" name="judul" value={formData.judul} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Ikon Program</label>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2">
                                <Upload size={18} />
                                <span>Pilih Ikon</span>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                        </div>
                        {formData.ikon &&
                            <div className="mt-2 p-2 border rounded-md inline-block relative">
                                <img src={getIconUrl(formData.ikon)} alt="Preview" className="h-20 w-20 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, ikon: '' }))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                    <X size={12} />
                                </button>
                            </div>
                        }
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Deskripsi *</label>
                        <textarea name="deskripsi" rows={4} value={formData.deskripsi} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                    </div>
                </form>
                <footer className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-100">Batal</button>
                    <button
                        type="submit"
                        form="program-form"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2 hover:bg-opacity-90 disabled:bg-gray-400"
                    >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                        {isEditing ? 'Simpan Perubahan' : 'Tambah Program'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

// --- Card Component ---
const ProgramCard: React.FC<{ program: ProgramUnggulanAPI; onEdit: () => void; onDelete: () => void; }> = ({ program, onEdit, onDelete }) => {
    // ... (No changes to ProgramCard)
    const getIconUrl = (iconName: string) => {
        if (!iconName) return '';
        if (iconName.startsWith('http')) return iconName;
        return `${STORAGE_URL}${iconName}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-md border overflow-hidden flex flex-col group relative text-center">
            <div className="p-6 flex flex-col items-center flex-grow">
                <div className="w-20 h-20 mb-4 p-2 bg-primary/10 rounded-full flex items-center justify-center">
                    <img
                        src={getIconUrl(program.ikon)}
                        alt={`Ikon ${program.judul}`}
                        className="w-12 h-12 object-contain"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                </div>
                <h3 className="font-bold text-gray-800 text-base">{program.judul}</h3>
                <p className="text-sm text-gray-500 mt-2 flex-grow">{program.deskripsi}</p>
            </div>
            <div className="absolute top-3 right-3 flex flex-col items-center space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={onEdit} className="p-2 bg-white/80 backdrop-blur-sm text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-full transition-colors shadow-md"><Pencil size={16} /></button>
                <button onClick={onDelete} className="p-2 bg-white/80 backdrop-blur-sm text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors shadow-md"><Trash2 size={16} /></button>
            </div>
        </div>
    );
};


// --- Main Page Component ---
const ProgramUnggulanAdmin: React.FC = () => {
    // ... (No changes to main component logic)
    const [programs, setPrograms] = useState<ProgramUnggulanAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<FormState>(initialFormState);

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
            if (result.success && Array.isArray(result.data)) {
                setPrograms(result.data);
            } else {
                setPrograms([]);
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

    const handleOpenModal = (program?: ProgramUnggulanAPI) => {
        if (program) {
            setEditingId(program.id);
            setFormData({
                judul: program.judul,
                deskripsi: program.deskripsi,
                ikon: program.ikon,
            });
        } else {
            setEditingId(null);
            setFormData(initialFormState);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData(initialFormState);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `${API_URL}${editingId}` : API_URL;

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

            showNotification('success', `Program berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}.`);
            handleCloseModal();
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus program ini?')) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (!res.ok || !result.success) throw new Error(result.message || 'Gagal menghapus program.');
            showNotification('success', 'Program berhasil dihapus.');
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderGrid = () => {
        if (isLoading) {
            return Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md border p-6 text-center flex flex-col items-center animate-pulse">
                    <div className="w-20 h-20 rounded-full bg-gray-200 mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 mt-1"></div>
                </div>
            ));
        }
        if (programs.length === 0) {
            return (
                <div className="col-span-full text-center py-16 text-gray-500">
                    <Sparkles className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="font-semibold">Belum ada program unggulan yang ditambahkan.</p>
                </div>
            );
        }
        return programs.map(program => (
            <ProgramCard
                key={program.id}
                program={program}
                onEdit={() => handleOpenModal(program)}
                onDelete={() => handleDelete(program.id)}
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
                    <h1 className="text-3xl font-bold text-gray-800">Kelola Program Unggulan</h1>
                    <p className="text-gray-500 mt-1">Tambah, edit, atau hapus program unggulan yayasan.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-transform duration-300 hover:scale-105 self-start md:self-center">
                    <Plus className="w-5 h-5 mr-2" />
                    <span>Tambah Program</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {renderGrid()}
            </div>

            <FormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                isEditing={!!editingId}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default ProgramUnggulanAdmin;