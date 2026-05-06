import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../auth/hooks/auth.hook";
import {
    ArrowLeft, User, MapPin, Phone, Mail,
    Map, Hash, Save, X, Loader2, CheckCircle2, Globe
} from "lucide-react";

const EditProfile = () => {
    const { user, loading } = useSelector(state => state.auth);
    const { HandleUpdateUserProfile } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        contact: "",
        alternateContact: "",
        address: "",
        state: "",
        country: "",
        pincode: "",
    });

    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // Pre-fill form with existing user data
    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
                email: user.email || "",
                contact: user.contact || "",
                alternateContact: user.alternateContact || "",
                address: user.location?.address || "",
                state: user.location?.state || "",
                country: user.location?.country || "",
                pincode: user.location?.pincode || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            // Build the update payload — only send fields that have values
            const payload = {};

            if (formData.username && formData.username !== user?.username) payload.username = formData.username;
            if (formData.email && formData.email !== user?.email) payload.email = formData.email;
            if (formData.contact !== (user?.contact || "")) payload.contact = formData.contact;
            if (formData.alternateContact !== (user?.alternateContact || "")) payload.alternateContact = formData.alternateContact;

            // Build location object only with changed fields
            const location = {};
            if (formData.address !== (user?.location?.address || "")) location.address = formData.address;
            if (formData.state !== (user?.location?.state || "")) location.state = formData.state;
            if (formData.country !== (user?.location?.country || "")) location.country = formData.country;
            if (formData.pincode !== (user?.location?.pincode || "")) location.pincode = formData.pincode;

            if (Object.keys(location).length > 0) payload.location = location;

            if (Object.keys(payload).length === 0) {
                setSaving(false);
                navigate("/profile");
                return;
            }

            await HandleUpdateUserProfile({ formData: payload });
            setSuccess(true);
            setTimeout(() => navigate("/profile"), 1200);
        } catch (err) {
            setError(typeof err === "string" ? err : "Something went wrong. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 pt-28 pb-8">
                    <button
                        onClick={() => navigate("/profile")}
                        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors mb-6 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Profile
                    </button>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-400">Settings</p>
                        <h1 className="text-3xl lg:text-4xl font-black text-black tracking-tight mt-1 uppercase">Edit Profile</h1>
                        <p className="text-sm text-gray-400 mt-2 font-medium">Update your credentials and shipping information.</p>
                    </motion.div>
                </div>
            </div>

            {/* Notifications */}
            <div className="max-w-7xl mx-auto px-6 mt-6">
                {success && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <div className="flex items-center gap-3 bg-black text-white px-5 py-4 rounded-2xl shadow-xl">
                            <CheckCircle2 size={20} className="text-emerald-400" />
                            <span className="text-sm font-bold tracking-tight">Changes saved successfully! Redirecting...</span>
                        </div>
                    </motion.div>
                )}
                {error && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-600 px-5 py-4 rounded-2xl">
                            <X size={20} />
                            <span className="text-sm font-bold">{error}</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-6 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Personal & Contact */}
                    <div className="space-y-8">
                        {/* Personal Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm"
                        >
                            <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30">
                                <div className="flex items-center gap-2">
                                    <User size={16} className="text-black" />
                                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400">Personal</p>
                                </div>
                                <p className="text-base font-black text-gray-900 mt-1 uppercase">Basic Details</p>
                            </div>
                            <div className="p-8 space-y-6">
                                <InputField label="Username" name="username" value={formData.username} onChange={handleChange} icon={User} placeholder="Enter username" />
                                <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} icon={Mail} placeholder="Enter email" />
                            </div>
                        </motion.div>

                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm"
                        >
                            <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30">
                                <div className="flex items-center gap-2">
                                    <Phone size={16} className="text-black" />
                                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400">Contact</p>
                                </div>
                                <p className="text-base font-black text-gray-900 mt-1 uppercase">Reachability</p>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="Primary Phone" name="contact" value={formData.contact} onChange={handleChange} icon={Phone} placeholder="+91 XXXXXXXXXX" />
                                    <InputField label="Alternative Phone" name="alternateContact" value={formData.alternateContact} onChange={handleChange} icon={Phone} placeholder="+91 XXXXXXXXXX" />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Location */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm h-full"
                        >
                            <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-black" />
                                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400">Location</p>
                                </div>
                                <p className="text-base font-black text-gray-900 mt-1 uppercase">Shipping Address</p>
                            </div>
                            <div className="p-8 space-y-6">
                                <InputField label="Street Address" name="address" value={formData.address} onChange={handleChange} icon={MapPin} placeholder="Street address, apartment, suite" />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <InputField label="State" name="state" value={formData.state} onChange={handleChange} icon={Map} placeholder="State" />
                                    <InputField label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} icon={Hash} placeholder="Zip" />
                                    <InputField label="Country" name="country" value={formData.country} onChange={handleChange} icon={Globe} placeholder="Country" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 mt-10"
                >
                    <button
                        type="submit"
                        disabled={saving || success}
                        className="flex-[2] flex items-center justify-center gap-3 py-5 bg-black text-white font-black text-sm tracking-[0.2em] uppercase rounded-2xl hover:bg-gray-900 active:scale-[0.98] transition-all duration-300 shadow-xl shadow-black/10 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <><Loader2 size={20} className="animate-spin" /> Processing...</>
                        ) : success ? (
                            <><CheckCircle2 size={20} /> Success</>
                        ) : (
                            <><Save size={20} /> Update Profile</>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/profile")}
                        disabled={saving}
                        className="flex-1 py-5 bg-white text-gray-900 font-black text-sm tracking-[0.2em] uppercase rounded-2xl border-2 border-gray-100 hover:border-black active:scale-[0.98] transition-all duration-300 disabled:opacity-60"
                    >
                        Discard
                    </button>
                </motion.div>
            </form>
        </div>
    );
};

const InputField = ({ label, name, value, onChange, icon: Icon, placeholder, type = "text" }) => (
    <div className="group">
        <label htmlFor={name} className="block text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 mb-2.5">
            {label}
        </label>
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon size={18} className="text-gray-300 group-focus-within:text-black transition-colors" />
            </div>
            <input
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full pl-12 pr-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-black focus:ring-0 focus:bg-white transition-all"
            />
        </div>
    </div>
);

export default EditProfile;

