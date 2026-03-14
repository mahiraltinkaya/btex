import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const t = await getTranslations("AuthPage.layout");
  return (
    <div className="relative flex min-h-screen flex-col bg-[#0a0a0a] lg:flex-row">
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden lg:flex">
        <Image
          src="/images/landing/hero-bg.png"
          alt={t("heroAlt")}
          fill
          className="object-cover"
          priority
          quality={80}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a]/80 via-[#0a0a0a]/60 to-[#e63946]/20 backdrop-blur-[50px]" />
        <div className="relative z-10 flex flex-col items-center gap-4 px-12 text-center">
          <Link
            href="/"
            className="text-4xl font-extrabold tracking-tight text-white"
          >
            B<span className="text-[#e63946]">TEX</span>
          </Link>
          <p className="max-w-sm text-base leading-relaxed text-white/60">
            {t("tagline")}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white/30" />
            <span className="h-2 w-2 rounded-full bg-white/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#e63946]" />
            <span className="h-2 w-2 rounded-full bg-white/30" />
            <span className="h-2 w-2 rounded-full bg-white/30" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between px-5 py-4 lg:px-8 lg:py-6">
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tight text-white"
          >
            B<span className="text-[#e63946]">TEX</span>
          </Link>
        </header>
        <div className="flex flex-1 items-center justify-center px-5 pb-8 lg:px-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
