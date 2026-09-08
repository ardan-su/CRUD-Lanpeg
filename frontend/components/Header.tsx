import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { NAV_LINKS, SCHOOL_NAME } from '../constants';
import { MenuIcon, XIcon, ChevronDownIcon, ChevronRightIcon, UserIcon } from './icons';
import { useAuth } from '../auth/AuthContext';

const Header: React.FC = () => {
    const [isOpen, setIsOpen]                   = useState(false);
    const [openDropdown, setOpenDropdown]       = useState<string | null>(null);
    const [openSubDropdown, setOpenSubDropdown] = useState<string | null>(null);
    const [scrolled, setScrolled]               = useState(false);
    const { isAuthenticated }                   = useAuth();
    const location                              = useLocation();
    const headerRef                             = useRef<HTMLElement>(null);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
        setOpenDropdown(null);
        setOpenSubDropdown(null);
    }, [location.pathname]);

    // White at top → blue after scroll — stable, no flicker
    useEffect(() => {
        // Set initial state immediately based on current scroll position
        setScrolled(window.scrollY > 60);

        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 60);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const navLinkBase = `relative pb-1 text-sm font-semibold tracking-wide transition-colors duration-200
        after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-full after:transition-all after:duration-200`;

    const navLinkClasses = (isActive: boolean) =>
        `${navLinkBase} flex items-center gap-1
         ${scrolled
            ? isActive
                ? 'text-accent after:w-full after:bg-accent'
                : 'text-white/90 hover:text-white after:w-0 hover:after:w-full after:bg-accent'
            : isActive
                ? 'text-primary after:w-full after:bg-accent'
                : 'text-neutral-700 hover:text-primary after:w-0 hover:after:w-full after:bg-accent'
        }`;

    return (
        <>
            {/* Spacer — prevents layout shift since header is fixed */}
            <div className="h-0" aria-hidden="true" />

            <header
                ref={headerRef}
                id="site-header"
                className={`fixed top-0 left-0 right-0 z-50
                    ${scrolled
                        ? 'bg-primary shadow-lg'
                        : 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-neutral-200/60'
                    }`}
                style={{ transition: 'background-color 0.35s cubic-bezier(.4,0,.2,1), box-shadow 0.35s cubic-bezier(.4,0,.2,1), border-color 0.35s' }}
            >
                {/* ── Top info bar (desktop only, visible when NOT scrolled) ── */}
                <div
                    className={`hidden lg:block overflow-hidden transition-all duration-350
                        ${scrolled ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'}
                        ${scrolled ? '' : 'bg-primary'}`}
                    style={{ transition: 'max-height 0.35s cubic-bezier(.4,0,.2,1), opacity 0.25s' }}
                >
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex justify-between items-center text-xs text-white/80">
                        <span className="font-medium">Selamat Datang di {SCHOOL_NAME}</span>
                        <div className="flex items-center gap-5">
                            <span className="flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5 opacity-70" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                </svg>
                                Jakarta, Indonesia
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5 opacity-70" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                                </svg>
                                ardan@smkpkp1jakarta.sch.id
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Main nav ── */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 min-w-0 shrink-0 group">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-xl shadow-sm shrink-0 transition-colors duration-300
                                ${scrolled ? 'bg-white/15 border border-white/20' : 'bg-white shadow-white-glow/30'}`}>
                                <img src="/logo.png" alt="Logo" className="w-6 h-6" />

                            </div>
                            <div className="hidden sm:block leading-tight min-w-0">
                                <p className={`font-heading font-bold text-sm leading-tight transition-colors duration-300 ${scrolled ? 'text-white' : 'text-neutral-900'}`}>
                                    SMK PKP 1 JAKARTA
                                </p>
                                <p className={`text-xs font-medium transition-colors duration-300 ${scrolled ? 'text-white/70' : 'text-primary'}`}>
                                    Islamic School
                                </p>
                            </div>
                        </Link>

                        {/* Desktop nav */}
                        <nav className="hidden lg:flex items-center gap-6 font-semibold">
                            {NAV_LINKS.map((link) => (
                                <div key={link.name} className="relative group">
                                    <NavLink
                                        to={link.path}
                                        className={({ isActive }) => navLinkClasses(isActive)}
                                        end={link.path === '/'}
                                    >
                                        {link.name}
                                        {link.dropdown && (
                                            <ChevronDownIcon className={`h-3.5 w-3.5 group-hover:rotate-180 transition-transform duration-200
                                                ${scrolled ? 'opacity-70' : 'text-neutral-500'}`} />
                                        )}
                                    </NavLink>

                                    {link.dropdown && (
                                        <div className="absolute top-full left-0 pt-3 w-60 opacity-0 group-hover:opacity-100
                                            transition-all duration-200 invisible group-hover:visible
                                            translate-y-2 group-hover:translate-y-0 z-30">
                                            <div className="bg-white rounded-2xl shadow-card-hover border border-neutral-100 overflow-hidden">
                                                <div className="py-2">
                                                    {link.dropdown.map(item => (
                                                        <div key={item.name} className="relative group/sub">
                                                            <Link
                                                                to={item.path}
                                                                className="flex justify-between items-center px-4 py-2.5 text-sm text-neutral-700
                                                                    hover:bg-primary-light hover:text-primary transition-colors font-medium"
                                                            >
                                                                {item.name}
                                                                {item.dropdown && (
                                                                    <ChevronRightIcon className="h-4 w-4 text-neutral-400" />
                                                                )}
                                                            </Link>
                                                            {item.dropdown && (
                                                                <div className="absolute top-0 left-full pl-1.5 w-60
                                                                    opacity-0 group-hover/sub:opacity-100
                                                                    transition-all duration-200 invisible group-hover/sub:visible z-30">
                                                                    <div className="bg-white rounded-2xl shadow-card-hover border border-neutral-100 overflow-hidden">
                                                                        <div className="py-2">
                                                                            {item.dropdown.map(subItem => (
                                                                                <Link
                                                                                    key={subItem.name}
                                                                                    to={subItem.path}
                                                                                    className="block px-4 py-2.5 text-sm text-neutral-700
                                                                                        hover:bg-primary-light hover:text-primary transition-colors font-medium"
                                                                                >
                                                                                    {subItem.name}
                                                                                </Link>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* CTA + auth */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link
                                to="/pendaftaran"
                                className="hidden sm:inline-flex items-center gap-1.5 bg-accent hover:bg-accent-dark
                                    text-white font-bold py-2 px-5 rounded-lg text-sm
                                    transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-gold-glow/50"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Daftar Sekarang
                            </Link>

                            {isAuthenticated ? (
                                <Link
                                    to="/admin"
                                    className={`hidden sm:inline-flex items-center gap-1.5 font-semibold py-2 px-4 rounded-lg text-sm transition-all duration-200 border
                                        ${scrolled
                                            ? 'border-white/30 hover:bg-white/10 text-white'
                                            : 'border-primary/30 hover:bg-primary-light text-primary'
                                        }`}
                                >
                                    <UserIcon className="h-4 w-4" />
                                    Admin
                                </Link>
                            ) : (
                                <Link
                                    to="/login"
                                    className={`hidden sm:inline-block font-medium py-2 px-4 rounded-lg text-sm transition-all duration-200 border
                                        ${scrolled
                                            ? 'border-white/30 hover:bg-white/10 text-white'
                                            : 'border-primary/30 hover:bg-primary-light text-primary'
                                        }`}
                                >
                                    Login
                                </Link>
                            )}

                            {/* Hamburger */}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
                                aria-expanded={isOpen}
                                className={`lg:hidden p-2 rounded-lg transition-colors
                                    ${scrolled ? 'hover:bg-white/10 text-white' : 'hover:bg-neutral-100 text-neutral-700'}`}
                            >
                                {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Mobile menu overlay ── */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* ── Mobile menu drawer ── */}
            <div
                className={`fixed top-0 right-0 h-full w-80 max-w-full z-50 lg:hidden
                    bg-white shadow-2xl flex flex-col
                    transition-transform duration-350 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ transition: 'transform 0.32s cubic-bezier(.4,0,.2,1)' }}
                aria-hidden={!isOpen}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 bg-primary">
                    <div className="flex items-center gap-2.5">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/15 border border-white/20">
                            <span className="text-white font-black text-xs">KPK</span>
                        </div>
                        <div>
                            <p className="font-bold text-sm text-white leading-tight">SMK PKP 1 JAKARTA</p>
                            <p className="text-white/60 text-xs">Islamic School</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
                        aria-label="Tutup menu"
                    >
                        <XIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Drawer nav */}
                <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5">
                    {NAV_LINKS.map((link) => (
                        <div key={link.name}>
                            {link.dropdown ? (
                                <>
                                    <button
                                        onClick={() => {
                                            setOpenDropdown(openDropdown === link.name ? null : link.name);
                                            setOpenSubDropdown(null);
                                        }}
                                        className={`w-full flex justify-between items-center py-3 px-3.5 rounded-xl text-left font-semibold text-sm transition-colors
                                            ${openDropdown === link.name
                                                ? 'bg-primary-light text-primary'
                                                : 'text-neutral-800 hover:bg-neutral-50'}`}
                                    >
                                        {link.name}
                                        <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 shrink-0
                                            ${openDropdown === link.name ? 'rotate-180 text-primary' : 'text-neutral-400'}`} />
                                    </button>

                                    <div className={`overflow-hidden transition-all duration-300
                                        ${openDropdown === link.name ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="pl-4 py-1 space-y-0.5 border-l-2 border-primary/15 ml-4 mt-1">
                                            {link.dropdown.map(item => (
                                                <div key={item.name}>
                                                    {item.dropdown ? (
                                                        <>
                                                            <button
                                                                onClick={() => setOpenSubDropdown(openSubDropdown === item.name ? null : item.name)}
                                                                className="w-full flex justify-between items-center py-2.5 px-3 rounded-lg text-left text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                                                            >
                                                                {item.name}
                                                                <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform shrink-0
                                                                    ${openSubDropdown === item.name ? 'rotate-180 text-primary' : 'text-neutral-400'}`} />
                                                            </button>
                                                            <div className={`overflow-hidden transition-all duration-200
                                                                ${openSubDropdown === item.name ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                                <div className="pl-3 space-y-0.5 border-l-2 border-primary/10 ml-3 my-1">
                                                                    {item.dropdown.map(subItem => (
                                                                        <Link
                                                                            key={subItem.name}
                                                                            to={subItem.path}
                                                                            onClick={() => setIsOpen(false)}
                                                                            className="block py-2 px-3 text-sm text-neutral-600 hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
                                                                        >
                                                                            {subItem.name}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <Link
                                                            to={item.path}
                                                            onClick={() => setIsOpen(false)}
                                                            className="block py-2.5 px-3 rounded-lg text-sm text-neutral-700 hover:text-primary hover:bg-primary-light transition-colors font-medium"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <NavLink
                                    to={link.path}
                                    end={link.path === '/'}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `block py-3 px-3.5 rounded-xl font-semibold text-sm transition-colors
                                         ${isActive ? 'bg-primary-light text-primary' : 'text-neutral-800 hover:bg-neutral-50'}`}
                                >
                                    {link.name}
                                </NavLink>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Drawer CTA */}
                <div className="px-4 py-4 border-t border-neutral-100 space-y-2.5 bg-neutral-50/60">
                    <Link
                        to="/pendaftaran"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent-dark text-white font-bold py-3 px-6 rounded-xl text-sm transition-all duration-200 shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Daftar Sekarang
                    </Link>
                    {isAuthenticated ? (
                        <Link
                            to="/admin"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center gap-2 w-full bg-primary text-white font-bold py-3 px-6 rounded-xl text-sm transition-all duration-200"
                        >
                            <UserIcon className="h-4 w-4" />
                            Panel Admin
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center w-full border border-neutral-300 text-neutral-700 font-semibold py-3 px-6 rounded-xl text-sm hover:bg-white transition-colors"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
};

export default Header;
