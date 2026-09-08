import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Pencil, Trash2, Plus, Loader2, X, FileText, User, Calendar, Upload, Eye, ExternalLink, Tag, GraduationCap, BookOpen } from 'lucide-react';
import ReactQuill from 'react-quill';
import { type KolomSiswaAPI } from '../../../types';
import { uploadFile, createPreviewUrl } from '../../../lib/uploadHelper';
import { registerImageResize } from '../../../lib/quillImageResize';

// Register custom image resize module
registerImageResize();

// --- API Configuration ---
const API_URL = "http://localhost:5001/api/kolom_siswa/";

// Default categories
const DEFAULT_CATEGORIES = ['Jurnal', 'Cerpen', 'Puisi', 'Esai', 'Artikel', 'Opini', 'Resensi', 'Lainnya'];

// --- Type Definitions & Initial State ---
type FormState = Omit<KolomSiswaAPI, 'id' | 'created_at' | 'updated_at' | 'slug'>;

const initialFormState: FormState = {
    judul: "",
    konten: "",
    nama_siswa: "",
    gambar: "",
    kategori: "",
    angkatan: "",
    tahun_ajaran: "",
    kelas: "",
};

// --- Helper Functions ---
const formatDateForDisplay = (dateString: string | null): string => {
    if (!dateString) return "Tanggal tidak diketahui";
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
    } catch (e) {
        return "Tanggal tidak valid";
    }
}

const getCategoryColor = (kategori?: string): string => {
    const colors: Record<string, string> = {
        'Jurnal': 'bg-blue-100 text-blue-800',
        'Cerpen': 'bg-purple-100 text-purple-800',
        'Puisi': 'bg-pink-100 text-pink-800',
        'Esai': 'bg-green-100 text-green-800',
        'Artikel': 'bg-yellow-100 text-yellow-800',
        'Opini': 'bg-orange-100 text-orange-800',
        'Resensi': 'bg-teal-100 text-teal-800',
        'Lainnya': 'bg-gray-100 text-gray-800',
    };
    return colors[kategori || ''] || 'bg-gray-100 text-gray-800';
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
    const quillRef = React.useRef<ReactQuill>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const preview = await createPreviewUrl(file);
            setPreviewUrl(preview);
        }
    };

    const handleEditorChange = (content: string) => {
        setFormData(prev => ({ ...prev, konten: content }));
    };

    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            if (input.files && input.files[0]) {
                const file = input.files[0];
                try {
                    const url = await uploadFile(file, 'kolom-siswa-content');
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

    const modules = useMemo(() => ({
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
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler,
            }
        },
        clipboard: {
            matchVisual: false,
        },
        imageResize: {},
    }), [imageHandler]);

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

    // Merge default + existing categories (unique, sorted)
    const allCategories = useMemo(() => {
        const merged = new Set([...DEFAULT_CATEGORIES, ...existingCategories]);
        return Array.from(merged).sort();
    }, [existingCategories]);

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-0" onClick={onClose}>
            <div className="bg-white shadow-2xl w-full h-full flex flex-col rounded-none" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Tulisan Siswa' : 'Tambah Tulisan Baru'}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} className="text-gray-600" />
                    </button>
                </header>
                <form id="siswa-form" onSubmit={onSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Judul Tulisan *</label>
                        <input type="text" name="judul" value={formData.judul} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Nama Siswa *</label>
                            <input type="text" name="nama_siswa" value={formData.nama_siswa} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                        </div>
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
                                            setFormData(prev => ({ ...prev, kategori: allCategories[0] || '' }));
                                        }}
                                        className="text-xs text-gray-600 hover:text-gray-800 underline"
                                    >
                                        Pilih dari kategori yang ada
                                    </button>
                                </div>
                            ) : (
                                <select
                                    name="kategori"
                                    value={formData.kategori || ''}
                                    onChange={handleChange}
                                    required
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
                                >
                                    <option value="">Pilih Kategori</option>
                                    {allCategories.map((cat, idx) => (
                                        <option key={idx} value={cat}>{cat}</option>
                                    ))}
                                    <option value="__ADD_NEW__" className="font-semibold text-primary">+ Tambah Kategori Baru</option>
                                </select>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Angkatan</label>
                            <input type="text" name="angkatan" value={formData.angkatan || ''} onChange={handleChange} placeholder="Contoh: 2024" className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Tahun Ajaran</label>
                            <input type="text" name="tahun_ajaran" value={formData.tahun_ajaran || ''} onChange={handleChange} placeholder="Contoh: 2024/2025" className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Kelas</label>
                            <input type="text" name="kelas" value={formData.kelas || ''} onChange={handleChange} placeholder="Contoh: XII IPA 1" className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                        </div>
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
                        {(previewUrl || formData.gambar) && (
                            <div className="mt-2 relative inline-block">
                                <img src={previewUrl || formData.gambar || ''} alt="Preview" className="h-40 rounded-md border object-contain p-1" />
                                <button type="button" onClick={() => { setPreviewUrl(''); setSelectedFile(null); setFormData(prev => ({ ...prev, gambar: '' })); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Konten / Isi Tulisan *</label>
                        <div className="h-[55vh] mb-12 bg-white">
                            {/* @ts-ignore */}
                            <ReactQuill
                                ref={quillRef}
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
                        form="siswa-form"
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
const ArticleCard: React.FC<{ article: KolomSiswaAPI; onEdit: () => void; onDelete: () => void; onPreview: () => void; }> = ({ article, onEdit, onDelete, onPreview }) => {
    return (
        <div className="bg-white rounded-lg shadow-md border overflow-hidden flex flex-col group">
            <div className="h-56 overflow-hidden relative">
                <img
                    src={article.gambar || `https://picsum.photos/seed/siswa-${article.id}/600/400`}
                    alt={article.judul}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {article.kategori && (
                    <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-bold rounded-full ${getCategoryColor(article.kategori)}`}>
                        {article.kategori}
                    </span>
                )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-800 text-base flex-grow line-clamp-2">{article.judul}</h3>
                <div className="text-xs text-gray-500 my-2 space-y-1">
                    <p className="flex items-center"><User size={14} className="mr-1.5" />{article.nama_siswa}</p>
                    <p className="flex items-center"><Calendar size={14} className="mr-1.5" />{formatDateForDisplay(article.created_at)}</p>
                    {(article.kelas || article.angkatan) && (
                        <p className="flex items-center">
                            <GraduationCap size={14} className="mr-1.5" />
                            {[article.kelas, article.angkatan ? `Angkatan ${article.angkatan}` : ''].filter(Boolean).join(' · ')}
                        </p>
                    )}
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={() => window.open(`${window.location.origin}${window.location.pathname}#/informasi/kolom-siswa/${article.slug}`, '_blank')} className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-colors" title="Lihat di Web"><ExternalLink size={18} /></button>
                    <button onClick={onPreview} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors" title="Preview"><Eye size={18} /></button>
                    <button onClick={onEdit} className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-full transition-colors" title="Edit"><Pencil size={18} /></button>
                    <button onClick={onDelete} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors" title="Hapus"><Trash2 size={18} /></button>
                </div>
            </div>
        </div>
    );
};

// --- Preview Modal Component ---
const SiswaPreviewModal: React.FC<{ article: KolomSiswaAPI | null; onClose: () => void; }> = ({ article, onClose }) => {
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
                    <span className="text-sm font-semibold text-gray-500">Preview Karya Siswa</span>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>
                <article className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 text-center">
                        {article.kategori && (
                            <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full mb-4 ${getCategoryColor(article.kategori)}`}>
                                {article.kategori}
                            </span>
                        )}
                        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-neutral-900 mb-4">{article.judul}</h1>
                        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-sm text-neutral-500 border-b border-neutral-200 pb-6">
                            <div className="flex items-center">
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                {article.nama_siswa}
                            </div>
                            {article.kelas && (
                                <div className="flex items-center">
                                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    {article.kelas}
                                </div>
                            )}
                            {article.angkatan && (
                                <div className="flex items-center">
                                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                                    Angkatan {article.angkatan}
                                </div>
                            )}
                            {article.tahun_ajaran && (
                                <div className="flex items-center">
                                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    TA {article.tahun_ajaran}
                                </div>
                            )}
                            <div className="flex items-center">
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                {formatDate(article.created_at)}
                            </div>
                        </div>
                    </div>

                    {article.gambar && (
                        <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
                            <img src={article.gambar} alt={article.judul} className="w-full h-auto object-cover max-h-[500px]" />
                        </div>
                    )}

                    <div
                        className="prose prose-lg max-w-none text-neutral-800 prose-img:rounded-xl prose-img:shadow-lg prose-img:my-4 [&_img]:!max-w-full [&_img[style*='float']]:!mx-0 [&_img[style*='float']]:!my-0 after:content-[''] after:block after:clear-both"
                        dangerouslySetInnerHTML={{ __html: article.konten || "" }}
                    />
                </article>
            </div>
        </div>
    );
};

// --- Main Page Component ---
const KolomSiswaAdmin: React.FC = () => {
    const [articles, setArticles] = useState<KolomSiswaAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<FormState>(initialFormState);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [previewItem, setPreviewItem] = useState<KolomSiswaAPI | null>(null);

    // Filter states
    const [filterKategori, setFilterKategori] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

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
                setArticles(result.data.sort((a: KolomSiswaAPI, b: KolomSiswaAPI) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
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

    // Extract unique categories from existing articles
    const existingCategories = useMemo(() => {
        const categories = articles
            .map(a => a.kategori)
            .filter(Boolean) as string[];
        return Array.from(new Set(categories)).sort();
    }, [articles]);

    // Filtered articles
    const filteredArticles = useMemo(() => {
        return articles.filter(article => {
            const matchesKategori = !filterKategori || article.kategori === filterKategori;
            const matchesSearch = !searchTerm ||
                article.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.nama_siswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (article.kelas || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (article.angkatan || '').toLowerCase().includes(searchTerm.toLowerCase());
            return matchesKategori && matchesSearch;
        });
    }, [articles, filterKategori, searchTerm]);

    // All available categories for filter (merged)
    const allFilterCategories = useMemo(() => {
        const merged = new Set([...DEFAULT_CATEGORIES, ...existingCategories]);
        return Array.from(merged).sort();
    }, [existingCategories]);

    const handleOpenModal = (article?: KolomSiswaAPI) => {
        if (article) {
            setEditingId(article.id);
            setFormData({
                judul: article.judul,
                konten: article.konten ?? '',
                nama_siswa: article.nama_siswa,
                gambar: article.gambar,
                kategori: article.kategori || '',
                angkatan: article.angkatan || '',
                tahun_ajaran: article.tahun_ajaran || '',
                kelas: article.kelas || '',
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
                    imageUrl = await uploadFile(selectedFile, 'kolom-siswa');
                } catch (uploadErr: any) {
                    throw new Error(`Gagal mengupload gambar: ${uploadErr.message}`);
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
        if (filteredArticles.length === 0) {
            return (
                <div className="col-span-full text-center py-16 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="font-semibold">{searchTerm || filterKategori ? 'Tidak ada tulisan yang sesuai filter.' : 'Belum ada tulisan yang ditambahkan.'}</p>
                </div>
            );
        }
        return filteredArticles.map(article => (
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

            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Kelola Kolom Siswa</h1>
                    <p className="text-gray-500 mt-1">Tambah, edit, atau hapus karya tulis dari para siswa.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-transform duration-300 hover:scale-105 self-start md:self-center">
                    <Plus className="w-5 h-5 mr-2" />
                    <span>Tambah Tulisan Baru</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="relative flex-1 max-w-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Cari judul, nama, kelas..."
                        className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilterKategori('')}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${!filterKategori ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Semua
                    </button>
                    {allFilterCategories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilterKategori(cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${filterKategori === cat ? 'bg-primary text-white' : getCategoryColor(cat) + ' hover:opacity-80'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
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
                existingCategories={existingCategories}
            />

            <SiswaPreviewModal
                article={previewItem}
                onClose={() => setPreviewItem(null)}
            />
        </div>
    );
};

export default KolomSiswaAdmin;