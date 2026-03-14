import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Event } from "@/types";

interface EventStore {
  events: Event[];
  setEvents: (events: Event[]) => void;
  clearEvents: () => void;
}

export const useEventStore = create<EventStore>()(
  persist(
    (set) => ({
      events: [],
      setEvents: (events) => set({ events }),
      clearEvents: () => set({ events: [] }),
    }),
    { name: "btex-events" },
  ),
);
