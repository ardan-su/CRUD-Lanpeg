import React from 'react';
import { useLocation } from 'react-router-dom';

const AdminPage: React.FC = () => {
    const location = useLocation();
    
    // Create a user-friendly title from the URL path
    const pageTitle = location.pathname
        .split('/')
        .pop()
        ?.replace(/-/g, ' ') || 'Page';
        
    const formattedTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);

    return (
        <div>
            <div className="mt-8 p-16 bg-white rounded-lg shadow-sm text-center text-neutral-500 border border-gray-200">
                <p className="text-lg font-semibold text-gray-700">CRUD Management for {formattedTitle}</p>
                <p className="text-sm mt-2 max-w-md mx-auto">
                    The interface to Create, Read, Update, and Delete content for the <span className="font-semibold">{formattedTitle}</span> section will be implemented here.
                </p>
                <div className="mt-6 h-32 w-full bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-gray-400 text-xs font-mono">Component: /pages/admin/AdminPage.tsx</p>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
