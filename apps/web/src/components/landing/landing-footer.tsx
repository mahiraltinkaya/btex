"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function LandingFooter() {
  const t = useTranslations("LandingPage.footer");

  return (
    <footer className="w-full border-t border-white/5 bg-[#050505] px-4 py-10 sm:py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col items-center gap-3 sm:items-start">
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tight text-white"
          >
            B<span className="text-[#e63946]">TEX</span>
          </Link>
          <p className="text-xs text-white/30">{t("copyright")}</p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-end">
          <Link
            href="#"
            className="text-sm text-white/50 transition-colors duration-200 hover:text-white"
          >
            {t("about")}
          </Link>
          <Link
            href="#"
            className="text-sm text-white/50 transition-colors duration-200 hover:text-white"
          >
            {t("contact")}
          </Link>
          <Link
            href="#"
            className="text-sm text-white/50 transition-colors duration-200 hover:text-white"
          >
            {t("terms")}
          </Link>
          <Link
            href="#"
            className="text-sm text-white/50 transition-colors duration-200 hover:text-white"
          >
            {t("privacy")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
