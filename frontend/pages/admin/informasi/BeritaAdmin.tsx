import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Plus, Loader2, X, FileText, Upload, ChevronLeft, ChevronRight, Search, Eye, ExternalLink } from 'lucide-react';
import ReactQuill, { Quill } from 'react-quill';
import { type BeritaArtikelAPI } from '../../../types';
import { uploadFile } from '../../../lib/uploadHelper';
import ImageUpload from '../../../components/ImageUpload';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { registerImageResize } from '../../../lib/quillImageResize';

// Register custom image resize module
registerImageResize();

const API_URL = "http://localhost:5001/api/berita-artikel/";
const ITEMS_PER_PAGE = 20;

type FormState = Omit<BeritaArtikelAPI, 'id' | 'created_at' | 'updated_at' | 'slug'>;

const initialFormState: FormState = {
    kategori: "",
    judul: "",
    gambar: "",
    tanggal: new Date().toISOString().split("T")[0],
    deskripsi: "",
};

// Helper function to decode HTML entities
const decodeHtmlEntities = (text: string): string => {
    if (!text) return '';
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
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
    existingCategories: string[];
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose, onSubmit, formData, setFormData, isEditing, isSubmitting, selectedFile, setSelectedFile, previewUrl, setPreviewUrl, existingCategories }) => {
    if (!isOpen) return null;

    const [isAddingNewCategory, setIsAddingNewCategory] = React.useState(false);
    const [newCategoryInput, setNewCategoryInput] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Handle category dropdown change
        if (name === 'kategori') {
            if (value === '__ADD_NEW__') {
                setIsAddingNewCategory(true);
                setNewCategoryInput('');
                setFormData(prev => ({ ...prev, kategori: '' }));
            } else {
                setIsAddingNewCategory(false);
                setFormData(prev => ({ ...prev, [name]: value }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewCategoryInput(value);
        setFormData(prev => ({ ...prev, kategori: value }));
    };

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
    };

    const handleClearImage = () => {
        setSelectedFile(null);
        setPreviewUrl('');
        setFormData(prev => ({ ...prev, gambar: '' }));
    };

    const handleEditorChange = (content: string) => {
        setFormData(prev => ({ ...prev, deskripsi: content }));
    };

    const quillRef = React.useRef<ReactQuill>(null);

    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            if (input.files && input.files[0]) {
                const file = input.files[0];
                try {
                    const url = await uploadFile(file, 'berita-content');
                    const quill = quillRef.current?.getEditor();
                    if (quill) {
                        const range = quill.getSelection();
                        const index = range ? range.index : 0;
                        quill.insertEmbed(index, 'image', url);
                    }
                } catch (err) {
                    console.error('Upload failed:', err);
                    alert('Gagal mengupload gambar ke dalam konten.');
                }
            }
        };
    }, []);

    const videoHandler = useCallback(() => {
        const url = prompt('Masukkan URL Video YouTube:');
        if (url) {
            let embedUrl = url;
            // Enhanced YouTube URL parsing to cover more cases
            const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
            const match = url.match(youtubeRegex);

            if (match && match[1]) {
                embedUrl = `https://www.youtube.com/embed/${match[1]}`;
            }

            const quill = quillRef.current?.getEditor();
            if (quill) {
                const range = quill.getSelection();
                const index = range ? range.index : 0;
                quill.insertEmbed(index, 'video', embedUrl);
            }
        }
    }, []);

    const modules = React.useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'align': [] }],
                [{ 'direction': 'rtl' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                ['link', 'image', 'video'],
                ['clean']
            ],
            handlers: {
                image: imageHandler,
                video: videoHandler
            }
        },
        clipboard: {
            matchVisual: false,
        },
        imageResize: {},
    }), [imageHandler, videoHandler]);

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
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-0" onClick={onClose}>
            <div className="bg-white shadow-2xl w-full h-full flex flex-col rounded-none" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Artikel' : 'Tambah Artikel Baru'}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} className="text-gray-600" />
                    </button>
                </header>
                <form id="article-form" onSubmit={onSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Judul *</label>
                        <input type="text" name="judul" value={formData.judul} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Kategori *</label>
                            {isAddingNewCategory ? (
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={newCategoryInput}
                                        onChange={handleNewCategoryChange}
                                        placeholder="Masukkan kategori baru"
                                        required
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAddingNewCategory(false);
                                            setFormData(prev => ({ ...prev, kategori: existingCategories[0] || '' }));
                                        }}
                                        className="text-xs text-gray-600 hover:text-gray-800 underline"
                                    >
                                        Pilih dari kategori yang ada
                                    </button>
                                </div>
                            ) : (
                                <select
                                    name="kategori"
                                    value={formData.kategori}
                                    onChange={handleChange}
                                    required
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
                                >
                                    <option value="">Pilih Kategori</option>
                                    {existingCategories.map((cat, idx) => (
                                        <option key={idx} value={cat}>{cat}</option>
                                    ))}
                                    <option value="__ADD_NEW__" className="font-semibold text-primary">+ Tambah Kategori Baru</option>
                                </select>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Tanggal Terbit *</label>
                            <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                        </div>
                    </div>
                    <ImageUpload
                        value={formData.gambar}
                        previewUrl={previewUrl}
                        onFileSelect={handleFileSelect}
                        onClear={handleClearImage}
                        label="Gambar Artikel"
                    />
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Deskripsi / Konten Artikel *</label>
                        <div className="h-[60vh] mb-12 bg-white">
                            {/* @ts-ignore */}
                            <ReactQuill
                                ref={quillRef}
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
                        form="article-form"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2 hover:bg-opacity-90 disabled:bg-gray-400"
                    >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                        {isEditing ? 'Simpan Perubahan' : 'Tambah Artikel'}
                    </button>
                </footer>
            </div>
        </div>
    );
};


// --- Preview Modal Component ---
interface PreviewModalProps {
    article: BeritaArtikelAPI | null;
    onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ article, onClose }) => {
    if (!article) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Tanggal tidak valid";
        return date.toLocaleDateString('id-ID', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    const cleanAndDecodeHtml = (content: string) => {
        if (!content) return '';
        let cleaned = content;
        cleaned = cleaned.replace(/\\r\\n/g, '');
        cleaned = cleaned.replace(/\\n/g, '');
        cleaned = cleaned.replace(/\\t/g, '');
        cleaned = cleaned.replace(/\\\"/g, '"');
        if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
            cleaned = cleaned.slice(1, -1);
        }
        const decode = (str: string) => {
            const txt = document.createElement("textarea");
            txt.innerHTML = str;
            return txt.value;
        };
        for (let i = 0; i < 3; i++) {
            const current = cleaned;
            const decoded = decode(current);
            if (decoded === current) break;
            cleaned = decoded;
        }
        return cleaned;
    };

    let contentToRender = '';
    if (article.content_delta) {
        contentToRender = typeof article.content_delta === 'string'
            ? cleanAndDecodeHtml(article.content_delta)
            : JSON.stringify(article.content_delta);
    } else if (article.deskripsi) {
        contentToRender = cleanAndDecodeHtml(article.deskripsi);
        if (!/\<[a-z][\s\S]*\>/i.test(contentToRender)) {
            contentToRender = contentToRender.replace(/\n/g, '<br/>');
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white w-full h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
                {/* Close Button */}
                <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b px-6 py-3 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-500">Preview Artikel</span>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>
                {/* Content mirroring BeritaDetail public page */}
                <article className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <span className="inline-block bg-accent/20 text-accent text-sm font-bold px-3 py-1 rounded-full mb-4">
                            {article.kategori}
                        </span>
                        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-neutral-900 leading-tight mb-4">
                            {article.judul}
                        </h1>
                        <div className="flex flex-wrap items-center text-sm text-neutral-500 gap-4 border-b border-neutral-200 pb-6">
                            <div className="flex items-center">
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                {formatDate(article.tanggal)}
                            </div>
                        </div>
                    </div>

                    {article.gambar && (
                        <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
                            <img
                                src={article.gambar}
                                alt={article.judul}
                                className="w-full h-auto object-cover max-h-[600px]"
                            />
                        </div>
                    )}

                    <div
                        className="
                            prose prose-lg max-w-none text-neutral-800 
                            prose-headings:font-bold prose-headings:text-primary
                            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                            prose-img:rounded-xl prose-img:shadow-lg prose-img:my-4
                            [&>p]:mb-4 [&>p]:leading-relaxed
                            [&_span]:!leading-relaxed
                            [&_img]:!max-w-full
                            [&_img[style*='float']]:!mx-0 [&_img[style*='float']]:!my-0
                            after:content-[''] after:block after:clear-both
                        "
                        dangerouslySetInnerHTML={{ __html: contentToRender }}
                    />
                </article>
            </div>
        </div>
    );
};

// --- Main Page Component ---
const BeritaAdmin: React.FC = () => {
    const [articles, setArticles] = useState<BeritaArtikelAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<FormState>(initialFormState);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [previewArticle, setPreviewArticle] = useState<BeritaArtikelAPI | null>(null);

    // Search & Pagination States
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Extract unique categories from existing articles
    const existingCategories = React.useMemo(() => {
        const categories = articles
            .map(article => article.kategori)
            .filter(Boolean); // Remove empty/null values
        return Array.from(new Set(categories)).sort(); // Unique and sorted
    }, [articles]);

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
            if (result.success) {
                setArticles(result.data.sort((a: BeritaArtikelAPI, b: BeritaArtikelAPI) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()));
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

    const handleOpenModal = (article?: BeritaArtikelAPI) => {
        if (article) {
            setEditingId(article.id);
            setFormData({
                judul: article.judul,
                kategori: article.kategori,
                tanggal: article.tanggal,
                gambar: article.gambar,
                deskripsi: decodeHtmlEntities(article.deskripsi || article.content_delta || ''),
            });
            setPreviewUrl(article.gambar || '');
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
                    imageUrl = await uploadFile(selectedFile, 'berita');
                } catch (uploadErr: any) {
                    throw new Error(`Gagal mengupload gambar: ${uploadErr.message}`);
                }
            }

            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `${API_URL}${editingId}` : API_URL;

            const payload = {
                ...formData,
                gambar: imageUrl,
                content_delta: formData.deskripsi
            };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            if (!res.ok || !result.success) {
                const errorMessages = result.data ? Object.values(result.data).flat().join(' ') : result.message;
                throw new Error(errorMessages || 'Gagal menyimpan data.');
            }

            showNotification('success', `Artikel berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}.`);
            handleCloseModal();
            fetchArticles();

        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete Confirmation State
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; articleId: number | null }>({
        isOpen: false,
        articleId: null
    });

    const handleDelete = (id: number) => {
        setDeleteModal({ isOpen: true, articleId: id });
    };

    const confirmDelete = async () => {
        if (!deleteModal.articleId) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}${deleteModal.articleId}`, { method: 'DELETE' });
            const result = await res.json();
            if (!res.ok || !result.success) throw new Error(result.message || 'Gagal menghapus artikel.');
            showNotification('success', 'Artikel berhasil dihapus.');
            fetchArticles();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
            setDeleteModal({ isOpen: false, articleId: null });
        }
    };

    // --- Filter & Pagination Logic ---
    const filteredArticles = articles.filter(article => {
        if (!searchTerm) return true;
        const lowerTerm = searchTerm.toLowerCase();
        return (
            article.judul.toLowerCase().includes(lowerTerm) ||
            article.kategori.toLowerCase().includes(lowerTerm)
        );
    });

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentArticles = filteredArticles.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="relative">
            {notification && (
                <div className={`p-4 mb-4 rounded-md text-sm fixed top-24 right-8 z-[100] shadow-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} role="alert">
                    {notification.message}
                </div>
            )}

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Kelola Berita & Artikel</h1>
                    <p className="text-gray-500 mt-1">Tambah, edit, atau hapus berita yang ditampilkan di website.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-transform duration-300 hover:scale-105">
                    <Plus className="w-5 h-5 mr-2" />
                    <span>Tambah Berita Baru</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-100 flex items-center">
                    <div className="relative w-full md:w-1/3">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari judul atau kategori..."
                            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Terbit</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-700">
                            {isLoading ? (
                                <tr><td colSpan={4} className="text-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" /></td></tr>
                            ) : filteredArticles.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-10 text-gray-500">
                                    <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                    {searchTerm ? 'Data tidak ditemukan.' : 'Belum ada artikel.'}
                                </td></tr>
                            ) : (
                                currentArticles.map(article => (
                                    <tr key={article.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium max-w-sm truncate">{article.judul}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {article.kategori}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(article.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button onClick={() => window.open(`${window.location.origin}${window.location.pathname}#/informasi/berita/${article.slug}`, '_blank')} className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-colors" title="Lihat di Web"><ExternalLink size={18} /></button>
                                                <button onClick={() => setPreviewArticle(article)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors" title="Preview"><Eye size={18} /></button>
                                                <button onClick={() => handleOpenModal(article)} className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-full transition-colors" title="Edit"><Pencil size={18} /></button>
                                                <button onClick={() => handleDelete(article.id!)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors" title="Hapus"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Controls */}
                {!isLoading && totalPages > 1 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                            Halaman {currentPage} dari {totalPages}
                        </span>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={`px-3 py-1 rounded-md border ${currentPage === number
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {number}
                                </button>
                            ))}
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
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
                existingCategories={existingCategories}
            />

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, articleId: null })}
                onConfirm={confirmDelete}
                title="Hapus Artikel"
                message="Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus"
                cancelText="Batal"
                isDestructive={true}
                isLoading={isSubmitting}
            />

            <PreviewModal
                article={previewArticle}
                onClose={() => setPreviewArticle(null)}
            />
        </div>
    );
};

export default BeritaAdmin;