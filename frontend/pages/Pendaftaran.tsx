
import React from 'react';
import { Link } from 'react-router-dom';
import FormPendaftaran from '../components/FormPendaftaran';

const Pendaftaran: React.FC = () => {
  return (
    <div className="bg-neutral-100 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Link 
            to="/data-pendaftaran" 
            className="inline-block bg-primary text-white hover:bg-opacity-90 font-semibold py-2 px-6 rounded-full transition-all duration-300 hover:scale-105"
          >
            Lihat Data Pendaftar &rarr;
          </Link>
        </div>
        <FormPendaftaran />
      </div>
    </div>
  );
};

export default Pendaftaran;