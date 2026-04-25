import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingCart, Mic, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../auth/hooks/auth.hook';



const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const { HandleLogout } = useAuth();
    const isLoggedIn = !!user && (user.username || user.name || user._id);

    const getAvatarColor = (name = 'User') => {
        const colors = [
            'bg-[#FF5733]', 'bg-[#33FF57]', 'bg-[#3357FF]', 
            'bg-[#F333FF]', 'bg-[#33FFF3]', 'bg-[#F3FF33]',
            'bg-indigo-600', 'bg-emerald-600', 'bg-rose-600'
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };



    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header 
            className={`fixed top-0 left-0 w-full  z-50 transition-all duration-300 ${
                isScrolled 
                ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' 
                : 'bg-white py-5'
            }`}
        >
            <div className="max-w-[1440px] mx-auto px-6 md:px-10">
                <div className="flex items-center justify-between gap-4">
                    
                    {/* Left: Nav Links (Desktop) */}
                    <div className="hidden lg:flex items-center gap-8">
                        <NavLinks />
                    </div>

                    {/* Left: Mobile Menu Toggle */}
                    <button 
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu size={24} className="text-gray-800" />
                    </button>

                    {/* Center: Brand Name */}
                    <Link to="/" className="flex-shrink-0">
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tighter text-black uppercase italic">
                            Urban<span className="text-gray-500 not-italic font-light">Knife</span>
                        </h1>
                    </Link>

                    {/* Right Section */}
                    <div className="flex items-center gap-3 md:gap-6">
                        
                        {/* Search Bar (Desktop) */}
                        <div className="hidden md:block">
                            <SearchBar 
                                isFocused={isSearchFocused} 
                                setFocused={setIsSearchFocused} 
                            />
                        </div>

                        {/* Search Icon (Mobile) */}
                        <button className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Search size={20} className="text-gray-700" />
                        </button>

                        {/* Icons Group */}
                        <div className="flex items-center gap-1 md:gap-4">
                            <ProfileMenu />
                            
                            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group">
                                <Heart size={22} className="text-gray-700 group-hover:text-rose-500 transition-colors" />
                                <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full font-bold">0</span>
                            </button>

                            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group">
                                <ShoppingCart size={22} className="text-gray-700 group-hover:text-blue-600 transition-colors" />
                                <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full font-bold">2</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Navigation */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                        />
                        <motion.div 
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white z-[70] shadow-2xl p-8 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <h1 className="text-xl font-black italic tracking-tighter">URBANKNIFE</h1>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X size={24} />
                                </button>
                            </div>
                            <nav className="flex flex-col gap-6 text-lg font-bold tracking-widest text-gray-900">
                                <Link to="/men" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-500 transition-colors">MEN</Link>
                                <Link to="/women" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-500 transition-colors">WOMEN</Link>
                                <Link to="/sneakers" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gray-500 transition-colors">SNEAKERS</Link>
                                {isLoggedIn ? (
                                    <>
                                        <div className="flex items-center gap-3 px-1 py-2 mb-2">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${getAvatarColor(user?.username || user?.name || 'U')}`}>
                                                {(user?.username || user?.name || 'U').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Welcome back,</p>
                                                <p className="text-sm font-black text-black truncate max-w-[150px] uppercase tracking-tighter">{user?.username || user?.name}</p>
                                            </div>
                                        </div>
                                        <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-600 font-medium text-base py-2">
                                            <User size={20} /> My Profile
                                        </Link>
                                        <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-600 font-medium text-base py-2">
                                            <ShoppingCart size={20} /> My Orders
                                        </Link>
                                        <button 
                                            onClick={() => {
                                                HandleLogout();
                                                setIsMobileMenuOpen(false);
                                            }} 
                                            className="flex items-center gap-3 text-rose-600 font-bold text-base py-2 mt-4"
                                        >
                                            <LogOut size={20} /> Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-600 font-medium text-base py-2">
                                            <User size={20} /> Login
                                        </Link>
                                        <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-600 font-medium text-base py-2">
                                            <ChevronDown size={20} className="-rotate-90" /> Register
                                        </Link>
                                    </>
                                )}
                                <div className="h-[1px] bg-gray-100 my-4" />
                                <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-600 font-medium text-base py-2">
                                    <Heart size={20} /> Wishlist
                                </Link>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

const NavLinks = () => {
    const links = [
        { name: 'MEN', path: '/men' },
        { name: 'WOMEN', path: '/women' },
        { name: 'SNEAKERS', path: '/sneakers' },
    ];

    return (
        <nav className="flex items-center gap-10">
            {links.map((link) => (
                <Link 
                    key={link.name} 
                    to={link.path}
                    className="relative group py-2 text-[13px] font-bold tracking-[0.15em] text-gray-800"
                >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
                </Link>
            ))}
        </nav>
    );
};

const SearchBar = ({ isFocused, setFocused }) => {
    return (
        <div className={`relative group transition-all duration-300 ${isFocused ? 'w-[300px]' : 'w-[240px]'}`}>
            <div className={`flex items-center bg-gray-100/80 rounded-full px-4 py-2 border transition-all duration-300 ${
                isFocused ? 'border-black bg-white ring-4 ring-black/5 shadow-sm' : 'border-transparent'
            }`}>
                <Search size={18} className={`mr-2 transition-colors ${isFocused ? 'text-black' : 'text-gray-400'}`} />
                <input 
                    type="text" 
                    placeholder="What are you looking for?"
                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400 text-gray-700 font-medium"
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
                <Mic size={18} className="ml-2 text-gray-400 hover:text-black cursor-pointer transition-colors" />
            </div>
        </div>
    );
};

const ProfileMenu = () => {
    const { user, loading } = useSelector((state) => state.auth);
    const { HandleLogout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const isLoggedIn = !!user && (user.username || user.name);
    const username = user?.username || user?.name || "User";
    const initial = username.charAt(0).toUpperCase();

    const getAvatarColor = (name) => {
        const colors = [
            'bg-black', 'bg-indigo-700', 'bg-emerald-700', 
            'bg-rose-700', 'bg-amber-700', 'bg-slate-800'
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const handleLogout = async () => {
        setIsOpen(false);
        await HandleLogout();
        navigate('/login');
    };

    if (loading) {
        return <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-100 animate-pulse" />;
    }
    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center transition-all active:scale-95 group"
            >
                {isLoggedIn ? (
                    <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-white transition-all group-hover:shadow-lg ${getAvatarColor(username)}`}>
                        {initial}
                    </div>
                ) : (
                    <div className="p-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-full transition-all">
                        <User size={24} strokeWidth={1.5} />
                    </div>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden py-2"
                        >
                            {isLoggedIn ? (
                                <>
                                    <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-3 bg-gray-50/30">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ${getAvatarColor(username)}`}>
                                            {initial}
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-[10px] text-gray-400 font-black tracking-widest uppercase">Account</span>
                                            <span className="text-sm font-bold text-black truncate uppercase tracking-tighter">{username}</span>
                                        </div>
                                    </div>

                                    <div className="py-1">
                                        <MenuLink to="/profile" icon={<User size={16} />} label="My Profile" onClick={() => setIsOpen(false)} />
                                        <MenuLink to="/orders" icon={<ShoppingCart size={16} />} label="Orders" onClick={() => setIsOpen(false)} />
                                        <div className="h-[1px] bg-gray-100 my-2 mx-5" />
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="py-1">
                                    <div className="px-5 py-3 border-b border-gray-50 mb-1">
                                        <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">Welcome to UrbanKnife</p>
                                    </div>
                                    <MenuLink to="/login" label="Login" onClick={() => setIsOpen(false)} />
                                    <MenuLink to="/register" label="Register" onClick={() => setIsOpen(false)} />
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
const MenuLink = ({ to, label, icon, onClick }) => (
    <Link 
        to={to} 
        onClick={onClick}
        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
    >
        {icon}
        {label}
    </Link>
);

export default Header