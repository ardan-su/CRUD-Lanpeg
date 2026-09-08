import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Plus, Loader2, X, Users, Upload, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { type StrukturOrganisasiAPI } from '../../../types';
import { uploadFile } from '../../../lib/uploadHelper';

// --- API Configuration ---
const API_URL = "http://localhost:5001/api/profil_yayasan/struktur/";
const ITEMS_PER_PAGE = 10;

// --- Type Definitions & Initial State ---
type FormState = Omit<StrukturOrganisasiAPI, 'id'>;

const initialFormState: FormState = {
    nama: "",
    jabatan: "",
    gambar: "",
    keterangan: null,
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
                const url = await uploadFile(file, 'struktur');
                setFormData(prev => ({ ...prev, gambar: url }));
            } catch (error: any) {
                console.error('Upload error:', error);
                alert('Gagal mengupload gambar: ' + error.message);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Anggota' : 'Tambah Anggota Baru'}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} className="text-gray-600" />
                    </button>
                </header>
                <form id="struktur-form" onSubmit={onSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Nama Lengkap *</label>
                        <input type="text" name="nama" value={formData.nama} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Jabatan *</label>
                        <input type="text" name="jabatan" value={formData.jabatan} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Foto Anggota *</label>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2">
                                <Upload size={18} />
                                <span>Pilih Foto</span>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                            <span className="text-xs text-gray-500">Format: JPG, PNG.</span>
                        </div>
                        {formData.gambar &&
                            <div className="mt-2 p-2 border rounded-md inline-block relative">
                                <img src={formData.gambar} alt="Preview" className="h-32 w-32 object-cover rounded" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, gambar: '' }))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                    <X size={12} />
                                </button>
                            </div>
                        }
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Keterangan (Opsional)</label>
                        <textarea name="keterangan" rows={3} value={formData.keterangan ?? ''} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                    </div>
                </form>
                <footer className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-100">Batal</button>
                    <button
                        type="submit"
                        form="struktur-form"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2 hover:bg-opacity-90 disabled:bg-gray-400"
                    >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                        {isEditing ? 'Simpan Perubahan' : 'Tambah Anggota'}
                    </button>
                </footer>
            </div>
        </div>
    );
};


// --- Card Component ---
const PersonCard: React.FC<{ person: StrukturOrganisasiAPI; onEdit: () => void; onDelete: () => void; }> = ({ person, onEdit, onDelete }) => {
    // ... (No changes to Card)
    return (
        <div className="bg-white rounded-lg shadow-md border overflow-hidden flex flex-col group relative text-center">
            <div className="h-56 bg-gray-100">
                <img
                    src={person.gambar}
                    alt={`Foto ${person.nama}`}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src = `https://ui-avatars.com/api/?name=${person.nama.replace(/\s/g, '+')}&background=1A6DB5&color=fff&size=256`;
                    }}
                />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-800 text-base">{person.nama}</h3>
                <p className="text-sm text-gray-500 mt-1 flex-grow">{person.jabatan}</p>
            </div>
            <div className="absolute top-3 right-3 flex flex-col items-center space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={onEdit} className="p-2 bg-white/80 backdrop-blur-sm text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-full transition-colors shadow-md"><Pencil size={16} /></button>
                <button onClick={onDelete} className="p-2 bg-white/80 backdrop-blur-sm text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors shadow-md"><Trash2 size={16} /></button>
            </div>
        </div>
    );
};

// --- Main Page Component ---
const StrukturOrganisasiAdmin: React.FC = () => {
    const [members, setMembers] = useState<StrukturOrganisasiAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<FormState>(initialFormState);

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
                setMembers(result.data);
            } else {
                setMembers([]);
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

    const handleOpenModal = (person?: StrukturOrganisasiAPI) => {
        if (person) {
            setEditingId(person.id);
            setFormData({
                nama: person.nama,
                jabatan: person.jabatan,
                gambar: person.gambar,
                keterangan: person.keterangan,
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

            showNotification('success', `Anggota berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}.`);
            handleCloseModal();
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus anggota ini?')) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (!res.ok || !result.success) throw new Error(result.message || 'Gagal menghapus anggota.');
            showNotification('success', 'Anggota berhasil dihapus.');
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter Logic
    const filteredMembers = members.filter(member => {
        if (!searchTerm) return true;
        const lowerTerm = searchTerm.toLowerCase();
        return (
            member.nama.toLowerCase().includes(lowerTerm) ||
            member.jabatan.toLowerCase().includes(lowerTerm)
        );
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentMembers = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const renderGrid = () => {
        if (isLoading) {
            return Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md border overflow-hidden animate-pulse">
                    <div className="h-56 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            ));
        }
        if (filteredMembers.length === 0) {
            return (
                <div className="col-span-full text-center py-16 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="font-semibold">{searchTerm ? 'Tidak ada anggota yang ditemukan.' : 'Belum ada anggota yang ditambahkan.'}</p>
                </div>
            );
        }
        return currentMembers.map(person => (
            <PersonCard
                key={person.id}
                person={person}
                onEdit={() => handleOpenModal(person)}
                onDelete={() => handleDelete(person.id)}
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
                    <h1 className="text-3xl font-bold text-gray-800">Kelola Struktur Organisasi</h1>
                    <p className="text-gray-500 mt-1">Tambah, edit, atau hapus anggota dari struktur organisasi yayasan.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-transform duration-300 hover:scale-105 self-start md:self-center">
                    <Plus className="w-5 h-5 mr-2" />
                    <span>Tambah Anggota</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Cari nama atau jabatan..."
                    className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
            />
        </div>
    );
};

export default StrukturOrganisasiAdmin;