import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    
    // Parallax effect: background moves slightly slower than scroll
    const y = useTransform(scrollY, [0, 1000], [0, 200]);

    return (
        <main className="relative w-full   h-screen overflow-hidden bg-[#121212]">
            {/* Background Hero Section with Parallax */}
            <motion.div 
                style={{ y }}
                className="absolute inset-0 w-full top-18 h-[120%] -top-[10%]"
            >
                <img 
                    src="/bg-home.png" 
                    alt="UrbanKnife Luxury Fashion" 
                    className="w-full h-full object-cover object-center brightness-[0.7] desaturate-[0.15] contrast-[1.05]"
                />
                
                {/* Cinematic Overlays */}
                {/* Side Gradients for depth and focus */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
                {/* Bottom Shadow for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
                {/* Subtle Grain Overlay (Optional but nice for luxury feel) */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </motion.div>

            {/* Content Overlay */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                
                {/* Subtle Tagline */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-12 md:mb-16"
                >
                    <p className="text-white/80 text-[10px] md:text-xs tracking-[0.5em] font-medium uppercase luxury-font italic">
                        Redefine Everyday Style
                    </p>
                </motion.div>

                {/* Main Action Section */}
                <div className="w-full max-w-[1440px] px-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    
                    {/* Left: Shop Men */}
                    <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full md:w-auto"
                    >
                        <HeroButton 
                            label="SHOP MEN" 
                            onClick={() => navigate('/men')} 
                        />
                    </motion.div>

                    {/* Right: Shop Women */}
                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full md:w-auto"
                    >
                        <HeroButton 
                            label="SHOP WOMEN" 
                            onClick={() => navigate('/women')} 
                        />
                    </motion.div>

                </div>

                {/* Decorative Bottom Brand Text */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.05 }}
                    transition={{ duration: 2, delay: 1 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white font-black text-[15vw] md:text-[10vw] tracking-[-0.05em] select-none pointer-events-none"
                >
                    URBANKNIFE
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
            </motion.div>
        </main>
    );
};

const HeroButton = ({ label, onClick }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 1)", color: "#000" }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="btn-sweep group relative w-full md:w-[280px] py-5 px-8 bg-white/5 backdrop-blur-xl border border-white/10 text-white text-xs md:text-sm font-bold tracking-[0.3em] transition-all duration-500 ease-out shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] overflow-hidden"
        >
            <span className="relative z-10">{label}</span>
            
            {/* Inner Border Animation on Hover */}
            <div className="absolute inset-0 border border-white/0 group-hover:border-black/10 transition-colors duration-500" />
        </motion.button>
    );
};

export default Home;