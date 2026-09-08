import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Plus, Loader2, X, FileText, User, Calendar, Upload, Eye, ExternalLink } from 'lucide-react';
import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css'; // Removed
import { type KolomGuruAPI } from '../../../types';
import { uploadFile } from '../../../lib/uploadHelper';
import { registerImageResize } from '../../../lib/quillImageResize';

// Register custom image resize module
registerImageResize();

// --- API Configuration ---
const API_URL = "http://localhost:5001/api/kolom_guru/";

// --- Type Definitions & Initial State ---
type FormState = Omit<KolomGuruAPI, 'id' | 'created_at' | 'updated_at' | 'slug'>;

const initialFormState: FormState = {
    judul: "",
    konten: "",
    penulis: "",
    status: "published",
    tanggal: new Date().toISOString().split("T")[0],
    image: null,
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
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose, onSubmit, formData, setFormData, isEditing, isSubmitting }) => {
    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const url = await uploadFile(file, 'kolom-guru');
                setFormData(prev => ({ ...prev, image: url }));
            } catch (error: any) {
                console.error('Upload error:', error);
                alert('Gagal mengupload gambar: ' + error.message);
            }
        }
    };

    const handleEditorChange = (content: string) => {
        setFormData(prev => ({ ...prev, konten: content }));
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
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Tulisan Guru' : 'Tambah Tulisan Baru'}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} className="text-gray-600" />
                    </button>
                </header>
                <form id="guru-form" onSubmit={onSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Judul Tulisan *</label>
                        <input type="text" name="judul" value={formData.judul} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Penulis *</label>
                            <input type="text" name="penulis" value={formData.penulis} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Tanggal Terbit *</label>
                            <input type="date" name="tanggal" value={formData.tanggal ?? ''} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Status *</label>
                        <select name="status" value={formData.status} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary">
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Gambar Artikel</label>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2">
                                <Upload size={18} />
                                <span>Pilih Gambar</span>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                            <span className="text-xs text-gray-500">Format: JPG, PNG.</span>
                        </div>
                        {formData.image && (
                            <div className="mt-2 relative inline-block">
                                <img src={formData.image} alt="Preview" className="h-40 rounded-md border object-contain p-1" />
                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, image: null }))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Konten / Isi Tulisan *</label>
                        <div className="h-64 mb-12 bg-white">
                            <ReactQuill
                                theme="snow"
                                value={formData.konten}
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
                        form="guru-form"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2 hover:bg-opacity-90 disabled:bg-gray-400"
                    >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                        {isEditing ? 'Simpan Perubahan' : 'Tambah Tulisan'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

// --- Card Component ---
const ArticleCard: React.FC<{ article: KolomGuruAPI; onEdit: () => void; onDelete: () => void; onPreview: () => void; }> = ({ article, onEdit, onDelete, onPreview }) => {
    // ... (No changes to ArticleCard)
    const statusColor = article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
    return (
        <div className="bg-white rounded-lg shadow-md border overflow-hidden flex flex-col group">
            <div className="h-56 overflow-hidden relative">
                <img
                    src={article.image || `https://picsum.photos/seed/guru-${article.id}/600/400`}
                    alt={article.judul}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-bold rounded-full capitalize ${statusColor}`}>
                    {article.status}
                </span>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-800 text-base flex-grow line-clamp-2">{article.judul}</h3>
                <div className="text-xs text-gray-500 my-2 space-y-1">
                    <p className="flex items-center"><User size={14} className="mr-1.5" />{article.penulis}</p>
                    <p className="flex items-center"><Calendar size={14} className="mr-1.5" />{formatDateForDisplay(article.tanggal)}</p>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={() => window.open(`${window.location.origin}${window.location.pathname}#/informasi/kolom-guru/${article.slug}`, '_blank')} className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-colors" title="Lihat di Web"><ExternalLink size={18} /></button>
                    <button onClick={onPreview} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors" title="Preview"><Eye size={18} /></button>
                    <button onClick={onEdit} className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-full transition-colors" title="Edit"><Pencil size={18} /></button>
                    <button onClick={onDelete} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors" title="Hapus"><Trash2 size={18} /></button>
                </div>
            </div>
        </div>
    );
};

// --- Preview Modal Component ---
const GuruPreviewModal: React.FC<{ article: KolomGuruAPI | null; onClose: () => void; }> = ({ article, onClose }) => {
    if (!article) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Tanggal tidak valid";
        return date.toLocaleDateString('id-ID', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white w-full h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b px-6 py-3 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-500">Preview Tulisan Guru</span>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>
                <article className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 text-center">
                        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-neutral-900 mb-4">{article.judul}</h1>
                        <div className="flex justify-center items-center gap-6 text-sm text-neutral-500 border-b border-neutral-200 pb-6">
                            <div className="flex items-center">
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                {article.penulis}
                            </div>
                            <div className="flex items-center">
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                {formatDate(article.tanggal)}
                            </div>
                        </div>
                    </div>

                    {article.image && (
                        <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
                            <img src={article.image} alt={article.judul} className="w-full h-auto object-cover max-h-[500px]" />
                        </div>
                    )}

                    <div
                        className="prose prose-lg max-w-none text-neutral-800 text-justify prose-img:rounded-xl prose-img:shadow-lg prose-img:my-4 [&_img]:!max-w-full [&_img[style*='float']]:!mx-0 [&_img[style*='float']]:!my-0 after:content-[''] after:block after:clear-both"
                        dangerouslySetInnerHTML={{ __html: article.konten || "" }}
                    />
                </article>
            </div>
        </div>
    );
};

// --- Main Page Component ---
const KolomGuruAdmin: React.FC = () => {
    // ... (No changes to main component logic)
    const [articles, setArticles] = useState<KolomGuruAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<FormState>(initialFormState);
    const [previewItem, setPreviewItem] = useState<KolomGuruAPI | null>(null);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    const fetchArticles = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(API_URL, { headers: { Accept: 'application/json' } });
            if (!res.ok) throw new Error('Gagal memuat data dari server.');
            const result = await res.json();
            if (result.success && Array.isArray(result.data)) {
                setArticles(result.data.sort((a: KolomGuruAPI, b: KolomGuruAPI) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()));
            } else {
                setArticles([]);
            }
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const handleOpenModal = (article?: KolomGuruAPI) => {
        if (article) {
            setEditingId(article.id);
            setFormData({
                judul: article.judul,
                konten: article.konten ?? '',
                penulis: article.penulis,
                status: article.status,
                tanggal: formatDateForInput(article.tanggal),
                image: article.image
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

            showNotification('success', `Tulisan berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}.`);
            handleCloseModal();
            fetchArticles();

        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus tulisan ini?')) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (!res.ok || !result.success) throw new Error(result.message || 'Gagal menghapus tulisan.');
            showNotification('success', 'Tulisan berhasil dihapus.');
            fetchArticles();
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
        if (articles.length === 0) {
            return (
                <div className="col-span-full text-center py-16 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="font-semibold">Belum ada tulisan yang ditambahkan.</p>
                </div>
            );
        }
        return articles.map(article => (
            <ArticleCard
                key={article.id}
                article={article}
                onEdit={() => handleOpenModal(article)}
                onDelete={() => handleDelete(article.id)}
                onPreview={() => setPreviewItem(article)}
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
                    <h1 className="text-3xl font-bold text-gray-800">Kelola Kolom Guru</h1>
                    <p className="text-gray-500 mt-1">Tambah, edit, atau hapus tulisan dari para guru.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-transform duration-300 hover:scale-105">
                    <Plus className="w-5 h-5 mr-2" />
                    <span>Tambah Tulisan Baru</span>
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

            <GuruPreviewModal
                article={previewItem}
                onClose={() => setPreviewItem(null)}
            />
        </div>
    );
};

export default KolomGuruAdmin;