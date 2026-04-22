import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { AuthScene } from "../components/AuthScene";
import {  useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/auth.hook";

const VerifyPassword = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const {user}=useSelector((state)=>state.auth)
    const email = user?.email;
    const navigate=useNavigate()
    const {HandleVerifyPassword}=useAuth()
    
    const handleChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const submitHandler = async(event) => {
        event.preventDefault();
        const OTP=otp.join("")
        console.log(OTP)
    const data=  await HandleVerifyPassword({email,otp:OTP})
    if(data.success){
        navigate("/reset-password")
    }
        setOtp(["", "", "", "", "", ""])
            
        
    };

    return (
        <AuthScene backgroundImage="/urban1.png" imageSide="left" sceneOffset={-40}>
            <div className="mb-8 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/85 md:text-black/70">
                    URBAN KNIFE
                </span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-white/70 md:text-[#9a9a9a]">
                    Verification
                </span>
            </div>

            <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.5 }}
                className="text-4xl font-black uppercase leading-[0.9] tracking-[-0.04em] text-white sm:text-5xl md:text-black"
            >
                Verify Account
            </motion.h1>
            <p className="mt-4 text-sm text-white/75 md:text-[#8d8d8d]">
                Enter the 6-digit code sent to your email address to verify your identity.
            </p>

            <div className="mt-12 space-y-10">
                <form onSubmit={submitHandler} className="space-y-10">
                    <div className="flex justify-between gap-2 sm:gap-4">
                        {otp.map((digit, index) => (
                            <div key={index} className="relative flex-1">
                                <input
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-full border-b-2 border-white/30 bg-transparent py-4 text-center text-2xl font-bold text-white outline-none transition focus:border-white md:border-black/15 md:text-black md:focus:border-black"
                                />
                                <motion.div
                                    className="absolute bottom-0 left-0 h-0.5 bg-white md:bg-black"
                                    initial={{ width: "0%" }}
                                    animate={{ width: digit ? "100%" : "0%" }}
                                    transition={{ duration: 0.2 }}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.01, opacity: 0.92 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full rounded-full bg-black px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#f8f8f8]"
                        >
                            Verify OTP
                        </motion.button>

                        <button
                            type="button"
                            className="w-full text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60 transition hover:text-white md:text-black/40 md:hover:text-black"
                        >
                            Resend Code
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-12 flex flex-col gap-4">
                <p className="text-sm text-white/75 md:text-[#8f8f8f]">
                    Having trouble?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-white underline decoration-white/40 underline-offset-4 md:text-black md:decoration-black/30"
                    >
                        Contact support
                    </Link>
                </p>
            </div>
        </AuthScene>
    );
};

export default VerifyPassword;