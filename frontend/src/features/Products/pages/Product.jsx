import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useProduct from '../hooks/product.hook';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductSkeleton = () => (
    <div className="space-y-4">
        <div className="relative aspect-[3/4] bg-gray-200 rounded-xl animate-pulse overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
        </div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4 mt-4"></div>
        </div>
    </div>
);

const Product = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const observerTarget = React.useRef(null);
    const { handleGetMaleProducts, handleGetFemaleProducts, handleGetSneakers } = useProduct();
    const { products, loading, error, hasMore, page } = useSelector((state) => state.product);

    useEffect(() => {
        // Reset scroll to top when category changes
        window.scrollTo(0, 0);

        // Initial load
        if (location.pathname === '/men') {
            handleGetMaleProducts(1, false);
        } else if (location.pathname === '/women') {
            handleGetFemaleProducts(1, false);
        } else if (location.pathname === '/sneakers') {
            handleGetSneakers(1, false);
        }
    }, [location.pathname]);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            if (location.pathname === '/men') {
                handleGetMaleProducts(nextPage, true);
            } else if (location.pathname === '/women') {
                handleGetFemaleProducts(nextPage, true);
            } else if (location.pathname === '/sneakers') {
                handleGetSneakers(nextPage, true);
            }
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
    }, [hasMore, loading, page, location.pathname]);

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/men': return "Men's Collection";
            case '/women': return "Women's Collection";
            case '/sneakers': return "Premium Sneakers";
            default: return "Products";
        }
    };

    if (loading && products.length === 0) {
        return (
            <div className="min-h-screen bg-[#fafafa] pt-32 pb-20 px-6 md:px-10">
                <div className="max-w-[1440px] mx-auto">
                    <div className="mb-12">
                        <div className="h-16 w-64 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                        <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                        {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
                    </div>
                </div>
            </div>
        );
    }

    if (error && products.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white px-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-rose-600 mb-2">Error Loading Products</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-black text-white px-8 py-3 rounded-full text-xs font-bold tracking-widest"
                    >
                        RETRY
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] pt-32 pb-20 px-6 md:px-10">
            <div className="max-w-[1440px] mx-auto">
                {/* Header Section */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-black tracking-tighter text-black uppercase"
                        >
                            {getPageTitle()}
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-500 mt-2 font-medium tracking-wide"
                        >
                            Explore our curated selection of high-quality essentials.
                        </motion.p>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-bold tracking-widest text-gray-400">
                        <span>{products?.length || 0} ITEMS</span>
                        <div className="w-8 h-[1px] bg-gray-300"></div>
                        <span className="text-black">SORT BY: FEATURED</span>
                    </div>
                </div>

                {/* Products Grid */}
                {products && products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                            {products.map((product, index) => (
                                <ProductCard key={product._id} product={product} index={index} />
                            ))}
                            
                            {/* Skeleton loaders for next page */}
                            {loading && (
                                [...Array(4)].map((_, i) => <ProductSkeleton key={`skeleton-${i}`} />)
                            )}
                        </div>

                        {/* Observer Target */}
                        <div ref={observerTarget} className="h-20 flex items-center justify-center mt-12">
                            {loading && (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Discovering more...</span>
                                </div>
                            )}
                            {!hasMore && products.length > 0 && (
                                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">You've reached the end of the collection</p>
                            )}
                        </div>
                    </>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-32 text-center"
                    >
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-black mb-2">No products found</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">We couldn't find any products in this category at the moment. Please check back later.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

const ProductCard = ({ product, index }) => {
     const navigate = useNavigate();
    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group cursor-pointer"
            onClick={()=>{
                                navigate(`/product/${product._id}`)
                            console.log("hello",product._id)
                            }}
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-xl mb-5">
                <img 
                    src={product.image?.[0]?.url || 'https://via.placeholder.com/600x800'} 
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <button className="w-full bg-white text-black py-4 rounded-lg font-bold text-xs tracking-[0.2em] flex items-center justify-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
                        ADD TO BAG <ArrowRight size={14} />
                    </button>
                </div>

                {/* Badge */}
                {index % 3 === 0 && (
                    <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-black px-3 py-1 tracking-widest rounded-full">
                        NEW ARRIVAL
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="space-y-1">
                <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold tracking-tight text-gray-900 group-hover:text-gray-600 transition-colors uppercase truncate pr-2">
                        {product.title}
                    </h3>
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <Star size={12} className="fill-black text-black" />
                        <span className="text-[10px] font-black">4.8</span>
                    </div>
                </div>
                <p className="text-xs text-gray-400 font-medium tracking-wide">
                    {product.category?.clothType || 'Premium Wear'}
                </p>
                <div className="pt-2 flex items-center gap-3">
                    <span className="text-lg font-black tracking-tight text-black">
                        {product.price?.currency} {product.price?.amount?.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-300 line-through font-bold">
                        {product.price?.currency} {(product.price?.amount * 1.2).toFixed(0)}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default Product;