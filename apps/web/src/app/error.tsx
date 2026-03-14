"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-5">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex max-w-md flex-col items-center text-center"
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#e63946]/10">
          <AlertTriangle className="h-10 w-10 text-[#e63946]" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/50 sm:text-base">
          An unexpected error occurred. Please try again or return to the home
          page.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <motion.button
            onClick={reset}
            whileHover={{
              scale: 1.06,
              boxShadow: "0 0 30px rgba(230, 57, 70, 0.5)",
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#e63946] px-6 text-sm font-semibold text-white shadow-lg shadow-[#e63946]/30 transition-colors duration-200 hover:bg-[#c5303c]"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </motion.button>
          <Link href="/">
            <motion.button
              whileHover={{
                scale: 1.06,
                boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10"
            >
              <Home className="h-4 w-4" />
              Go Home
            </motion.button>
          </Link>
        </div>
      </motion.div>

      <div className="absolute bottom-8">
        <span className="text-sm font-extrabold tracking-tight text-white/20">
          B<span className="text-[#e63946]/30">TEX</span>
        </span>
      </div>
    </main>
  );
}
