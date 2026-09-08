import React from 'react';
import { Link } from 'react-router-dom';
import { PhotoIcon, UserGroupIcon, BuildingLibraryIcon, SparklesIcon, NewspaperIcon, ClipboardDocumentListIcon, GlobeAltIcon } from '../../components/icons';

interface ActionCardProps {
    title: string;
    description: string;
    path: string;
    icon: React.FC<{ className?: string }>;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, path, icon: Icon }) => (
    <Link 
        to={path} 
        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex items-start space-x-4 border border-gray-200/80 group"
    >
        <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg group-hover:bg-blue-500 transition-colors duration-300">
            <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
        </div>
        <div>
            <h3 className="font-bold text-gray-800 text-base">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
    </Link>
);

const DashboardAdmin: React.FC = () => {
    const actions: ActionCardProps[] = [
        { title: 'Kelola Slider', description: 'Atur gambar dan teks pada hero banner.', path: '/admin/slider', icon: PhotoIcon },
        { title: 'Kelola Sambutan', description: 'Ubah teks sambutan dari kepala sekolah.', path: '/admin/beranda/sambutan', icon: UserGroupIcon },
        { title: 'Kelola Unit Pendidikan', description: 'Edit daftar unit pendidikan yang ditampilkan.', path: '/admin/beranda/unit-pendidikan', icon: BuildingLibraryIcon },
        { title: 'Kelola Program Unggulan', description: 'Perbarui program unggulan di halaman utama.', path: '/admin/beranda/program-unggulan', icon: SparklesIcon },
        { title: 'Kelola Berita Terbaru', description: 'Tambahkan atau edit berita dan artikel.', path: '/admin/beranda/berita', icon: NewspaperIcon },
        { title: 'Kelola Ajakan Pendaftaran', description: 'Ubah teks dan tautan pada seksi pendaftaran.', path: '/admin/beranda/pendaftaran', icon: ClipboardDocumentListIcon },
        { title: 'Kelola Media Sosial', description: 'Perbarui tautan akun media sosial.', path: '/admin/beranda/media-sosial', icon: GlobeAltIcon },
    ];

    return (
        <div>
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-2xl shadow-lg -mt-2 mb-10">
                <h1 className="text-3xl font-bold">Selamat Datang, Admin!</h1>
                <p className="mt-2 text-blue-100 max-w-2xl">Panel Admin SMK PKP 1 Jakarta Islamic School. Gunakan kartu di bawah ini untuk mengelola konten yang tampil di halaman utama website.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {actions.map(({ title, description, path, icon }) => (
                    <ActionCard 
                        key={title}
                        title={title}
                        description={description}
                        path={path}
                        icon={icon}
                    />
                ))}
            </div>
        </div>
    );
};

export default DashboardAdmin;