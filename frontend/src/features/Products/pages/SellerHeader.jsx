import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Plus, Package, Home, ChevronDown, User, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../auth/hooks/auth.hook';
import './Seller.css';

const SellerHeader = () => {
    const { user } = useSelector((state) => state.auth);
    const { HandleLogout } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = async () => {
        await HandleLogout();
        navigate('/login');
    };

    const username = user?.username || user?.name || "Seller";
    const initial = username.charAt(0).toUpperCase();

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12">
            <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                
                {/* Brand Logo & Tag */}
                <div className="flex items-center gap-4">
                    <Link to="/" className="group">
                        <h1 className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic transition-all group-hover:scale-105">
                            Urban<span className="text-gray-500 not-italic font-light">Knife</span>
                        </h1>
                    </Link>
                    <div className="h-6 w-[1px] bg-white/10 hidden md:block" />
                    <span className="gold-text royal-heading text-[10px] md:text-xs font-bold tracking-[0.3em] hidden md:block">
                        Seller Hub
                    </span>
                </div>

                {/* Navigation Links */}
                <nav className="hidden lg:flex items-center gap-10">
                    <Link to="/seller" className="nav-link-premium text-xs font-bold tracking-widest flex items-center gap-2 uppercase">
                        <Package size={14} className="text-[#d4af37]" />
                        Inventory
                    </Link>
                    <Link to="/seller/createProduct" className="nav-link-premium text-xs font-bold tracking-widest flex items-center gap-2 uppercase">
                        <Plus size={14} className="text-[#d4af37]" />
                        Create Product
                    </Link>
                    <Link to="/" className="nav-link-premium text-xs font-bold tracking-widest flex items-center gap-2 uppercase">
                        <Home size={14} className="text-[#d4af37]" />
                        Back to Home
                    </Link>
                </nav>

                {/* Profile Section */}
                <div className="relative">
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 pl-4 py-1 border-l border-white/10 hover:opacity-80 transition-opacity"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Premium Seller</p>
                            <p className="text-sm font-bold text-white uppercase tracking-tighter">{username}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#aa771c] flex items-center justify-center text-black font-black text-sm border-2 border-white/20 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                            {initial}
                        </div>
                        <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                                <motion.div 
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                    className="absolute right-0 mt-4 w-64 bg-zinc-950 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
                                >
                                    <div className="p-5 border-b border-white/5 bg-white/[0.02]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-[#aa771c] flex items-center justify-center text-black font-black text-lg">
                                                {initial}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-white uppercase tracking-tighter">{username}</span>
                                                <span className="text-[10px] text-gray-500 font-medium">Verified Merchant</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="py-2">
                                        <button className="w-full flex items-center gap-3 px-5 py-3 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all text-left uppercase tracking-widest">
                                            <User size={16} className="text-[#d4af37]" />
                                            Dashboard
                                        </button>
                                        <button className="w-full flex items-center gap-3 px-5 py-3 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all text-left uppercase tracking-widest">
                                            <Settings size={16} className="text-[#d4af37]" />
                                            Store Settings
                                        </button>
                                        <div className="h-[1px] bg-white/5 my-2 mx-5" />
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-5 py-4 text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-all text-left uppercase tracking-widest"
                                        >
                                            <LogOut size={16} />
                                            Sign Out
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default SellerHeader;