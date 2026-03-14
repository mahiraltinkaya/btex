"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type EventCardProps = {
  name: string;
  venue: string;
  imageSrc: string;
};

export function EventCard({ name, venue, imageSrc }: EventCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group cursor-pointer"
    >
      <div className="relative mx-auto mb-4 flex h-56 w-56 items-center justify-center overflow-hidden rounded-full sm:h-64 sm:w-64">
        {/* Vinyl record background ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1a1a1a] via-[#0d0d0d] to-[#1a1a1a] shadow-inner">
          <div className="absolute inset-3 rounded-full border border-white/5" />
          <div className="absolute inset-6 rounded-full border border-white/5" />
          <div className="absolute inset-9 rounded-full border border-white/5" />
          <div className="absolute inset-12 rounded-full border border-white/5" />
        </div>

        {/* Artist image */}
        <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-[#1a1a1a] shadow-xl transition-transform duration-500 group-hover:scale-105 sm:h-44 sm:w-44">
          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 160px, 176px"
          />
        </div>

        {/* Hover red glow ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-br from-[#e63946]/40 via-transparent to-[#e63946]/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "2px",
          }}
        />
      </div>

      <div className="text-center">
        <h3 className="text-lg font-bold text-white transition-colors duration-200 group-hover:text-[#e63946] sm:text-xl">
          {name}
        </h3>
        <p className="mt-1 text-sm text-white/50">
          {venue}
        </p>
      </div>
    </motion.div>
  );
}
