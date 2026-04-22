import { motion } from "motion/react";
import { useState } from "react";
import { AuthScene, InputField } from "../components/AuthScene";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();
    console.log("Password reset submitted");
  };

  return (
    <AuthScene backgroundImage="/urban1.png" imageSide="right" sceneOffset={40}>
      <div className="mb-8 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/85 md:text-black/70">
          URBAN KNIFE
        </span>
        <span className="text-[11px] uppercase tracking-[0.2em] text-white/70 md:text-[#9a9a9a]">
          Reset
        </span>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.5 }}
        className="text-4xl font-black uppercase leading-[0.9] tracking-[-0.04em] text-white sm:text-5xl md:text-black"
      >
        New Password
      </motion.h1>
      <p className="mt-4 text-sm text-white/75 md:text-[#8d8d8d]">
        Create a new secure password for your account to ensure your curation remains private.
      </p>

      <div className="mt-12 space-y-8">
        <form className="space-y-8 font-semibold" onSubmit={submitHandler}>
          <InputField
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            actionLabel={showPassword ? <EyeOff size={18} strokeWidth={2.2} /> : <Eye size={18} strokeWidth={2.2} />}
            onActionClick={() => setShowPassword((current) => !current)}
          />

          <InputField
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.01, opacity: 0.92 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-full bg-black px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#f8f8f8]"
          >
            Update Password
          </motion.button>
        </form>
      </div>

      <div className="mt-12 flex flex-col gap-4">
        <p className="text-sm text-white/75 md:text-[#8f8f8f]">
          Password must be at least 8 characters and include a mix of letters, numbers, and symbols.
        </p>
      </div>
    </AuthScene>
  );
};

export default ResetPassword;