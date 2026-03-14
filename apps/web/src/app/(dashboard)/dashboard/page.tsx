"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, DollarSign, TrendingUp, Ticket } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { EventsTable } from "@/components/dashboard/events-table";
import { getEventMonitor } from "@/actions/monitor";
import { getAllEvents } from "@/actions/events";
import { useAuth } from "@/context/auth-provider";
import { useEventStore } from "@/stores/event-store";
import type { EventMonitor } from "@/types";

const fmt = new Intl.NumberFormat("en-US");

function computeStats(monitors: EventMonitor[]) {
  const totalEvents = monitors.length;
  const totalRevenue = monitors.reduce((sum, m) => sum + m.totalRevenue, 0);
  const totalSold = monitors.reduce((sum, m) => sum + m.soldTickets, 0);
  const avgOccupancy =
    totalEvents > 0
      ? Math.round(
          monitors.reduce((sum, m) => sum + m.occupancyRate, 0) / totalEvents,
        )
      : 0;
  return { totalEvents, totalRevenue, totalSold, avgOccupancy };
}

export default function DashboardPage() {
  const t = useTranslations("Dashboard.overview");
  const { user } = useAuth();
  const setEvents = useEventStore((s) => s.setEvents);
  const storeEvents = useEventStore((s) => s.events);

  const monitorsQuery = useQuery({
    queryKey: ["eventMonitors"],
    queryFn: getEventMonitor,
  });

  const eventsQuery = useQuery({
    queryKey: ["events", "dashboard"],
    queryFn: () => getAllEvents(1, 5),
  });

  useEffect(() => {
    if (eventsQuery.data?.data) {
      setEvents(eventsQuery.data.data);
    }
  }, [eventsQuery.data, setEvents]);

  const events = eventsQuery.data?.data ?? storeEvents;
  const stats = computeStats(monitorsQuery.data ?? []);
  const isLoading = monitorsQuery.isLoading || eventsQuery.isLoading;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[120px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
            />
          ))
        ) : (
          <>
            <StatCard
              icon={CalendarDays}
              label={t("totalEvents")}
              value={String(stats.totalEvents)}
            />
            <StatCard
              icon={DollarSign}
              label={t("totalRevenue")}
              value={`$${fmt.format(stats.totalRevenue)}`}
            />
            <StatCard
              icon={TrendingUp}
              label={t("occupancyRate")}
              value={`${stats.avgOccupancy}%`}
            />
            <StatCard
              icon={Ticket}
              label={t("soldTickets")}
              value={fmt.format(stats.totalSold)}
            />
          </>
        )}
      </div>

      {/* Recent Events */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">
          {t("recentEvents")}
        </h2>
        {eventsQuery.isLoading ? (
          <div className="h-[300px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
        ) : eventsQuery.error ? (
          <div className="flex items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 py-12">
            <p className="text-sm text-red-400">{eventsQuery.error.message}</p>
          </div>
        ) : (
          <EventsTable
            events={events.slice(0, 5)}
            role={user?.role ?? "CUSTOMER"}
          />
        )}
      </div>
    </div>
  );
}
