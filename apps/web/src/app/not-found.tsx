"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-5">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex max-w-md flex-col items-center text-center"
      >
        {/* 404 Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.15,
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className="mb-6"
        >
          <span className="text-8xl font-extrabold tracking-tighter text-[#e63946] sm:text-9xl">
            404
          </span>
        </motion.div>

        {/* Title */}
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Page Not Found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/50 sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/">
            <motion.button
              whileHover={{
                scale: 1.06,
                boxShadow: "0 0 30px rgba(230, 57, 70, 0.5)",
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#e63946] px-6 text-sm font-semibold text-white shadow-lg shadow-[#e63946]/30 transition-colors duration-200 hover:bg-[#c5303c]"
            >
              <Home className="h-4 w-4" />
              Go Home
            </motion.button>
          </Link>
          <motion.button
            onClick={() => window.history.back()}
            whileHover={{
              scale: 1.06,
              boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </motion.button>
        </div>
      </motion.div>

      {/* BTEX branding */}
      <div className="absolute bottom-8">
        <span className="text-sm font-extrabold tracking-tight text-white/20">
          B<span className="text-[#e63946]/30">TEX</span>
        </span>
      </div>
    </main>
  );
}
