import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (user: string, pass: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    const login = async (user: string, pass: string) => {
        // NOTE: Replace with real backend authentication when available
        if (user === 'admin' && pass === 'Smkpkp12026!') {
            setIsAuthenticated(true);
            navigate('/admin');
        } else {
            throw new Error('Username atau password salah.');
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
