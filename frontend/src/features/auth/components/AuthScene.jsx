import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const AUTH_IMAGE_NAMES = [
  "20 Stylish Spring Outfits That Will Instantly Upgrade Your Look.jpg",
  "Classy Career Outfit ?? _ Elegant Office Style Inspiration.jpg",
  "download (1).jpg",
  "download (1).webp",
  "download (2).jpg",
  "download (2).webp",
  "download.jpg",
  "download.webp",
  "Dreamy Pastel Outfit Inspiration ?? Soft & Feminine Style.jpg",
  "urbanaes1.webp",
  "urbanaes2.jpg"
];

const AUTH_IMAGES = AUTH_IMAGE_NAMES.map(
  (imageName) => `/photos/${encodeURIComponent(imageName)}`,
);

export const AuthScene = ({
  children,
  imageSide = "left",
  sceneOffset = 0,
  backgroundImage,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadAllImages = async () => {
      const imagesToLoad = backgroundImage ? [backgroundImage] : AUTH_IMAGES;
      const results = await Promise.all(
        imagesToLoad.map(
          (imageUrl) =>
            new Promise((resolve) => {
              const image = new Image();
              image.onload = () => resolve(imageUrl);
              image.onerror = () => resolve(null);
              image.src = imageUrl;
            }),
        ),
      );

      if (isMounted) {
        const validImages = results.filter(Boolean);
        setLoadedImages(validImages.length > 0 ? validImages : imagesToLoad);
      }
    };

    loadAllImages();

    return () => {
      isMounted = false;
    };
  }, [backgroundImage]);

  useEffect(() => {
    if (loadedImages.length < 2 || backgroundImage) return undefined;

    const slider = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % loadedImages.length);
    }, 3500);

    return () => window.clearInterval(slider);
  }, [loadedImages, backgroundImage]);

  useEffect(() => {
    if (activeIndex >= loadedImages.length && loadedImages.length > 0) {
      setActiveIndex(0);
    }
  }, [activeIndex, loadedImages]);

  const imageIsLeft = imageSide === "left";
  const currentImage =
    backgroundImage ||
    (loadedImages.length > 0 ? loadedImages[activeIndex] : AUTH_IMAGES[0]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black text-black">
      <div className="absolute inset-0">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={currentImage}
            className="absolute inset-0 bg-cover bg-center md:blur-[2px] md:scale-[1.03]"
            style={{ backgroundImage: `url('${currentImage}')` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          />
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 bg-black/40 md:bg-black/24" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1280px] items-center px-4 py-8 sm:px-8 md:py-4 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16, x: sceneOffset }}
          animate={{
            opacity: 1,
            y: 0,
            x: 0,
          }}
          transition={{
            opacity: { duration: 0.7, ease: "easeOut" },
            x: { duration: 0.7, ease: "easeOut" },
            y: { duration: 0.7, ease: "easeOut" },
          }}
          className="grid w-full md:grid-cols-2"
        >
          <div
            className={`relative hidden min-h-[620px] overflow-hidden md:block ${imageIsLeft ? "order-1" : "order-2"
              }`}
          >
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={`desktop-${currentImage}`}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${currentImage}')` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-black/22" />
          </div>

          <div
            className={`relative order-1 md:min-h-[620px] ${imageIsLeft ? "md:order-2" : "md:order-1"
              }`}
          >
            <div className="absolute inset-0 md:bg-[#f8f8f8]" />
            <div className="absolute inset-0 md:hidden" />
            <div className="relative p-6 sm:p-8 md:p-8 lg:p-10">{children}</div>
          </div>
        </motion.div>
      </main>
    </section>
  );
};

export const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  dense = false,
  actionLabel,
  onActionClick,
  rightElement,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-[#d7d7d7] md:text-[#7a7a7a]">
        <span>{label}</span>
        {rightElement}
      </div>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full border-0 bg-transparent px-0 ${dense ? "py-1.5" : "py-2"
            } ${actionLabel ? "pr-14" : ""} text-[15px] text-white outline-none placeholder:text-[#d0d0d0] transition md:text-black md:placeholder:text-[#a9a9a9] ${isFocused ? "placeholder:opacity-60" : "placeholder:opacity-100"
            }`}
          placeholder={label}
        />
        {actionLabel && onActionClick ? (
          <button
            type="button"
            onClick={onActionClick}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.15em] text-white/75 transition hover:text-white md:text-black/60 md:hover:text-black"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
      <div className="h-px w-full bg-white/35 md:bg-black/15">
        <motion.div
          className="h-full bg-white md:bg-black"
          initial={{ width: "0%" }}
          animate={{ width: isFocused ? "100%" : "0%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </label>
  );
};

export const GoogleButton = ({ text }) => (
  <motion.button
    type="button"
    whileHover={{ scale: 1.01, opacity: 0.96 }}
    whileTap={{ scale: 0.98 }}
    className="flex h-11 w-full items-center justify-center gap-3 rounded-md border border-[#747775] bg-white px-4 text-[14px] font-medium text-[#1f1f1f] transition"
    style={{ fontFamily: "Roboto, Arial, sans-serif" }}
  >
    <svg
      aria-hidden="true"
      className="h-[18px] w-[18px]"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.653 32.657 29.193 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.062 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.062 6.053 29.27 4 24 4c-7.682 0-14.346 4.337-17.694 10.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.168 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.147 35.091 26.714 36 24 36c-5.172 0-9.623-3.328-11.284-7.946l-6.522 5.025C9.5 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.05 12.05 0 01-4.084 5.571l.003-.002 6.19 5.238C37.049 39.139 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
    {text}
  </motion.button>
);
