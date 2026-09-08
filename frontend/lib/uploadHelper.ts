/**
 * Upload Helper Utility
 * Handles file uploads to the backend server
 */

const API_BASE_URL   = 'http://localhost:5001';
const UPLOAD_API_URL = `${API_BASE_URL}/api/upload`;

export interface UploadResponse {
    success: boolean;
    data?: {
        url?: string;
        path?: string;
        filename?: string;
    };
    message?: string;
}

/**
 * Upload a file to the server
 * @param file   - The file to upload
 * @param folder - Optional folder name (e.g., 'slider', 'berita')
 * @returns Promise with the uploaded file URL
 */
export async function uploadFile(file: File, folder?: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);

    const response = await fetch(UPLOAD_API_URL, {
        method: 'POST',
        body: formData,
    });

    const result: UploadResponse = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || 'Gagal mengupload file');
    }

    const relativeUrl = result.data?.url || result.data?.path || '';

    if (relativeUrl.startsWith('http')) {
        return relativeUrl;
    } else {
        return `${API_BASE_URL}${relativeUrl}`;
    }
}

/**
 * Create a preview URL for a file (no network call)
 */
export function createPreviewUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror  = reject;
        reader.readAsDataURL(file);
    });
}
