"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, Search, LogOut, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { logout } from "@/actions/auth";

interface DashboardHeaderProps {
  onMenuToggle: () => void;
}

function getPageTitle(pathname: string, t: (key: string) => string): string {
  if (pathname.startsWith("/events")) return t("events");
  if (pathname.startsWith("/tickets")) return t("tickets");
  return t("dashboard");
}

export function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const tNav = useTranslations("Dashboard.nav");
  const tHeader = useTranslations("Dashboard.header");
  const pageTitle = getPageTitle(pathname, tNav);
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      router.push("/");
    },
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-white/10 bg-white/[0.03] px-4 backdrop-blur-xl sm:px-6">
      <button
        type="button"
        onClick={onMenuToggle}
        className="cursor-pointer rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
        {pageTitle}
      </h1>

      <div className="flex-1" />
      <div className="hidden max-w-xs flex-1 sm:block">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
          <Input
            type="search"
            placeholder={tHeader("search")}
            className="h-9 border-white/10 bg-white/5 pl-9 text-sm text-white placeholder:text-white/25 focus-visible:border-[#e63946]/40 focus-visible:ring-[#e63946]/10"
          />
        </div>
      </div>

      <motion.button
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
        whileHover={{
          scale: 1.06,
          boxShadow: "0 0 20px rgba(230, 57, 70, 0.3)",
        }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/50 transition-colors duration-200 hover:bg-white/5 hover:text-white/80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {logoutMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">{tHeader("logout")}</span>
      </motion.button>
    </header>
  );
}
