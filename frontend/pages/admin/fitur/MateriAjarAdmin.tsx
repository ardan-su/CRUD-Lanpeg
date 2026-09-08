import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Plus, Loader2, X, BookOpen, Upload, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { type MateriAjarAPI } from '../../../types';
import { uploadFile } from '../../../lib/uploadHelper';
import ImageUpload from '../../../components/ImageUpload';

// --- API Configuration ---
const API_URL = "http://localhost:5001/api/materi_ajar/";
const ITEMS_PER_PAGE = 10;

// --- Type Definitions & Initial State ---
type FormState = Omit<MateriAjarAPI, 'id' | 'created_at' | 'updated_at'>;

const initialFormState: FormState = {
    judul: "",
    deskripsi: "",
    gambar: "",
    penulis: "",
    tanggal: new Date().toISOString().split("T")[0],
    tombol_link: "",
    tombol_teks: "",
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
                    <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Materi Ajar' : 'Tambah Materi Baru'}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} className="text-gray-600" />
                    </button>
                </header>
                <form id="materi-form" onSubmit={onSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Judul *</label>
                        <input type="text" name="judul" value={formData.judul} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Penulis *</label>
                            <input type="text" name="penulis" value={formData.penulis} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Tanggal *</label>
                            <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                        </div>
                    </div>
                    <ImageUpload
                        value={formData.gambar}
                        previewUrl={previewUrl}
                        onFileSelect={handleFileSelect}
                        onClear={handleClearImage}
                        label="Gambar Cover"
                    />
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Deskripsi *</label>
                        <textarea name="deskripsi" rows={6} value={formData.deskripsi} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Teks Tombol</label>
                            <input type="text" name="tombol_teks" value={formData.tombol_teks} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Link Tombol</label>
                            <input type="url" name="tombol_link" value={formData.tombol_link} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" placeholder="https://..." />
                        </div>
                    </div>
                </form>
                <footer className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-100">Batal</button>
                    <button
                        type="submit"
                        form="materi-form"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2 hover:bg-opacity-90 disabled:bg-gray-400"
                    >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                        {isEditing ? 'Simpan Perubahan' : 'Tambah Materi'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

// --- Card Component ---
const MateriCard: React.FC<{ materi: MateriAjarAPI; onEdit: () => void; onDelete: () => void; }> = ({ materi, onEdit, onDelete }) => (
    <div className="bg-white rounded-lg shadow-md border overflow-hidden flex flex-col group relative">
        <div className="h-48 bg-gray-100 overflow-hidden">
            <img
                src={materi.gambar || `https://picsum.photos/seed/materi-${materi.id}/600/400`}
                alt={materi.judul}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-bold text-gray-800 text-base flex-grow line-clamp-2">{materi.judul}</h3>
            <div className="text-xs text-gray-500 mt-2">
                <p>Oleh: {materi.penulis}</p>
                <p>Tanggal: {formatDateForInput(materi.tanggal)}</p>
            </div>
        </div>
        <div className="absolute top-3 right-3 flex flex-col items-center space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button onClick={onEdit} className="p-2 bg-white/80 backdrop-blur-sm text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-full transition-colors shadow-md"><Pencil size={16} /></button>
            <button onClick={onDelete} className="p-2 bg-white/80 backdrop-blur-sm text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors shadow-md"><Trash2 size={16} /></button>
        </div>
    </div>
);

// --- Main Page Component ---
const MateriAjarAdmin: React.FC = () => {
    const [materials, setMaterials] = useState<MateriAjarAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<FormState>(initialFormState);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    // Search & Pagination States
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

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
                setMaterials(result.data.sort((a: MateriAjarAPI, b: MateriAjarAPI) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()));
            } else {
                setMaterials([]);
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

    const handleOpenModal = (materi?: MateriAjarAPI) => {
        if (materi) {
            setEditingId(materi.id);
            setFormData({
                judul: materi.judul,
                deskripsi: materi.deskripsi,
                gambar: materi.gambar,
                penulis: materi.penulis,
                tanggal: formatDateForInput(materi.tanggal),
                tombol_link: materi.tombol_link,
                tombol_teks: materi.tombol_teks,
            });
            setPreviewUrl(materi.gambar || '');
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
                    imageUrl = await uploadFile(selectedFile, 'materi-ajar');
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

            showNotification('success', `Materi berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}.`);
            handleCloseModal();
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus materi ajar ini?')) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (!res.ok || !result.success) throw new Error(result.message || 'Gagal menghapus materi.');
            showNotification('success', 'Materi berhasil dihapus.');
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filtering Logic
    const filteredMaterials = materials.filter(item => {
        if (!searchTerm) return true;
        const lowerTerm = searchTerm.toLowerCase();
        return (
            item.judul.toLowerCase().includes(lowerTerm) ||
            item.penulis.toLowerCase().includes(lowerTerm)
        );
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredMaterials.length / ITEMS_PER_PAGE);
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentMaterials = filteredMaterials.slice(indexOfFirstItem, indexOfLastItem);

    const renderGrid = () => {
        if (isLoading) {
            return Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md border overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            ));
        }
        if (filteredMaterials.length === 0) {
            return (
                <div className="col-span-full text-center py-16 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="font-semibold">{searchTerm ? 'Tidak ada materi yang cocok.' : 'Belum ada materi ajar yang ditambahkan.'}</p>
                </div>
            );
        }
        return currentMaterials.map(materi => (
            <MateriCard
                key={materi.id}
                materi={materi}
                onEdit={() => handleOpenModal(materi)}
                onDelete={() => handleDelete(materi.id)}
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
                    <h1 className="text-3xl font-bold text-gray-800">Kelola Materi Ajar</h1>
                    <p className="text-gray-500 mt-1">Tambah, edit, atau hapus materi ajar yang ditampilkan di website.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-transform duration-300 hover:scale-105 self-start md:self-center">
                    <Plus className="w-5 h-5 mr-2" />
                    <span>Tambah Materi</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Cari materi berdasarkan judul atau penulis..."
                    className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {renderGrid()}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-md border disabled:opacity-50 hover:bg-gray-100"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm text-gray-600">
                        Halaman {currentPage} dari {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-md border disabled:opacity-50 hover:bg-gray-100"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}

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

export default MateriAjarAdmin;