import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthScene, GoogleButton, InputField } from "../components/AuthScene";
import { useAuth } from "../hooks/auth.hook";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const navigate=useNavigate()
  const { HandleLogin } = useAuth()

  const submitHandler = async (event) => {
    event.preventDefault()
    await HandleLogin({ email, password })
    navigate("/")
    setEmail("")
    setPassword("")
    setShowPassword(false)

  }

  return (
    <AuthScene imageSide="left" sceneOffset={-40}>
      <div className="mb-8 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/85 md:text-black/70">
          URBAN KNIFE
        </span>
        <span className="text-[11px] uppercase tracking-[0.2em] text-white/70 md:text-[#9a9a9a]">
          Login
        </span>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.5 }}
        className="text-4xl font-black uppercase leading-[0.9] tracking-[-0.04em] text-white sm:text-5xl md:text-black"
      >
        Welcome Back
      </motion.h1>
      <p className="mt-4 text-sm text-white/75 md:text-[#8d8d8d]">
        Sign in to continue your luxury curation journey.
      </p>

      <div className="mt-8 space-y-6">
        <a className="mb-2 block" href="http://localhost:3000/api/auth/google"> <GoogleButton text="Continue with Google" /></a>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-white/30 md:bg-black/15" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-white/70 md:text-[#a0a0a0]">
            or
          </span>
          <span className="h-px flex-1 bg-white/30 md:bg-black/15" />
        </div>

        <form className="space-y-6 font-semibold"
          onSubmit={submitHandler}
        >
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
          <InputField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            actionLabel={showPassword ? <EyeOff size={18} strokeWidth={2.2} /> : <Eye size={18} strokeWidth={2.2} />}
            onActionClick={() => setShowPassword((current) => !current)}
            rightElement={
              <Link
                to="/forget-password"
                className="font-semibold lowercase tracking-[0.1em] text-white/60  md:text-[#8d8d8d] "
              >
                Forget Password?
              </Link>
            }
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.01, opacity: 0.92 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-full bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#f8f8f8]"
          >
            Login
          </motion.button>
        </form>
      </div>

      <p className="mt-8 text-sm text-white/75 md:text-[#8f8f8f]">
        New to Urban Knife?{" "}
        <Link
          to="/register"
          className="font-semibold text-white underline decoration-white/40 underline-offset-4 md:text-black md:decoration-black/30"
        >
          Create account
        </Link>
      </p>
    </AuthScene>
  );
};

export default Login;
