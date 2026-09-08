import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Plus, Loader2, X, Layout, Target, BookOpen, Star, Users, Trophy, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { uploadFile } from '../../../lib/uploadHelper';
import {
    type VisiMisiSasaranSdit,
    type KurikulumSdit,
    type ProgramUnggulanSdit,
    type StrukturOrganisasiSdit,
    type PrestasiSdit
} from '../../../types';

// --- Types & Interfaces ---
interface BannerSdit {
    id: number;
    judul: string;
    deskripsi: string;
    gambar: string;
    tombol_teks: string;
    tombol_link: string;
}

// --- API Configurations ---
const API_BASE = "http://localhost:5001/api";
const ENDPOINTS = {
    banner: `${API_BASE}/banner_sdit/`,
    visiMisi: `${API_BASE}/visi_misi_sasaran_sdit/`,
    kurikulum: `${API_BASE}/kurikulum_sdit/`,
    program: `${API_BASE}/program_unggulan_sdit/`,
    struktur: `${API_BASE}/struktur_organisasi_sdit/`,
    prestasi: `${API_BASE}/prestasi_sdit/`,
};

const ITEMS_PER_PAGE = 20;

// --- Reusable Components ---

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: any; label: string }> = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center px-4 py-3 text-sm font-medium transition-colors border-b-2 ${active
            ? 'border-primary text-primary bg-primary/5'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
    >
        <Icon size={18} className="mr-2" />
        {label}
    </button>
);

const SectionHeader: React.FC<{ title: string; description: string; onAdd?: () => void; addButtonLabel?: string }> = ({ title, description, onAdd, addButtonLabel }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        {onAdd && (
            <button onClick={onAdd} className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded-lg flex items-center transition-transform hover:scale-105">
                <Plus size={18} className="mr-2" />
                {addButtonLabel || 'Tambah Baru'}
            </button>
        )}
    </div>
);

const SDITAdmin: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'banner' | 'visimisi' | 'kurikulum' | 'program' | 'struktur' | 'prestasi'>('banner');

    // Generic States
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Search & Pagination States
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // --- Actions ---

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    const getEndpoint = () => {
        switch (activeTab) {
            case 'banner': return ENDPOINTS.banner;
            case 'visimisi': return ENDPOINTS.visiMisi;
            case 'kurikulum': return ENDPOINTS.kurikulum;
            case 'program': return ENDPOINTS.program;
            case 'struktur': return ENDPOINTS.struktur;
            case 'prestasi': return ENDPOINTS.prestasi;
            default: return '';
        }
    };

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(getEndpoint(), { headers: { Accept: 'application/json' } });
            const result = await res.json();
            if (result.success && Array.isArray(result.data)) {
                setData(result.data);
            } else {
                setData([]);
            }
        } catch (err: any) {
            showNotification('error', 'Gagal memuat data: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchData();
        setFormData({});
        setEditingId(null);
        setSearchTerm('');
        setCurrentPage(1);
    }, [fetchData, activeTab]);

    // Filtering Logic
    const filteredData = data.filter((item) => {
        if (!searchTerm) return true;
        const lowerTerm = searchTerm.toLowerCase();
        return Object.values(item).some(val =>
            String(val).toLowerCase().includes(lowerTerm)
        );
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const url = editingId ? `${getEndpoint()}${editingId}` : getEndpoint();
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await res.json();
            if (!res.ok || !result.success) throw new Error(result.message || 'Gagal menyimpan data');

            showNotification('success', 'Data berhasil disimpan');
            setIsModalOpen(false);
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Yakin ingin menghapus data ini?')) return;
        try {
            const res = await fetch(`${getEndpoint()}${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (!result.success) throw new Error(result.message);
            showNotification('success', 'Data berhasil dihapus');
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        }
    };

    // --- Form Handling ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const url = await uploadFile(file, 'sdit');
                setFormData({ ...formData, [fieldName]: url });
            } catch (error: any) {
                console.error('Upload error:', error);
                alert('Gagal mengupload gambar: ' + error.message);
            }
        }
    };

    const openModal = (item?: any) => {
        if (item) {
            setEditingId(item.id);
            setFormData({ ...item });
        } else {
            setEditingId(null);
            switch (activeTab) {
                case 'banner': setFormData({ judul: '', deskripsi: '', gambar: '', tombol_teks: '', tombol_link: '' }); break;
                case 'visimisi': setFormData({ tipe: 'Visi', deskripsi: '' }); break;
                case 'kurikulum': setFormData({ judul: '', deskripsi: '' }); break;
                case 'program': setFormData({ kategori: 'Unggulan', nama_program: '' }); break;
                case 'struktur': setFormData({ nama: '', jabatan: '', foto: '' }); break;
                case 'prestasi': setFormData({ jenis_lomba: '', nama_siswa: '', prestasi: '', tanggal: new Date().toISOString().split('T')[0], tingkat: '' }); break;
            }
        }
        setIsModalOpen(true);
    };

    // --- Render Content Based on Tab ---
    const renderFormContent = () => {
        switch (activeTab) {
            case 'banner':
                return (
                    <>
                        <div className="mb-4"><label className="block text-sm font-medium mb-1">Judul</label><input type="text" name="judul" value={formData.judul || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" /></div>
                        <div className="mb-4"><label className="block text-sm font-medium mb-1">Deskripsi</label><textarea name="deskripsi" value={formData.deskripsi || ''} onChange={handleInputChange} rows={3} className="w-full border rounded px-3 py-2" /></div>
                        <div className="mb-4"><label className="block text-sm font-medium mb-1">Gambar Banner</label><input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'gambar')} className="block w-full text-sm text-gray-500" />{formData.gambar && <img src={formData.gambar} alt="Preview" className="mt-2 h-20 object-contain" />}</div>
                        <div className="grid grid-cols-2 gap-4 mb-4"><div><label className="block text-sm font-medium mb-1">Teks Tombol</label><input type="text" name="tombol_teks" value={formData.tombol_teks || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" /></div><div><label className="block text-sm font-medium mb-1">Link Tombol</label><input type="text" name="tombol_link" value={formData.tombol_link || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" /></div></div>
                    </>
                );
            case 'visimisi':
                return (
                    <>
                        <div className="mb-4"><label className="block text-sm font-medium mb-1">Tipe</label><select name="tipe" value={formData.tipe || 'Visi'} onChange={handleInputChange} className="w-full border rounded px-3 py-2"><option value="Visi">Visi</option><option value="Misi">Misi</option><option value="Sasaran">Sasaran</option></select></div>
                        <div className="mb-4"><label className="block text-sm font-medium mb-1">Deskripsi</label><textarea name="deskripsi" value={formData.deskripsi || ''} onChange={handleInputChange} rows={5} className="w-full border rounded px-3 py-2" /></div>
                    </>
                );
            case 'kurikulum':
                return (
                    <>
                        <div className="mb-4"><label className="block text-sm font-medium mb-1">Judul / Kategori</label><input type="text" name="judul" value={formData.judul || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" /></div>
                        <div className="mb-4"><label className="block text-sm font-medium mb-1">Isi Kurikulum</label><textarea name="deskripsi" value={formData.deskripsi || ''} onChange={handleInputChange} rows={5} className="w-full border rounded px-3 py-2" /></div>
                    </>
                );
            case 'program':
                return (
                    <>
                        <div className="mb-4"><label className="block text-sm font-medium mb-1">Kategori</label><input type="text" name="kategori" value={formData.kategori || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" /></div>
                        <div className="mb-4"><label className="block text-sm font-medium mb-1">Nama Program</label><textarea name="nama_program" value={formData.nama_program || ''} onChange={handleInputChange} rows={3} className="w-full border rounded px-3 py-2" /></div>
                    </>
                );
            case 'struktur':
                return (
                    <>
                        <div className="mb-4"><label className="block text-sm font-medium mb-1">Nama Lengkap</label><input type="text" name="nama" value={formData.nama || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" /></div>
                        <div className="mb-4"><label className="block text-sm font-medium mb-1">Jabatan</label><input type="text" name="jabatan" value={formData.jabatan || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" /></div>
                        <div className="mb-4"><label className="block text-sm font-medium mb-1">Foto</label><input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'foto')} className="block w-full text-sm text-gray-500" />{formData.foto && <img src={formData.foto} alt="Preview" className="mt-2 h-20 object-contain" />}</div>
                    </>
                );
            case 'prestasi':
                return (
                    <>
                        <div className="grid grid-cols-2 gap-4 mb-4"><div><label className="block text-sm font-medium mb-1">Tanggal</label><input type="date" name="tanggal" value={formData.tanggal || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" /></div><div><label className="block text-sm font-medium mb-1">Nama Siswa</label><input type="text" name="nama_siswa" value={formData.nama_siswa || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" /></div></div>
                        <div className="mb-4"><label className="block text-sm font-medium mb-1">Jenis Lomba</label><input type="text" name="jenis_lomba" value={formData.jenis_lomba || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" /></div>
                        <div className="grid grid-cols-2 gap-4 mb-4"><div><label className="block text-sm font-medium mb-1">Prestasi (Juara)</label><input type="text" name="prestasi" value={formData.prestasi || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" /></div><div><label className="block text-sm font-medium mb-1">Tingkat</label><input type="text" name="tingkat" value={formData.tingkat || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" /></div></div>
                    </>
                );
            default: return null;
        }
    };

    const renderTableContent = () => {
        if (isLoading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></div>;
        if (filteredData.length === 0) return <div className="p-8 text-center text-gray-500">{searchTerm ? 'Data tidak ditemukan.' : 'Belum ada data.'}</div>;

        switch (activeTab) {
            case 'banner':
                return currentItems.map((item: BannerSdit) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-3"><img src={item.gambar} alt="Banner" className="h-12 w-20 object-cover rounded" /></td>
                        <td className="p-3 font-medium">{item.judul}</td>
                        <td className="p-3 text-sm text-gray-500 truncate max-w-xs">{(item.deskripsi || '').substring(0, 50)}...</td>
                        <td className="p-3 text-right">
                            <button onClick={() => openModal(item)} className="text-yellow-600 p-2"><Pencil size={16} /></button>
                            <button onClick={() => handleDelete(item.id)} className="text-red-600 p-2"><Trash2 size={16} /></button>
                        </td>
                    </tr>
                ));
            case 'visimisi':
                return currentItems.map((item: VisiMisiSasaranSdit) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-bold text-primary w-32">{item.tipe}</td>
                        <td className="p-3 whitespace-pre-wrap text-sm">{(item.deskripsi || '').substring(0, 100)}...</td>
                        <td className="p-3 text-right w-24">
                            <button onClick={() => openModal(item)} className="text-yellow-600 p-2"><Pencil size={16} /></button>
                            <button onClick={() => handleDelete(item.id)} className="text-red-600 p-2"><Trash2 size={16} /></button>
                        </td>
                    </tr>
                ));
            case 'kurikulum':
                return currentItems.map((item: KurikulumSdit) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium w-1/4">{item.judul}</td>
                        <td className="p-3 text-sm">{(item.deskripsi || '').substring(0, 100)}...</td>
                        <td className="p-3 text-right w-24">
                            <button onClick={() => openModal(item)} className="text-yellow-600 p-2"><Pencil size={16} /></button>
                            <button onClick={() => handleDelete(item.id)} className="text-red-600 p-2"><Trash2 size={16} /></button>
                        </td>
                    </tr>
                ));
            case 'program':
                return currentItems.map((item: ProgramUnggulanSdit) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium w-1/4">{item.kategori}</td>
                        <td className="p-3 text-sm">{item.nama_program}</td>
                        <td className="p-3 text-right w-24">
                            <button onClick={() => openModal(item)} className="text-yellow-600 p-2"><Pencil size={16} /></button>
                            <button onClick={() => handleDelete(item.id)} className="text-red-600 p-2"><Trash2 size={16} /></button>
                        </td>
                    </tr>
                ));
            case 'struktur':
                return currentItems.map((item: StrukturOrganisasiSdit) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-3"><img src={item.foto} alt={item.nama} className="h-10 w-10 rounded-full object-cover" /></td>
                        <td className="p-3 font-medium">{item.nama}</td>
                        <td className="p-3 text-sm">{item.jabatan}</td>
                        <td className="p-3 text-right w-24">
                            <button onClick={() => openModal(item)} className="text-yellow-600 p-2"><Pencil size={16} /></button>
                            <button onClick={() => handleDelete(item.id)} className="text-red-600 p-2"><Trash2 size={16} /></button>
                        </td>
                    </tr>
                ));
            case 'prestasi':
                return currentItems.map((item: PrestasiSdit) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm">{item.tanggal}</td>
                        <td className="p-3 font-medium">{item.nama_siswa}</td>
                        <td className="p-3 text-sm">{item.jenis_lomba}</td>
                        <td className="p-3 text-sm font-bold text-green-600">{item.prestasi}</td>
                        <td className="p-3 text-sm">{item.tingkat}</td>
                        <td className="p-3 text-right w-24">
                            <button onClick={() => openModal(item)} className="text-yellow-600 p-2"><Pencil size={16} /></button>
                            <button onClick={() => handleDelete(item.id)} className="text-red-600 p-2"><Trash2 size={16} /></button>
                        </td>
                    </tr>
                ));
        }
    };

    const getTableHeaders = () => {
        switch (activeTab) {
            case 'banner': return ['Gambar', 'Judul', 'Deskripsi', 'Aksi'];
            case 'visimisi': return ['Tipe', 'Deskripsi', 'Aksi'];
            case 'kurikulum': return ['Judul', 'Deskripsi', 'Aksi'];
            case 'program': return ['Kategori', 'Nama Program', 'Aksi'];
            case 'struktur': return ['Foto', 'Nama', 'Jabatan', 'Aksi'];
            case 'prestasi': return ['Tanggal', 'Nama Siswa', 'Jenis Lomba', 'Prestasi', 'Tingkat', 'Aksi'];
            default: return [];
        }
    };

    return (
        <div className="relative">
            {notification && (
                <div className={`p-4 mb-4 rounded-md text-sm fixed top-24 right-8 z-[100] shadow-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {notification.message}
                </div>
            )}

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Manajemen Unit SDIT</h1>
                <p className="text-gray-500">Kelola seluruh konten untuk halaman SMK PKP 1 Jakarta.</p>
            </div>

            <div className="bg-white rounded-t-xl border-b flex overflow-x-auto scrollbar-hide">
                <TabButton active={activeTab === 'banner'} onClick={() => setActiveTab('banner')} icon={Layout} label="Banner" />
                <TabButton active={activeTab === 'visimisi'} onClick={() => setActiveTab('visimisi')} icon={Target} label="Visi Misi" />
                <TabButton active={activeTab === 'kurikulum'} onClick={() => setActiveTab('kurikulum')} icon={BookOpen} label="Kurikulum" />
                <TabButton active={activeTab === 'program'} onClick={() => setActiveTab('program')} icon={Star} label="Program" />
                <TabButton active={activeTab === 'struktur'} onClick={() => setActiveTab('struktur')} icon={Users} label="Struktur" />
                <TabButton active={activeTab === 'prestasi'} onClick={() => setActiveTab('prestasi')} icon={Trophy} label="Prestasi" />
            </div>

            <div className="bg-white rounded-b-xl shadow-sm border border-t-0 p-6">
                <SectionHeader
                    title={`Data ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
                    description={`Kelola daftar ${activeTab} SDIT.`}
                    onAdd={() => openModal()}
                />

                <div className="mb-4 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Cari data..."
                        className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-primary"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-700 text-sm uppercase">
                                {getTableHeaders().map((h, i) => <th key={i} className="p-3 border-b">{h}</th>)}
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {renderTableContent()}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-6 space-x-2">
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
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="font-bold text-lg">{editingId ? 'Edit Data' : 'Tambah Data Baru'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 max-h-[80vh] overflow-y-auto">
                            {renderFormContent()}
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Batal</button>
                                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 flex items-center">
                                    {isSubmitting && <Loader2 size={16} className="animate-spin mr-2" />} Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SDITAdmin;