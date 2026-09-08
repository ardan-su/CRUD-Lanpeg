import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Plus, Loader2, X, MapPin, Phone, Mail, Building2 } from 'lucide-react';
import { type HubungiKamiAPI } from '../../../types';

// --- API Configuration ---
const API_URL = "http://localhost:5001/api/hubungi_kami/";

// --- Type Definitions & Initial State ---
type FormState = Omit<HubungiKamiAPI, 'id' | 'created_at' | 'updated_at'>;

const initialFormState: FormState = {
  nama_unit: "",
  alamat: "",
  telepon: "",
  email: "",
  map_url: "",
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

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Kontak Unit' : 'Tambah Kontak Baru'}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </header>
        <form id="contact-form" onSubmit={onSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Nama Unit *</label>
            <input type="text" name="nama_unit" value={formData.nama_unit} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Alamat *</label>
            <textarea name="alamat" rows={3} value={formData.alamat} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Telepon (pisahkan dengan koma)</label>
            <input type="text" name="telepon" value={formData.telepon ?? ''} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email (pisahkan dengan koma)</label>
            <input type="email" name="email" value={formData.email ?? ''} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">URL Google Maps *</label>
            <input type="url" name="map_url" value={formData.map_url} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" placeholder="https://maps.app.goo.gl/..." />
          </div>
        </form>
         <footer className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-100">Batal</button>
          <button
            type="submit"
            form="contact-form"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2 hover:bg-opacity-90 disabled:bg-gray-400"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            {isEditing ? 'Simpan Perubahan' : 'Tambah Kontak'}
          </button>
        </footer>
      </div>
    </div>
  );
};

// --- Card Component ---
const ContactCard: React.FC<{ contact: HubungiKamiAPI; onEdit: () => void; onDelete: () => void; }> = ({ contact, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-lg shadow-md border overflow-hidden flex flex-col group relative">
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-800 text-lg mb-4">{contact.nama_unit}</h3>
                <div className="space-y-3 text-sm text-gray-600 flex-grow">
                    <div className="flex items-start gap-3">
                        <MapPin size={16} className="text-primary mt-1 flex-shrink-0" />
                        <span>{contact.alamat}</span>
                    </div>
                    {contact.telepon && (
                         <div className="flex items-start gap-3">
                            <Phone size={16} className="text-primary mt-1 flex-shrink-0" />
                            <span>{contact.telepon}</span>
                        </div>
                    )}
                    {contact.email && (
                        <div className="flex items-start gap-3">
                            <Mail size={16} className="text-primary mt-1 flex-shrink-0" />
                            <span className="break-all">{contact.email}</span>
                        </div>
                    )}
                </div>
            </div>
             <div className="absolute top-3 right-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={onEdit} className="p-2 bg-white/80 backdrop-blur-sm text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-full transition-colors shadow-sm"><Pencil size={16} /></button>
                <button onClick={onDelete} className="p-2 bg-white/80 backdrop-blur-sm text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors shadow-sm"><Trash2 size={16} /></button>
            </div>
        </div>
    );
};

// --- Main Page Component ---
const HubungiKamiAdmin: React.FC = () => {
    const [contacts, setContacts] = useState<HubungiKamiAPI[]>([]);
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

    const fetchContacts = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(API_URL, { headers: { Accept: 'application/json' } });
            if (!res.ok) throw new Error('Gagal memuat data dari server.');
            const result = await res.json();
            if (result.success && Array.isArray(result.data)) {
                setContacts(result.data.sort((a: HubungiKamiAPI, b: HubungiKamiAPI) => a.id - b.id));
            } else {
                setContacts([]);
            }
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const handleOpenModal = (contact?: HubungiKamiAPI) => {
        if (contact) {
            setEditingId(contact.id);
            setFormData({
                nama_unit: contact.nama_unit,
                alamat: contact.alamat,
                telepon: contact.telepon,
                email: contact.email,
                map_url: contact.map_url,
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

            showNotification('success', `Kontak berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}.`);
            handleCloseModal();
            fetchContacts();

        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus data kontak ini?')) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (!res.ok || !result.success) throw new Error(result.message || 'Gagal menghapus data.');
            showNotification('success', 'Data kontak berhasil dihapus.');
            fetchContacts();
        } catch (err: any) {
            showNotification('error', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderGrid = () => {
        if (isLoading) {
            return Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md border p-5 space-y-4 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
            ));
        }
        if (contacts.length === 0) {
            return (
                <div className="col-span-full text-center py-16 text-gray-500">
                    <Building2 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="font-semibold">Belum ada data kontak yang ditambahkan.</p>
                </div>
            );
        }
        return contacts.map(contact => (
            <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={() => handleOpenModal(contact)}
                onDelete={() => handleDelete(contact.id)}
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
                    <h1 className="text-3xl font-bold text-gray-800">Kelola Informasi Kontak</h1>
                    <p className="text-gray-500 mt-1">Tambah, edit, atau hapus data kontak untuk setiap unit.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-transform duration-300 hover:scale-105 self-start md:self-center">
                    <Plus className="w-5 h-5 mr-2" />
                    <span>Tambah Baru</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
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
            />
        </div>
    );
};

export default HubungiKamiAdmin;
