import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Upload, X, ChevronLeft, Check, Box, Palette, Layers, ImageIcon, ArrowRight } from 'lucide-react';
import useProduct from '../hooks/product.hook';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const VALID_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const SellerProductCreate = () => {
    const { handleCreateProduct, handleAddVariation } = useProduct();
    const { loading } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [isPublished, setIsPublished] = useState(false);
    const [createdProduct, setCreatedProduct] = useState(null);

    // Base product info — color, material, sizes belong to the PRODUCT itself
    const [baseInfo, setBaseInfo] = useState({
        title: '', description: '', price: '', currency: 'INR',
        genre: 'male', clothType: 'shirt',
        color: 'Default', material: '',
        sizes: VALID_SIZES.map(s => ({ size: s, stock: 0 }))
    });
    const [mainImages, setMainImages] = useState([]);
    const [mainImagePreviews, setMainImagePreviews] = useState([]);

    // Additional variations (separate colorways added AFTER the product)
    const [variations, setVariations] = useState([]);

    const handleBaseInfoChange = (e) => {
        const { name, value } = e.target;
        setBaseInfo(prev => ({ ...prev, [name]: value }));
    };
    const updateBaseSize = (sIndex, field, value) => {
        setBaseInfo(prev => {
            const newSizes = [...prev.sizes];
            newSizes[sIndex][field] = value;
            return { ...prev, sizes: newSizes };
        });
    };
    const handleMainImageChange = (e) => {
        const files = Array.from(e.target.files);
        setMainImages(prev => [...prev, ...files]);
        setMainImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    };
    const removeMainImage = (i) => {
        setMainImages(prev => prev.filter((_, idx) => idx !== i));
        setMainImagePreviews(prev => prev.filter((_, idx) => idx !== i));
    };
    const addNewVariation = () => {
        setVariations(prev => [...prev, {
            color: '', material: '', images: [], previews: [],
            sizes: VALID_SIZES.map(s => ({ size: s, stock: 0 }))
        }]);
    };
    const removeVariation = (i) => setVariations(prev => prev.filter((_, idx) => idx !== i));
    const updateVariationField = (vi, field, value) => {
        setVariations(prev => { const n = [...prev]; n[vi][field] = value; return n; });
    };
    const updateVariationSize = (vi, si, field, value) => {
        setVariations(prev => { const n = [...prev]; n[vi].sizes[si][field] = value; return n; });
    };
    const handleVariationImageChange = (vi, e) => {
        const files = Array.from(e.target.files);
        setVariations(prev => {
            const n = [...prev];
            n[vi].images = [...n[vi].images, ...files];
            n[vi].previews = [...n[vi].previews, ...files.map(f => URL.createObjectURL(f))];
            return n;
        });
    };
    const removeVariationImage = (vi, ii) => {
        setVariations(prev => {
            const n = [...prev];
            n[vi].images = n[vi].images.filter((_, i) => i !== ii);
            n[vi].previews = n[vi].previews.filter((_, i) => i !== ii);
            return n;
        });
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('title', baseInfo.title);
        formData.append('description', baseInfo.description);
        formData.append('price', baseInfo.price);
        formData.append('currency', baseInfo.currency);
        formData.append('genre', baseInfo.genre);
        formData.append('clothType', baseInfo.clothType);
        formData.append('color', baseInfo.color);
        formData.append('material', baseInfo.material);
        formData.append('sizes', JSON.stringify(baseInfo.sizes.filter(s => s.stock > 0)));
        mainImages.forEach(img => formData.append('images', img));

        const product = await handleCreateProduct(formData);
        if (!product) return;
        setCreatedProduct(product);

        for (const v of variations) {
            if (v.images.length === 0) continue;
            const vf = new FormData();
            vf.append('color', v.color || "Default");
            vf.append('material', v.material);
            vf.append('sizes', JSON.stringify(v.sizes.filter(s => s.stock > 0)));
            v.images.forEach(img => vf.append('images', img));
            await handleAddVariation(product._id, vf);
        }
        setIsPublished(true);
    };

    const StepIndicator = () => (
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-8 md:mb-12">
            {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 border ${step === num ? 'bg-[#d4af37] text-black border-[#d4af37] scale-105 shadow-[0_0_20px_rgba(212,175,55,0.3)]' : step > num ? 'bg-zinc-900 text-[#d4af37] border-[#d4af37]/30' : 'bg-transparent text-gray-600 border-white/5'}`}>
                        {step > num ? <Check size={14} /> : num}
                    </div>
                    {num < 3 && <div className={`w-8 md:w-16 h-[1px] mx-1 md:mx-2 transition-all duration-500 ${step > num ? 'bg-[#d4af37]/50' : 'bg-white/5'}`} />}
                </div>
            ))}
        </div>
    );

    if (isPublished) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 pt-32">
                <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="text-center space-y-10 max-w-lg w-full bg-zinc-950 p-16 rounded-[3rem] border border-white/5  relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#d4af37]/20 blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="w-28 h-28 bg-gradient-to-br from-[#d4af37] to-[#aa8c2c] rounded-full flex items-center justify-center mx-auto text-black relative z-10">
                        <Check size={48} />
                    </div>
                    <div className="space-y-4 relative z-10">
                        <h1 className="text-4xl md:text-5xl font-black text-white royal-heading">MASTERPIECE <span className="gold-text">PUBLISHED</span></h1>
                        <p className="text-gray-400 text-sm font-medium tracking-wide">Your creation is now live and available to the world.</p>
                    </div>
                    <div className="flex flex-col gap-4 relative z-10 pt-4">
                        <button onClick={() => navigate(`/product/${createdProduct._id}`)} className="w-full py-5 gold-button text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl ">View Product</button>
                        <button onClick={() => window.location.reload()} className="w-full py-5 border border-white/10 text-white hover:bg-white/5 transition-colors text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl">Add Another</button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white px-4 py-6 md:p-8 pt-20 md:pt-28 selection:bg-[#d4af37] selection:text-black">
            <div className="absolute top-0 left-0 w-full h-[25vh] bg-gradient-to-b from-zinc-900/40 to-transparent pointer-events-none" />
            
            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-6 md:mb-10 text-center">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-2 royal-heading text-white">NEW <span className="gold-text">CURATION</span></h1>
                    <p className="text-gray-400 text-[10px] md:text-xs font-light tracking-[0.1em] uppercase opacity-70">Define. Curate. Release.</p>
                </header>
                <StepIndicator />

                <AnimatePresence mode="wait">
                    {/* STEP 1: Product Details */}
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-4 md:space-y-6">
                            <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
                                {/* Core Info */}
                                <div className="lg:col-span-7 space-y-4 md:space-y-6 bg-zinc-950/80 backdrop-blur-xl p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-900/30 blur-[80px] rounded-full pointer-events-none" />
                                    
                                    <h3 className="text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-[#d4af37] opacity-80"><Box size={12} /> Core Identity</h3>
                                    
                                    <div className="space-y-4 relative z-10">
                                        <div className="group">
                                            <label className="text-[8px] uppercase font-black text-gray-500 tracking-widest block mb-1">Product Title</label>
                                            <input type="text" name="title" value={baseInfo.title} onChange={handleBaseInfoChange} placeholder="e.g. Obsidian Linen Jacket" className="w-full bg-transparent border-b border-white/10 py-1.5 focus:outline-none focus:border-[#d4af37] transition-all text-lg md:text-xl font-bold text-white placeholder:text-gray-800" />
                                        </div>
                                        <div className="group">
                                            <label className="text-[8px] uppercase font-black text-gray-500 tracking-widest block mb-1">Description</label>
                                            <textarea name="description" value={baseInfo.description} onChange={handleBaseInfoChange} placeholder="The essence of this piece..." className="w-full bg-transparent border-b border-white/10 py-1.5 focus:outline-none focus:border-[#d4af37] transition-all min-h-[60px] md:min-h-[80px] resize-none text-[13px] text-gray-300 placeholder:text-gray-800 font-medium custom-scrollbar" />
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                                            <div className="group">
                                                <label className="text-[8px] uppercase font-black text-gray-500 tracking-widest block mb-1">Genre</label>
                                                <select name="genre" value={baseInfo.genre} onChange={handleBaseInfoChange} className="w-full bg-zinc-900/50 border border-white/5 rounded-lg py-2 px-3 focus:outline-none focus:border-[#d4af37] transition-all text-[12px] text-white appearance-none font-bold">
                                                    <option value="male">Male</option><option value="female">Female</option><option value="sneaker">Sneakers</option>
                                                </select>
                                            </div>
                                            <div className="group">
                                                <label className="text-[8px] uppercase font-black text-gray-500 tracking-widest block mb-1">Cloth Type</label>
                                                <input type="text" name="clothType" value={baseInfo.clothType} onChange={handleBaseInfoChange} placeholder="e.g. Outerwear" className="w-full bg-transparent border-b border-white/10 py-2 focus:outline-none focus:border-[#d4af37] transition-all text-[12px] text-white placeholder:text-gray-800 font-bold" />
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 md:gap-6 pt-1">
                                            <div className="group">
                                                <label className="text-[8px] uppercase font-black text-gray-500 tracking-widest block mb-1">Valuation</label>
                                                <div className="relative">
                                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-600 font-bold text-sm">
                                                        {baseInfo.currency === 'USD' ? '$' : baseInfo.currency === 'AED' ? 'د.إ' : '₹'}
                                                    </span>
                                                    <input type="number" name="price" value={baseInfo.price} onChange={handleBaseInfoChange} placeholder="0.00" className="w-full bg-transparent border-b border-white/10 py-1.5 pl-5 focus:outline-none focus:border-[#d4af37] transition-all text-xl font-black text-[#d4af37] placeholder:text-zinc-900" />
                                                </div>
                                            </div>
                                            <div className="group">
                                                <label className="text-[8px] uppercase font-black text-gray-500 tracking-widest block mb-1">Currency</label>
                                                <select name="currency" value={baseInfo.currency} onChange={handleBaseInfoChange} className="w-full bg-zinc-900/50 border border-white/5 rounded-lg py-2 px-3 focus:outline-none focus:border-[#d4af37] transition-all text-[12px] text-white appearance-none font-bold">
                                            <option value="INR">INR</option><option value="USD">USD</option><option value="AED">AED</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Product's Attributes */}
                                <div className="lg:col-span-5 space-y-4 md:space-y-6 bg-zinc-950/80 backdrop-blur-xl p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col">
                                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#d4af37]/5 to-transparent pointer-events-none" />
                                    
                                    <h3 className="text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-white opacity-80"><Layers size={12} /> Attributes</h3>
                                    
                                    <div className="space-y-4 relative z-10 flex-grow">
                                        <div className="group">
                                            <label className="text-[8px] uppercase font-black text-gray-500 tracking-widest block mb-1">Color</label>
                                            <input type="text" name="color" value={baseInfo.color} onChange={handleBaseInfoChange} placeholder="e.g. Obsidian" className="w-full bg-transparent border-b border-white/10 py-1.5 focus:outline-none focus:border-white transition-all text-[13px] text-white font-bold placeholder:text-gray-800" />
                                        </div>
                                        <div className="group">
                                            <label className="text-[8px] uppercase font-black text-gray-500 tracking-widest block mb-1">Material</label>
                                            <input type="text" name="material" value={baseInfo.material} onChange={handleBaseInfoChange} placeholder="e.g. Cotton" className="w-full bg-transparent border-b border-white/10 py-1.5 focus:outline-none focus:border-white transition-all text-[13px] text-white font-bold placeholder:text-gray-800" />
                                        </div>
                                        
                                        <div className="space-y-2 pt-1">
                                            <label className="text-[8px] uppercase font-black text-gray-500 tracking-widest block">Inventory</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {baseInfo.sizes?.map((s, si) => (
                                                    <div key={si} className="bg-zinc-900/50 p-2 rounded-lg border border-white/5 flex flex-col items-center">
                                                        <span className="text-[7px] font-black text-gray-500 tracking-widest mb-0.5">{s.size}</span>
                                                        <input type="number" value={s.stock} onChange={(e) => updateBaseSize(si, 'stock', e.target.value)} className="w-full text-center focus:outline-none text-[12px] font-bold text-white bg-transparent" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            
                            <div className="flex justify-center md:justify-end pt-2">
                                <button disabled={!baseInfo.title || !baseInfo.price} onClick={() => setStep(2)} className="gold-button w-full md:w-auto px-10 py-3.5 text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 rounded-full transition-all shadow-xl hover:scale-105 active:scale-95">
                                    Continue <ArrowRight size={14} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: Product Images */}
                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
                            <div className="bg-zinc-950/80 backdrop-blur-xl p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 shadow-2xl">
                                <header className="space-y-1 mb-6">
                                    <h3 className="text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-[#d4af37] opacity-80"><ImageIcon size={12} /> Assets</h3>
                                    <p className="text-[10px] text-gray-500 font-medium">Imagery for the base piece.</p>
                                </header>
                                
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
                                    <label className="aspect-[3/4] border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#d4af37]/50 hover:bg-[#d4af37]/5 transition-all group relative overflow-hidden">
                                        <Upload className="text-gray-600 group-hover:text-[#d4af37] transition-colors mb-1.5" size={18} />
                                        <span className="text-[7px] font-black uppercase tracking-widest text-gray-600 group-hover:text-[#d4af37]">Add</span>
                                        <input type="file" multiple onChange={handleMainImageChange} className="hidden" accept="image/*" />
                                    </label>
                                    
                                    {mainImagePreviews?.map((preview, i) => (
                                        <motion.div key={i} layoutId={`main-img-${i}`} className="relative aspect-[3/4] rounded-xl overflow-hidden group shadow-lg">
                                            <img src={preview} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button onClick={() => removeMainImage(i)} className="p-2 bg-rose-500/80 text-white rounded-full hover:bg-rose-500 transition-all">
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center gap-4 pt-2">
                                <button onClick={() => setStep(1)} className="px-6 py-3 border border-white/5 text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-white/5 transition-all rounded-full">
                                    <ChevronLeft size={14} /> Back
                                </button>
                                <button disabled={mainImages.length === 0} onClick={() => setStep(3)} className="gold-button px-10 py-3.5 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 rounded-full transition-all shadow-xl">
                                    Variations <ArrowRight size={14} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: Additional Variations (OPTIONAL) */}
                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }} className="space-y-6">
                            <header className="flex flex-col md:flex-row items-start md:items-center justify-between bg-zinc-950 p-6 rounded-[2rem] border border-white/5 shadow-xl gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-white"><Palette size={14} className="text-[#d4af37]" /> Colorways & Editions</h3>
                                    <p className="text-[10px] text-gray-500 font-medium">Optional — expand your curation with distinct aesthetic variations.</p>
                                </div>
                                <button onClick={addNewVariation} className="px-6 py-3 bg-zinc-900 border border-[#d4af37]/30 text-[#d4af37] text-[9px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-[#d4af37] hover:text-black transition-all flex items-center gap-2 shadow-sm whitespace-nowrap">
                                    <Plus size={12} /> Add Edition
                                </button>
                            </header>

                            <div className="space-y-6">
                                {variations?.map((v, vi) => (
                                    <motion.div key={vi} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative bg-zinc-950 p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-xl">
                                        <button onClick={() => removeVariation(vi)} className="absolute -top-3 -right-3 p-3 bg-rose-500 text-white rounded-full shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:scale-110 hover:bg-rose-600 transition-all z-10"><X size={14} /></button>
                                        
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                            {/* Variation Info */}
                                            <div className="lg:col-span-4 space-y-6">
                                                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                                                    <div className="group">
                                                        <label className="text-[9px] uppercase font-black text-gray-500 tracking-widest block mb-2">Variation Hue</label>
                                                        <input type="text" value={v.color} onChange={(e) => updateVariationField(vi, 'color', e.target.value)} placeholder="e.g. Midnight Black" className="w-full bg-transparent border-b border-white/10 py-2 focus:outline-none focus:border-[#d4af37] transition-all text-sm text-white placeholder:text-gray-700 font-bold" />
                                                    </div>
                                                    <div className="group">
                                                        <label className="text-[9px] uppercase font-black text-gray-500 tracking-widest block mb-2">Material Profile</label>
                                                        <input type="text" value={v.material} onChange={(e) => updateVariationField(vi, 'material', e.target.value)} placeholder="e.g. Italian Silk" className="w-full bg-transparent border-b border-white/10 py-2 focus:outline-none focus:border-[#d4af37] transition-all text-sm text-white placeholder:text-gray-700 font-bold" />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[9px] uppercase font-black text-gray-500 tracking-widest block">Inventory Limits</label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {v.sizes?.map((s, si) => (
                                                            <div key={si} className="bg-zinc-900 p-2 rounded-xl border border-white/5">
                                                                <span className="text-[8px] font-black text-gray-500 block text-center mb-1">{s.size}</span>
                                                                <input type="number" value={s.stock} onChange={(e) => updateVariationSize(vi, si, 'stock', e.target.value)} className="w-full text-center focus:outline-none text-sm font-bold text-white bg-transparent" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Variation Images */}
                                            <div className="lg:col-span-8 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-[9px] uppercase font-black text-white flex items-center gap-2 tracking-widest"><ImageIcon size={12} className="text-[#d4af37]" /> Visual Assets {v.images.length === 0 && <span className="text-rose-500 ml-2 border border-rose-500/30 px-1.5 py-0.5 rounded text-[8px] bg-rose-500/10">Required</span>}</label>
                                                </div>
                                                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                                    <label className={`aspect-[3/4] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden ${v.images.length === 0 ? 'border-rose-500/50 bg-rose-500/5 hover:bg-rose-500/10' : 'border-white/10 hover:border-[#d4af37] bg-white/5'}`}>
                                                        <Upload size={16} className={`mb-1 transition-colors ${v.images.length === 0 ? 'text-rose-500/70 group-hover:text-rose-500' : 'text-gray-500 group-hover:text-[#d4af37]'}`} />
                                                        <span className={`text-[7px] font-black uppercase tracking-widest ${v.images.length === 0 ? 'text-rose-500' : 'text-gray-500 group-hover:text-[#d4af37]'}`}>Upload</span>
                                                        <input type="file" multiple onChange={(e) => handleVariationImageChange(vi, e)} className="hidden" accept="image/*" />
                                                    </label>
                                                    {v.previews?.map((preview, ii) => (
                                                        <div key={ii} className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-md group">
                                                            <img src={preview} alt="" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <button onClick={() => removeVariationImage(vi, ii)} className="p-2 bg-rose-500 text-white rounded-full hover:scale-110 transition-transform"><Trash2 size={12} /></button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                
                                {variations.length === 0 && (
                                    <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-[2rem] bg-zinc-950/50 relative overflow-hidden">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/5 blur-[80px] rounded-full pointer-events-none" />
                                        <p className="text-white royal-heading text-2xl md:text-3xl font-black opacity-30 relative z-10">NO EDITIONS</p>
                                        <p className="text-[9px] text-gray-500 uppercase tracking-[0.3em] mt-3 font-bold relative z-10">You will publish only the original masterpiece.</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-6 border-t border-white/5">
                                <button onClick={() => setStep(2)} className="w-full md:w-auto px-8 py-4 border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white/5 transition-all rounded-full"><ChevronLeft size={14} /> Assets</button>
                                <button onClick={handleSubmit} disabled={loading || variations.some(v => v.images.length === 0)} className="w-full md:w-auto px-10 py-4 bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-gray-200 transition-all disabled:opacity-30 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                    {loading ? 'Publishing...' : 'Release to World'} <Check size={14} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SellerProductCreate;