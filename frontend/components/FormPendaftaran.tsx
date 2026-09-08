import React, { useState } from 'react';

type FormState = {
  nama_calon_siswa: string;
  nik: string;
  nisn: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat_lengkap: string;
  asal_sekolah: string;
  alamat_asal_sekolah: string;
  unit_pilihan: string;
  nama_orang_tua_wali: string;
  no_wa: string;
  tahun_pelajaran: string;
  honeypot: string; // For spam prevention
};

const initialState: FormState = {
  nama_calon_siswa: '',
  nik: '',
  nisn: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  alamat_lengkap: '',
  asal_sekolah: '',
  alamat_asal_sekolah: '',
  unit_pilihan: '',
  nama_orang_tua_wali: '',
  no_wa: '',
  tahun_pelajaran: '2025/2026',
  honeypot: '',
};

const FormPendaftaran: React.FC = () => {
  const [formData, setFormData] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState(
    'Gagal mengirim formulir. Silakan coba lagi nanti atau hubungi kami langsung.'
  );

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};

    if (!formData.nama_calon_siswa) newErrors.nama_calon_siswa = 'Nama lengkap wajib diisi.';
    if (!formData.nama_orang_tua_wali) newErrors.nama_orang_tua_wali = 'Nama orang tua wajib diisi.';
    if (!formData.no_wa) {
      newErrors.no_wa = 'Nomor WhatsApp wajib diisi.';
    } else if (!/^\+?([0-9]{10,15})$/.test(formData.no_wa)) {
      newErrors.no_wa = 'Format nomor WhatsApp tidak valid (contoh: 08123456789).';
    }
    if (formData.nik && !/^\d{16}$/.test(formData.nik)) {
      newErrors.nik = 'NIK harus terdiri dari 16 digit angka.';
    }
    if (formData.nisn && !/^\d{10}$/.test(formData.nisn)) {
      newErrors.nisn = 'NISN harus terdiri dari 10 digit angka.';
    }
    if (!formData.unit_pilihan) {
      newErrors.unit_pilihan = 'Unit pilihan wajib diisi.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on change
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (formData.honeypot) return; // Spam prevention
    if (!validate()) return;

    setStatus('submitting');

    const API_URL = 'http://localhost:5001/api/pendaftaran_siswa_baru/';

    // Exclude honeypot field from payload
    const { honeypot, ...payload } = formData;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const isJson = response.headers.get('content-type')?.includes('application/json');
      const result = isJson ? await response.json() : { success: false, message: 'Unknown error from server' };

      if (result.success) {
        setStatus('success');
        setFormData(initialState);
        setErrors({});
      } else {
        let message = result.message || 'Gagal mengirim formulir. Periksa kembali data Anda.';
        if (result.data && typeof result.data === 'object') {
          const errorDetails = Object.values(result.data).flat().join(' ');
          if (errorDetails) {
            message += ' ' + errorDetails;
          }
        }
        setErrorMessage(message);
        setStatus('error');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      setErrorMessage('Gagal mengirim formulir. Periksa koneksi internet Anda atau hubungi kami langsung.');
      setStatus('error');
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl mx-auto">
      <h2 className="font-heading text-3xl font-bold text-primary text-center mb-2">
        Formulir Pendaftaran Siswa Baru
      </h2>
      <p className="text-center text-neutral-600 mb-8">TP 2025 - 2026</p>

      {status === 'success' && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md"
          role="alert"
        >
          <p className="font-bold">Pendaftaran Anda Telah Dikirim!</p>
          <p>Terima kasih telah mendaftar. Tim kami akan segera menghubungi Anda melalui WhatsApp.</p>
        </div>
      )}
      {status === 'error' && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md"
          role="alert"
        >
          <p className="font-bold">Terjadi Kesalahan</p>
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="space-y-8">
        {/* Data Diri Siswa */}
        <fieldset className="space-y-6 border-t pt-4 border-neutral-200">
          <legend className="text-lg font-semibold text-primary">Data Diri Calon Siswa</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label
                htmlFor="nama_calon_siswa"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Nama Calon Siswa *
              </label>
              <input
                type="text"
                id="nama_calon_siswa"
                name="nama_calon_siswa"
                value={formData.nama_calon_siswa}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary"
              />
              {errors.nama_calon_siswa && (
                <p className="text-red-500 text-xs mt-1">{errors.nama_calon_siswa}</p>
              )}
            </div>
            <div>
              <label htmlFor="nik" className="block text-sm font-medium text-neutral-700 mb-1">
                NIK
              </label>
              <input
                type="text"
                id="nik"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="16 digit NIK"
              />
              {errors.nik && <p className="text-red-500 text-xs mt-1">{errors.nik}</p>}
            </div>
            <div>
              <label htmlFor="nisn" className="block text-sm font-medium text-neutral-700 mb-1">
                NISN
              </label>
              <input
                type="text"
                id="nisn"
                name="nisn"
                value={formData.nisn}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="10 digit NISN"
              />
              {errors.nisn && <p className="text-red-500 text-xs mt-1">{errors.nisn}</p>}
            </div>
            <div>
              <label
                htmlFor="tempat_lahir"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Tempat Lahir
              </label>
              <input
                type="text"
                id="tempat_lahir"
                name="tempat_lahir"
                value={formData.tempat_lahir}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="tanggal_lahir"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Tanggal Lahir
              </label>
              <input
                type="date"
                id="tanggal_lahir"
                name="tanggal_lahir"
                value={formData.tanggal_lahir}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="alamat_lengkap"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Alamat Lengkap
              </label>
              <textarea
                id="alamat_lengkap"
                name="alamat_lengkap"
                value={formData.alamat_lengkap}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary"
              ></textarea>
            </div>
          </div>
        </fieldset>

        {/* Informasi Sekolah */}
        <fieldset className="space-y-6 border-t pt-4 border-neutral-200">
          <legend className="text-lg font-semibold text-primary">Informasi Sekolah</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="asal_sekolah"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Asal Sekolah
              </label>
              <input
                type="text"
                id="asal_sekolah"
                name="asal_sekolah"
                value={formData.asal_sekolah}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="unit_pilihan"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Unit Pilihan *
              </label>
              <select
                id="unit_pilihan"
                name="unit_pilihan"
                value={formData.unit_pilihan}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary"
              >
                <option value="">-- Pilih Unit --</option>
                <option value="TKIT">TKIT</option>
                <option value="SDIT">SDIT</option>
                <option value="SMPIT">SMPIT</option>
                <option value="SMAIT">SMAIT</option>
                <option value="SMKIT">SMKIT</option>
              </select>
              {errors.unit_pilihan && (
                <p className="text-red-500 text-xs mt-1">{errors.unit_pilihan}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="alamat_asal_sekolah"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Alamat Asal Sekolah
              </label>
              <textarea
                id="alamat_asal_sekolah"
                name="alamat_asal_sekolah"
                value={formData.alamat_asal_sekolah}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary"
              ></textarea>
            </div>
          </div>
        </fieldset>

        {/* Data Orang Tua / Wali */}
        <fieldset className="space-y-6 border-t pt-4 border-neutral-200">
          <legend className="text-lg font-semibold text-primary">Data Orang Tua / Wali</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label
                htmlFor="nama_orang_tua_wali"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Nama Orang Tua / Wali *
              </label>
              <input
                type="text"
                id="nama_orang_tua_wali"
                name="nama_orang_tua_wali"
                value={formData.nama_orang_tua_wali}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary"
              />
              {errors.nama_orang_tua_wali && (
                <p className="text-red-500 text-xs mt-1">{errors.nama_orang_tua_wali}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="no_wa"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                No. WhatsApp *
              </label>
              <input
                type="tel"
                id="no_wa"
                name="no_wa"
                value={formData.no_wa}
                onChange={handleChange}
                placeholder="Contoh: 08123456789"
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary"
              />
              {errors.no_wa && <p className="text-red-500 text-xs mt-1">{errors.no_wa}</p>}
            </div>
          </div>
        </fieldset>

        {/* Tahun Pelajaran */}
        <fieldset className="border-t pt-4 border-neutral-200">
          <label
            htmlFor="tahun_pelajaran"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Tahun Pelajaran
          </label>
          <input
            type="text"
            id="tahun_pelajaran"
            name="tahun_pelajaran"
            value={formData.tahun_pelajaran}
            readOnly
            className="w-full px-4 py-2 border border-neutral-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </fieldset>

        {/* Honeypot (hidden) */}
        <input
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={handleChange}
          style={{ display: 'none' }}
          autoComplete="off"
          tabIndex={-1}
        />

        {/* Submit Button */}
        <div className="pt-6">
          <button
            onClick={handleSubmit}
            disabled={status === 'submitting'}
            className={`w-full py-3 font-semibold text-white rounded-md ${
              status === 'submitting' ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'
            } transition-colors`}
          >
            {status === 'submitting' ? 'Mengirim...' : 'Kirim Pendaftaran'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormPendaftaran;
