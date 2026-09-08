import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Plus, Loader2, X, Layout, Target, Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { uploadFile } from '../../../lib/uploadHelper';

// --- API Configurations ---
const API_BASE = "http://localhost:5001/api";
const ENDPOINTS = {
    banner: `${API_BASE}/banner_tkit/`,
    visiMisi: `${API_BASE}/visi_misi_tujuan_tkit_1/`,
    struktur: `${API_BASE}/struktur_organisasi_tkit1/`,
};

const ITEMS_PER_PAGE = 20;

// --- Helper Components ---
const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: any; label: string }> = ({ active, onClick, icon: Icon, label }) => (
    <button onClick={onClick} className={`flex items-center px-4 py-3 text-sm font-medium transition-colors border-b-2 ${active ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
        <Icon size={18} className="mr-2" />{label}
    </button>
);

const TKIT1Admin: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'banner' | 'visimisi' | 'struktur'>('banner');
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

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    const getEndpoint = () => {
        switch (activeTab) {
            case 'banner': return ENDPOINTS.banner;
            case 'visimisi': return ENDPOINTS.visiMisi;
            case 'struktur': return ENDPOINTS.struktur;
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
            showNotification('error', err.message);
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const url = await uploadFile(file, 'tkit1');
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
            setFormData({});
        }
        setIsModalOpen(true);
    };

    const renderFormContent = () => {
        switch (activeTab) {
            case 'banner':
                return (
                    <>
                        <div className="mb-4"><label className="block text-sm font-medium mb-1">Judul</label><input type="text" name="judul" value={formData.judul || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" /></div>
                        <div className="mb-4"><label className="block text-sm font-medium mb-1">Deskripsi</label><textarea name="deskripsi" value={formData.deskripsi || ''} onChange={handleInputChange} rows={3} className="w-full border rounded px-3 py-2" /></div>
                        <div className="mb-4"><label className="block text-sm font-medium mb-1">Gambar</label><input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'gambar')} className="block w-full text-sm text-gray-500" /></div>
                        <div className="grid grid-cols-2 gap-4"><div className="mb-4"><label className="block text-sm font-medium mb-1">Teks Tombol</label><input type="text" name="tombol_text" value={formData.tombol_text || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" /></div><div><label className="block text-sm font-medium mb-1">Link Tombol</label><input type="text" name="tombol_link" value={formData.tombol_link || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" /></div></div>
                        <div className="mb-4"><label className="block text-sm font-medium mb-1">Urutan</label><input type="number" name="urutan" value={formData.urutan || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" /></div>
                    </>
                );
            case 'visimisi':
                return (
                    <>
                        <div className="mb-4"><label className="block text-sm font-medium mb-1">Visi</label><textarea name="visi" value={formData.visi || ''} onChange={handleInputChange} rows={3} className="w-full border rounded px-3 py-2" /></div>
                        <div className="mb-4"><label className="block text-sm font-medium mb-1">Misi</label><textarea name="misi" value={formData.misi || ''} onChange={handleInputChange} rows={5} className="w-full border rounded px-3 py-2" /></div>
                        <div className="mb-4"><label className="block text-sm font-medium mb-1">Tujuan</label><textarea name="tujuan" value={formData.tujuan || ''} onChange={handleInputChange} rows={5} className="w-full border rounded px-3 py-2" /></div>
                    </>
                );
            case 'struktur':
                return (
                    <>
                        <div className="mb-4"><label className="block text-sm font-medium mb-1">Nama</label><input type="text" name="nama" value={formData.nama || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" /></div>
                        <div className="mb-4"><label className="block text-sm font-medium mb-1">Jabatan</label><input type="text" name="jabatan" value={formData.jabatan || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" /></div>
                        <div className="mb-4"><label className="block text-sm font-medium mb-1">Foto</label><input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'foto')} className="block w-full text-sm text-gray-500" /></div>
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
                return currentItems.map(item => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-3"><img src={item.gambar} className="h-12 w-20 object-cover rounded" alt="Banner" /></td>
                        <td className="p-3 font-medium">{item.judul}</td>
                        <td className="p-3 text-right">
                            <button onClick={() => openModal(item)} className="text-yellow-600 p-2"><Pencil size={16} /></button>
                            <button onClick={() => handleDelete(item.id)} className="text-red-600 p-2"><Trash2 size={16} /></button>
                        </td>
                    </tr>
                ));
            case 'visimisi':
                return currentItems.map(item => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm line-clamp-2">{(item.visi || '').substring(0, 50)}...</td>
                        <td className="p-3 text-sm line-clamp-2">{(item.misi || '').substring(0, 50)}...</td>
                        <td className="p-3 text-right">
                            <button onClick={() => openModal(item)} className="text-yellow-600 p-2"><Pencil size={16} /></button>
                            <button onClick={() => handleDelete(item.id)} className="text-red-600 p-2"><Trash2 size={16} /></button>
                        </td>
                    </tr>
                ));
            case 'struktur':
                return currentItems.map(item => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-3"><img src={item.foto} className="h-10 w-10 rounded-full object-cover" alt={item.nama} /></td>
                        <td className="p-3 font-medium">{item.nama}</td>
                        <td className="p-3 text-sm">{item.jabatan}</td>
                        <td className="p-3 text-right">
                            <button onClick={() => openModal(item)} className="text-yellow-600 p-2"><Pencil size={16} /></button>
                            <button onClick={() => handleDelete(item.id)} className="text-red-600 p-2"><Trash2 size={16} /></button>
                        </td>
                    </tr>
                ));
        }
    };

    return (
        <div>
            {notification && <div className={`p-4 mb-4 rounded-md text-sm fixed top-24 right-8 z-[100] shadow-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{notification.message}</div>}
            <div className="mb-8"><h1 className="text-3xl font-bold text-gray-800">Manajemen TKIT 1</h1></div>
            <div className="bg-white rounded-t-xl border-b flex">
                <TabButton active={activeTab === 'banner'} onClick={() => setActiveTab('banner')} icon={Layout} label="Banner" />
                <TabButton active={activeTab === 'visimisi'} onClick={() => setActiveTab('visimisi')} icon={Target} label="Visi Misi" />
                <TabButton active={activeTab === 'struktur'} onClick={() => setActiveTab('struktur')} icon={Users} label="Struktur" />
            </div>
            <div className="bg-white rounded-b-xl shadow-sm border border-t-0 p-6">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold">Data {activeTab.toUpperCase()}</h2>
                    <button onClick={() => openModal()} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center"><Plus size={18} className="mr-2" /> Tambah</button>
                </div>

                {/* Search Bar */}
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

                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50"><tr><th className="p-3">Info</th><th className="p-3">Detail</th><th className="p-3 text-right">Aksi</th></tr></thead>
                    <tbody>{renderTableContent()}</tbody>
                </table>

                {/* Pagination Controls */}
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
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg">{editingId ? 'Edit' : 'Tambah'}</h3><button onClick={() => setIsModalOpen(false)}><X size={20} /></button></div>
                        <form onSubmit={handleSave}>{renderFormContent()}<div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Batal</button><button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded flex items-center">{isSubmitting && <Loader2 size={16} className="animate-spin mr-2" />} Simpan</button></div></form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TKIT1Admin;