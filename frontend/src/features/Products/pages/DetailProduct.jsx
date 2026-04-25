import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronRight, 
    ChevronLeft, 
    ShoppingBag, 
    Star, 
    Truck, 
    RotateCcw, 
    ShieldCheck, 
    Plus, 
    Minus,
    ArrowRight
} from 'lucide-react';
import useProduct from '../hooks/product.hook';

const DetailProduct = () => {
    const { id } = useParams();
    const { handleGetProductById } = useProduct();
    const { currentProduct: product, loading, error } = useSelector((state) => state.product);

    const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (id) handleGetProductById(id);
    }, [id]);

    // Reset state when product changes
    useEffect(() => {
        if (product) {
            setSelectedVariantIndex(null);
            setSelectedSize(null);
            setActiveImageIndex(0);
        }
    }, [product]);

    // Derived Data
    const currentImages = useMemo(() => {
        if (!product) return [];
        // If a variation is selected and has images, use those. Otherwise use main images.
        if (selectedVariantIndex !== null) {
            const variantImages = product.variation?.[selectedVariantIndex]?.images;
            if (variantImages && variantImages.length > 0) return variantImages;
        }
        return product.image || [];
    }, [product, selectedVariantIndex]);

    const currentSizes = useMemo(() => {
        if (!product || selectedVariantIndex === null || !product.variation?.[selectedVariantIndex]) return [];
        return product.variation[selectedVariantIndex].sizes || [];
    }, [product, selectedVariantIndex]);

    if (loading) return <LoadingSkeleton />;
    if (!product) return <ProductNotFound />;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#fafafa] pt-24 pb-20"
        >
            <div className="max-w-[1600px] mx-auto px-4 md:px-10 lg:px-16">
                
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-8">
                    <span>Home</span> <ChevronRight size={10} /> 
                    <span>{product.category?.genre}</span> <ChevronRight size={10} /> 
                    <span className="text-black">{product.title}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
                    
                    {/* Left: Image Gallery (70%) */}
                    <div className="lg:w-[65%] xl:w-[70%]">
                        <ImageGallery 
                            images={currentImages} 
                            activeIndex={activeImageIndex} 
                            setActiveIndex={setActiveImageIndex} 
                        />
                    </div>

                    {/* Right: Product Details (Sticky) */}
                    <div className="lg:w-[35%] xl:w-[30%]">
                        <div className="sticky top-32 space-y-10">
                            
                            {/* Title & Price */}
                            <section className="space-y-4">
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight text-black leading-tight">
                                        {product.title}
                                    </h1>
                                    <p className="text-xs font-black tracking-[0.2em] text-gray-400 uppercase mt-2">
                                        {product.category?.clothType} — Premium Essentials
                                    </p>
                                </div>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-3xl font-bold tracking-tighter">
                                        {product.price?.currency} {product.price?.amount?.toLocaleString()}
                                    </span>
                                    <span className="text-lg text-gray-300 line-through font-medium">
                                        {product.price?.currency} {(product.price?.amount * 1.2).toFixed(0)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex text-black">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-black" />)}
                                    </div>
                                    <span className="text-xs font-bold tracking-widest text-gray-500">(128 REVIEWS)</span>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed font-light">
                                {product.description || "Crafted from premium materials, this piece embodies the UrbanKnife philosophy of minimalism and timeless elegance. Designed for a perfect fit and exceptional durability."}
                            </p>

                            {/* Variant Selectors */}
                            {product.variation?.length > 0 && (
                                <section className="space-y-8">
                                    {/* Color Selection */}
                                    <div className="space-y-4">
                                        <h4 className="text-[11px] font-black tracking-[0.2em] text-black uppercase">
                                            Color: <span className="text-gray-400 ml-2">
                                                {selectedVariantIndex !== null ? product.variation[selectedVariantIndex]?.color : "Select a variation"}
                                            </span>
                                        </h4>
                                        <div className="flex gap-3">
                                            {/* Reset/Main option */}
                                            <button
                                                onClick={() => {
                                                    setSelectedVariantIndex(null);
                                                    setSelectedSize(null);
                                                    setActiveImageIndex(0);
                                                }}
                                                className={`w-12 h-12 rounded-full border-2 transition-all p-1 ${
                                                    selectedVariantIndex === null ? 'border-black' : 'border-transparent'
                                                }`}
                                            >
                                                <div 
                                                    className="w-full h-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-[8px] font-bold"
                                                    style={{ 
                                                        backgroundImage: `url(${product.image?.[0]?.url})`,
                                                        backgroundSize: 'cover'
                                                    }}
                                                >
                                                    {!product.image?.[0]?.url && "MAIN"}
                                                </div>
                                            </button>

                                            {product.variation.map((variant, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        setSelectedVariantIndex(idx);
                                                        setSelectedSize(null);
                                                        setActiveImageIndex(0);
                                                    }}
                                                    className={`w-12 h-12 rounded-full border-2 transition-all p-1 ${
                                                        selectedVariantIndex === idx ? 'border-black' : 'border-transparent'
                                                    }`}
                                                >
                                                    <div 
                                                        className="w-full h-full rounded-full overflow-hidden bg-gray-100"
                                                        style={{ 
                                                            backgroundImage: `url(${variant.images?.[0]?.url || product.image?.[0]?.url})`,
                                                            backgroundSize: 'cover'
                                                        }}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Size Selection */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-[11px] font-black tracking-[0.2em] text-black uppercase">Select Size</h4>
                                            <button className="text-[10px] font-bold text-gray-400 underline tracking-widest uppercase hover:text-black">Size Guide</button>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {currentSizes.length > 0 ? currentSizes.map((s, idx) => (
                                                <button
                                                    key={idx}
                                                    disabled={s.stock === 0}
                                                    onClick={() => setSelectedSize(s.size)}
                                                    className={`py-4 text-xs font-bold border transition-all ${
                                                        selectedSize === s.size 
                                                            ? 'bg-black text-white border-black' 
                                                            : s.stock === 0 
                                                                ? 'text-gray-300 border-gray-100 cursor-not-allowed' 
                                                                : 'bg-white text-black border-gray-200 hover:border-black'
                                                    }`}
                                                >
                                                    {s.size}
                                                </button>
                                            )) : (
                                                ["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                                                    <button key={s} disabled className="py-4 text-xs font-bold border border-gray-100 text-gray-300 cursor-not-allowed">{s}</button>
                                                ))
                                            )}
                                        </div>
                                        {selectedSize && (
                                            <p className="text-[10px] font-bold text-emerald-600 tracking-widest uppercase">
                                                In Stock • Ready to ship
                                            </p>
                                        )}
                                    </div>
                                </section>
                            )}

                            {/* Add to Bag */}
                            <section className="space-y-4">
                                <button
                                    disabled={product.variation?.length > 0 && !selectedSize}
                                    onClick={() => {
                                        setIsAdding(true);
                                        setTimeout(() => setIsAdding(false), 2000);
                                    }}
                                    className={`w-full py-5 text-xs font-black tracking-[0.2em] rounded-full transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden ${
                                        (product.variation?.length > 0 && !selectedSize)
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-black text-white shadow-2xl hover:bg-gray-900 group'
                                    }`}
                                >
                                    {isAdding ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <ShoppingBag size={18} className="group-hover:-translate-y-1 transition-transform" />
                                            <span>{selectedSize ? 'ADD TO BAG' : 'SELECT SIZE'}</span>
                                        </>
                                    )}
                                    <motion.div 
                                        className="absolute inset-0 bg-white/10"
                                        initial={{ x: '-100%' }}
                                        whileHover={{ x: '100%' }}
                                        transition={{ duration: 0.6 }}
                                    />
                                </button>
                                <button className="w-full py-5 text-xs font-black tracking-[0.2em] text-black border border-black/10 rounded-full hover:bg-gray-50 transition-colors uppercase">
                                    Add to Wishlist
                                </button>
                            </section>

                            {/* Accordion Sections */}
                            <section className="pt-10">
                                <Accordion 
                                    items={[
                                        { 
                                            title: "Product Details", 
                                            content: "High-quality fabric sourced from Italy. Featuring meticulous stitching, a tailored silhouette, and UrbanKnife branding on the hem. 100% Cotton." 
                                        },
                                        { 
                                            title: "Delivery & Returns", 
                                            content: "Complimentary express shipping on orders over ₹5,000. Easy 14-day returns policy. Orders typically ship within 24-48 hours." 
                                        },
                                        { 
                                            title: "Material & Care", 
                                            content: "Machine wash cold, gentle cycle. Do not bleach. Tumble dry low. Cool iron if needed." 
                                        }
                                    ]} 
                                />
                            </section>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-4 pt-10 text-center border-t border-gray-100">
                                <div className="space-y-2">
                                    <Truck size={20} className="mx-auto text-gray-400" />
                                    <p className="text-[8px] font-black tracking-widest text-gray-400 uppercase">Fast Delivery</p>
                                </div>
                                <div className="space-y-2">
                                    <RotateCcw size={20} className="mx-auto text-gray-400" />
                                    <p className="text-[8px] font-black tracking-widest text-gray-400 uppercase">Easy Returns</p>
                                </div>
                                <div className="space-y-2">
                                    <ShieldCheck size={20} className="mx-auto text-gray-400" />
                                    <p className="text-[8px] font-black tracking-widest text-gray-400 uppercase">Secure Payment</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Add to Bag */}
            <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md p-4 lg:hidden z-50 border-t border-gray-100">
                <button
                    disabled={product.variation?.length > 0 && !selectedSize}
                    className="w-full py-4 bg-black text-white text-[10px] font-black tracking-[0.3em] rounded-full flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-transform"
                >
                    {selectedSize ? `ADD TO BAG • ${product.price?.currency} ${product.price?.amount}` : 'SELECT SIZE'}
                </button>
            </div>
        </motion.div>
    );
};

// --- Sub-components ---

const ImageGallery = ({ images, activeIndex, setActiveIndex }) => {
    const mainImgRef = useRef(null);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });

    const handleMouseMove = (e) => {
        if (!mainImgRef.current) return;
        const { left, top, width, height } = mainImgRef.current.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setZoomPos({ x, y, show: true });
    };

    return (
        <div className="flex flex-col-reverse md:flex-row gap-6">
            {/* Thumbnails (Vertical on Desktop) */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar">
                {images?.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`relative w-20 h-24 md:w-24 md:h-32 flex-shrink-0 bg-white rounded-lg overflow-hidden transition-all duration-500 border ${
                            activeIndex === idx ? 'border-black' : 'border-transparent opacity-60'
                        }`}
                    >
                        <img src={img.url} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                    </button>
                ))}
            </div>

            {/* Main Image with Zoom */}
            <div className="relative flex-1 group overflow-hidden bg-white rounded-2xl cursor-crosshair">
                <div 
                    ref={mainImgRef}
                    className="relative aspect-[3/4] w-full"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setZoomPos(prev => ({ ...prev, show: false }))}
                >
                    <AnimatePresence mode="wait">
                        {images && images.length > 0 ? (
                            <motion.img
                                key={images[activeIndex]?.url}
                                src={images[activeIndex]?.url}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6 }}
                                className="w-full h-full object-cover"
                                alt="Main Product"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                                <span className="text-gray-300 text-xs font-black tracking-widest uppercase">No Image Available</span>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Zoom Lens Lens Effect */}
                    {zoomPos.show && (
                        <div 
                            className="absolute inset-0 pointer-events-none z-10 hidden lg:block"
                            style={{
                                backgroundImage: `url(${images?.[activeIndex]?.url})`,
                                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                                backgroundSize: '200%',
                            }}
                        />
                    )}
                </div>

                {/* Navigation Arrows */}
                {images && images.length > 1 && (
                    <>
                        <button 
                            onClick={() => setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                            className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/20 backdrop-blur-md rounded-full text-black opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button 
                            onClick={() => setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                            className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/20 backdrop-blur-md rounded-full text-black opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

const Accordion = ({ items }) => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="divide-y divide-gray-100">
            {items.map((item, idx) => (
                <div key={idx} className="py-6">
                    <button 
                        onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                        className="w-full flex justify-between items-center group"
                    >
                        <span className="text-[11px] font-black tracking-[0.2em] text-black uppercase group-hover:text-gray-500 transition-colors">
                            {item.title}
                        </span>
                        <Plus 
                            size={14} 
                            className={`transition-transform duration-500 ${openIndex === idx ? 'rotate-45' : ''}`} 
                        />
                    </button>
                    <AnimatePresence>
                        {openIndex === idx && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <p className="pt-4 text-xs leading-relaxed text-gray-500 font-medium">
                                    {item.content}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
};

const LoadingSkeleton = () => (
    <div className="min-h-screen bg-white pt-32 px-10 animate-pulse">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-20">
            <div className="lg:w-[70%] bg-gray-50 aspect-video rounded-3xl" />
            <div className="lg:w-[30%] space-y-10">
                <div className="h-12 bg-gray-50 rounded-lg w-3/4" />
                <div className="h-6 bg-gray-50 rounded-lg w-1/2" />
                <div className="h-32 bg-gray-50 rounded-lg" />
                <div className="h-20 bg-gray-50 rounded-lg" />
            </div>
        </div>
    </div>
);

const ProductNotFound = () => (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-10">
        <h2 className="text-4xl font-serif mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-10">The piece you're looking for might have been moved or is currently unavailable.</p>
        <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-xs font-black tracking-widest uppercase hover:gap-4 transition-all"
        >
            <ChevronLeft size={16} /> Go Back
        </button>
    </div>
);

export default DetailProduct;