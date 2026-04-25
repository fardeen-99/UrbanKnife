import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";

const Protected = ({ children }) => {
    const { user, loading } = useSelector((state) => state.auth);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
                <div className="flex flex-col items-center gap-6">
                    {/* Minimal Luxury Spinner */}
                    <div className="relative w-16 h-16">
                        <motion.div 
                            className="absolute inset-0 border-t-2 border-black rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div 
                            className="absolute inset-2 border-t border-gray-200 rounded-full"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                    </div>

                    {/* Brand Text */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <h2 className="text-sm font-black tracking-[0.6em] uppercase italic">
                            Urban<span className="not-italic font-light">Knife</span>
                        </h2>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
                            Verifying Identity
                        </span>
                    </motion.div>
                </div>
                
                {/* Subtle Progress Line at Bottom */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-100 overflow-hidden">
                    <motion.div 
                        className="h-full bg-black origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />
                </div>
            </div>
        );
    }

    if (!user || user.role !== "seller") {
        return <Navigate to="/" replace />;
    }
  
    return children;
};

export default Protected;
