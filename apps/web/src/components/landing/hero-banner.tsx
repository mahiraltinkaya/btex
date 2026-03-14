"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function HeroBanner() {
  const t = useTranslations("LandingPage.hero");

  return (
    <section className="relative flex min-h-[85vh] w-full items-center justify-center overflow-hidden">
      <Image
        src="/images/landing/hero-bg.png"
        alt="Concert venue with dramatic lighting"
        fill
        className="object-cover"
        priority
        quality={90}
      />
      <div className="absolute inset-0 backdrop-blur-[50px] bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/40 to-[#0a0a0a]" />
      <div className="relative z-10 flex flex-col items-center gap-6 px-4 text-center">
        <h1 className="max-w-4xl text-4xl font-extrabold uppercase tracking-wider text-white drop-shadow-2xl sm:text-5xl md:text-7xl lg:text-8xl">
          {t("headline")}
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg">
          {t("subheadline")}
        </p>
        <Link href="#events">
          <motion.button
            whileHover={{
              scale: 1.06,
              boxShadow: "0 0 30px rgba(230, 57, 70, 0.5)",
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="cursor-pointer rounded-full bg-[#e63946] px-8 py-3 text-base font-bold text-white shadow-lg shadow-[#e63946]/30 sm:px-10 sm:py-4 sm:text-lg"
          >
            {t("cta")}
          </motion.button>
        </Link>
        <div className="mt-6 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-white/40" />
          <span className="h-2 w-2 rounded-full bg-white/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e63946]" />
          <span className="h-2 w-2 rounded-full bg-white/40" />
          <span className="h-2 w-2 rounded-full bg-white/40" />
        </div>
      </div>
    </section>
  );
}
