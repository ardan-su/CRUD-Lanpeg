import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Plus, Loader2, X, Share2, Youtube, Facebook, Instagram } from 'lucide-react';
import { type MediaSosial } from '../../../types';

// --- API Configuration ---
const API_URL = "http://localhost:5001/api/media-sosial/";

// --- Type Definitions & Initial State ---
type FormState = Omit<MediaSosial, 'id'>;

const initialFormState: FormState = {
  nama: "YouTube",
  username: "",
  link: "",
  icon: "youtube",
};

const ICON_OPTIONS: MediaSosial['icon'][] = ['youtube', 'facebook', 'instagram'];

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Media Sosial' : 'Tambah Media Sosial'}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </header>
        <form id="social-form" onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Platform *</label>
            <select name="nama" value={formData.nama} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary">
              <option value="YouTube">YouTube</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Username/Handle *</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Link URL Lengkap *</label>
            <input type="url" name="link" value={formData.link} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Ikon *</label>
            <select name="icon" value={formData.icon} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary">
              {ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
            </select>
          </div>
        </form>
        <footer className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-100">Batal</button>
          <button type="submit" form="social-form" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2 hover:bg-opacity-90 disabled:bg-gray-400">
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            {isEditing ? 'Simpan Perubahan' : 'Tambah'}
          </button>
        </footer>
      </div>
    </div>
  );
};

const iconMap: { [key: string]: React.FC<any> } = {
  youtube: Youtube,
  facebook: Facebook,
  instagram: Instagram,
};

// --- Main Page Component ---
const MediaSosialAdminBeranda: React.FC = () => {
    const [socials, setSocials] = useState<MediaSosial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<FormState>(initialFormState);

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
                setSocials(result.data);
            } else {
                setSocials([]);
            }
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleOpenModal = (item?: MediaSosial) => {
        if (item) {
            setEditingId(item.id);
            setFormData({ nama: item.nama, username: item.username, link: item.link, icon: item.icon });
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
            if (!res.ok || !result.success) throw new Error(result.message || 'Gagal menyimpan data.');
            showNotification('success', `Media sosial berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}.`);
            handleCloseModal();
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus item ini?')) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (!res.ok || !result.success) throw new Error(result.message || 'Gagal menghapus data.');
            showNotification('success', 'Media sosial berhasil dihapus.');
            fetchData();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="p-8 text-center text-gray-500"><Loader2 className="h-8 w-8 animate-spin mx-auto" /> Memuat...</div>;
        }
        if (socials.length === 0) {
            return (
                <div className="text-center py-16 text-gray-500 border-2 border-dashed rounded-lg">
                    <Share2 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="font-semibold">Belum ada media sosial yang ditambahkan.</p>
                </div>
            );
        }
        return (
            <div className="space-y-3">
                {socials.map(item => {
                    const Icon = iconMap[item.icon] || Share2;
                    return (
                        <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Icon className="w-8 h-8 text-primary" />
                                <div>
                                    <p className="font-bold text-gray-800">{item.nama}</p>
                                    <p className="text-sm text-gray-500">{item.username}</p>
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">{item.link}</a>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleOpenModal(item)} className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-full"><Pencil size={18} /></button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    )
                })}
            </div>
        );
    };

    return (
        <div className="relative max-w-4xl mx-auto">
            {notification && (
                <div className={`p-4 mb-4 rounded-md text-sm fixed top-24 right-8 z-[100] shadow-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} role="alert">
                    {notification.message}
                </div>
            )}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Kelola Media Sosial</h1>
                    <p className="text-gray-500 mt-1">Atur tautan media sosial yang ditampilkan di website.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-transform duration-300 hover:scale-105">
                    <Plus className="w-5 h-5 mr-2" />
                    <span>Tambah</span>
                </button>
            </div>
            {renderContent()}
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

export default MediaSosialAdminBeranda;