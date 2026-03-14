import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TicketWithEvent } from "@/types";

interface TicketStore {
  tickets: TicketWithEvent[];
  setTickets: (tickets: TicketWithEvent[]) => void;
  clearTickets: () => void;
}

export const useTicketStore = create<TicketStore>()(
  persist(
    (set) => ({
      tickets: [],
      setTickets: (tickets) => set({ tickets }),
      clearTickets: () => set({ tickets: [] }),
    }),
    { name: "btex-tickets" },
  ),
);
