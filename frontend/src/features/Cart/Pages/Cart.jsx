import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, Heart, ChevronRight, ShoppingBag } from "lucide-react";
import useCart from "../hooks/cart.hook";


const Cart = () => {
    const { HandleGetCart,HandleIncreaseCart,HandleDecreaseCart,HandleRemoveFromCart } = useCart();
    const { cart, status, error } = useSelector((state) => state.cart);


    useEffect(() => {
        HandleGetCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cartItems = cart?.items || [];

    // Calculate Totals (Mocking MRP as +20% for discount display)
    const bagTotalMRP = cartItems.reduce((acc, item) => acc + (item.price * 1.2 * item.quantity), 0);
    const bagTotalSelling = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const productDiscount = bagTotalMRP - bagTotalSelling;
    const grandTotal = bagTotalSelling;

    // TODO: Connect these to Backend endpoints in future
    const handleIncrement = async (item) => {
        HandleIncreaseCart(item);
        console.log(cart)
    };
    
    const handleDecrement = async (item) => {
        HandleDecreaseCart(item);
    };

    const handleRemove = (itemId) => {
      HandleRemoveFromCart(itemId);
    };

    if (status === "loading") return <LoadingSkeleton />;
    
    if (error) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <p className="text-red-500 font-bold">{error}</p>
        </div>
    );

    if (cartItems.length === 0) return <EmptyCart />;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#fafafa] pt-28 pb-20"
        >
            <div className="max-w-[1400px] mx-auto px-4 md:px-10 lg:px-16">
                
                {/* Header */}
                <h1 className="text-2xl md:text-3xl font-serif tracking-tight mb-8 md:mb-12 uppercase text-black">
                    Shopping Bag <span className="text-gray-400 text-lg font-sans tracking-normal ml-2">({cartItems.length} Items)</span>
                </h1>
                
                <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
                    
                    {/* Left Side: Cart Items (70%) */}
                    <div className="lg:w-[65%] xl:w-[70%] space-y-6">
                        {cartItems.map((item) => (
                            <div 
                                key={item._id} 
                                className="bg-white p-4 md:p-6 flex flex-col sm:flex-row gap-6 relative border border-gray-100 hover:shadow-sm transition-shadow"
                            >
                                {/* Item Image */}
                                <Link to={`/product/${item.productID}`} className="w-28 h-36 md:w-32 md:h-44 bg-gray-50 flex-shrink-0 group overflow-hidden">
                                    <img 
                                        src={item.image?.[0]?.url || "https://via.placeholder.com/150"} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                    />
                                </Link>
                                
                                {/* Item Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start pr-8 sm:pr-10">
                                            <Link to={`/product/${item.productID}`}>
                                                <h3 className="text-sm md:text-base font-medium text-black capitalize hover:underline underline-offset-4">
                                                    {item.title}
                                                </h3>
                                            </Link>
                                            
                                            <button 
                                                onClick={() => handleRemove(item._id)} 
                                                className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-300 hover:text-red-500 transition-colors"
                                                title="Remove from bag"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        
                                        <div className="mt-2 flex items-center gap-3 text-[10px] font-black tracking-widest text-gray-500 uppercase">
                                            <span>Size: {item.size}</span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <span>Color: {item.color}</span>
                                        </div>
                                    </div>

                                    {/* Controls & Price */}
                                    <div className="flex justify-between items-end mt-6">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center border border-gray-200">
                                            <button 
                                                onClick={() => handleDecrement(item)} 
                                                disabled={item.quantity <= 1}
                                                className="p-2 md:p-3 hover:bg-gray-50 transition-colors text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="w-8 md:w-10 text-center text-xs font-bold text-black">
                                                {item.quantity}
                                            </span>
                                            <button 
                                                onClick={() => handleIncrement(item)} 
                                                className="p-2 md:p-3 hover:bg-gray-50 transition-colors text-gray-600"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>

                                        {/* Price block */}
                                        <div className="text-right">
                                            <p className="text-[10px] md:text-xs text-gray-400 line-through mb-1 tracking-wider">
                                                ₹ {(item.price * 1.2).toFixed(0)}
                                            </p>
                                            <p className="text-sm md:text-base font-bold text-black tracking-tight">
                                                ₹ {(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Wishlist Button */}
                                    <div className="mt-5 pt-4 border-t border-gray-50">
                                        <button className="text-[10px] font-black tracking-[0.2em] text-gray-500 hover:text-black transition-colors uppercase flex items-center gap-2">
                                            <Heart size={12} /> Move to Wishlist
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Side: Order Summary (30%) */}
                    <div className="lg:w-[35%] xl:w-[30%]">
                        <div className="sticky top-32 bg-white border border-gray-100 p-6 md:p-8">
                            
                            <h3 className="text-[11px] font-black tracking-[0.2em] text-black uppercase mb-6">
                                Price Details
                            </h3>
                            
                            <div className="space-y-4 text-xs md:text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Bag Total</span>
                                    <span>₹ {bagTotalMRP.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-emerald-600">
                                    <span>Product Discount</span>
                                    <span>- ₹ {productDiscount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span className="text-emerald-600">FREE</span>
                                </div>
                            </div>

                            <div className="my-6 border-t border-dashed border-gray-200"></div>

                            <div className="flex justify-between items-end mb-8">
                                <span className="text-sm font-bold text-black uppercase tracking-wider">Grand Total</span>
                                <span className="text-xl md:text-2xl font-bold tracking-tight text-black leading-none">
                                    ₹ {grandTotal.toLocaleString()}
                                </span>
                            </div>

                            <button className="w-full py-5 bg-black text-white text-[10px] md:text-[11px] font-black tracking-[0.2em] rounded-full hover:bg-gray-900 transition-all flex items-center justify-center gap-3 group shadow-2xl">
                                PAY ₹ {grandTotal.toLocaleString()}
                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            
                            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                                <span>100% Secure Payments</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};

// --- Sub-components ---

const EmptyCart = () => (
    <div className="h-[100dvh] flex flex-col items-center justify-center text-center p-10 bg-[#fafafa]">
        <div className="w-24 h-24 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-300">
            <ShoppingBag size={32} strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-serif tracking-tight mb-4 text-black">Your bag is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm text-sm leading-relaxed">
            Discover our latest collection and add your favorite pieces to the bag.
        </p>
        <Link 
            to="/" 
            className="px-8 py-4 bg-black text-white text-[10px] font-black tracking-[0.2em] uppercase rounded-full hover:bg-gray-900 transition-all shadow-xl hover:shadow-2xl"
        >
            Continue Shopping
        </Link>
    </div>
);

const LoadingSkeleton = () => (
    <div className="min-h-screen bg-[#fafafa] pt-28 pb-20 px-4 md:px-10 lg:px-16 animate-pulse">
        <div className="max-w-[1400px] mx-auto">
            <div className="h-8 bg-gray-200 w-64 mb-12 rounded-sm opacity-50"></div>
            <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
                <div className="lg:w-[70%] space-y-6">
                    {[1, 2].map(i => (
                        <div key={i} className="h-44 bg-white border border-gray-100 flex gap-6 p-6">
                            <div className="w-32 bg-gray-100 h-full"></div>
                            <div className="flex-1 space-y-4 py-2">
                                <div className="h-4 bg-gray-100 w-3/4 rounded-sm"></div>
                                <div className="h-3 bg-gray-100 w-1/4 rounded-sm"></div>
                                <div className="h-6 bg-gray-100 w-24 rounded-sm mt-8"></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="lg:w-[30%]">
                    <div className="h-80 bg-white border border-gray-100 p-8">
                        <div className="h-4 bg-gray-100 w-1/2 mb-8 rounded-sm"></div>
                        <div className="space-y-4">
                            <div className="h-3 bg-gray-100 w-full rounded-sm"></div>
                            <div className="h-3 bg-gray-100 w-full rounded-sm"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Cart;