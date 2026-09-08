import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Plus, Loader2, X, Building, Save, Upload } from 'lucide-react';
import { type JenjangPendidikan } from '../../../types';
import { uploadFile } from '../../../lib/uploadHelper';
import ImageUpload from '../../../components/ImageUpload';

// API Configuration
const API_URL = "http://localhost:5001/api/jenjang-pendidikan/";

// Type Definitions
type UnitItem = {
    id: number;
    nama_unit: string;
    image: string;
};

type HeaderData = {
    id: number;
    judul: string;
    deskripsi: string;
};

type UnitFormState = Omit<UnitItem, 'id'>;

const initialFormState: UnitFormState = {
    nama_unit: "",
    image: "",
};

// Form Modal Component for Units
interface FormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: UnitFormState;
    setFormData: React.Dispatch<React.SetStateAction<UnitFormState>>;
    isEditing: boolean;
    isSubmitting: boolean;
    selectedFile: File | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
    previewUrl: string;
    setPreviewUrl: React.Dispatch<React.SetStateAction<string>>;
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose, onSubmit, formData, setFormData, isEditing, isSubmitting, selectedFile, setSelectedFile, previewUrl, setPreviewUrl }) => {
    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
    };

    const handleClearImage = () => {
        setSelectedFile(null);
        setPreviewUrl('');
        setFormData(prev => ({ ...prev, image: '' }));
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Unit' : 'Tambah Unit Baru'}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} className="text-gray-600" />
                    </button>
                </header>
                <form id="unit-form" onSubmit={onSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Nama Unit *</label>
                        <input type="text" name="nama_unit" value={formData.nama_unit} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                    </div>
                    <ImageUpload
                        value={formData.image}
                        previewUrl={previewUrl}
                        onFileSelect={handleFileSelect}
                        onClear={handleClearImage}
                        label="Gambar Unit *"
                    />
                </form>
                <footer className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-100">Batal</button>
                    <button type="submit" form="unit-form" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2 hover:bg-opacity-90 disabled:bg-gray-400">
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                        {isEditing ? 'Simpan Perubahan' : 'Tambah Unit'}
                    </button>
                </footer>
            </div>
        </div>
    );
};


// --- Main Component ---
const UnitPendidikanAdmin: React.FC = () => {
    const [headerData, setHeaderData] = useState<HeaderData | null>(null);
    const [units, setUnits] = useState<UnitItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<UnitItem | null>(null);
    const [formState, setFormState] = useState<UnitFormState>(initialFormState);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

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
                const header = result.data.find((d: JenjangPendidikan) => d.judul && d.deskripsi);
                const unitItems = result.data
                    .filter((d: JenjangPendidikan) => d.nama_unit)
                    .map((d: JenjangPendidikan): UnitItem => ({ id: d.id, nama_unit: d.nama_unit!, image: d.image! }));
                if (header) setHeaderData({ id: header.id, judul: header.judul!, deskripsi: header.deskripsi! });
                setUnits(unitItems);
            } else {
                setHeaderData(null);
                setUnits([]);
            }
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (headerData) setHeaderData({ ...headerData, [e.target.name]: e.target.value });
    };

    const handleHeaderSave = async () => {
        if (!headerData) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}${headerData.id}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ judul: headerData.judul, deskripsi: headerData.deskripsi }),
            });
            const result = await res.json();
            if (!res.ok || !result.success) throw new Error(result.message || 'Gagal menyimpan header.');
            showNotification('success', 'Judul & Deskripsi berhasil diperbarui.');
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenModal = (unit?: UnitItem) => {
        if (unit) {
            setEditingUnit(unit);
            setFormState({ nama_unit: unit.nama_unit, image: unit.image });
            setPreviewUrl(unit.image || '');
        } else {
            setEditingUnit(null);
            setFormState(initialFormState);
            setPreviewUrl('');
        }
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUnit(null);
        setFormState(initialFormState);
        setSelectedFile(null);
        setPreviewUrl('');
    };

    const handleUnitSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let imageUrl = formState.image;

            // Upload file if a new file is selected
            if (selectedFile) {
                try {
                    imageUrl = await uploadFile(selectedFile, 'jenjang-pendidikan');
                } catch (uploadErr: any) {
                    throw new Error(`Gagal mengupload gambar: ${uploadErr.message}`);
                }
            }

            const method = editingUnit ? "PUT" : "POST";
            const url = editingUnit ? `${API_URL}${editingUnit.id}` : API_URL;
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ ...formState, image: imageUrl }),
            });
            const result = await res.json();
            if (!res.ok || !result.success) throw new Error(result.message || 'Gagal menyimpan data unit.');
            showNotification('success', `Unit berhasil ${editingUnit ? 'diperbarui' : 'ditambahkan'}.`);
            handleCloseModal();
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUnitDelete = async (id: number) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus unit ini?')) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (!res.ok || !result.success) throw new Error(result.message || 'Gagal menghapus unit.');
            showNotification('success', 'Unit berhasil dihapus.');
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative space-y-8">
            {notification && (
                <div className={`p-4 rounded-md text-sm fixed top-24 right-8 z-[100] shadow-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} role="alert">
                    {notification.message}
                </div>
            )}

            <section className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Header Section</h2>
                {isLoading ? <p>Loading header...</p> : headerData ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Judul</label>
                            <input type="text" name="judul" value={headerData.judul} onChange={handleHeaderChange} className="mt-1 w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                            <textarea name="deskripsi" rows={4} value={headerData.deskripsi} onChange={handleHeaderChange} className="mt-1 w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div className="text-right">
                            <button onClick={handleHeaderSave} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center ml-auto disabled:bg-gray-400">
                                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                <span className="ml-2">Simpan Perubahan Header</span>
                            </button>
                        </div>
                    </div>
                ) : <p>Header data not found.</p>}
            </section>

            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Daftar Unit</h2>
                    <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-transform duration-300 hover:scale-105">
                        <Plus className="w-5 h-5 mr-2" />
                        <span>Tambah Unit</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {isLoading ? Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-lg shadow-md border p-4 text-center animate-pulse h-48">
                            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-2"></div>
                            <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto"></div>
                        </div>
                    )) : units.length === 0 ? (
                        <div className="col-span-full text-center py-16 text-gray-500">
                            <Building className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                            <p className="font-semibold">Belum ada unit yang ditambahkan.</p>
                        </div>
                    ) : (
                        units.map(unit => (
                            <div key={unit.id} className="bg-white rounded-lg shadow-md border p-4 text-center group relative">
                                <img src={unit.image} alt={unit.nama_unit} className="w-20 h-20 object-contain rounded-full mx-auto mb-2" />
                                <h3 className="font-semibold text-gray-700">{unit.nama_unit}</h3>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 rounded-lg">
                                    <button onClick={() => handleOpenModal(unit)} className="p-3 bg-white/80 text-yellow-600 rounded-full shadow-lg"><Pencil size={18} /></button>
                                    <button onClick={() => handleUnitDelete(unit.id)} className="p-3 bg-white/80 text-red-600 rounded-full shadow-lg"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <FormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleUnitSubmit}
                formData={formState}
                setFormData={setFormState}
                isEditing={!!editingUnit}
                isSubmitting={isSubmitting}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
            />
        </div>
    );
};

export default UnitPendidikanAdmin;