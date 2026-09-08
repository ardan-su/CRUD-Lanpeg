import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Plus, Loader2, X, FileText } from 'lucide-react';
import { type BeritaArtikelAPI } from '../../../types';
import { uploadFile } from '../../../lib/uploadHelper';
import ImageUpload from '../../../components/ImageUpload';

const API_URL = "http://localhost:5001/api/berita-artikel/";

type FormState = Omit<BeritaArtikelAPI, 'id' | 'created_at' | 'updated_at' | 'slug'>;

const initialFormState: FormState = {
    kategori: "",
    judul: "",
    gambar: "",
    tanggal: new Date().toISOString().split("T")[0],
    deskripsi: "",
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

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
    };

    const handleClearImage = () => {
        setSelectedFile(null);
        setPreviewUrl('');
        setFormData(prev => ({ ...prev, gambar: '' }));
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
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
                            <input type="text" name="kategori" value={formData.kategori} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
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
                        <label className="block text-sm font-medium mb-1 text-gray-700">Deskripsi *</label>
                        <textarea name="deskripsi" rows={5} value={formData.deskripsi} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
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


// --- Main Page Component ---
const BeritaAdminBeranda: React.FC = () => {
    const [articles, setArticles] = useState<BeritaArtikelAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<FormState>(initialFormState);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

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
                deskripsi: article.deskripsi,
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

            showNotification('success', `Artikel berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}.`);
            handleCloseModal();
            fetchArticles();

        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (!res.ok || !result.success) throw new Error(result.message || 'Gagal menghapus artikel.');
            showNotification('success', 'Artikel berhasil dihapus.');
            fetchArticles();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
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
                    <h1 className="text-3xl font-bold text-gray-800">Kelola Berita & Artikel (Beranda)</h1>
                    <p className="text-gray-500 mt-1">Tambah, edit, atau hapus berita yang ditampilkan di halaman utama.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-transform duration-300 hover:scale-105">
                    <Plus className="w-5 h-5 mr-2" />
                    <span>Tambah Berita Baru</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                            ) : articles.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-10 text-gray-500">
                                    <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                    Belum ada artikel.
                                </td></tr>
                            ) : (
                                articles.map(article => (
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
                                                <button onClick={() => handleOpenModal(article)} className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-full transition-colors"><Pencil size={18} /></button>
                                                <button onClick={() => handleDelete(article.id!)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
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
        </div>
    );
};

export default BeritaAdminBeranda;