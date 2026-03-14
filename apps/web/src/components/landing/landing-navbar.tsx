"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Search, Globe } from "lucide-react";

export function LandingNavbar() {
  const t = useTranslations("LandingPage.nav");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-1">
          <span className="text-xl font-extrabold tracking-tight text-white">
            B<span className="text-[#e63946]">TEX</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="#"
            className="text-sm font-medium text-white/80 transition-colors duration-200 hover:text-white"
          >
            {t("allEvents")}
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-white/80 transition-colors duration-200 hover:text-white"
          >
            {t("festival")}
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-white/80 transition-colors duration-200 hover:text-white"
          >
            {t("comedy")}
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-white/80 transition-colors duration-200 hover:text-white"
          >
            {t("concertWeek")}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="cursor-pointer rounded-full p-2 text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-full p-2 text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white"
            aria-label="Language"
          >
            <Globe className="h-5 w-5" />
          </button>
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer rounded-full border border-white/20 bg-transparent px-5 py-1.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10"
            >
              {t("register")}
            </motion.button>
          </Link>
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer rounded-full bg-[#e63946] px-5 py-1.5 text-sm font-semibold text-white hover:bg-[#c5303c]"
            >
              {t("logIn")}
            </motion.button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
