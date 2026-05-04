import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';
import { closeCartDrawer } from '../state/cart.slice';
import useCart from '../hooks/cart.hook';

const CartDrawer = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isCartDrawerOpen, cart } = useSelector((state) => state.cart);
    const { HandleIncreaseCart, HandleDecreaseCart, HandleRemoveFromCart } = useCart();
    const cartItems = cart?.items || [];
    
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleClose = () => {
        dispatch(closeCartDrawer());
    };

    return (
        <AnimatePresence>
            {isCartDrawerOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-[100dvh] w-full sm:w-[450px] bg-white z-[100] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <h2 className="text-sm font-black tracking-widest uppercase flex items-center gap-2">
                                <ShoppingBag size={16} /> 
                                Shopping Bag ({cartItems.length})
                            </h2>
                            <button 
                                onClick={handleClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-500 hover:text-black" />
                            </button>
                        </div>

                        {/* Cart Items (Scrollable) */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                                    <ShoppingBag size={48} className="mb-4 opacity-20" />
                                    <p className="text-xs font-bold tracking-widest uppercase">Your bag is empty</p>
                                    <button 
                                        onClick={handleClose}
                                        className="mt-6 text-[10px] font-bold text-black border-b border-black pb-1 uppercase tracking-widest"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <div key={item._id} className="flex gap-4 group">
                                        <div className="w-24 h-28 bg-gray-50 rounded-md overflow-hidden relative border border-gray-100">
                                            <img 
                                                src={item.image?.[0]?.url || ""} 
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col py-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-sm font-bold text-black uppercase tracking-tight line-clamp-1">{item.title}</h3>
                                                    <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-1">
                                                        {item.size} • {item.color}
                                                    </p>
                                                </div>
                                                <button 
                                                    onClick={() => HandleRemoveFromCart(item._id)}
                                                    className="text-[10px] text-gray-400 font-bold tracking-wider hover:text-rose-500 transition-colors uppercase"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            
                                            <div className="mt-auto flex justify-between items-end">
                                                <div className="flex items-center border border-gray-200">
                                                    <button 
                                                        onClick={() => HandleDecreaseCart(item)}
                                                        disabled={item.quantity <= 1}
                                                        className="p-1.5 hover:bg-gray-50 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                                    >
                                                        <Minus size={10} />
                                                    </button>
                                                    <span className="w-6 text-center text-[10px] font-bold">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => HandleIncreaseCart(item)}
                                                        className="p-1.5 hover:bg-gray-50 text-gray-600"
                                                    >
                                                        <Plus size={10} />
                                                    </button>
                                                </div>
                                                <p className="text-sm font-bold text-black">
                                                    ₹ {(item.price * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}

                            {/* Related Products Section */}
                            {cartItems.length > 0 && (
                                <div className="pt-8 mt-8 border-t border-gray-100">
                                    <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 mb-4">You Might Also Like</h4>
                                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                                        {[1, 2, 3].map((_, i) => (
                                            <div key={i} className="min-w-[120px] group cursor-pointer">
                                                <div className="h-32 bg-gray-50 border border-gray-100 rounded-md mb-2 overflow-hidden relative">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <ShoppingBag size={24} />
                                                    </div>
                                                </div>
                                                <p className="text-[10px] font-bold text-black truncate uppercase tracking-tighter">Premium Essential</p>
                                                <p className="text-[9px] text-gray-500 font-bold tracking-widest mt-0.5">₹ 2,999</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer / Actions */}
                        {cartItems.length > 0 && (
                            <div className="p-6 bg-gray-50 border-t border-gray-200">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-xs font-black tracking-widest text-gray-500 uppercase">Subtotal</span>
                                    <span className="text-lg font-bold text-black tracking-tight">₹ {subtotal.toLocaleString()}</span>
                                </div>
                                
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => {
                                            handleClose();
                                            navigate('/checkout');
                                        }}
                                        className="w-full py-4 bg-black text-white text-xs font-black tracking-[0.2em] uppercase rounded flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors shadow-lg shadow-black/20"
                                    >
                                        Checkout <ArrowRight size={14} />
                                    </button>
                                    <button 
                                        onClick={() => {
                                            handleClose();
                                            navigate('/cart');
                                        }}
                                        className="w-full py-4 bg-white text-black border border-gray-200 text-xs font-black tracking-[0.2em] uppercase rounded hover:border-black hover:bg-gray-50 transition-all"
                                    >
                                        View Cart
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
