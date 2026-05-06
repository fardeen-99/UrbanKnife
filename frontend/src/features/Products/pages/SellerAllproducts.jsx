import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Eye, Edit3, Plus, ArrowUpRight, Search, Filter, Star } from 'lucide-react';
import useProduct from '../hooks/product.hook';
import SellerHeader from './SellerHeader';
import './Seller.css';

const SellerProductSkeleton = () => (
    <div className="seller-card rounded-3xl overflow-hidden flex flex-col h-full animate-pulse">
        <div className="relative aspect-[4/5] bg-white/5">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
        </div>
        <div className="p-6 space-y-4">
            <div className="flex justify-between">
                <div className="h-6 bg-white/10 rounded w-2/3"></div>
                <div className="h-6 bg-white/10 rounded w-1/4"></div>
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-white/5 rounded w-full"></div>
                <div className="h-3 bg-white/5 rounded w-5/6"></div>
            </div>
            <div className="pt-4 border-t border-white/5 flex justify-between">
                <div className="h-3 bg-white/5 rounded w-1/3"></div>
                <div className="h-3 bg-white/5 rounded w-1/4"></div>
            </div>
        </div>
    </div>
);

const SellerAllproducts = () => {
    const observerTarget = React.useRef(null);
    const { products, loading, hasMore, page } = useSelector((state) => state.product);
    const { handleGetSellerAllProducts } = useProduct();

    useEffect(() => {
        handleGetSellerAllProducts(1, false);
    }, []);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            handleGetSellerAllProducts(page + 1, true);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    handleLoadMore();
                }
            },
            { 
                rootMargin: '200px',
                threshold: 0.1 
            }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, loading, page]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <div className="min-h-screen seller-luxury-bg text-white pt-24 pb-20">
            <main className="max-w-[1600px] mx-auto px-6 md:px-12">
                {/* Dashboard Header */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <motion.h2 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl md:text-6xl font-black royal-heading tracking-tighter"
                        >
                            MAISON <span className="gold-text">INVENTORY</span>
                        </motion.h2>
                        <p className="text-gray-500 text-xs md:text-sm tracking-[0.3em] font-bold uppercase mt-2">
                            Curate and manage your exclusive collections
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative group hidden sm:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-[#d4af37] transition-colors" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search inventory..." 
                                className="premium-input pl-12 pr-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase w-64"
                            />
                        </div>
                        <Link to="/seller/createProduct">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="gold-button px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg"
                            >
                                <Plus size={16} />
                                New Creation
                            </motion.button>
                        </Link>
                    </div>
                </header>

                {/* Stats Bar */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <StatCard label="Total Items" value={products?.length || 0} />
                    <StatCard label="Active Status" value="Online" />
                    <StatCard label="Collections" value="Autumn '24" />
                    <StatCard label="Verified" value="Yes" />
                </section>

                {/* Products Grid */}
                {loading && products.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => <SellerProductSkeleton key={i} />)}
                    </div>
                ) : products?.length > 0 ? (
                    <>
                        <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                        
                            {products.map((product, index) => (
                                <motion.div 
                                    key={product._id} 
                                    variants={itemVariants}
                                    className="seller-card rounded-[2rem] overflow-hidden group flex flex-col h-full border border-white/5 hover:border-[#d4af37]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-black/50"
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden">
                                        <img 
                                            src={product?.image[0]?.url || 'https://via.placeholder.com/400x500?text=No+Image'} 
                                            alt={product?.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4 backdrop-blur-[2px]">
                                            <Link to={`/seller/product/${product?._id}`}>
                                                <motion.button 
                                                    whileHover={{ scale: 1.1 }}
                                                    className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center hover:bg-[#d4af37] transition-colors shadow-xl"
                                                >
                                                    <Eye size={24} />
                                                </motion.button>
                                            </Link>
                                            <Link to={`/seller/product/${product?._id}?edit=true`}>
                                                <motion.button 
                                                    whileHover={{ scale: 1.1 }}
                                                    className="w-14 h-14 rounded-2xl bg-[#d4af37] text-black flex items-center justify-center hover:bg-white transition-colors shadow-xl"
                                                >
                                                    <Edit3 size={24} />
                                                </motion.button>
                                            </Link>
                                        </div>
                                        <div className="absolute top-6 left-6">
                                            <span className="bg-black/80 backdrop-blur-xl text-[#d4af37] text-[10px] font-black px-4 py-2 rounded-xl border border-[#d4af37]/20 uppercase tracking-[0.2em]">
                                                {product.category?.clothType || 'Luxury'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-8 flex flex-col flex-grow bg-gradient-to-b from-white/[0.03] to-transparent">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-xl font-bold uppercase tracking-tight truncate flex-1 group-hover:text-[#d4af37] transition-colors">{product.title}</h3>
                                            <p className="gold-text font-black ml-4 text-lg">{product.price?.currency} {product.price?.amount?.toLocaleString()}</p>
                                        </div>
                                        <p className="text-gray-500 text-[11px] line-clamp-2 mb-6 flex-grow uppercase tracking-[0.15em] leading-relaxed font-medium">
                                            {product.description}
                                        </p>
                                        <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#d4af37]/10 transition-colors">
                                                    <Package size={14} className="text-[#d4af37]" />
                                                </div>
                                                {product.variation?.length || 0} Variations
                                            </div>
                                            <Link 
                                                to={`/seller/product/${product._id}`}
                                                className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group-hover:text-[#d4af37] transition-all"
                                            >
                                                Details
                                                <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            
                            {/* Infinite Scroll Skeletons */}
                            {loading && (
                                [...Array(4)].map((_, i) => <SellerProductSkeleton key={`skeleton-${i}`} />)
                            )}
                        </motion.div>
                        
                        {/* Observer Target */}
                        <div ref={observerTarget} className="h-32 flex items-center justify-center mt-12">
                            {loading && (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#d4af37] animate-pulse">Acquiring Masterpieces...</span>
                                </div>
                            )}
                            {!hasMore && products.length > 0 && (
                                <div className="flex flex-col items-center gap-4 opacity-40">
                                    <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Curated Collection Complete</p>
                                    <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-32 seller-card rounded-[3rem] border border-white/5"
                    >
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                            <Package size={40} className="text-[#d4af37] opacity-50" />
                        </div>
                        <h3 className="text-3xl font-bold uppercase tracking-[0.2em] mb-4 royal-heading">No Masterpieces Found</h3>
                        <p className="text-gray-500 uppercase text-xs tracking-[0.3em] mb-12 max-w-md mx-auto leading-loose">Your gallery is currently empty. Begin curating your exclusive collections to showcase them to the world.</p>
                        <Link to="/seller/createProduct">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="gold-button px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em]"
                            >
                                Start First Creation
                            </motion.button>
                        </Link>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

const StatCard = ({ label, value }) => (
    <div className="seller-card p-6 rounded-2xl flex flex-col items-center justify-center text-center">
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{label}</span>
        <span className="text-xl font-bold uppercase tracking-tighter">{value}</span>
    </div>
);

export default SellerAllproducts;