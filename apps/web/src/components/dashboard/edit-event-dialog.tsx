"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Loader2,
  Users,
  FileText,
  CalendarDays,
  Type,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateEvent } from "@/actions/events";
import type { Event } from "@/types";
import { EventType } from "@/types";

interface EditEventDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EVENT_IMAGES: Record<EventType, string> = {
  [EventType.CONCERT]: "/images/events/concert.png",
  [EventType.FESTIVAL]: "/images/events/festival.png",
  [EventType.CONFERENCE]: "/images/events/conference.png",
  [EventType.OTHER]: "/images/events/default.png",
};

export function EditEventDialog({
  event,
  open,
  onOpenChange,
}: EditEventDialogProps) {
  const t = useTranslations("Dashboard.editEventDialog");
  const queryClient = useQueryClient();

  const [prevEventId, setPrevEventId] = useState<string | null>(null);
  const [name, setName] = useState<string>(event?.name ?? "");
  const [type, setType] = useState<EventType>(event?.type ?? EventType.OTHER);
  const [amount, setAmount] = useState(String(event?.amount ?? ""));
  const [description, setDescription] = useState(event?.description ?? "");
  const [capacity, setCapacity] = useState(String(event?.capacity ?? ""));
  const [eventDate, setEventDate] = useState(
    event?.eventDate ? event.eventDate.slice(0, 16) : "",
  );

  const currentEventId = event?.id ?? null;
  if (open && currentEventId && currentEventId !== prevEventId) {
    setPrevEventId(currentEventId);
    setName(event!.name);
    setType(event!.type);
    setAmount(String(event!.amount));
    setDescription(event!.description);
    setCapacity(String(event!.capacity));
    setEventDate(event!.eventDate ? event!.eventDate.slice(0, 16) : "");
  }

  const mutation = useMutation({
    mutationFn: () =>
      updateEvent({
        id: event!.id,
        name,
        type,
        amount: parseFloat(amount),
        description,
        capacity: parseInt(capacity, 10),
        eventDate: eventDate || null,
      }),
    onSuccess: (data) => {
      toast.success(data.message);
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["eventMonitors"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (!event) return null;

  const imageSrc = EVENT_IMAGES[type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border-white/10 bg-[#0a0a0b]/95 p-0 backdrop-blur-2xl sm:max-w-[480px]">
        <div className="relative h-40 w-full">
          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-cover"
            sizes="480px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/60 to-transparent" />
          <div className="absolute right-0 bottom-0 left-0 px-6 pb-4">
            <DialogHeader className="p-0">
              <DialogTitle className="text-lg font-semibold text-white">
                {name || event.name}
              </DialogTitle>
            </DialogHeader>
            <p className="mt-0.5 text-xs text-white/40">
              {t("subtitle", { type })}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 pt-2 pb-6">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/40">
                <Type className="h-3.5 w-3.5" />
                {t("name")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/20 focus:border-[#e63946]/50 focus:ring-1 focus:ring-[#e63946]/30 focus:outline-none"
                placeholder={t("namePlaceholder")}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/40">
                <Sparkles className="h-3.5 w-3.5" />
                {t("type")}
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EventType)}
                className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white focus:border-[#e63946]/50 focus:ring-1 focus:ring-[#e63946]/30 focus:outline-none [color-scheme:dark]"
              >
                {Object.values(EventType).map((et) => (
                  <option
                    key={et}
                    value={et}
                    className="bg-[#0a0a0b] text-white"
                  >
                    {et}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/40">
              <FileText className="h-3.5 w-3.5" />
              {t("description")}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#e63946]/50 focus:ring-1 focus:ring-[#e63946]/30 focus:outline-none"
              placeholder={t("descriptionPlaceholder")}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/40">
                <DollarSign className="h-3.5 w-3.5" />
                {t("price")}
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={0}
                step="0.01"
                className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 font-mono text-sm text-white placeholder:text-white/20 focus:border-[#e63946]/50 focus:ring-1 focus:ring-[#e63946]/30 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/40">
                <Users className="h-3.5 w-3.5" />
                {t("capacity")}
              </label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                min={1}
                max={10000}
                className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 font-mono text-sm text-white placeholder:text-white/20 focus:border-[#e63946]/50 focus:ring-1 focus:ring-[#e63946]/30 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/40">
                <CalendarDays className="h-3.5 w-3.5" />
                {t("eventDate")}
              </label>
              <input
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/20 focus:border-[#e63946]/50 focus:ring-1 focus:ring-[#e63946]/30 focus:outline-none [color-scheme:dark]"
              />
            </div>
          </div>

          <p className="text-[10px] text-white/20">{t("capacityHint")}</p>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 cursor-pointer border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.06] hover:text-white"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 cursor-pointer bg-[#e63946] text-white shadow-lg shadow-[#e63946]/30 hover:bg-[#c5303c]"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t("save")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
