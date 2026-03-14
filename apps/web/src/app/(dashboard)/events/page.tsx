"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { EventsTable } from "@/components/dashboard/events-table";
import { CreateEventDialog } from "@/components/dashboard/create-event-dialog";
import { Pagination } from "@/components/dashboard/pagination";
import { getAllEvents } from "@/actions/events";
import { useAuth } from "@/context/auth-provider";
import { useEventStore } from "@/stores/event-store";

const EVENTS_PER_PAGE = 10;

export default function EventsPage() {
  const t = useTranslations("Dashboard.eventsPage");
  const { user } = useAuth();
  const role = user?.role ?? "CUSTOMER";
  const setEvents = useEventStore((s) => s.setEvents);
  const storeEvents = useEventStore((s) => s.events);

  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const eventsQuery = useQuery({
    queryKey: ["events", page],
    queryFn: () => getAllEvents(page, EVENTS_PER_PAGE),
  });

  useEffect(() => {
    if (eventsQuery.data?.data) {
      setEvents(eventsQuery.data.data);
    }
  }, [eventsQuery.data, setEvents]);

  const events = eventsQuery.data?.data ?? storeEvents;
  const totalPages = eventsQuery.data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            {t("title")}
          </h2>
          <p className="mt-1 text-sm text-white/40">{t("subtitle")}</p>
        </div>
        {role === "ADMIN" && (
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex h-10 cursor-pointer items-center gap-2 self-start rounded-xl bg-[#e63946] px-4 text-sm font-semibold text-white shadow-lg shadow-[#e63946]/30 transition-all duration-200 hover:bg-[#c5303c] hover:shadow-[0_0_30px_rgba(230,57,70,0.5)] active:scale-95"
          >
            <Plus className="h-4 w-4" />
            {t("createEvent")}
          </button>
        )}
      </div>
      {eventsQuery.isLoading ? (
        <div className="flex h-[400px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="flex items-end gap-[5px]">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="inline-block w-[4px] rounded-full bg-[#e63946]"
                style={{
                  animation: `musicWave 1s ease-in-out ${i * 0.12}s infinite alternate`,
                }}
              />
            ))}
          </div>
        </div>
      ) : eventsQuery.error ? (
        <div className="flex items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 py-12">
          <p className="text-sm text-red-400">{eventsQuery.error.message}</p>
        </div>
      ) : (
        <EventsTable events={events} role={role} />
      )}
      {!eventsQuery.isLoading && !eventsQuery.error && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Create Event Dialog */}
      <CreateEventDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
