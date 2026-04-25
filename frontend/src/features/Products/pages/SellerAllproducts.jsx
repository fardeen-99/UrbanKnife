import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Eye, Edit3, Plus, ArrowUpRight, Search, Filter } from 'lucide-react';
import useProduct from '../hooks/product.hook';
import SellerHeader from './SellerHeader';
import './Seller.css';

const SellerAllproducts = () => {
    const { products, loading } = useSelector((state) => state.product);
    const { handleGetSellerAllProducts } = useProduct();

    useEffect(() => {
        handleGetSellerAllProducts();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
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
                    <StatCard label="Total Items" value={products?.length} />
                    <StatCard label="Active Status" value="Online" />
                    <StatCard label="Collections" value="Autumn '24" />
                    <StatCard label="Verified" value="Yes" />
                </section>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div key={n} className="h-96 rounded-3xl bg-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : products?.length > 0 ? (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                        
                        {products?.map((product, index) => (
                            <motion.div 
                                key={product._id} 
                                variants={itemVariants}
                                className="seller-card rounded-3xl overflow-hidden group flex flex-col h-full"
                                
                                >
                                {console.log("this is the product",product)}
                                
                                <div className="relative aspect-[4/5] overflow-hidden">
                                    <img 
                                        src={product?.image[0]?.url || 'https://via.placeholder.com/400x500?text=No+Image'} 
                                        alt={product?.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <Link to={`/seller/product/${product?._id}`}>
                                            <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#d4af37] transition-colors">
                                                <Eye size={20} />
                                            </button>
                                        </Link>
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-black/80 backdrop-blur-md text-[#d4af37] text-[10px] font-black px-3 py-1 rounded-full border border-[#d4af37]/30 uppercase tracking-widest">
                                            {product.category?.clothType || 'Luxury'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold uppercase tracking-tight truncate flex-1">{product.title}</h3>
                                        <p className="gold-text font-black ml-2">{product.price?.currency} {product.price?.amount}</p>
                                    </div>
                                    <p className="text-gray-500 text-xs line-clamp-2 mb-4 flex-grow uppercase tracking-widest leading-relaxed">
                                        {product.description}
                                    </p>
                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <Package size={14} className="text-[#d4af37]" />
                                            {product.variation?.length || 0} Variations
                                        </div>
                                        <Link 
                                            to={`/seller/product/${product._id}`}
                                            className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 group-hover:text-[#d4af37] transition-colors"
                                        >
                                            View Details
                                            <ArrowUpRight size={12} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-20 seller-card rounded-3xl">
                        <Package size={64} className="mx-auto text-gray-700 mb-6" />
                        <h3 className="text-2xl font-bold uppercase tracking-widest mb-2">No masterpieces found</h3>
                        <p className="text-gray-500 uppercase text-xs tracking-widest mb-8">Start your journey by creating your first product</p>
                        <Link to="/seller/createProduct">
                            <button className="gold-button px-10 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em]">
                                Create First Product
                            </button>
                        </Link>
                    </div>
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