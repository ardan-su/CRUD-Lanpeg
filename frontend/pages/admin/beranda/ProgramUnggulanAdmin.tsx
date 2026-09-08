import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Plus, Loader2, X, Sparkles, Save, Upload } from 'lucide-react';
import { type ProgramSection, type ProgramUnggulan } from '../../../types';
import { uploadFile, createPreviewUrl } from '../../../lib/uploadHelper';

// API Configuration
const SECTION_API_URL = "http://localhost:5001/api/program-section/";
const PROGRAM_API_URL = "http://localhost:5001/api/program-unggulan/";

// Type Definitions
type ProgramFormState = Omit<ProgramUnggulan, 'id'>;

const initialFormState: ProgramFormState = {
    deskripsi: "",
    image: "",
    section_id: 1, // Will be updated dynamically
};

// Form Modal Component for Program Items
interface FormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: ProgramFormState;
    setFormData: React.Dispatch<React.SetStateAction<ProgramFormState>>;
    isEditing: boolean;
    isSubmitting: boolean;
    selectedFile: File | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
    previewUrl: string;
    setPreviewUrl: React.Dispatch<React.SetStateAction<string>>;
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose, onSubmit, formData, setFormData, isEditing, isSubmitting, selectedFile, setSelectedFile, previewUrl, setPreviewUrl }) => {
    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const preview = await createPreviewUrl(file);
            setPreviewUrl(preview);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Program' : 'Tambah Program Baru'}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} className="text-gray-600" />
                    </button>
                </header>
                <form id="program-form" onSubmit={onSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Deskripsi Program *</label>
                        <textarea name="deskripsi" rows={4} value={formData.deskripsi} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Ikon / Gambar *</label>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2">
                                <Upload size={18} />
                                <span>Pilih Ikon/Gambar</span>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                            <span className="text-xs text-gray-500">Format: JPG, PNG.</span>
                        </div>
                        {(previewUrl || formData.image) && (
                            <div className="mt-2 relative inline-block">
                                <img src={previewUrl || formData.image} alt="Preview" className="h-20 w-20 object-contain rounded border p-1" />
                                <button type="button" onClick={() => { setPreviewUrl(''); setSelectedFile(null); setFormData(prev => ({ ...prev, image: '' })); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                    </div>
                </form>
                <footer className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-100">Batal</button>
                    <button type="submit" form="program-form" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2 hover:bg-opacity-90 disabled:bg-gray-400">
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                        {isEditing ? 'Simpan Perubahan' : 'Tambah Program'}
                    </button>
                </footer>
            </div>
        </div>
    );
};


// --- Main Component ---
const ProgramUnggulanAdmin: React.FC = () => {
    const [headerData, setHeaderData] = useState<ProgramSection | null>(null);
    const [programs, setPrograms] = useState<ProgramUnggulan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState<ProgramUnggulan | null>(null);
    const [formState, setFormState] = useState<ProgramFormState>(initialFormState);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [sectionRes, programRes] = await Promise.all([
                fetch(SECTION_API_URL, { headers: { Accept: 'application/json' } }),
                fetch(PROGRAM_API_URL, { headers: { Accept: 'application/json' } })
            ]);

            if (!sectionRes.ok || !programRes.ok) throw new Error('Gagal memuat data dari server.');

            const sectionResult = await sectionRes.json();
            const programResult = await programRes.json();

            if (sectionResult.success && Array.isArray(sectionResult.data) && sectionResult.data.length > 0) {
                setHeaderData(sectionResult.data[0]);
            } else {
                setHeaderData(null);
            }

            if (programResult.success && Array.isArray(programResult.data)) {
                setPrograms(programResult.data);
            } else {
                setPrograms([]);
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
            const res = await fetch(`${SECTION_API_URL}${headerData.id}`, {
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

    const handleOpenModal = (program?: ProgramUnggulan) => {
        if (program) {
            setEditingProgram(program);
            setFormState({ deskripsi: program.deskripsi, image: program.image, section_id: program.section_id });
            setPreviewUrl(program.image || '');
        } else {
            setEditingProgram(null);
            setFormState({ ...initialFormState, section_id: headerData?.id || 1 });
            setPreviewUrl('');
        }
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProgram(null);
        setFormState(initialFormState);
        setSelectedFile(null);
        setPreviewUrl('');
    };

    const handleProgramSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let imageUrl = formState.image;

            // Upload file if a new file is selected
            if (selectedFile) {
                try {
                    imageUrl = await uploadFile(selectedFile, 'program-unggulan');
                } catch (uploadErr: any) {
                    throw new Error(`Gagal mengupload gambar: ${uploadErr.message}`);
                }
            }

            const method = editingProgram ? "PUT" : "POST";
            const url = editingProgram ? `${PROGRAM_API_URL}${editingProgram.id}` : PROGRAM_API_URL;
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ ...formState, image: imageUrl }),
            });
            const result = await res.json();
            if (!res.ok || !result.success) throw new Error(result.message || 'Gagal menyimpan data program.');
            showNotification('success', `Program berhasil ${editingProgram ? 'diperbarui' : 'ditambahkan'}.`);
            handleCloseModal();
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleProgramDelete = async (id: number) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus program ini?')) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`${PROGRAM_API_URL}${id}`, { method: 'DELETE' });
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

    return (
        <div className="relative space-y-8">
            {notification && (
                <div className={`p-4 rounded-md text-sm fixed top-24 right-8 z-[100] shadow-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} role="alert">
                    {notification.message}
                </div>
            )}

            <section className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Header Section Program Unggulan</h2>
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
                                <span className="ml-2">Simpan Header</span>
                            </button>
                        </div>
                    </div>
                ) : <p>Header data not found.</p>}
            </section>

            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Daftar Program Unggulan</h2>
                    <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-transform duration-300 hover:scale-105">
                        <Plus className="w-5 h-5 mr-2" />
                        <span>Tambah Program</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {isLoading ? Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-lg shadow-md border p-4 text-center animate-pulse h-48">
                            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-full mx-auto"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
                            </div>
                        </div>
                    )) : programs.length === 0 ? (
                        <div className="col-span-full text-center py-16 text-gray-500">
                            <Sparkles className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                            <p className="font-semibold">Belum ada program yang ditambahkan.</p>
                        </div>
                    ) : (
                        programs.map(program => (
                            <div key={program.id} className="bg-white rounded-lg shadow-md border p-4 text-center group relative flex flex-col items-center">
                                <div className="w-16 h-16 mb-2 flex items-center justify-center">
                                    <img src={program.image} alt="icon" className="max-w-full max-h-full object-contain" />
                                </div>
                                <p className="text-sm text-gray-600 flex-grow">{program.deskripsi}</p>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 rounded-lg">
                                    <button onClick={() => handleOpenModal(program)} className="p-3 bg-white/80 text-yellow-600 rounded-full shadow-lg"><Pencil size={18} /></button>
                                    <button onClick={() => handleProgramDelete(program.id)} className="p-3 bg-white/80 text-red-600 rounded-full shadow-lg"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <FormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleProgramSubmit}
                formData={formState}
                setFormData={setFormState}
                isEditing={!!editingProgram}
                isSubmitting={isSubmitting}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
            />
        </div>
    );
};

export default ProgramUnggulanAdmin;