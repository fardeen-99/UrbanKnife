import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback } from "react";

const GREETINGS = [
    "Hello",
    "Bonjour",
    "Hola",
    "Ciao",
    "Hallo",
    "नमस्ते",
    "こんにちは",
    "안녕하세요",
    "你好",
    "Olá",
];

// ULTRA SNAPPY TIMING
const WORD_DURATION = 150;      // ms each word is fully visible
const TRANSITION_DURATION = 0.15; // seconds for framer motion crossfade

const Loader = ({ onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [phase, setPhase] = useState("greetings"); // "greetings" | "curtain"
    const [showGreeting, setShowGreeting] = useState(true);
    const[on,seton]=useState(true)
     if(!on) return;

    // Determine if we are in the last two greetings for the theme switch
    const isLastTwo = currentIndex >= GREETINGS.length - 2;

    // Progress for the bar (0 to 1)
    const progress = Math.min(currentIndex / (GREETINGS.length - 1), 1);

    // Cycle through greetings
    useEffect(() => {
        
        if (phase !== "greetings") return;

        const timer = setTimeout(() => {
            if (currentIndex < GREETINGS.length - 1) {
                setShowGreeting(false);
                setTimeout(() => {
                    setCurrentIndex((prev) => prev + 1);
                    setShowGreeting(true);
                }, 40); // Minimal gap for snappy feel
            } else {
                // All greetings done — begin curtain phase
                setShowGreeting(false);
                setTimeout(() => {
                    setPhase("curtain");
                }, 200);
            }
        }, WORD_DURATION + TRANSITION_DURATION * 1000);

        return () => clearTimeout(timer);
    }, [currentIndex, phase]);

    const handleCurtainComplete = useCallback(() => {
        
        if (onComplete) onComplete();
    }, [onComplete]);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap');
        .loader-text {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
        }
      `}</style>

            {/* ─── GRAIN FILTER ─── */}
            <svg className="fixed" style={{ width: 0, height: 0 }}>
                <filter id="loaderGrain">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
            </svg>

            <AnimatePresence>
                {phase === "greetings" && (
                    <motion.div
                        key="greeting-screen"
                        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
                        animate={{
                            backgroundColor: isLastTwo ? "#000000" : "#FFFFFF"
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Subtle Grain */}
                        <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                                filter: "url(#loaderGrain)",
                                opacity: isLastTwo ? 0.08 : 0.03,
                                mixBlendMode: isLastTwo ? "overlay" : "multiply",
                            }}
                        />

                        {/* Greeting text */}
                        <AnimatePresence mode="wait">
                            {showGreeting && (
                                <motion.h1
                                    key={GREETINGS[currentIndex]}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{
                                        duration: TRANSITION_DURATION,
                                        ease: [0.2, 1, 0.3, 1],
                                    }}
                                    className="loader-text relative z-10 select-none text-center"
                                    style={{
                                        color: isLastTwo ? "#FFFFFF" : "#000000",
                                        fontSize: "clamp(3.5rem, 9vw, 7rem)",
                                        fontWeight: 800,
                                        letterSpacing: "-0.05em",
                                        lineHeight: 1,
                                    }}
                                >
                                    {GREETINGS[currentIndex]}
                                </motion.h1>
                            )}
                        </AnimatePresence>

                        {/* Micro Branding */}
                        <div className="absolute bottom-8 flex flex-col items-center gap-4">
                            {/* Progress bar */}
                            <div className={`w-24 h-[1px] ${isLastTwo ? "bg-white/20" : "bg-black/10"}`}>
                                <motion.div
                                    className="h-full origin-left"
                                    style={{ backgroundColor: isLastTwo ? "#FFFFFF" : "#000000" }}
                                    animate={{ scaleX: progress }}
                                    transition={{ duration: 0.1, ease: "linear" }}
                                />
                            </div>
                            <span
                                className="loader-text text-[10px] font-bold uppercase tracking-[0.5em]"
                                style={{ color: isLastTwo ? "#FFFFFF" : "#000000", opacity: 0.4 }}
                            >
                                Urban Knife
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── FINAL CURTAIN REVEAL ─── */}
            <AnimatePresence onExitComplete={handleCurtainComplete}>
                {phase === "curtain" && <CurtainReveal onDone={handleCurtainComplete} />}
            </AnimatePresence>
        </>
    );
};

const CurtainReveal = ({ onDone }) => {
   
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onDone) onDone();
        }, 850);
        return () => clearTimeout(timer);
        seton(false)
    }, [onDone]);

    return (
        <motion.div
            className="fixed inset-0 z-[9998]"
            style={{ backgroundColor: "#000000" }}
            initial={{ y: 0 }}
            animate={{ y: "-100%" }}
            transition={{
                duration: 0.7,
                ease: [0.8, 0, 0.1, 1],
            }}
            
        >
            <span className="text-white  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Urban Knife</span>
        </motion.div>
    );
};

export default Loader;