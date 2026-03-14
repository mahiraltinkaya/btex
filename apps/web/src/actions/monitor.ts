"use server";

import { apiFetch } from "@/lib/api-client";
import type { EventMonitor } from "@/types";

// ── Actions ────────────────────────────────────────────

export async function getEventMonitor() {
  return apiFetch<EventMonitor[]>("/api/monitor/events", { method: "GET" });
}

export async function getEventMonitorById(id: string) {
  return apiFetch<EventMonitor>(`/api/monitor/events/${id}`, {
    method: "GET",
  });
}
