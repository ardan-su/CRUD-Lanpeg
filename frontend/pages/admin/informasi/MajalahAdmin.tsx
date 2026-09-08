import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Plus, Loader2, X, FileText, Calendar, BookOpen, Upload, Eye, ExternalLink } from 'lucide-react';
import ReactQuill from 'react-quill';
import { type MajalahDigitalAPI } from '../../../types';
import { uploadFile } from '../../../lib/uploadHelper';
import ImageUpload from '../../../components/ImageUpload';
import { registerImageResize } from '../../../lib/quillImageResize';

// Register custom image resize module
registerImageResize();

// --- API Configuration ---
const API_URL = "http://localhost:5001/api/majalah_digital/";

// --- Type Definitions & Initial State ---
type FormState = Omit<MajalahDigitalAPI, 'id' | 'created_at' | 'updated_at' | 'slug'>;

const initialFormState: FormState = {
    judul: "",
    deskripsi: "",
    cover_image: "",
    file_url: null,
    status: "published",
    tanggal_rilis: new Date().toISOString().split("T")[0],
};

// --- Helper Functions ---
const formatDateForInput = (dateString: string | null): string => {
    if (!dateString) return new Date().toISOString().split("T")[0];
    try {
        return new Date(dateString).toISOString().split("T")[0];
    } catch (e) {
        return new Date().toISOString().split("T")[0];
    }
};

const formatDateForDisplay = (dateString: string | null): string => {
    if (!dateString) return "Belum diatur";
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric'
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
    selectedFile: File | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
    previewUrl: string;
    setPreviewUrl: React.Dispatch<React.SetStateAction<string>>;
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose, onSubmit, formData, setFormData, isEditing, isSubmitting, selectedFile, setSelectedFile, previewUrl, setPreviewUrl }) => {
    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
    };

    const handleClearImage = () => {
        setSelectedFile(null);
        setPreviewUrl('');
        setFormData(prev => ({ ...prev, cover_image: '' }));
    };

    const handleEditorChange = (content: string) => {
        setFormData(prev => ({ ...prev, deskripsi: content }));
    };

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
        imageResize: {},
    };

    const formats = [
        'bold', 'italic', 'underline',
        'list', 'bullet',
        'link', 'image',
        'width', 'height', 'style', 'data-size', 'data-align', 'data-wrap'
    ];

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Majalah' : 'Tambah Majalah Baru'}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} className="text-gray-600" />
                    </button>
                </header>
                <form id="magazine-form" onSubmit={onSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Judul Majalah *</label>
                        <input type="text" name="judul" value={formData.judul} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Status *</label>
                            <select name="status" value={formData.status} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary">
                                <option value="published">Published</option>
                                <option value="coming_soon">Coming Soon</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Tanggal Rilis *</label>
                            <input type="date" name="tanggal_rilis" value={formData.tanggal_rilis ?? ''} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                        </div>
                    </div>
                    <ImageUpload
                        value={formData.cover_image}
                        previewUrl={previewUrl}
                        onFileSelect={handleFileSelect}
                        onClear={handleClearImage}
                        label="Gambar Sampul"
                    />
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">URL File PDF (opsional)</label>
                        <input type="text" name="file_url" value={formData.file_url ?? ''} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" placeholder="https://..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Deskripsi</label>
                        <div className="h-48 mb-8 bg-white">
                            <ReactQuill
                                theme="snow"
                                value={formData.deskripsi}
                                onChange={handleEditorChange}
                                modules={modules}
                                formats={formats}
                                className="h-full"
                            />
                        </div>
                    </div>
                </form>
                <footer className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-100">Batal</button>
                    <button
                        type="submit"
                        form="magazine-form"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2 hover:bg-opacity-90 disabled:bg-gray-400"
                    >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                        {isEditing ? 'Simpan Perubahan' : 'Tambah Majalah'}
                    </button>
                </footer>
            </div>
        </div>
    );
};


// --- Card Component ---
const MagazineCard: React.FC<{ magazine: MajalahDigitalAPI; onEdit: () => void; onDelete: () => void; onPreview: () => void; }> = ({ magazine, onEdit, onDelete, onPreview }) => {
    const statusColor = magazine.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
    return (
        <div className="bg-white rounded-lg shadow-md border overflow-hidden flex flex-col group">
            <div className="h-64 overflow-hidden relative">
                <img
                    src={magazine.cover_image || `https://picsum.photos/seed/${magazine.id}/400/500`}
                    alt={magazine.judul}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
                <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-bold rounded-full ${statusColor}`}>
                    {magazine.status === 'published' ? 'Diterbitkan' : 'Segera Hadir'}
                </span>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-800 text-base flex-grow">{magazine.judul}</h3>
                <div className="text-xs text-gray-500 mt-2 flex items-center">
                    <Calendar size={14} className="mr-1.5" />
                    Rilis: {formatDateForDisplay(magazine.tanggal_rilis)}
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={() => window.open(`${window.location.origin}${window.location.pathname}#/informasi/majalah/${magazine.slug}`, '_blank')} className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-colors" title="Lihat di Web"><ExternalLink size={18} /></button>
                    <button onClick={onPreview} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors" title="Preview"><Eye size={18} /></button>
                    <button onClick={onEdit} className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-full transition-colors" title="Edit"><Pencil size={18} /></button>
                    <button onClick={onDelete} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors" title="Hapus"><Trash2 size={18} /></button>
                </div>
            </div>
        </div>
    );
};

// --- Preview Modal Component ---
const MajalahPreviewModal: React.FC<{ magazine: MajalahDigitalAPI | null; onClose: () => void; }> = ({ magazine, onClose }) => {
    if (!magazine) return null;

    const isPublished = magazine.status === 'published';
    const fileUrl = magazine.file_url || null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white w-full h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b px-6 py-3 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-500">Preview Majalah</span>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>
                <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-10">
                        <div className="md:w-1/3 flex-shrink-0">
                            <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-xl sticky top-24">
                                <img
                                    src={magazine.cover_image || `https://picsum.photos/seed/${magazine.id}/400/500`}
                                    alt={magazine.judul}
                                    className="w-full h-full object-cover object-top"
                                />
                            </div>
                        </div>
                        <div className="md:w-2/3">
                            <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-neutral-900 mb-4">{magazine.judul}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-neutral-500 text-sm mb-6 pb-6 border-b">
                                <div className="flex items-center">
                                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    {formatDateForDisplay(magazine.tanggal_rilis)}
                                </div>
                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {isPublished ? 'Diterbitkan' : 'Segera Hadir'}
                                </span>
                            </div>

                            <div
                                className="prose text-neutral-600 mb-8 flex-grow prose-img:rounded-xl prose-img:shadow-lg prose-img:my-4 [&_img]:!max-w-full [&_img[style*='float']]:!mx-0 [&_img[style*='float']]:!my-0 after:content-[''] after:block after:clear-both"
                                dangerouslySetInnerHTML={{ __html: magazine.deskripsi || "" }}
                            />

                            <div className="pt-6 border-t border-neutral-100">
                                {isPublished && fileUrl ? (
                                    <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all"
                                    >
                                        <FileText size={18} /> Baca / Unduh Majalah
                                    </a>
                                ) : (
                                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg text-center">
                                        <BookOpen className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                                        <p className="font-semibold">Segera Hadir!</p>
                                        <p className="text-sm">Edisi ini sedang dalam proses persiapan.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Main Page Component ---
const MajalahAdmin: React.FC = () => {
    const [magazines, setMagazines] = useState<MajalahDigitalAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<FormState>(initialFormState);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [previewItem, setPreviewItem] = useState<MajalahDigitalAPI | null>(null);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    const fetchMagazines = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(API_URL, { headers: { Accept: 'application/json' } });
            if (!res.ok) throw new Error('Gagal memuat data dari server.');
            const result = await res.json();
            if (result.success && Array.isArray(result.data)) {
                setMagazines(result.data.sort((a: MajalahDigitalAPI, b: MajalahDigitalAPI) => new Date(b.tanggal_rilis!).getTime() - new Date(a.tanggal_rilis!).getTime()));
            } else {
                setMagazines([]);
            }
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMagazines();
    }, [fetchMagazines]);

    const handleOpenModal = (magazine?: MajalahDigitalAPI) => {
        if (magazine) {
            setEditingId(magazine.id);
            setFormData({
                judul: magazine.judul,
                deskripsi: magazine.deskripsi ?? '',
                cover_image: magazine.cover_image ?? '',
                file_url: magazine.file_url,
                status: magazine.status,
                tanggal_rilis: formatDateForInput(magazine.tanggal_rilis),
            });
            setPreviewUrl(magazine.cover_image || '');
        } else {
            setEditingId(null);
            setFormData(initialFormState);
            setPreviewUrl('');
        }
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData(initialFormState);
        setSelectedFile(null);
        setPreviewUrl('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let coverUrl = formData.cover_image;

            if (selectedFile) {
                try {
                    coverUrl = await uploadFile(selectedFile, 'majalah');
                } catch (uploadErr: any) {
                    throw new Error(`Gagal mengupload gambar: ${uploadErr.message}`);
                }
            }

            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `${API_URL}${editingId}` : API_URL;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ ...formData, cover_image: coverUrl }),
            });

            const result = await res.json();
            if (!res.ok || !result.success) {
                const errorMessages = result.data ? Object.values(result.data).flat().join(' ') : result.message;
                throw new Error(errorMessages || 'Gagal menyimpan data.');
            }

            showNotification('success', `Majalah berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}.`);
            handleCloseModal();
            fetchMagazines();

        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus majalah ini?')) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (!res.ok || !result.success) throw new Error(result.message || 'Gagal menghapus majalah.');
            showNotification('success', 'Majalah berhasil dihapus.');
            fetchMagazines();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderGrid = () => {
        if (isLoading) {
            return Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md border overflow-hidden animate-pulse">
                    <div className="h-64 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            ));
        }
        if (magazines.length === 0) {
            return (
                <div className="col-span-full text-center py-16 text-gray-500">
                    < BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="font-semibold">Belum ada majalah yang ditambahkan.</p>
                </div>
            );
        }
        return magazines.map(magazine => (
            <MagazineCard
                key={magazine.id}
                magazine={magazine}
                onEdit={() => handleOpenModal(magazine)}
                onDelete={() => handleDelete(magazine.id)}
                onPreview={() => setPreviewItem(magazine)}
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

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Kelola Majalah Digital</h1>
                    <p className="text-gray-500 mt-1">Tambah, edit, atau hapus edisi majalah digital.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-transform duration-300 hover:scale-105">
                    <Plus className="w-5 h-5 mr-2" />
                    <span>Tambah Majalah Baru</span>
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
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
            />

            <MajalahPreviewModal
                magazine={previewItem}
                onClose={() => setPreviewItem(null)}
            />
        </div>
    );
};

export default MajalahAdmin;