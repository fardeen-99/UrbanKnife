import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useRef } from "react";
import {
    Pencil, MapPin, Phone, Mail, Heart,
    Headphones, ChevronRight, Package, Map,
    Hash, Shield, Camera, Globe
} from "lucide-react";
import { useAuth } from "../../auth/hooks/auth.hook";

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const stagger = {
    animate: { transition: { staggerChildren: 0.08 } }
};

const getAvatarGradient = (name = "U") => {
    const gradients = [
        "bg-gradient-to-br from-gray-900 to-black",
        "bg-gradient-to-br from-indigo-800 to-indigo-950",
        "bg-gradient-to-br from-emerald-800 to-emerald-950",
        "bg-gradient-to-br from-rose-800 to-rose-950",
        "bg-gradient-to-br from-amber-800 to-amber-950",
        "bg-gradient-to-br from-slate-800 to-slate-950",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
};

const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
            <Icon size={16} className="text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">{label}</p>
            <p className={`text-sm mt-0.5 truncate ${value ? "text-gray-900 font-medium" : "text-gray-300 italic"}`}>
                {value || "Not provided"}
            </p>
        </div>
        <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
    </div>
);

const Profile = () => {
    const { user, loading } = useSelector(state => state.auth);
    const { HandleUpdateProfilePic } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        navigate("/login");
        return null;
    }

    const username = user?.username || user?.name || "User";
    const initial = username.charAt(0).toUpperCase();

    const actionCards = [
        { icon: Heart, label: "Wishlist", sublabel: "Saved items", path: "/wishlist", hoverColor: "hover:border-rose-200", iconHover: "group-hover:text-rose-500" },
        { icon: Package, label: "My Orders", sublabel: "Track & manage", path: "/orders", hoverColor: "hover:border-blue-200", iconHover: "group-hover:text-blue-600" },
        { icon: Headphones, label: "Customer Care", sublabel: "Get help", path: "/support", hoverColor: "hover:border-emerald-200", iconHover: "group-hover:text-emerald-600" },
    ];

    const contactItems = [
        { icon: Phone, label: "Phone", value: user?.contact },
        { icon: Mail, label: "Email", value: user?.email },
        { icon: Phone, label: "Alt. Contact", value: user?.alternateContact },
    ];

    const addressItems = [
        { icon: MapPin, label: "Address", value: user?.location?.address },
        { icon: Map, label: "State", value: user?.location?.state },
        { icon: Globe, label: "Country", value: user?.location?.country },
        { icon: Hash, label: "Pincode", value: user?.location?.pincode },
    ];

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("profilePic", file);
            try {
                await HandleUpdateProfilePic(formData);
            } catch (err) {
                console.error("Upload failed", err);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
            />
            
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border-b border-gray-100"
            >
                <div className="max-w-7xl mx-auto px-6 pt-28 pb-10">
                    <div className="flex flex-col items-center lg:items-start lg:flex-row lg:gap-10">
                        {/* Avatar */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="relative mb-5 lg:mb-0"
                        >
                            {user?.profilePic ? (
                                <img
                                    src={user.profilePic}
                                    alt={username}
                                    className="w-28 h-28 lg:w-36 lg:h-36 rounded-full object-cover object-top ring-4 ring-gray-100 shadow-lg"
                                />
                            ) : (
                                <div className={`w-28 h-28 lg:w-36 lg:h-36 rounded-full flex items-center justify-center text-white text-4xl lg:text-5xl font-bold shadow-lg ring-4 ring-gray-100 ${getAvatarGradient(username)}`}>
                                    {initial}
                                </div>
                            )}
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="absolute bottom-1 right-1 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all"
                            >
                                <Camera size={18} />
                            </button>
                        </motion.div>

                        {/* Name & Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="text-center lg:text-left lg:pt-4"
                        >
                            <h1 className="text-2xl lg:text-3xl font-black text-black tracking-tight uppercase">{username}</h1>
                            <p className="text-sm lg:text-base text-gray-400 mt-1">{user?.email}</p>
                            <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 bg-black rounded-full">
                                <Shield size={12} className="text-white" />
                                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white">
                                    {user?.role || "Buyer"}
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
                {/* Action Cards */}
                <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-3 gap-3 sm:gap-6">
                    {actionCards.map((card) => (
                        <motion.div key={card.label} variants={fadeIn}>
                            <Link
                                to={card.path}
                                className={`group block bg-white rounded-2xl border border-gray-100 p-4 sm:p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${card.hoverColor}`}
                            >
                                <card.icon size={28} className={`mx-auto mb-2 sm:mb-4 text-gray-400 transition-colors duration-300 ${card.iconHover}`} />
                                <p className="text-xs sm:text-base font-black text-gray-900 tracking-tight uppercase">{card.label}</p>
                                <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 hidden sm:block font-medium">{card.sublabel}</p>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Info Sections - Side by Side on Large Screens */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm"
                    >
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
                            <div>
                                <p className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-400">Contact</p>
                                <p className="text-lg font-black text-gray-900 mt-0.5 uppercase tracking-tight">Personal Information</p>
                            </div>
                            <button
                                onClick={() => navigate("/edit-profile")}
                                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-500 hover:text-black hover:bg-gray-50 rounded-xl transition-all border border-gray-100"
                            >
                                <Pencil size={14} />
                                
                            </button>
                        </div>
                        <div className="divide-y divide-gray-50">
                            <InfoRow icon={Mail} label="Email" value={user?.email} />
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-50">
                                <InfoRow icon={Phone} label="Phone" value={user?.contact} />
                                <InfoRow icon={Phone} label="Alt. Contact" value={user?.alternateContact} />
                            </div>
                        </div>
                    </motion.div>

                    {/* Address Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-3xl border md:p-5 py-6 border-gray-100 overflow-hidden shadow-sm"
                    >
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
                            <div>
                                <p className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-400">Location</p>
                                <p className="text-lg font-black text-gray-900 mt-0.5 uppercase tracking-tight">Delivery Address</p>
                            </div>
                            <button
                                onClick={() => navigate("/edit-profile")}
                                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-500 hover:text-black hover:bg-gray-50 rounded-xl transition-all border border-gray-100"
                            >
                                <Pencil size={14} />
                              
                            </button>
                        </div>
                        <div className="divide-y   divide-gray-50 ">
                            <InfoRow icon={MapPin} label="Address"  value={user?.location?.address} />
                            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-50">
                                <InfoRow icon={Map} label="State" value={user?.location?.state} />
                                <InfoRow icon={Hash} label="Pincode" value={user?.location?.pincode} />
                                <InfoRow icon={Globe} label="Country" value={user?.location?.country} />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Edit Profile Button (Footer) */}
                {/* <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="pt-4 max-w-sm mx-auto">
                    <button
                        onClick={() => navigate("/edit-profile")}
                        className="w-full py-5 bg-black text-white font-black text-sm tracking-[0.2em] uppercase rounded-2xl hover:bg-gray-900 active:scale-[0.98] transition-all duration-200 shadow-xl shadow-black/20"
                    >
                        Edit Full Profile
                    </button>
                </motion.div> */}
            </div>
        </div>
    );
};

export default Profile;

