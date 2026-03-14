"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Loader2,
  FileText,
  Users,
  CalendarDays,
  DollarSign,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createEvent } from "@/actions/events";
import { EventType } from "@/types";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EVENT_IMAGES: Record<EventType, string> = {
  [EventType.CONCERT]: "/images/events/concert.png",
  [EventType.FESTIVAL]: "/images/events/festival.png",
  [EventType.CONFERENCE]: "/images/events/conference.png",
  [EventType.OTHER]: "/images/events/default.png",
};

const EVENT_TYPES = [
  EventType.CONCERT,
  EventType.FESTIVAL,
  EventType.CONFERENCE,
  EventType.OTHER,
] as const;

export function CreateEventDialog({
  open,
  onOpenChange,
}: CreateEventDialogProps) {
  const t = useTranslations("Dashboard.createEventDialog");
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<EventType>(EventType.CONCERT);
  const [amount, setAmount] = useState("");
  const [capacity, setCapacity] = useState("50");
  const [eventDate, setEventDate] = useState("");

  const imageSrc = EVENT_IMAGES[type];

  const resetForm = () => {
    setName("");
    setDescription("");
    setType(EventType.CONCERT);
    setAmount("");
    setCapacity("50");
    setEventDate("");
  };

  const mutation = useMutation({
    mutationFn: () =>
      createEvent({
        name,
        description,
        type,
        amount: parseFloat(amount),
        capacity: parseInt(capacity, 10),
        eventDate: eventDate || null,
      }),
    onSuccess: (data) => {
      toast.success(data.message);
      resetForm();
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border-white/10 bg-[#0a0a0b]/95 p-0 backdrop-blur-2xl sm:max-w-[480px]">
        <div className="relative h-36 w-full">
          <Image
            src={imageSrc}
            alt={name || "New Event"}
            fill
            className="object-cover transition-all duration-500"
            sizes="480px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/60 to-transparent" />
          <div className="absolute right-0 bottom-0 left-0 px-6 pb-4">
            <DialogHeader className="p-0">
              <DialogTitle className="text-lg font-semibold text-white">
                {t("title")}
              </DialogTitle>
            </DialogHeader>
            <p className="mt-0.5 text-xs text-white/40">{t("subtitle")}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 pt-1 pb-6">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/40">
              <Tag className="h-3.5 w-3.5" />
              {t("name")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/20 focus:border-[#e63946]/50 focus:ring-1 focus:ring-[#e63946]/30 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 text-xs font-medium text-white/40">
              {t("type")}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {EVENT_TYPES.map((et) => (
                <button
                  key={et}
                  type="button"
                  onClick={() => setType(et)}
                  className={`cursor-pointer rounded-xl border px-2 py-2 text-[11px] font-semibold transition-all ${
                    type === et
                      ? "border-[#e63946]/50 bg-[#e63946]/10 text-[#e63946]"
                      : "border-white/10 bg-white/[0.03] text-white/40 hover:border-white/20 hover:text-white/60"
                  }`}
                >
                  {et}
                </button>
              ))}
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
              rows={2}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#e63946]/50 focus:ring-1 focus:ring-[#e63946]/30 focus:outline-none"
              placeholder={t("descriptionPlaceholder")}
              required
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
                step={0.01}
                className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 font-mono text-sm text-white placeholder:text-white/20 focus:border-[#e63946]/50 focus:ring-1 focus:ring-[#e63946]/30 focus:outline-none"
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
                className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 font-mono text-sm text-white placeholder:text-white/20 focus:border-[#e63946]/50 focus:ring-1 focus:ring-[#e63946]/30 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/40">
                <CalendarDays className="h-3.5 w-3.5" />
                {t("eventDate")}
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-white placeholder:text-white/20 focus:border-[#e63946]/50 focus:ring-1 focus:ring-[#e63946]/30 focus:outline-none [color-scheme:dark]"
              />
            </div>
          </div>

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
                t("create")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
