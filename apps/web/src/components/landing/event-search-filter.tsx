"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Music, MapPin, CalendarDays } from "lucide-react";

export function EventSearchFilter() {
  const t = useTranslations("LandingPage.search");

  return (
    <div className="relative z-20 mx-auto -mt-24 w-full max-w-3xl px-4 sm:-mt-28">
      <div className="rounded-2xl border border-white/10 bg-[#1a1a1a]/90 p-6 shadow-2xl backdrop-blur-lg sm:p-8">
        <h2 className="mb-5 text-lg font-bold text-white sm:text-xl">
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Music className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <select
              className="w-full cursor-pointer appearance-none rounded-lg border border-white/10 bg-[#252525] py-3 pl-10 pr-8 text-sm text-white/80 transition-colors duration-200 hover:border-white/20 focus:border-[#e63946]/50 focus:outline-none"
              defaultValue=""
              aria-label={t("allGenres")}
            >
              <option value="">{t("allGenres")}</option>
              <option value="rock">Rock</option>
              <option value="pop">Pop</option>
              <option value="electronic">Electronic</option>
              <option value="hiphop">Hip-Hop</option>
              <option value="jazz">Jazz</option>
            </select>
            <ChevronDown />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <select
              className="w-full cursor-pointer appearance-none rounded-lg border border-white/10 bg-[#252525] py-3 pl-10 pr-8 text-sm text-white/80 transition-colors duration-200 hover:border-white/20 focus:border-[#e63946]/50 focus:outline-none"
              defaultValue=""
              aria-label={t("allLocations")}
            >
              <option value="">{t("allLocations")}</option>
              <option value="istanbul">Istanbul</option>
              <option value="dubai">Dubai</option>
              <option value="london">London</option>
              <option value="newyork">New York</option>
            </select>
            <ChevronDown />
          </div>

          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <select
              className="w-full cursor-pointer appearance-none rounded-lg border border-white/10 bg-[#252525] py-3 pl-10 pr-8 text-sm text-white/80 transition-colors duration-200 hover:border-white/20 focus:border-[#e63946]/50 focus:outline-none"
              defaultValue=""
              aria-label={t("allDates")}
            >
              <option value="">{t("allDates")}</option>
              <option value="today">Today</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="next-month">Next Month</option>
            </select>
            <ChevronDown />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="w-full cursor-pointer rounded-lg bg-[#e63946] py-3 text-sm font-bold text-white hover:bg-[#c5303c] hover:shadow-lg hover:shadow-[#e63946]/25"
          >
            {t("findEvents")}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function ChevronDown() {
  return (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
