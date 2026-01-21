import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FiHome,
    FiUpload,
    FiSearch,
    FiDollarSign,
    FiLogOut,
    FiMenu,
    FiX,
    FiUser,
    FiTag
} from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { admin, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: FiHome },
        { path: '/upload', label: 'Upload CSV', icon: FiUpload },
        { path: '/search', label: 'Search Student', icon: FiSearch },
        { path: '/expenditure', label: 'Expenditure', icon: FaRupeeSign },
        { path: '/categories', label: 'Categories', icon: FiTag },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-gradient-to-r from-primary-700 to-primary-800 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            <span className="text-xl font-bold text-white">₹</span>
                        </div>
                        <span className="font-semibold text-lg hidden sm:block">
                            Zeal IT Accounts
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive(link.path)
                                        ? 'bg-white/20 text-white'
                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="text-sm font-medium">{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 rounded-lg">
                            <FiUser className="w-4 h-4" />
                            <span className="text-sm font-medium">{admin?.name || 'Admin'}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-500/80 hover:bg-red-500 
                         rounded-lg transition-colors duration-200"
                        >
                            <FiLogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden bg-primary-800/95 backdrop-blur-sm border-t border-white/10">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(link.path)
                                        ? 'bg-white/20 text-white'
                                        : 'text-white/80 hover:bg-white/10'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{link.label}</span>
                                </Link>
                            );
                        })}
                        <hr className="border-white/20 my-2" />
                        <div className="flex items-center justify-between px-4 py-3">
                            <div className="flex items-center space-x-2">
                                <FiUser className="w-5 h-5" />
                                <span className="font-medium">{admin?.name || 'Admin'}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-3 py-2 bg-red-500/80 hover:bg-red-500 
                           rounded-lg transition-colors"
                            >
                                <FiLogOut className="w-4 h-4" />
                                <span className="text-sm">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
