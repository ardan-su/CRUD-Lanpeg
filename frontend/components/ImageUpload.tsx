import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { createPreviewUrl } from '../lib/uploadHelper';

interface ImageUploadProps {
    value?: string;
    previewUrl?: string;
    onFileSelect: (file: File) => void;
    onClear: () => void;
    label?: string;
    helperText?: string;
    className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    previewUrl: externalPreviewUrl,
    onFileSelect,
    onClear,
    label = "Gambar",
    helperText = "Format: JPG, PNG, GIF. Maks 2MB.",
    className = ""
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [localPreview, setLocalPreview] = useState<string>('');

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                onFileSelect(file);
                createPreviewUrl(file).then(setLocalPreview);
            }
        }
    }, [onFileSelect]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelect(file);
            const preview = await createPreviewUrl(file);
            setLocalPreview(preview);
        }
    };

    const handleClear = () => {
        setLocalPreview('');
        onClear();
    };

    const displayPreview = localPreview || externalPreviewUrl || value;

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>

            {!displayPreview ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                        relative border-2 border-dashed rounded-lg p-6 transition-all duration-200
                        flex flex-col items-center justify-center gap-2 cursor-pointer
                        ${isDragging
                            ? 'border-primary bg-primary/5 scale-[1.02]'
                            : 'border-gray-300 bg-gray-50 hover:border-primary hover:bg-gray-100'}
                    `}
                    onClick={() => document.getElementById('file-upload')?.click()}
                >
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <div className="p-3 bg-white rounded-full shadow-sm">
                        <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-semibold text-gray-800">Klik untuk upload atau drag & drop</p>
                        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
                    </div>
                </div>
            ) : (
                <div className="relative group inline-block">
                    <div className="relative rounded-lg border overflow-hidden bg-gray-50 flex items-center justify-center p-2 min-w-[200px] min-h-[150px]">
                        <img
                            src={displayPreview}
                            alt="Preview"
                            className="max-h-48 w-auto object-contain rounded"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => document.getElementById('file-upload-change')?.click()}
                                className="bg-white text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                            >
                                Ganti Gambar
                            </button>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-md transition-transform hover:scale-110"
                        title="Hapus Gambar"
                    >
                        <X size={14} />
                    </button>
                    <input
                        id="file-upload-change"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
