import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <footer className="bg-[#0a0a0a] text-white pt-12 pb-8 border-t border-white/5">
            <div className="max-w-[1440px] mx-auto px-6 md:px-10">
                
                {/* Compact Top: Newsletter */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12 pb-10 border-b border-white/10">
                    <div className="max-w-md">
                        <motion.h3 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-xl md:text-2xl font-black italic tracking-tighter uppercase mb-2"
                        >
                            Join the <span className="text-gray-500">Movement</span>
                        </motion.h3>
                        <p className="text-gray-500 text-xs font-medium tracking-wide">
                            Stay updated with exclusive drops and private sales.
                        </p>
                    </div>
                    
                    <form className="relative w-full lg:w-[350px]">
                        <input 
                            type="email" 
                            placeholder="EMAIL ADDRESS" 
                            className="w-full bg-transparent border-b border-white/20 py-2 pr-10 text-[10px] tracking-[0.2em] outline-none focus:border-white transition-all duration-300 placeholder:text-gray-800"
                        />
                        <button className="absolute right-0 top-1/2 -translate-y-1/2 p-1 hover:translate-x-1 transition-all">
                            <ArrowRight size={16} className="text-white" />
                        </button>
                    </form>
                </div>

                {/* Compact Middle: Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
                    
                    {/* Brand Section */}
                    <div className="col-span-2 lg:col-span-2">
                        <h2 className="text-lg font-black italic tracking-tighter mb-4">URBANKNIFE</h2>
                        <p className="text-gray-600 text-xs leading-relaxed max-w-xs font-medium">
                            Premium fashion and minimalist aesthetics for the urban landscape. Crafted for the modern statement.
                        </p>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="text-[9px] font-bold tracking-[0.2em] uppercase mb-4 text-gray-400">Shop</h4>
                        <ul className="flex flex-col gap-3">
                            <FooterLink label="Men" to="/men" />
                            <FooterLink label="Women" to="/women" />
                            <FooterLink label="Sneakers" to="/sneakers" />
                            <FooterLink label="New Arrivals" to="/new" />
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="text-[9px] font-bold tracking-[0.2em] uppercase mb-4 text-gray-400">Support</h4>
                        <ul className="flex flex-col gap-3">
                            <FooterLink label="Track Order" to="/track" />
                            <FooterLink label="Shipping" to="/shipping" />
                            <FooterLink label="Returns" to="/returns" />
                            <FooterLink label="Contact" to="/contact" />
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="text-[9px] font-bold tracking-[0.2em] uppercase mb-4 text-gray-400">Company</h4>
                        <ul className="flex flex-col gap-3">
                            <FooterLink label="About" to="/about" />
                            <FooterLink label="Sustainability" to="/sustainability" />
                            <FooterLink label="Privacy" to="/privacy" />
                            <FooterLink label="Terms" to="/terms" />
                        </ul>
                    </div>

                </div>

                {/* Compact Bottom */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-[9px] tracking-[0.2em] text-gray-700 uppercase font-bold">
                        © 2026 URBAN KNIFE STUDIOS
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex gap-2">
                            <PaymentIcon label="VISA" />
                            <PaymentIcon label="MC" />
                            <PaymentIcon label="APPLE" />
                        </div>
                        <div className="text-[9px] tracking-[0.2em] text-gray-500 font-bold uppercase cursor-pointer hover:text-white flex items-center gap-2">
                            <MapPin size={10} />
                            USA (USD)
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
};

const FooterLink = ({ label, to }) => (
    <li>
        <Link 
            to={to} 
            className="text-gray-600 text-[11px] font-semibold hover:text-white transition-all duration-300 relative group inline-block tracking-tight"
        >
            {label}
            <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full opacity-40" />
        </Link>
    </li>
);

const PaymentIcon = ({ label }) => (
    <div className="px-2 py-0.5 bg-white/[0.02] border border-white/5 rounded text-[7px] font-black text-gray-800 cursor-default select-none">
        {label}
    </div>
);

export default Footer;