import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeft, Plus, Image as ImageIcon, Layers, Palette, 
    Trash2, Upload, X, Check, ArrowRight, Package, Info, 
    Maximize2, MoreVertical, Edit2
} from 'lucide-react';
import useProduct from '../hooks/product.hook';
import SellerHeader from './SellerHeader';
import './Seller.css';

const VALID_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const SellerDetailProducts = () => {
    const { id } = useParams();
    const { currentProduct, loading } = useSelector((state) => state.product);
    const { handleGetSellerProductDetail, handleAddVariation } = useProduct();
    
    const [isAddingVariation, setIsAddingVariation] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [newVariation, setNewVariation] = useState({
        color: '',
        material: '',
        images: [],
        previews: [],
        sizes: VALID_SIZES.map(s => ({ size: s, stock: 0 }))
    });

    useEffect(() => {
        if (id) {
            handleGetSellerProductDetail(id);
        }
    }, [id]);

    const handleVariationImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewVariation(prev => ({
            ...prev,
            images: [...prev.images, ...files],
            previews: [...prev.previews, ...files.map(f => URL.createObjectURL(f))]
        }));
    };

    const removeVariationImage = (index) => {
        setNewVariation(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
            previews: prev.previews.filter((_, i) => i !== index)
        }));
    };

    const updateVariationSize = (index, stock) => {
        const updatedSizes = [...newVariation.sizes];
        updatedSizes[index].stock = parseInt(stock) || 0;
        setNewVariation(prev => ({ ...prev, sizes: updatedSizes }));
    };

    const submitVariation = async () => {
        if (newVariation.images.length === 0) return;
        
        const formData = new FormData();
        formData.append('color', newVariation.color || 'Default');
        formData.append('material', newVariation.material);
        formData.append('sizes', JSON.stringify(newVariation.sizes.filter(s => s.stock > 0)));
        newVariation.images.forEach(img => formData.append('images', img));

        const success = await handleAddVariation(id, formData);
        if (success) {
            setIsAddingVariation(false);
            setNewVariation({
                color: '',
                material: '',
                images: [],
                previews: [],
                sizes: VALID_SIZES.map(s => ({ size: s, stock: 0 }))
            });
            handleGetSellerProductDetail(id); // Refresh
        }
    };

    if (loading && !currentProduct) {
        return (
            <div className="min-h-screen seller-luxury-bg flex items-center justify-center">
                <div className="w-16 h-16 border-t-2 border-b-2 border-[#d4af37] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!currentProduct) {
        return (
            <div className="min-h-screen seller-luxury-bg flex flex-col items-center justify-center text-white">
                <h2 className="text-3xl royal-heading mb-4">Masterpiece Not Found</h2>
                <Link to="/seller" className="gold-text uppercase tracking-widest text-xs font-bold flex items-center gap-2">
                    <ChevronLeft size={16} /> Return to Inventory
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen seller-luxury-bg text-white pt-24 pb-20">
            <main className="max-w-[1600px] mx-auto px-6 md:px-12">
                {/* Navigation & Actions */}
                <div className="flex items-center justify-between mb-12">
                    <Link to="/seller" className="group flex items-center gap-2 text-gray-400 hover:text-[#d4af37] transition-colors">
                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#d4af37]/50">
                            <ChevronLeft size={16} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Inventory</span>
                    </Link>
                    
                    <div className="flex items-center gap-4">
                        <button className="p-3 rounded-full border border-white/5 hover:bg-white/5 transition-colors">
                            <Edit2 size={18} className="text-gray-400" />
                        </button>
                        <button className="p-3 rounded-full border border-white/5 hover:bg-white/5 transition-colors">
                            <Maximize2 size={18} className="text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Product Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
                    {/* Visual Gallery */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        <motion.div 
                            layoutId="main-image"
                            className="aspect-[4/5] rounded-[2.5rem] overflow-hidden seller-card relative group"
                        >
                            <AnimatePresence mode="wait">
                                <motion.img 
                                    key={activeImageIndex}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.6 }}
                                    src={currentProduct.image[activeImageIndex]?.url} 
                                    alt={currentProduct.title}
                                    className="w-full h-full object-cover"
                                />
                            </AnimatePresence>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                        
                        <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
                            {currentProduct.image?.map((img, i) => (
                                <button 
                                    key={i}
                                    onClick={() => setActiveImageIndex(i)}
                                    className={`relative w-24 aspect-[3/4] rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-300 ${
                                        activeImageIndex === i ? 'ring-2 ring-[#d4af37] ring-offset-4 ring-offset-black scale-105' : 'opacity-40 hover:opacity-100'
                                    }`}
                                >
                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Essence & Specs */}
                    <div className="lg:col-span-5 flex flex-col">
                        <div className="mb-10">
                            <span className="gold-text royal-heading text-xs font-black tracking-[0.4em] block mb-4">Exclusive Collection</span>
                            <h1 className="text-5xl md:text-7xl font-black royal-heading tracking-tighter mb-6 leading-[0.9]">
                                {currentProduct.title?.split(' ').map((word, i) => (
                                    <span key={i} className={i % 2 === 1 ? 'gold-text' : ''}>{word} </span>
                                ))}
                            </h1>
                            <div className="flex items-center gap-6 mb-8">
                                <div className="px-4 py-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 text-[#d4af37] text-[10px] font-black uppercase tracking-widest">
                                    {currentProduct.category?.clothType || 'Luxury'}
                                </div>
                                <span className="text-2xl font-serif italic text-gray-400">{currentProduct.price?.currency} {currentProduct.price?.amount}</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed uppercase tracking-widest font-medium mb-12 max-w-lg">
                                {currentProduct.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-12 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                            <SpecItem icon={<Palette size={16} />} label="Primary Hue" value={currentProduct.color || 'Heritage'} />
                            <SpecItem icon={<Layers size={16} />} label="Composition" value={currentProduct.material || 'Premium Fabric'} />
                            <SpecItem icon={<Package size={16} />} label="Availability" value={currentProduct.stock || 'In Maison'} />
                            <SpecItem icon={<Info size={16} />} label="Origin" value="Curated" />
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Maison Sizes</h3>
                            <div className="flex flex-wrap gap-3">
                                {VALID_SIZES.map(size => {
                                    const sizeData = currentProduct.sizes?.find(s => s.size === size);
                                    const inStock = sizeData && sizeData.stock > 0;
                                    return (
                                        <div 
                                            key={size}
                                            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 ${
                                                inStock 
                                                ? 'border-[#d4af37]/30 bg-[#d4af37]/5 text-white' 
                                                : 'border-white/5 text-gray-600'
                                            }`}
                                        >
                                            <span className="text-xs font-black">{size}</span>
                                            {inStock && <span className="text-[8px] font-bold text-[#d4af37] mt-1">{sizeData.stock}</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Variations Master Section */}
                <section className="mb-24">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl royal-heading font-black">CURATED <span className="gold-text">VARIATIONS</span></h2>
                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold mt-2">The diversity of elegance</p>
                        </div>
                        <button 
                            onClick={() => setIsAddingVariation(true)}
                            className="gold-button px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl"
                        >
                            <Plus size={18} />
                            Add Masterpiece
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {currentProduct.variation?.map((variant, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="seller-card rounded-[2.5rem] p-8 flex flex-col gap-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                                            <Palette size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Colorway</p>
                                            <h4 className="text-sm font-bold uppercase tracking-widest text-white">{variant.color}</h4>
                                        </div>
                                    </div>
                                    <button className="text-gray-600 hover:text-rose-500 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                                    {variant.images?.map((img, i) => (
                                        <div key={i} className="w-20 aspect-[3/4] rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {variant.sizes?.map((s, i) => (
                                        <div key={i} className="variation-chip px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                            {s.size}: {s.stock}
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-4 pt-6 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Material: {variant.material || 'Premium'}</span>
                                    <button className="text-[9px] font-black text-[#d4af37] uppercase tracking-widest flex items-center gap-1">
                                        Edit Details <ArrowRight size={10} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    
                    {(!currentProduct.variation || currentProduct.variation.length === 0) && (
                        <div className="py-32 text-center seller-card rounded-[3rem] border-dashed border-white/5">
                            <Layers size={48} className="mx-auto text-gray-700 mb-6" />
                            <h3 className="text-xl font-bold uppercase tracking-[0.2em] mb-2">No Variations Registered</h3>
                            <p className="text-gray-500 text-[10px] uppercase tracking-widest">Expand your collection with unique colorways</p>
                        </div>
                    )}
                </section>
            </main>

            {/* Add Variation Modal */}
            <AnimatePresence>
                {isAddingVariation && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddingVariation(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row"
                        >
                            {/* Modal Left: Visuals */}
                            <div className="md:w-5/12 bg-zinc-900/50 p-10 border-r border-white/5 flex flex-col">
                                <h3 className="text-xl royal-heading font-black mb-2">VISUAL <span className="gold-text">ASSETS</span></h3>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-8">Mandatory for luxury validation</p>
                                
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <label className="aspect-[3/4] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#d4af37]/50 hover:bg-[#d4af37]/5 transition-all group">
                                        <Upload className="text-gray-500 group-hover:text-[#d4af37]" />
                                        <span className="text-[8px] font-black uppercase tracking-widest mt-2 text-gray-500 group-hover:text-[#d4af37]">Upload</span>
                                        <input type="file" multiple onChange={handleVariationImageChange} className="hidden" />
                                    </label>
                                    {newVariation.previews?.map((url, i) => (
                                        <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl group">
                                            <img src={url} alt="" className="w-full h-full object-cover" />
                                            <button 
                                                onClick={() => removeVariationImage(i)}
                                                className="absolute top-2 right-2 p-1.5 bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                {newVariation.images.length === 0 && (
                                    <div className="flex-grow flex items-center justify-center text-center p-6 border border-white/5 rounded-3xl bg-black/20">
                                        <p className="text-[9px] text-rose-500/60 uppercase font-black tracking-[0.2em]">At least one image is required to curate a variation</p>
                                    </div>
                                )}
                            </div>

                            {/* Modal Right: Form */}
                            <div className="md:w-7/12 p-10 flex flex-col h-full max-h-[85vh] overflow-y-auto custom-scrollbar">
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="text-xl royal-heading font-black">CURATION <span className="gold-text">DETAILS</span></h3>
                                    <button onClick={() => setIsAddingVariation(false)} className="text-gray-500 hover:text-white transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-8 mb-10">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Variation Hue</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Onyx Gold"
                                                value={newVariation.color}
                                                onChange={(e) => setNewVariation(prev => ({ ...prev, color: e.target.value }))}
                                                className="premium-input w-full px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Material Base</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Suede Silk"
                                                value={newVariation.material}
                                                onChange={(e) => setNewVariation(prev => ({ ...prev, material: e.target.value }))}
                                                className="premium-input w-full px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Inventory Distribution</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {newVariation.sizes?.map((s, i) => (
                                                <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
                                                    <span className="text-[10px] font-black text-gray-400 mb-1">{s.size}</span>
                                                    <input 
                                                        type="number" 
                                                        placeholder="0"
                                                        value={s.stock}
                                                        onChange={(e) => updateVariationSize(i, e.target.value)}
                                                        className="w-full text-center bg-transparent border-none outline-none font-bold text-[#d4af37]"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                                    <p className="text-[9px] text-gray-500 italic max-w-[200px]">By publishing, this variation will immediately be available in your store gallery.</p>
                                    <button 
                                        onClick={submitVariation}
                                        disabled={loading || newVariation.images.length === 0}
                                        className="gold-button px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 disabled:opacity-30 shadow-2xl"
                                    >
                                        {loading ? 'Curating...' : 'Register Variation'}
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SpecItem = ({ icon, label, value }) => (
    <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[#d4af37]">
            {icon}
        </div>
        <div>
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{label}</p>
            <p className="text-xs font-bold text-white uppercase tracking-tighter">{value}</p>
        </div>
    </div>
);

export default SellerDetailProducts;