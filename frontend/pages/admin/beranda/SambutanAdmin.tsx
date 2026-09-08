
import React, { useEffect, useState, useCallback } from 'react';
import { Pencil, Trash2, Plus, Loader2, X } from 'lucide-react';
import { type ProfilYayasanAPI } from '../../../types';

const API_BASE_URL = 'http://localhost:5001/api';
const API_URL = `${API_BASE_URL}/profil-yayasan/`;

type FormState = Omit<ProfilYayasanAPI, 'id' | 'created_at' | 'updated_at'>;

const initialState: FormState = {
  judul: '',
  deskripsi: '',
  subjudul: '',
  sambutan: '',
  nama_ketua: '',
  jabatan: '',
  foto_url: '',
};

// --- Form Modal Component ---
interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormState;
  setFormData: React.Dispatch<React.SetStateAction<FormState>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isEditing: boolean;
  status: 'idle' | 'loading' | 'submitting';
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose, formData, setFormData, handleSubmit, isEditing, status }) => {
  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Data Sambutan' : 'Tambah Data Sambutan'}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X size={20} className="text-gray-600" />
          </button>
        </header>
        <form id="sambutan-form" onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Judul *</label>
            <input type="text" name="judul" value={formData.judul} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Subjudul *</label>
            <input type="text" name="subjudul" value={formData.subjudul} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Deskripsi *</label>
            <textarea name="deskripsi" rows={3} value={formData.deskripsi} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Isi Sambutan *</label>
            <textarea name="sambutan" rows={4} value={formData.sambutan} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Nama Ketua *</label>
              <input type="text" name="nama_ketua" value={formData.nama_ketua} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Jabatan *</label>
              <input type="text" name="jabatan" value={formData.jabatan} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">URL Foto</label>
            <input type="text" name="foto_url" value={formData.foto_url} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
            {formData.foto_url && <img src={formData.foto_url} alt="Preview" className="h-32 mt-2 rounded-md border object-cover" />}
          </div>
        </form>
        <footer className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-100">Batal</button>
          <button
            type="submit"
            form="sambutan-form"
            onClick={handleSubmit}
            disabled={status === 'submitting'}
            className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2 hover:bg-opacity-90 disabled:bg-gray-400"
          >
            {status === 'submitting' ? (<Loader2 size={18} className="animate-spin" />) : isEditing ? (<Pencil size={18} />) : (<Plus size={18} />)}
            {isEditing ? 'Update Data' : 'Tambah Data'}
          </button>
        </footer>
      </div>
    </div>
  );
};


const SambutanAdminBeranda: React.FC = () => {
  const [formData, setFormData] = useState<FormState>(initialState);
  const [dataList, setDataList] = useState<ProfilYayasanAPI[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'submitting'>('idle');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchData = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await fetch(API_URL, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('Network response was not ok.');
      const result = await res.json();
      if (result.success) {
        setDataList(result.data || []);
      } else {
        throw new Error(result.message || 'Gagal mengambil data.');
      }
    } catch (err: any) {
      showNotification('error', err.message);
      setDataList([]);
    } finally {
      setStatus('idle');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    let url = API_URL;
    let method: 'POST' | 'PUT' = 'POST';

    if (editingId) {
      url = `${API_URL}${editingId}`;
      method = 'PUT';
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();

      if (result.success) {
        showNotification('success', result.message || 'Data berhasil disimpan.');
        fetchData();
        handleCloseModal();
      } else {
        const errorMessages = result.data ? Object.values(result.data).flat().join(' ') : result.message;
        throw new Error(errorMessages || 'Gagal menyimpan data.');
      }
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setStatus('idle');
    }
  };
  
  const handleAddNewClick = () => {
    setEditingId(null);
    setFormData(initialState);
    setIsModalOpen(true);
  };

  const handleEditClick = (item: ProfilYayasanAPI) => {
    setEditingId(item.id);
    setFormData({
        judul: item.judul,
        deskripsi: item.deskripsi,
        subjudul: item.subjudul,
        sambutan: item.sambutan,
        nama_ketua: item.nama_ketua,
        jabatan: item.jabatan,
        foto_url: item.foto_url,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!id || !window.confirm('Yakin ingin menghapus data ini?')) return;
    setStatus('submitting');

    try {
      const res = await fetch(`${API_URL}${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });
      const result = await res.json();

      if (result.success) {
        showNotification('success', result.message || 'Data berhasil dihapus.');
        fetchData();
      } else {
        throw new Error(result.message || 'Gagal menghapus data.');
      }
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="relative">
      {notification && (
        <div
          className={`p-4 mb-4 rounded-md text-sm fixed top-24 right-8 z-[100] shadow-lg ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
          role="alert"
        >
          {notification.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Sambutan Kepala Sekolah</h1>
            <p className="text-gray-500 mt-1">Kelola konten sambutan yang tampil di halaman Beranda.</p>
        </div>
        {dataList.length === 0 && (
          <button onClick={handleAddNewClick} className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-transform duration-300 hover:scale-105">
              <Plus className="w-5 h-5 mr-2" />
              <span>Tambah Baru</span>
          </button>
        )}
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
        {status === 'loading' ? (
          <div className="text-center p-8">
            <Loader2 size={32} className="animate-spin text-primary mx-auto" />
            <p className="mt-2 text-gray-500">Memuat data...</p>
          </div>
        ) : dataList.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Belum ada data sambutan. Silakan tambahkan data baru.</p>
        ) : (
          <div className="grid gap-6">
            {dataList.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 shadow-sm flex flex-col md:flex-row gap-4 items-start hover:shadow-md transition-shadow">
                {item.foto_url && <img src={item.foto_url} alt={item.nama_ketua} className="w-full md:w-32 h-40 object-cover rounded-md" />}
                <div className="flex-grow">
                    <h4 className="text-lg font-bold text-primary">{item.subjudul}</h4>
                    <p className="text-sm text-gray-500 mb-2">{item.judul}</p>
                    <p className="text-sm italic text-gray-600 line-clamp-2">“{item.sambutan}”</p>
                    <p className="mt-2 font-semibold text-sm text-gray-800">
                        {item.nama_ketua} - <span className="font-normal text-gray-600">{item.jabatan}</span>
                    </p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2 mt-2 md:mt-0">
                  <button onClick={() => handleEditClick(item)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"><Pencil size={18} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        isEditing={!!editingId}
        status={status}
      />
    </div>
  );
};

export default SambutanAdminBeranda;
