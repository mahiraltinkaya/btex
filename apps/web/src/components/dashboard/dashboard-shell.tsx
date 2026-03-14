"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import Image from "next/image";

export function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex h-screen bg-[#0a0a0a]">
      <Image
        src="/images/landing/hero-bg.png"
        alt="Concert venue with dramatic lighting"
        fill
        className="object-cover"
        priority
        quality={90}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/40 to-[#0a0a0a] backdrop-blur-[50px]" />
      <DashboardSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <DashboardHeader onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-16">
          {children}
        </main>
      </div>
    </div>
  );
}
