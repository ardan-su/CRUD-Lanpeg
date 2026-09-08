import React, { useEffect, useState, useCallback } from 'react';
import { Pencil, Trash2, Plus, Loader2, X, Eye, Target } from 'lucide-react';
import { type VisiAPI, type MisiAPI } from '../../../types';

// API Configuration
const API_BASE_URL = 'http://localhost:5001/api/profil-yayasan';
const VISI_API_URL = `${API_BASE_URL}/visi/`;
const MISI_API_URL = `${API_BASE_URL}/misi/`;

// Type Definitions
type VisiFormState = Omit<VisiAPI, 'id' | 'profil_id'>;
type MisiFormState = Omit<MisiAPI, 'id' | 'profil_id'>;

type ModalMode = 'editVisi' | 'addMisi' | 'editMisi';

// --- Main Admin Component ---
const VisiMisiAdmin: React.FC = () => {
    const [visi, setVisi] = useState<VisiAPI | null>(null);
    const [misiList, setMisiList] = useState<MisiAPI[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'submitting'>('idle');
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<ModalMode | null>(null);
    const [formData, setFormData] = useState<Partial<VisiFormState & MisiFormState>>({});
    const [editingId, setEditingId] = useState<number | null>(null);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    const fetchData = useCallback(async () => {
        setStatus('loading');
        try {
            const [visiRes, misiRes] = await Promise.all([
                fetch(VISI_API_URL, { headers: { Accept: 'application/json' } }),
                fetch(MISI_API_URL, { headers: { Accept: 'application/json' } })
            ]);

            if (!visiRes.ok || !misiRes.ok) throw new Error('Gagal mengambil data dari server.');
            
            const visiResult = await visiRes.json();
            const misiResult = await misiRes.json();

            if (visiResult.success && visiResult.data.length > 0) {
                setVisi(visiResult.data[0]);
            } else {
                setVisi(null);
            }

            if (misiResult.success) {
                setMisiList(misiResult.data.sort((a: MisiAPI, b: MisiAPI) => a.nomor - b.nomor));
            } else {
                setMisiList([]);
            }
        } catch (err: any) {
            showNotification('error', err.message || 'Gagal memuat data.');
        } finally {
            setStatus('idle');
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const closeModal = () => {
        setIsModalOpen(false);
        setModalMode(null);
        setFormData({});
        setEditingId(null);
    };

    const handleEditVisi = () => {
        if (!visi) return;
        setModalMode('editVisi');
        setFormData({
            judul: visi.judul,
            deskripsi: visi.deskripsi,
            visi: visi.visi,
        });
        setEditingId(visi.id);
        setIsModalOpen(true);
    };

    const handleAddMisi = () => {
        setModalMode('addMisi');
        const nextNomor = misiList.length > 0 ? Math.max(...misiList.map(m => m.nomor)) + 1 : 1;
        setFormData({ isi: '', nomor: nextNomor });
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleEditMisi = (misiItem: MisiAPI) => {
        setModalMode('editMisi');
        setFormData({
            isi: misiItem.isi,
            nomor: misiItem.nomor,
        });
        setEditingId(misiItem.id);
        setIsModalOpen(true);
    };

    const handleDeleteMisi = async (id: number) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus misi ini?')) return;
        setStatus('submitting');
        try {
            const res = await fetch(`${MISI_API_URL}${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (!result.success) throw new Error(result.message || 'Gagal menghapus misi.');
            showNotification('success', 'Misi berhasil dihapus.');
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setStatus('idle');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        
        let url = '';
        let method: 'POST' | 'PUT' = 'POST';
        let body: any = {};

        if (modalMode === 'editVisi' && editingId) {
            url = `${VISI_API_URL}${editingId}`;
            method = 'PUT';
            body = formData;
        } else if (modalMode === 'addMisi') {
            url = MISI_API_URL;
            method = 'POST';
            body = { ...formData, profil_id: visi?.id };
            if (!visi?.id) {
                showNotification('error', 'Visi harus ada sebelum menambahkan Misi.');
                setStatus('idle');
                return;
            }
        } else if (modalMode === 'editMisi' && editingId) {
            url = `${MISI_API_URL}${editingId}`;
            method = 'PUT';
            body = { ...formData, profil_id: visi?.id };
        }

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(body),
            });
            const result = await res.json();
            if (!res.ok || !result.success) {
                const errorMessages = result.data ? Object.values(result.data).flat().join(' ') : result.message;
                throw new Error(errorMessages || 'Terjadi kesalahan pada server.');
            }
            showNotification('success', `Data berhasil ${method === 'POST' ? 'ditambahkan' : 'diperbarui'}.`);
            closeModal();
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setStatus('idle');
        }
    };

    return (
        <div className="space-y-10">
            {notification && (
                 <div className={`p-4 mb-4 rounded-md text-sm fixed top-24 right-8 z-[100] shadow-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} role="alert">
                    {notification.message}
                </div>
            )}

            {/* Visi Section */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <Eye className="text-primary"/> Visi
                    </h2>
                    <button onClick={handleEditVisi} disabled={!visi} className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed">
                        <Pencil size={16}/> Edit Visi
                    </button>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-primary">
                    {status === 'loading' ? <p className="text-gray-500">Memuat...</p> : visi ? (
                        <>
                            <h3 className="text-lg font-bold text-gray-700">{visi.judul}</h3>
                            <p className="text-sm text-gray-500">{visi.deskripsi}</p>
                            <blockquote className="mt-4 pl-4 border-l-2 border-gray-200 italic text-gray-600">
                                “{visi.visi}”
                            </blockquote>
                        </>
                    ) : <p className="text-gray-500 text-center py-4">Data Visi belum ada. Silakan tambahkan melalui CMS atau hubungi developer.</p>}
                </div>
            </section>
            
            {/* Misi Section */}
            <section>
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <Target className="text-primary"/> Misi
                    </h2>
                    <button onClick={handleAddMisi} disabled={!visi} className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed bg-primary/10 px-3 py-1.5 rounded-full">
                        <Plus size={16}/> Tambah Misi
                    </button>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
                    {status === 'loading' ? <p className="text-gray-500">Memuat...</p> : misiList.length > 0 ? (
                        misiList.map(item => (
                            <div key={item.id} className="flex items-start justify-between gap-4 p-3 rounded-lg hover:bg-gray-50">
                                <div className="flex items-start gap-3">
                                    <span className="font-bold text-primary">{item.nomor}.</span>
                                    <p className="text-gray-700">{item.isi}</p>
                                </div>
                                <div className="flex-shrink-0 flex items-center gap-1">
                                    <button onClick={() => handleEditMisi(item)} className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-full"><Pencil size={16}/></button>
                                    <button onClick={() => handleDeleteMisi(item.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        ))
                    ) : <p className="text-gray-500 text-center py-4">Belum ada data Misi.</p>}
                </div>
            </section>

            {isModalOpen && (
                <VisiMisiModal
                    isOpen={isModalOpen}
                    mode={modalMode!}
                    formData={formData}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                    onClose={closeModal}
                    isSubmitting={status === 'submitting'}
                />
            )}
        </div>
    );
};

// --- Modal Component ---
interface ModalProps {
    isOpen: boolean;
    mode: ModalMode;
    formData: Partial<VisiFormState & MisiFormState>;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    handleSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    isSubmitting: boolean;
}

const VisiMisiModal: React.FC<ModalProps> = ({ isOpen, mode, formData, setFormData, handleSubmit, onClose, isSubmitting }) => {
    if (!isOpen) return null;
    
    const title = {
        editVisi: 'Edit Visi',
        addMisi: 'Tambah Misi Baru',
        editMisi: 'Edit Misi',
    }[mode];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-5 border-b">
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><X size={20} className="text-gray-600" /></button>
                </header>
                <form id="visi-misi-form" onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
                    {mode === 'editVisi' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Judul</label>
                                <input type="text" name="judul" value={formData.judul || ''} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Deskripsi</label>
                                <textarea name="deskripsi" rows={3} value={formData.deskripsi || ''} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Visi</label>
                                <textarea name="visi" rows={4} value={formData.visi || ''} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                            </div>
                        </>
                    )}
                    {(mode === 'addMisi' || mode === 'editMisi') && (
                        <>
                             <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Isi Misi</label>
                                <textarea name="isi" rows={4} value={formData.isi || ''} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Nomor Urut</label>
                                <input type="number" name="nomor" value={formData.nomor || 1} onChange={handleChange} className="w-24 border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
                            </div>
                        </>
                    )}
                </form>
                 <footer className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
                    <button type="button" onClick={onClose} className="px-5 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-100">Batal</button>
                    <button type="submit" form="visi-misi-form" disabled={isSubmitting} className="px-5 py-2 bg-primary text-white rounded-md flex items-center gap-2 hover:bg-opacity-90 disabled:bg-gray-400">
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Simpan Perubahan'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default VisiMisiAdmin;
