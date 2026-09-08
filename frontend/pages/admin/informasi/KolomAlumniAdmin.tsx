import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Plus, Loader2, X, Users, Upload, Eye, ExternalLink } from 'lucide-react';
import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css'; // Removed
import { type KolomAlumniAPI } from '../../../types';
import { uploadFile, createPreviewUrl } from '../../../lib/uploadHelper';
import { registerImageResize } from '../../../lib/quillImageResize';

// Register custom image resize module
registerImageResize();

// --- API Configuration ---
const API_URL = "http://localhost:5001/api/kolom_alumni/";
const STORAGE_URL = "http://localhost:5001/storage/kolom_alumni/";

// --- Type Definitions & Initial State ---
type FormState = Omit<KolomAlumniAPI, 'id' | 'created_at' | 'updated_at' | 'slug'>;

const initialFormState: FormState = {
    nama_alumni: "",
    angkatan: "",
    judul: "",
    isi: "",
    gambar: null,
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
    selectedFile: File | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
    previewUrl: string;
    setPreviewUrl: React.Dispatch<React.SetStateAction<string>>;
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose, onSubmit, formData, setFormData, isEditing, isSubmitting, selectedFile, setSelectedFile, previewUrl, setPreviewUrl }) => {
    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const preview = await createPreviewUrl(file);
            setPreviewUrl(preview);
        }
    };

    const handleEditorChange = (content: string) => {
        setFormData(prev => ({ ...prev, isi: content }));
    };

    const getImageUrl = (imageName: string | null) => {
        if (!imageName) return '';
        if (imageName.startsWith('http')) return imageName;
        if (imageName.startsWith('data:image')) return imageName; // Handle base64 preview
        return `${STORAGE_URL}${imageName}`;
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            [{ 'direction': 'rtl' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            ['link', 'image'],
            ['clean']
        ],
        clipboard: {
            matchVisual: false,
        },
        imageResize: {},
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'color', 'background',
        'list', 'bullet', 'indent',
        'align', 'direction',
        'script',
        'link', 'image', 'video',
        'width', 'height', 'style', 'data-size', 'data-align', 'data-wrap'
    ];

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Kisah Alumni' : 'Tambah Kisah Alumni'}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} className="text-gray-600" />
                    </button>
                </header>
                <form id="alumni-form" onSubmit={onSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Nama Alumni *</label>
                            <input type="text" name="nama_alumni" value={formData.nama_alumni} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Angkatan *</label>
                            <input type="text" name="angkatan" value={formData.angkatan} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Judul Kisah/Testimoni *</label>
                        <input type="text" name="judul" value={formData.judul} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Foto Alumni</label>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2">
                                <Upload size={18} />
                                <span>Pilih Foto</span>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                            <span className="text-xs text-gray-500">Format: JPG, PNG.</span>
                        </div>
                        {(previewUrl || formData.gambar) &&
                            <div className="mt-2 relative inline-block">
                                <img src={previewUrl || getImageUrl(formData.gambar)} alt="Preview" className="h-32 w-32 object-cover rounded" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                <button type="button" onClick={() => { setPreviewUrl(''); setSelectedFile(null); setFormData(prev => ({ ...prev, gambar: null })); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                    <X size={12} />
                                </button>
                            </div>
                        }
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Isi Kisah/Testimoni *</label>
                        <div className="h-64 mb-12 bg-white">
                            <ReactQuill
                                theme="snow"
                                value={formData.isi}
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
                    <button type="submit" form="alumni-form" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2 hover:bg-opacity-90 disabled:bg-gray-400">
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                        {isEditing ? 'Simpan Perubahan' : 'Tambah Kisah'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

// --- Card Component ---
const AlumniCard: React.FC<{ alumni: KolomAlumniAPI; onEdit: () => void; onDelete: () => void; onPreview: () => void; }> = ({ alumni, onEdit, onDelete, onPreview }) => {
    // ... (No changes to AlumniCard)
    const getImageUrl = (imageName: string | null) => {
        if (!imageName) return `https://ui-avatars.com/api/?name=${alumni.nama_alumni.replace(/\s/g, '+')}&background=1A6DB5&color=fff&size=256`;
        if (imageName.startsWith('http')) return imageName;
        return `${STORAGE_URL}${imageName}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-md border overflow-hidden flex flex-col group relative">
            <div className="h-56 bg-gray-100">
                <img
                    src={getImageUrl(alumni.gambar)}
                    alt={`Foto ${alumni.nama_alumni}`}
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-800 text-base line-clamp-2">{alumni.judul}</h3>
                <p className="text-sm text-gray-500 mt-1">{alumni.nama_alumni} - Angkatan {alumni.angkatan}</p>
                {/* Strip HTML tags for preview */}
                <p className="text-xs text-gray-500 mt-3 flex-grow line-clamp-3">
                    {alumni.isi.replace(/<[^>]+>/g, '')}
                </p>
            </div>
            <div className="absolute top-3 right-3 flex flex-col items-center space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={() => window.open(`${window.location.origin}${window.location.pathname}#/informasi/kolom-alumni/${alumni.slug}`, '_blank')} className="p-2 bg-white/80 backdrop-blur-sm text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-colors shadow-md" title="Lihat di Web"><ExternalLink size={16} /></button>
                <button onClick={onPreview} className="p-2 bg-white/80 backdrop-blur-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors shadow-md" title="Preview"><Eye size={16} /></button>
                <button onClick={onEdit} className="p-2 bg-white/80 backdrop-blur-sm text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-full transition-colors shadow-md" title="Edit"><Pencil size={16} /></button>
                <button onClick={onDelete} className="p-2 bg-white/80 backdrop-blur-sm text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors shadow-md" title="Hapus"><Trash2 size={16} /></button>
            </div>
        </div>
    );
};

// --- Preview Modal Component ---
const AlumniPreviewModal: React.FC<{ alumni: KolomAlumniAPI | null; onClose: () => void; }> = ({ alumni, onClose }) => {
    if (!alumni) return null;

    const getImageUrl = (imageName: string | null) => {
        if (!imageName) return `https://ui-avatars.com/api/?name=${alumni.nama_alumni.replace(' ', '+')}&background=1A6DB5&color=fff&size=500`;
        if (imageName.startsWith('http')) return imageName;
        return `${STORAGE_URL}${imageName}`;
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white w-full h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b px-6 py-3 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-500">Preview Kisah Alumni</span>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>
                <article className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-8">
                        <div className="relative h-64 md:h-80 bg-neutral-100">
                            <img src={getImageUrl(alumni.gambar)} alt={alumni.nama_alumni} className="w-full h-full object-cover object-top opacity-90" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white w-full">
                                <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">{alumni.judul}</h1>
                            </div>
                        </div>
                        <div className="p-8 md:p-12">
                            <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-100 text-gray-600">
                                <div className="flex items-center">
                                    <svg className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    <span className="font-bold">{alumni.nama_alumni}</span>
                                </div>
                                <div className="flex items-center">
                                    <svg className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
                                    <span>Angkatan {alumni.angkatan}</span>
                                </div>
                            </div>
                            <div
                                className="prose prose-lg max-w-none text-neutral-700 italic leading-relaxed prose-img:rounded-xl prose-img:shadow-lg prose-img:my-4 [&_img]:!max-w-full [&_img[style*='float']]:!mx-0 [&_img[style*='float']]:!my-0 after:content-[''] after:block after:clear-both"
                                dangerouslySetInnerHTML={{ __html: alumni.isi || "" }}
                            />
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};


// --- Main Page Component ---
const KolomAlumniAdmin: React.FC = () => {
    const [alumniStories, setAlumniStories] = useState<KolomAlumniAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<FormState>(initialFormState);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [previewItem, setPreviewItem] = useState<KolomAlumniAPI | null>(null);

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
                setAlumniStories(result.data.sort((a: KolomAlumniAPI, b: KolomAlumniAPI) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
            } else {
                setAlumniStories([]);
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

    const handleOpenModal = (alumni?: KolomAlumniAPI) => {
        if (alumni) {
            setEditingId(alumni.id);
            setFormData({
                nama_alumni: alumni.nama_alumni,
                angkatan: alumni.angkatan,
                judul: alumni.judul,
                isi: alumni.isi,
                gambar: alumni.gambar,
            });
            setPreviewUrl(alumni.gambar || '');
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
            let imageUrl = formData.gambar;

            if (selectedFile) {
                try {
                    imageUrl = await uploadFile(selectedFile, 'kolom-alumni');
                } catch (uploadErr: any) {
                    throw new Error(`Gagal mengupload foto: ${uploadErr.message}`);
                }
            }

            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `${API_URL}${editingId}` : API_URL;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ ...formData, gambar: imageUrl }),
            });

            const result = await res.json();
            if (!res.ok || !result.success) {
                const errorMessages = result.data ? Object.values(result.data).flat().join(' ') : result.message;
                throw new Error(errorMessages || 'Gagal menyimpan data.');
            }

            showNotification('success', `Kisah alumni berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}.`);
            handleCloseModal();
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus kisah alumni ini?')) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (!res.ok || !result.success) throw new Error(result.message || 'Gagal menghapus kisah.');
            showNotification('success', 'Kisah alumni berhasil dihapus.');
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderGrid = () => {
        if (isLoading) {
            return Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md border overflow-hidden animate-pulse">
                    <div className="h-56 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            ));
        }
        if (alumniStories.length === 0) {
            return (
                <div className="col-span-full text-center py-16 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="font-semibold">Belum ada kisah alumni yang ditambahkan.</p>
                </div>
            );
        }
        return alumniStories.map(alumni => (
            <AlumniCard
                key={alumni.id}
                alumni={alumni}
                onEdit={() => handleOpenModal(alumni)}
                onDelete={() => handleDelete(alumni.id)}
                onPreview={() => setPreviewItem(alumni)}
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
                    <h1 className="text-3xl font-bold text-gray-800">Kelola Kolom Alumni</h1>
                    <p className="text-gray-500 mt-1">Tambah, edit, atau hapus kisah inspiratif dari para alumni.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-transform duration-300 hover:scale-105 self-start md:self-center">
                    <Plus className="w-5 h-5 mr-2" />
                    <span>Tambah Kisah</span>
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

            <AlumniPreviewModal
                alumni={previewItem}
                onClose={() => setPreviewItem(null)}
            />
        </div>
    );
};

export default KolomAlumniAdmin;