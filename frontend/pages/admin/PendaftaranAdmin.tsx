import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Plus, Loader2, X, Users, ClipboardList, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { type Pendaftar } from '../../types';

// --- API Configuration ---
const API_URL = "http://localhost:5001/api/pendaftaran_siswa_baru/";
const ITEMS_PER_PAGE = 20;

// --- Type Definitions & Initial State ---
type FormState = Omit<Pendaftar, 'id' | 'created_at' | 'updated_at'>;

const initialFormState: FormState = {
  nama_calon_siswa: "",
  nik: "",
  nisn: "",
  tempat_lahir: "",
  tanggal_lahir: "", // YYYY-MM-DD format
  alamat_lengkap: "",
  asal_sekolah: "",
  alamat_asal_sekolah: "",
  unit_pilihan: "",
  nama_orang_tua_wali: "",
  no_wa: "",
  tahun_pelajaran: "2025/2026",
};

// --- Helper Functions ---
const formatDateForInput = (dateString: string | null): string => {
    if (!dateString) return "";
    try {
        // Handle GMT format from API
        return new Date(dateString).toISOString().split("T")[0];
    } catch (e) {
        return "";
    }
};

const formatDateForDisplay = (dateString: string | null): string => {
    if (!dateString) return "-";
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
    setFormData(prev => ({ ...prev, [name]: value === "" ? null : value }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Data Pendaftar' : 'Tambah Pendaftar Baru'}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </header>
        <form id="pendaftar-form" onSubmit={onSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
          
          <fieldset className="space-y-4 border-b pb-4">
            <legend className="text-lg font-semibold text-primary">Data Siswa</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Nama Calon Siswa *</label>
                <input type="text" name="nama_calon_siswa" value={formData.nama_calon_siswa ?? ''} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Unit Pilihan *</label>
                <select name="unit_pilihan" value={formData.unit_pilihan ?? ''} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary">
                    <option value="">-- Pilih Unit --</option>
                    <option value="TKIT">TKIT</option>
                    <option value="SDIT">SDIT</option>
                    <option value="SMPIT">SMPIT</option>
                    <option value="SMAIT">SMAIT</option>
                    <option value="SMKIT">SMKIT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Tempat Lahir</label>
                <input type="text" name="tempat_lahir" value={formData.tempat_lahir ?? ''} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Tanggal Lahir</label>
                <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir ?? ''} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">Alamat Lengkap</label>
                <textarea name="alamat_lengkap" rows={2} value={formData.alamat_lengkap ?? ''} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
              </div>
            </div>
          </fieldset>
          
          <fieldset className="space-y-4 border-b pb-4">
            <legend className="text-lg font-semibold text-primary">Data Orang Tua/Wali</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Nama Orang Tua/Wali *</label>
                    <input type="text" name="nama_orang_tua_wali" value={formData.nama_orang_tua_wali ?? ''} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">No. WhatsApp *</label>
                    <input type="tel" name="no_wa" value={formData.no_wa ?? ''} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                </div>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-primary">Data Akademik</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">NIK</label>
                    <input type="text" name="nik" value={formData.nik ?? ''} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">NISN</label>
                    <input type="text" name="nisn" value={formData.nisn ?? ''} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Asal Sekolah</label>
                    <input type="text" name="asal_sekolah" value={formData.asal_sekolah ?? ''} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Tahun Pelajaran</label>
                    <input type="text" name="tahun_pelajaran" value={formData.tahun_pelajaran ?? '2025/2026'} readOnly className="w-full bg-gray-100 border-gray-300 rounded-md shadow-sm" />
                </div>
            </div>
          </fieldset>
        </form>
         <footer className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-100">Batal</button>
          <button type="submit" form="pendaftar-form" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2 hover:bg-opacity-90 disabled:bg-gray-400">
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            {isEditing ? 'Simpan Perubahan' : 'Tambah Pendaftar'}
          </button>
        </footer>
      </div>
    </div>
  );
};


const PendaftaranAdmin: React.FC = () => {
    const [registrations, setRegistrations] = useState<Pendaftar[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRegistration, setEditingRegistration] = useState<Pendaftar | null>(null);
    const [formData, setFormData] = useState<FormState>(initialFormState);
    
    // Search & Pagination
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
                 const sortedData = result.data.sort((a: Pendaftar, b: Pendaftar) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                setRegistrations(sortedData);
            } else {
                setRegistrations([]);
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

    const handleOpenModal = (pendaftar?: Pendaftar) => {
        if (pendaftar) {
            setEditingRegistration(pendaftar);
            setFormData({
                ...initialFormState,
                ...pendaftar,
                tanggal_lahir: formatDateForInput(pendaftar.tanggal_lahir),
            });
        } else {
            setEditingRegistration(null);
            setFormData(initialFormState);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRegistration(null);
        setFormData(initialFormState);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const method = editingRegistration ? "PUT" : "POST";
            const url = editingRegistration ? `${API_URL}${editingRegistration.id}` : API_URL;

            const payload = { ...formData };
            // Ensure null is sent for empty date, not an empty string
            if (payload.tanggal_lahir === "") {
                payload.tanggal_lahir = null;
            }

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

            showNotification('success', `Data pendaftar berhasil ${editingRegistration ? 'diperbarui' : 'ditambahkan'}.`);
            handleCloseModal();
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus data pendaftar ini?')) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (!res.ok || !result.success) throw new Error(result.message || 'Gagal menghapus data.');
            showNotification('success', 'Data pendaftar berhasil dihapus.');
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Filter & Pagination Logic ---
    const filteredRegistrations = registrations.filter(item => {
        if (!searchTerm) return true;
        const lowerTerm = searchTerm.toLowerCase();
        return (
            item.nama_calon_siswa?.toLowerCase().includes(lowerTerm) ||
            item.asal_sekolah?.toLowerCase().includes(lowerTerm) ||
            item.nama_orang_tua_wali?.toLowerCase().includes(lowerTerm) ||
            item.unit_pilihan?.toLowerCase().includes(lowerTerm)
        );
    });

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentRegistrations = filteredRegistrations.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRegistrations.length / ITEMS_PER_PAGE);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    
    return (
         <div className="relative">
            {notification && (
                <div className={`p-4 mb-4 rounded-md text-sm fixed top-24 right-8 z-[100] shadow-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} role="alert">
                    {notification.message}
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Kelola Pendaftaran Siswa</h1>
                    <p className="text-gray-500 mt-1">Lihat, tambah, edit, atau hapus data pendaftar siswa baru.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-transform duration-300 hover:scale-105 self-start md:self-center">
                    <Plus className="w-5 h-5 mr-2" />
                    <span>Tambah Pendaftar</span>
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
                            placeholder="Cari siswa, asal sekolah, ortu..."
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
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Wali</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. WA</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asal Sekolah</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Daftar</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-700">
                            {isLoading ? (
                                Array.from({length: 5}).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                                        <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : filteredRegistrations.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-10 text-gray-500">
                                    <ClipboardList className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                                    {searchTerm ? 'Data tidak ditemukan.' : 'Belum ada data pendaftar.'}
                                </td></tr>
                            ) : (
                                currentRegistrations.map(pendaftar => (
                                    <tr key={pendaftar.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium whitespace-nowrap">{pendaftar.nama_calon_siswa}</td>
                                        <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{pendaftar.unit_pilihan}</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap">{pendaftar.nama_orang_tua_wali}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{pendaftar.no_wa}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{pendaftar.asal_sekolah || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{formatDateForDisplay(pendaftar.created_at)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button onClick={() => handleOpenModal(pendaftar)} className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-full transition-colors"><Pencil size={18} /></button>
                                                <button onClick={() => handleDelete(pendaftar.id)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"><Trash2 size={18} /></button>
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
                            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                                Math.max(0, currentPage - 3), 
                                Math.min(totalPages, currentPage + 2)
                            ).map((number) => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={`px-3 py-1 rounded-md border ${
                                        currentPage === number
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
                isEditing={!!editingRegistration}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default PendaftaranAdmin;