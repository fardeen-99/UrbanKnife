import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthScene, GoogleButton, InputField } from "../components/AuthScene";
import { useAuth } from "../hooks/auth.hook";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    contact: "",
    password: "",
  });
  const [isSeller, setIsSeller] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { HandleRegister } = useAuth()
  const navigate = useNavigate()

  const onValueChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const submitHandler = async (event) => {
    event.preventDefault()
    await HandleRegister({ username: form.username, email: form.email, password: form.password, contact: form.contact, isSeller })
    navigate("/")
    setForm({ username: "", email: "", password: "", contact: "", role: "buyer" })
    setIsSeller(false)
    setShowPassword(false)
  }

  return (
    <AuthScene imageSide="right" sceneOffset={40}>
      <div className="mb-6 flex items-center justify-between md:mb-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/85 md:text-black/70">
          URBAN KNIFE
        </span>
        <span className="text-[11px] uppercase tracking-[0.2em] text-white/70 md:text-[#9a9a9a]">
          Signup
        </span>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.5 }}
        className="text-3xl font-black uppercase leading-[0.9] tracking-[-0.04em] text-white sm:text-4xl md:text-black"
      >
        Create Account
      </motion.h1>
      <p className="mt-3 text-sm text-white/75 md:mt-2 md:text-[#8d8d8d]">
        Enter the world of tailored luxury and premium drops.
      </p>

      <div className="mt-6 space-y-4 md:mt-4 md:space-y-3.5">
        <a className="mb-2 block" href="http://localhost:3000/api/auth/google"> <GoogleButton text="Sign up with Google" /></a>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-white/30 md:bg-black/15" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-white/70 md:text-[#a0a0a0]">
            or
          </span>
          <span className="h-px flex-1 bg-white/30 md:bg-black/15" />
        </div>

        <form className="space-y-4 md:space-y-3 font-semibold"
          onSubmit={submitHandler}
        >
          <InputField
            label="Username"
            value={form.username}
            onChange={onValueChange("username")}
            autoComplete="username"
            dense
          />
          <InputField
            label="Email"
            type="email"
            value={form.email}
            onChange={onValueChange("email")}
            autoComplete="email"
            dense
          />
          <InputField
            label="Contact"
            type="tel"
            value={form.contact}
            onChange={onValueChange("contact")}
            autoComplete="tel"
            dense
          />
          <InputField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={onValueChange("password")}
            autoComplete="new-password"
            dense
            actionLabel={showPassword ? <EyeOff size={16} strokeWidth={2.2} /> : <Eye size={16} strokeWidth={2.2} />}
            onActionClick={() => setShowPassword((current) => !current)}
          />

          <div className="flex items-center justify-between rounded-2xl border border-white/35 bg-black/15 px-4 py-2.5 md:border-black/10 md:bg-transparent md:py-2">
            <p className="text-sm text-white md:text-black">Register as Seller</p>
            <motion.button
              type="button"
              onClick={() => setIsSeller((current) => !current)}
              className={`relative h-7 w-12 rounded-full border transition ${isSeller
                  ? "border-black bg-black"
                  : "border-white/60 bg-white md:border-black/25"
                }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`absolute top-[2px] h-5 w-5 rounded-full ${isSeller ? "left-[24px] bg-white" : "left-[2px] bg-black"
                  }`}
              />
            </motion.button>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.01, opacity: 0.92 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-full bg-black px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-[#f8f8f8]"
          >
            Sign Up
          </motion.button>
        </form>
      </div>

      <p className="mt-6 text-sm text-white/75 md:mt-4 md:text-[#8f8f8f]">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-white underline decoration-white/40 underline-offset-4 md:text-black md:decoration-black/30"
        >
          Sign in
        </Link>
      </p>
    </AuthScene>
  );
};

export default Register;