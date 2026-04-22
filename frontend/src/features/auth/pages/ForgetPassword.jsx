import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { AuthScene, InputField } from "../components/AuthScene";

const ForgetPassword = () => {
    const [email, setEmail] = useState("");

    const submitHandler = (event) => {
        event.preventDefault();
        // Functionality not required as per user request
        console.log("Forget Password submitted for:", email);
    };

    return (
        <AuthScene backgroundImage="/urban1.png" imageSide="right" sceneOffset={40}>
            <div className="mb-8 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/85 md:text-black/70">
                    URBAN KNIFE
                </span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-white/70 md:text-[#9a9a9a]">
                    Recovery
                </span>
            </div>

            <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.5 }}
                className="text-4xl font-black uppercase leading-[1.2] tracking-[-0.04em] text-white sm:text-5xl md:text-black"
            >
                Forgot Password?
            </motion.h1>
            <p className="mt-4 text-sm text-white/75 md:text-[#8d8d8d]">
                Enter your email address to receive a recovery link and regain access to your account.
            </p>

            <div className="mt-12 space-y-8">
                <form className="space-y-8 font-semibold" onSubmit={submitHandler}>
                    <InputField
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                    />

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.01, opacity: 0.92 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full rounded-full bg-black px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#f8f8f8]"
                    >
                        Send Reset Link
                    </motion.button>
                </form>
            </div>

            <div className="mt-12 flex flex-col gap-4">
                <p className="text-sm text-white/75 md:text-[#8f8f8f]">
                    Remembered your password?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-white underline decoration-white/40 underline-offset-4 md:text-black md:decoration-black/30"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </AuthScene>
    );
};

export default ForgetPassword;