import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { NAV_LINKS } from '../../constants';
import {
    HomeIcon, UserGroupIcon, BuildingLibraryIcon, NewspaperIcon, UsersIcon, SparklesIcon,
    ChevronDownIcon, ArrowRightOnRectangleIcon, MenuIcon, XIcon, UserCircleIcon, Cog6ToothIcon, PhotoIcon, ClipboardDocumentListIcon, GlobeAltIcon
} from '../../components/icons';

interface NavItem {
    name: string;
    path: string;
    icon: React.FC<{ className?: string }>;
    children?: NavItem[];
    isExternal?: boolean;
}

const iconMap: { [key: string]: React.FC<any> } = {
    Profil: UserGroupIcon,
    Unit: BuildingLibraryIcon,
    Informasi: NewspaperIcon,
    Pendaftaran: UsersIcon,
    Fitur: SparklesIcon,
};

// Helper function to flatten nested dropdowns for the admin sidebar
const flattenDropdowns = (links: any[]): NavItem[] => {
    return links.flatMap(link => {
        const path = link.path.startsWith('http') ? link.path : link.path.replace('/', '/admin/');

        // If it has children (dropdown)
        if (link.dropdown) {
            // Recursively get children, but flatten the result if it's a "Unit" specific nesting (like TK -> TKIT1)
            // For the Admin panel, we prefer a flatter hierarchy 
            const children = link.dropdown.flatMap((child: any) => {
                const childPath = child.path.startsWith('http') ? child.path : child.path.replace('/', '/admin/');

                // If the child itself has a dropdown (like 'TK' having 'TKIT1' & 'TKIT2')
                if (child.dropdown) {
                    // Include the parent (TK) AND its children (TKIT1, TKIT2) as siblings in the admin menu
                    // or just return the children if the parent page is just a placeholder.
                    // Here we return the child + its sub-children flattened
                    return [
                        { name: child.name, path: childPath, icon: HomeIcon },
                        ...child.dropdown.map((subChild: any) => ({
                            name: subChild.name,
                            path: subChild.path.replace('/', '/admin/'),
                            icon: HomeIcon
                        }))
                    ];
                }

                return {
                    name: child.name,
                    path: childPath,
                    icon: HomeIcon,
                    isExternal: child.path.startsWith('http')
                };
            });

            return {
                name: link.name,
                path: path,
                icon: iconMap[link.name] || HomeIcon,
                children: children
            };
        }

        return {
            name: link.name,
            path: path,
            icon: iconMap[link.name] || HomeIcon,
            isExternal: link.path.startsWith('http')
        };
    });
};

const adminNavLinks: NavItem[] = [
    { name: 'Dashboard', path: '/admin', icon: HomeIcon },
    {
        name: 'Beranda',
        path: '/admin/beranda-section', // A dummy path to make the parent active logic work if needed, or simply container
        icon: HomeIcon,
        children: [
            { name: 'Slider', path: '/admin/slider', icon: PhotoIcon },
            { name: 'Sambutan', path: '/admin/beranda/sambutan', icon: UserGroupIcon },
            { name: 'Unit Pendidikan', path: '/admin/beranda/unit-pendidikan', icon: BuildingLibraryIcon },
            { name: 'Program Unggulan', path: '/admin/beranda/program-unggulan', icon: SparklesIcon },

            { name: 'Ajakan Pendaftaran', path: '/admin/beranda/pendaftaran', icon: ClipboardDocumentListIcon },
            { name: 'Media Sosial', path: '/admin/beranda/media-sosial', icon: GlobeAltIcon },
        ]
    },
    ...flattenDropdowns(NAV_LINKS.filter(link => link.name !== 'Beranda'))
];

const SidebarNavItem: React.FC<{ item: NavItem; isCollapsed: boolean; }> = ({ item, isCollapsed }) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    // Check if current route matches this item or any of its children
    const isParentActive = item.children
        ? item.children.some(child => location.pathname.startsWith(child.path))
        : location.pathname === item.path;

    useEffect(() => {
        if (isParentActive && item.children) {
            setIsOpen(true);
        }
    }, [isParentActive, item.children]);

    const baseLinkClasses = "flex items-center p-2.5 rounded-lg transition-all duration-200 group";
    const activeClasses = "bg-accent text-primary shadow-sm font-semibold";
    const inactiveClasses = "text-blue-100 hover:bg-white/10 hover:text-white";

    const getLinkClasses = () => {
        if (item.name === 'Dashboard') {
            return `${baseLinkClasses} ${location.pathname === '/admin' ? activeClasses : inactiveClasses}`;
        }
        if (item.children) {
            // Parent styling when open or active
            return `${baseLinkClasses} ${isParentActive ? 'text-white' : 'text-blue-100'} hover:bg-white/10`;
        }
        return `${baseLinkClasses} ${location.pathname.startsWith(item.path) ? activeClasses : inactiveClasses}`;
    };

    if (!item.children) {
        if (item.isExternal) {
            return (
                <li>
                    <a href={item.path} target="_blank" rel="noopener noreferrer" className={inactiveClasses + " flex items-center p-2.5 rounded-lg"}>
                        <item.icon className="w-6 h-6 flex-shrink-0" />
                        <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>{item.name}</span>
                    </a>
                </li>
            );
        }
        return (
            <li>
                <NavLink to={item.path} className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeClasses : inactiveClasses}`} end>
                    <item.icon className="w-6 h-6 flex-shrink-0" />
                    <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>{item.name}</span>
                </NavLink>
            </li>
        );
    }

    return (
        <li>
            <button onClick={() => setIsOpen(!isOpen)} className={`${getLinkClasses()} w-full justify-between`}>
                <div className="flex items-center">
                    <item.icon className="w-6 h-6 flex-shrink-0" />
                    <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>{item.name}</span>
                </div>
                {!isCollapsed && <ChevronDownIcon className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`} />}
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen && !isCollapsed ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <ul className={`pt-2 pl-6 space-y-1 ${isCollapsed ? 'lg:hidden' : ''}`}>
                        {item.children.map(child => <SidebarSubItem key={child.name} item={child} />)}
                    </ul>
                </div>
            </div>
        </li>
    );
};

const SidebarSubItem: React.FC<{ item: NavItem }> = ({ item }) => {
    if (item.isExternal) {
        return (
            <li>
                <a href={item.path} target="_blank" rel="noopener noreferrer" className="flex items-center p-2 text-blue-200 hover:text-white rounded-md text-sm">
                    {item.name}
                </a>
            </li>
        );
    }
    return (
        <li>
            <NavLink to={item.path} className={({ isActive }) => `block p-2 rounded-md text-sm ${isActive ? 'text-accent font-bold' : 'text-blue-200 hover:text-white'}`} end>
                {item.name}
            </NavLink>
        </li>
    );
};

const AdminLayout: React.FC = () => {
    const { logout } = useAuth();
    const location = useLocation();
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isProfileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const currentTitle = pathSegments.length > 1
        ? pathSegments[pathSegments.length - 1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        : 'Dashboard';

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const sidebarClasses = `
        bg-primary text-white flex flex-col fixed inset-y-0 left-0 z-40
        transition-transform duration-300 ease-in-out
        w-64
        ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `;

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            <aside className={sidebarClasses}>
                <div className="flex items-center justify-center h-20 border-b border-white/10 flex-shrink-0">
                    <Link to="/admin" className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm shrink-0">
                            <span className="text-primary font-black text-sm leading-none">PKP</span>
                        </div>
                        <span className={`font-bold text-sm whitespace-nowrap leading-tight transition-opacity duration-300 ${isSidebarCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>
                            SMK PKP 1 Jakarta<br/>
                            <span className="text-blue-200 font-normal text-xs">Admin Panel</span>
                        </span>
                    </Link>
                </div>
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-800">
                    <ul>
                        {adminNavLinks.map(link => (
                            <SidebarNavItem key={link.name} item={link} isCollapsed={isSidebarCollapsed} />
                        ))}
                    </ul>
                </nav>
                <div className={`px-3 py-4 border-t border-white/10 ${isSidebarCollapsed ? 'lg:px-2' : ''}`}>
                    <button onClick={logout} className="flex items-center w-full p-2.5 rounded-lg text-blue-100 hover:bg-red-500/20 hover:text-red-300 transition-colors">
                        <ArrowRightOnRectangleIcon className="w-6 h-6 flex-shrink-0" />
                        <span className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${isSidebarCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>Logout</span>
                    </button>
                </div>
            </aside>

            <div className={`transition-all duration-300 ease-in-out min-h-screen flex flex-col ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg shadow-sm h-20 flex items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center">
                        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden mr-4 p-2 text-gray-600 hover:bg-gray-100 rounded-md">
                            {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                        </button>
                        <button onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className="hidden lg:block mr-4 p-2 text-gray-600 hover:bg-gray-100 rounded-md">
                            <MenuIcon className="h-6 w-6" />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800 truncate">{currentTitle}</h1>
                    </div>
                    <div className="relative" ref={profileRef}>
                        <button onClick={() => setProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-100">
                            <UserCircleIcon className="w-8 h-8 text-gray-600" />
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-semibold text-gray-800">Admin</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                        </button>
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20 border py-1">
                                <Link to="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <Cog6ToothIcon className="w-5 h-5 mr-2 text-gray-400" />
                                    Settings
                                </Link>
                                <button onClick={logout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>
                <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;