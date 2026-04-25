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
        <div className="flex items-center justify-center gap-4 mb-12">
            {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step === num ? 'bg-black text-white scale-110 shadow-lg' : step > num ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {step > num ? <Check size={14} /> : num}
                    </div>
                    {num < 3 && <div className={`w-12 h-[2px] mx-2 ${step > num ? 'bg-emerald-500' : 'bg-gray-100'}`} />}
                </div>
            ))}
        </div>
    );

    if (isPublished) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 pt-32">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8 max-w-md">
                    <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto shadow-2xl text-white"><Check size={48} /></div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-serif font-medium tracking-tight text-black">Product Published</h1>
                        <p className="text-gray-500">Your product is now live on UrbanKnife.</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <button onClick={() => navigate(`/product/${createdProduct._id}`)} className="w-full py-4 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors rounded-xl shadow-lg">View Product</button>
                        <button onClick={() => window.location.reload()} className="w-full py-4 border border-black text-black text-sm font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors rounded-xl">Add Another</button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black p-6 md:p-12 lg:p-20 pt-32">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12 text-center md:text-left">
                    <h1 className="text-5xl md:text-6xl font-serif font-medium tracking-tight mb-4 italic text-black">New<span className="not-italic font-light">Product</span></h1>
                    <p className="text-gray-500 text-lg">Define your product and optionally add color variations.</p>
                </header>
                <StepIndicator />

                <AnimatePresence mode="wait">
                    {/* STEP 1: Product Details + its own color/material/sizes */}
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-16">
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-gray-400"><Box size={14} /> Core Information</h3>
                                    <div className="space-y-6">
                                        <div className="group">
                                            <label className="text-[10px] uppercase font-bold text-gray-400">Product Title</label>
                                            <input type="text" name="title" value={baseInfo.title} onChange={handleBaseInfoChange} placeholder="e.g. Linen Blend Oversized Shirt" className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-all text-xl font-medium text-black placeholder:text-gray-200" />
                                        </div>
                                        <div className="group">
                                            <label className="text-[10px] uppercase font-bold text-gray-400">Description</label>
                                            <textarea name="description" value={baseInfo.description} onChange={handleBaseInfoChange} placeholder="Describe the texture, fit, and essence..." className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-all min-h-[120px] resize-none text-black placeholder:text-gray-200" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="group">
                                                <label className="text-[10px] uppercase font-bold text-gray-400">Genre</label>
                                                <select name="genre" value={baseInfo.genre} onChange={handleBaseInfoChange} className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-all bg-white text-black">
                                                    <option value="male">Male</option><option value="female">Female</option><option value="sneaker">Sneakers</option>
                                                </select>
                                            </div>
                                            <div className="group">
                                                <label className="text-[10px] uppercase font-bold text-gray-400">Cloth Type</label>
                                                <input type="text" name="clothType" value={baseInfo.clothType} onChange={handleBaseInfoChange} placeholder="shirt, pants..." className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-all text-black placeholder:text-gray-200" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="group">
                                                <label className="text-[10px] uppercase font-bold text-gray-400">Base Price</label>
                                                <input type="number" name="price" value={baseInfo.price} onChange={handleBaseInfoChange} placeholder="0.00" className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-all text-xl text-black" />
                                            </div>
                                            <div className="group">
                                                <label className="text-[10px] uppercase font-bold text-gray-400">Currency</label>
                                                <select name="currency" value={baseInfo.currency} onChange={handleBaseInfoChange} className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-all bg-white text-black">
                                                    <option value="INR">INR</option><option value="USD">USD</option><option value="AED">AED</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Product's OWN color, material, sizes */}
                                <div className="space-y-8 bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
                                    <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-gray-400"><Layers size={14} /> Product Attributes</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="group">
                                            <label className="text-[10px] uppercase font-bold text-gray-400">Color</label>
                                            <input type="text" name="color" value={baseInfo.color} onChange={handleBaseInfoChange} className="w-full bg-transparent border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-all text-black" />
                                        </div>
                                        <div className="group">
                                            <label className="text-[10px] uppercase font-bold text-gray-400">Material</label>
                                            <input type="text" name="material" value={baseInfo.material} onChange={handleBaseInfoChange} placeholder="e.g. 100% Linen" className="w-full bg-transparent border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-all text-black placeholder:text-gray-300" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Stock by Size</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {baseInfo.sizes?.map((s, si) => (
                                                <div key={si} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-black">
                                                    <span className="text-[10px] font-black">{s.size}</span>
                                                    <input type="number" value={s.stock} onChange={(e) => updateBaseSize(si, 'stock', e.target.value)} className="w-full text-center focus:outline-none font-medium mt-1 text-black bg-transparent" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <div className="flex justify-end pt-10">
                                <button disabled={!baseInfo.title || !baseInfo.price} onClick={() => setStep(2)} className="px-12 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-gray-900 transition-all disabled:opacity-30 rounded-full shadow-xl shadow-black/10">
                                    Product Gallery <ArrowRight size={16} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: Product Images */}
                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                            <header className="space-y-2">
                                <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-gray-400"><ImageIcon size={14} /> Product Gallery</h3>
                                <p className="text-sm text-gray-400 italic">These images represent your original product.</p>
                            </header>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                <label className="aspect-[3/4] border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition-all group">
                                    <Upload className="text-gray-300 group-hover:text-black transition-colors" />
                                    <span className="text-[10px] font-bold uppercase mt-2 text-gray-300 group-hover:text-black">Add Images</span>
                                    <input type="file" multiple onChange={handleMainImageChange} className="hidden" accept="image/*" />
                                </label>
                                {mainImagePreviews?.map((preview, i) => (
                                    <motion.div key={i} layoutId={`main-img-${i}`} className="relative aspect-[3/4] rounded-[2rem] overflow-hidden group shadow-md">
                                        <img src={preview} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <button onClick={() => removeMainImage(i)} className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full text-black opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"><X size={14} /></button>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="flex justify-between pt-16">
                                <button onClick={() => setStep(1)} className="px-10 py-4 border border-black text-black text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-gray-50 transition-all rounded-full"><ChevronLeft size={16} /> Details</button>
                                <button disabled={mainImages.length === 0} onClick={() => setStep(3)} className="px-12 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-gray-900 transition-all disabled:opacity-30 rounded-full">Variations (Optional) <ArrowRight size={16} /></button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: Additional Variations (OPTIONAL) */}
                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                            <header className="flex items-center justify-between bg-gray-50 p-6 rounded-[2rem]">
                                <div className="space-y-1">
                                    <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-black"><Palette size={14} /> Additional Color Variations</h3>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Optional — add other colorways with their own images & stock</p>
                                </div>
                                <button onClick={addNewVariation} className="px-6 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg"><Plus size={14} /> Add Color Way</button>
                            </header>

                            <div className="space-y-16">
                                {variations?.map((v, vi) => (
                                    <motion.div key={vi} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                                        <button onClick={() => removeVariation(vi)} className="absolute -top-4 -right-4 p-4 bg-white text-rose-500 rounded-full shadow-xl hover:bg-rose-500 hover:text-white transition-all z-10"><Trash2 size={20} /></button>
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                            <div className="lg:col-span-4 space-y-8">
                                                <div className="space-y-6">
                                                    <div className="group text-black">
                                                        <label className="text-[10px] uppercase font-bold text-gray-400">Color Way</label>
                                                        <input type="text" value={v.color} onChange={(e) => updateVariationField(vi, 'color', e.target.value)} placeholder="e.g. Midnight Black" className="w-full bg-transparent border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-all text-black placeholder:text-gray-300 font-medium" />
                                                    </div>
                                                    <div className="group text-black">
                                                        <label className="text-[10px] uppercase font-bold text-gray-400">Material</label>
                                                        <input type="text" value={v.material} onChange={(e) => updateVariationField(vi, 'material', e.target.value)} placeholder="e.g. Italian Silk" className="w-full bg-transparent border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-all text-black placeholder:text-gray-300" />
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-[10px] uppercase font-bold text-gray-400">Stock by Size</label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {v.sizes?.map((s, si) => (
                                                            <div key={si} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-black">
                                                                <span className="text-[10px] font-black opacity-40">{s.size}</span>
                                                                <input type="number" value={s.stock} onChange={(e) => updateVariationSize(vi, si, 'stock', e.target.value)} className="w-full text-center focus:outline-none font-medium mt-1 text-black bg-transparent" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="lg:col-span-8 space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-[10px] uppercase font-bold text-black flex items-center gap-2"><ImageIcon size={12} /> Variation Gallery <span className="text-rose-500 font-black">* Required</span></label>
                                                </div>
                                                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                                    <label className={`aspect-[3/4] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group ${v.images.length === 0 ? 'border-rose-200 bg-rose-50/20' : 'border-gray-100 hover:border-black'}`}>
                                                        <Upload size={20} className={v.images.length === 0 ? 'text-rose-300 group-hover:text-rose-500' : 'text-gray-300 group-hover:text-black'} />
                                                        <input type="file" multiple onChange={(e) => handleVariationImageChange(vi, e)} className="hidden" accept="image/*" />
                                                    </label>
                                                    {v.previews?.map((preview, ii) => (
                                                        <div key={ii} className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm group">
                                                            <img src={preview} alt="" className="w-full h-full object-cover" />
                                                            <button onClick={() => removeVariationImage(vi, ii)} className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full text-black opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {variations.length === 0 && (
                                    <div className="text-center py-32 border-2 border-dashed border-gray-50 rounded-[4rem]">
                                        <p className="text-gray-300 font-serif italic text-3xl">No extra variations.</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em] mt-4">You can publish with just the original product</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between pt-16 border-t border-gray-100">
                                <button onClick={() => setStep(2)} className="px-10 py-4 border border-black text-black text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-gray-50 transition-all rounded-full"><ChevronLeft size={16} /> Gallery</button>
                                <button onClick={handleSubmit} disabled={loading || variations.some(v => v.images.length === 0)} className="px-12 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-gray-900 transition-all disabled:opacity-30 rounded-full shadow-2xl shadow-black/20">
                                    {loading ? 'Publishing...' : 'Publish Product'} <ArrowRight size={16} />
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