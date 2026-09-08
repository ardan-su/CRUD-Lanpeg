import React from 'react';
import { Link } from 'react-router-dom';

const TK: React.FC = () => {
    return (
        <section>
            <h2 className="font-heading text-3xl font-bold text-primary mb-2">Program Kejuruan</h2>
            <div className="w-20 h-1 bg-accent mb-6"></div>
            <div className="prose prose-lg max-w-none text-neutral-600 space-y-4">
                <p>
                    SMK PKP 1 Jakarta Islamic School menyediakan berbagai program kejuruan unggulan yang dirancang untuk membekali siswa dengan keterampilan profesional dan nilai-nilai Islami.
                </p>
                <p>
                    Pilih jurusan di bawah ini untuk informasi lebih lanjut:
                </p>
                <ul>
                    <li><Link to="/unit/sdit"  className="text-primary hover:underline">Akuntansi</Link></li>
                    <li><Link to="/unit/smpit" className="text-primary hover:underline">Manajemen Perkantoran</Link></li>
                    <li><Link to="/unit/smait" className="text-primary hover:underline">Rekayasa Perangkat Lunak</Link></li>
                    <li><Link to="/unit/tkit1" className="text-primary hover:underline">Teknik Kendaraan Ringan</Link></li>
                    <li><Link to="/unit/smkit" className="text-primary hover:underline">Teknik Komputer Jaringan</Link></li>
                    <li><Link to="/unit/dkv"   className="text-primary hover:underline">Desain Komunikasi Visual</Link></li>
                </ul>
            </div>
        </section>
    );
};

export default TK;
