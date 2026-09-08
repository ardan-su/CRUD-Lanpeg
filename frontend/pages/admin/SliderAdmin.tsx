import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Plus, Loader2, X, Image as ImageIcon, Upload } from 'lucide-react';
import { type HeroSlide } from '../../types';
import { uploadFile } from '../../lib/uploadHelper';
import ImageUpload from '../../components/ImageUpload';

// API Configuration
const API_URL = "http://localhost:5001/api/slider/";
const STORAGE_URL = "http://localhost:5001/storage/slider/";

// Type Definitions & Initial State for the form
type FormState = Omit<HeroSlide, 'id'>;

const initialFormState: FormState = {
  judul: "",
  deskripsi: "",
  gambar: "",
  tombol_text: "",
};

// Form Modal Component
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

  const getImageUrl = (imageName: string) => {
    if (!imageName) return '';
    if (imageName.startsWith('http')) return imageName;
    if (imageName.startsWith('data:image')) return imageName; // Handle Base64
    return `${STORAGE_URL}${imageName}`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Slide' : 'Tambah Slide Baru'}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors"><X size={20} className="text-gray-600" /></button>
        </header>
        <form id="slide-form" onSubmit={onSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Judul *</label>
            <input type="text" name="judul" value={formData.judul} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Deskripsi *</label>
            <textarea name="deskripsi" rows={3} value={formData.deskripsi} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <ImageUpload
            value={formData.gambar ? getImageUrl(formData.gambar) : ''}
            previewUrl={previewUrl}
            onFileSelect={handleFileSelect}
            onClear={handleClearImage}
            label="Gambar Slide *"
            helperText="Format: JPG, PNG. Rekomendasi: 1920x1080px."
          />
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Teks Tombol *</label>
            <input type="text" name="tombol_text" value={formData.tombol_text} onChange={handleChange} required className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary" />
          </div>
        </form>
        <footer className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-100">Batal</button>
          <button type="submit" form="slide-form" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2 hover:bg-opacity-90 disabled:bg-gray-400">
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            {isEditing ? 'Simpan Perubahan' : 'Tambah Slide'}
          </button>
        </footer>
      </div>
    </div>
  );
};

// Slide Card Component
const SlideCard: React.FC<{ slide: HeroSlide; onEdit: () => void; onDelete: () => void; }> = ({ slide, onEdit, onDelete }) => {
  const getImageUrl = (imageName: string) => {
    if (!imageName) return `https://via.placeholder.com/400x200?text=No+Image`;
    if (imageName.startsWith('http')) return imageName;
    return `${STORAGE_URL}${imageName}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border overflow-hidden group relative">
      <img src={getImageUrl(slide.gambar)} alt={slide.judul} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-gray-800 truncate">{slide.judul}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{slide.deskripsi}</p>
        <p className="text-xs text-gray-400 mt-2">Tombol: <span className="font-medium text-gray-600">{slide.tombol_text}</span></p>
      </div>
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
        <button onClick={onEdit} className="p-3 bg-white/90 text-yellow-600 rounded-full shadow-lg hover:bg-yellow-100 transition-colors"><Pencil size={20} /></button>
        <button onClick={onDelete} className="p-3 bg-white/90 text-red-600 rounded-full shadow-lg hover:bg-red-100 transition-colors"><Trash2 size={20} /></button>
      </div>
    </div>
  );
};

// Main Admin Page Component for Slider
const SliderAdmin: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
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

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('Gagal memuat data dari server.');
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setSlides(result.data);
      } else {
        setSlides([]);
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

  const handleOpenModal = (slide?: HeroSlide) => {
    if (slide) {
      setEditingId(slide.id);
      setFormData({
        judul: slide.judul,
        deskripsi: slide.deskripsi,
        gambar: slide.gambar,
        tombol_text: slide.tombol_text,
      });
      // Set preview URL for existing image — the DB stores full URLs,
      // so use the value directly. The getImageUrl helper handles both
      // full URLs and bare filenames.
      setPreviewUrl(slide.gambar || '');
    } else {
      setEditingId(null);
      setFormData(initialFormState);
      setPreviewUrl('');
    }
    setSelectedFile(null); // Clear selected file when opening modal
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

      // Upload file if a new file is selected
      if (selectedFile) {
        try {
          imageUrl = await uploadFile(selectedFile, 'slider');
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

      showNotification('success', `Slide berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}.`);
      handleCloseModal();
      fetchData();
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus slide ini?')) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || 'Gagal menghapus slide.');
      showNotification('success', 'Slide berhasil dihapus.');
      fetchData();
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderGrid = () => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md border overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ));
    }
    if (slides.length === 0) {
      return (
        <div className="col-span-full text-center py-16 text-gray-500">
          <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p className="font-semibold">Belum ada slide yang ditambahkan.</p>
        </div>
      );
    }
    return slides.map(slide => (
      <SlideCard
        key={slide.id}
        slide={slide}
        onEdit={() => handleOpenModal(slide)}
        onDelete={() => handleDelete(slide.id)}
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

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Kelola Slider Beranda</h1>
          <p className="text-gray-500 mt-1">Atur gambar, teks, dan tombol pada hero banner di halaman utama.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-transform duration-300 hover:scale-105">
          <Plus className="w-5 h-5 mr-2" />
          <span>Tambah Slide</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        previewUrl={previewUrl}
        setPreviewUrl={setPreviewUrl}
      />
    </div>
  );
};

export default SliderAdmin;