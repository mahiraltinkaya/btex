"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { TicketsTable } from "@/components/dashboard/tickets-table";
import { Pagination } from "@/components/dashboard/pagination";
import { getAllTickets, getAllEvents } from "@/actions/events";
import { useTicketStore } from "@/stores/ticket-store";
import { useEventStore } from "@/stores/event-store";

const TICKETS_PER_PAGE = 10;

export default function TicketsPage() {
  const t = useTranslations("Dashboard.ticketsPage");
  const setTickets = useTicketStore((s) => s.setTickets);
  const storeTickets = useTicketStore((s) => s.tickets);
  const storeEvents = useEventStore((s) => s.events);

  const [page, setPage] = useState(1);
  const [selectedEventId, setSelectedEventId] = useState<string>("all");

  // Fetch events for filter dropdown
  const eventsQuery = useQuery({
    queryKey: ["events", "filter-options"],
    queryFn: () => getAllEvents(1, 100),
  });

  const eventId = selectedEventId === "all" ? undefined : selectedEventId;

  const ticketsQuery = useQuery({
    queryKey: ["tickets", page, eventId],
    queryFn: () => getAllTickets(page, TICKETS_PER_PAGE, eventId),
  });

  useEffect(() => {
    if (ticketsQuery.data?.data) {
      setTickets(ticketsQuery.data.data);
    }
  }, [ticketsQuery.data, setTickets]);

  const tickets = ticketsQuery.data?.data ?? storeTickets;
  const totalPages = ticketsQuery.data?.totalPages ?? 1;
  const eventOptions = eventsQuery.data?.data ?? storeEvents;

  function handleEventFilter(newEventId: string) {
    setSelectedEventId(newEventId);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            {t("title")}
          </h2>
          <p className="mt-1 text-sm text-white/40">{t("subtitle")}</p>
        </div>
        {/* Event Filter */}
        {eventOptions.length > 0 && (
          <div className="relative self-start">
            <select
              value={selectedEventId}
              onChange={(e) => handleEventFilter(e.target.value)}
              className="h-10 cursor-pointer appearance-none rounded-xl border border-white/10 bg-white/[0.03] py-0 pr-10 pl-4 text-sm font-medium text-white/70 backdrop-blur-xl transition-colors hover:border-white/20 hover:bg-white/[0.06] focus:border-[#e63946]/50 focus:ring-1 focus:ring-[#e63946]/30 focus:outline-none"
            >
              <option value="all" className="bg-[#0a0a0b] text-white">
                {t("allEvents")}
              </option>
              {eventOptions.map((event) => (
                <option
                  key={event.id}
                  value={event.id}
                  className="bg-[#0a0a0b] text-white"
                >
                  {event.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-white/30" />
          </div>
        )}
      </div>

      {ticketsQuery.isLoading ? (
        <div className="h-[400px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
      ) : ticketsQuery.error ? (
        <div className="flex items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 py-12">
          <p className="text-sm text-red-400">{ticketsQuery.error.message}</p>
        </div>
      ) : (
        <TicketsTable
          tickets={tickets.sort((a, b) =>
            a.seatNumber - b.seatNumber,
          )}
        />
      )}

      {!ticketsQuery.isLoading && !ticketsQuery.error && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
