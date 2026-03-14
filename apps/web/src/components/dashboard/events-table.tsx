"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Pencil,
  Trash2,
  Ticket,
  CalendarOff,
  Loader2,
  Users,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import { reserveByEvent } from "@/actions/booking";
import { deleteEvent } from "@/actions/events";
import { useConfirmation } from "@/context/confirmation-provider";
import { EditEventDialog } from "@/components/dashboard/edit-event-dialog";
import type { Event } from "@/types";
import { EventType } from "@/types";

interface EventsTableProps {
  events: Event[];
  role?: "ADMIN" | "CUSTOMER";
}

const TYPE_BADGES: Record<EventType, { bg: string; text: string }> = {
  [EventType.CONCERT]: { bg: "bg-purple-500/20", text: "text-purple-300" },
  [EventType.FESTIVAL]: { bg: "bg-orange-500/20", text: "text-orange-300" },
  [EventType.CONFERENCE]: { bg: "bg-blue-500/20", text: "text-blue-300" },
  [EventType.OTHER]: { bg: "bg-white/10", text: "text-white/60" },
};

const EVENT_IMAGES: Record<EventType, string> = {
  [EventType.CONCERT]: "/images/events/concert.png",
  [EventType.FESTIVAL]: "/images/events/festival.png",
  [EventType.CONFERENCE]: "/images/events/conference.png",
  [EventType.OTHER]: "/images/events/default.png",
};

export function EventsTable({ events, role = "ADMIN" }: EventsTableProps) {
  const t = useTranslations("Dashboard.eventsTable");
  const tConfirm = useTranslations("Dashboard.confirmations");
  const queryClient = useQueryClient();
  const { confirm } = useConfirmation();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const reserveMutation = useMutation({
    mutationFn: (eventId: string) => reserveByEvent(eventId),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["eventMonitors"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleReserve = async (eventId: string, eventName: string) => {
    const confirmed = await confirm(
      tConfirm("reserveTitle"),
      tConfirm("reserveMessage", { event: eventName }),
      {
        confirmText: tConfirm("reserveConfirm"),
        cancelText: tConfirm("cancelBtn"),
      },
    );
    if (confirmed) {
      reserveMutation.mutate(eventId);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (eventId: string) => deleteEvent(eventId),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["eventMonitors"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = async (eventId: string, eventName: string) => {
    const confirmed = await confirm(
      tConfirm("deleteTitle"),
      tConfirm("deleteMessage", { event: eventName }),
      {
        confirmText: tConfirm("deleteConfirm"),
        cancelText: tConfirm("cancelBtn"),
        variant: "destructive",
      },
    );
    if (confirmed) {
      deleteMutation.mutate(eventId);
    }
  };

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] py-16 text-center backdrop-blur-xl">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-[#e63946]/5 blur-xl" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
            <CalendarOff className="h-8 w-8 text-white/20" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-white/50">{t("empty")}</p>
          <p className="text-xs text-white/25">{t("emptyHint")}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => {
          const badge = TYPE_BADGES[event.type];
          const imageSrc = EVENT_IMAGES[event.type];
          const isPendingThis =
            reserveMutation.isPending && reserveMutation.variables === event.id;
          return (
            <div
              key={event.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-black/20"
            >
              <div className="absolute inset-0 h-80 w-full overflow-hidden cursor-pointer-none">
                <Image
                  src={imageSrc}
                  alt={event.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105 "
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md ${badge.bg} ${badge.text}`}
                  >
                    {event.type}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium backdrop-blur-md ${
                      event.isActive
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    <span
                      className={`mr-1 h-1.5 w-1.5 rounded-full ${
                        event.isActive ? "bg-emerald-400" : "bg-red-400"
                      }`}
                    />
                    {event.isActive ? t("active") : t("inactive")}
                  </span>
                </div>
              </div>
              <div className="h-48"></div>
              <div className="relative border-t border-white/5 bg-white/[0.03] p-4 backdrop-blur-xl">
                <h3 className="truncate text-sm font-semibold text-white/90">
                  {event.name}
                </h3>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-white/30" />
                    <span className="text-xs text-white/40">
                      {event.capacity} {t("seats")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-white/30" />
                    <span className="text-xs text-white/40">
                      {event.eventDate
                        ? new Date(event.eventDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )
                        : "TBA"}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                  <span className="text-base font-bold text-white/90">
                    ${event.amount}
                  </span>

                  <div className="flex items-center gap-1">
                    {role === "ADMIN" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setEditingEvent(event)}
                          className="cursor-pointer rounded-lg p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                          title={t("edit")}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={
                            deleteMutation.isPending &&
                            deleteMutation.variables === event.id
                          }
                          onClick={() => handleDelete(event.id, event.name)}
                          className="cursor-pointer rounded-lg p-2 text-white/40 transition-colors hover:bg-red-500/10 hover:text-[#e63946] disabled:cursor-not-allowed disabled:opacity-30"
                          title={t("delete")}
                        >
                          {deleteMutation.isPending &&
                          deleteMutation.variables === event.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        disabled={isPendingThis || !event.isActive}
                        onClick={() => handleReserve(event.id, event.name)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#e63946]/90 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg shadow-[#e63946]/20 transition-all hover:bg-[#e63946] disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        {isPendingThis ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <>
                            <Ticket className="h-3.5 w-3.5" />
                            {t("reserve")}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <EditEventDialog
        event={editingEvent}
        open={!!editingEvent}
        onOpenChange={(open) => {
          if (!open) setEditingEvent(null);
        }}
      />
    </>
  );
}
