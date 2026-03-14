"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, CalendarDays, Ticket, X } from "lucide-react";

interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { key: "dashboard" as const, href: "/dashboard", icon: LayoutDashboard },
  { key: "events" as const, href: "/events", icon: CalendarDays },
  { key: "tickets" as const, href: "/tickets", icon: Ticket },
];

export function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("Dashboard.nav");

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-6">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-white"
        >
          B<span className="text-[#e63946]">TEX</span>
        </Link>
        {/* Mobile close */}
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="mt-4 flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={onClose}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#e63946]/10 text-[#e63946]"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] transition-colors duration-200 ${
                  isActive
                    ? "text-[#e63946]"
                    : "text-white/40 group-hover:text-white/70"
                }`}
              />
              {t(item.key)}
            </Link>
          );
        })}
      </nav>

      {/* Bottom branding */}
      <div className="border-t border-white/5 px-6 py-4">
        <p className="text-[10px] tracking-wide text-white/20">© 2026 BTEX</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-white/[0.03] backdrop-blur-xl lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
