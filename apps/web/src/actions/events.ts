"use server";

import { apiFetch } from "@/lib/api-client";
import type {
  Event,
  ApiMessageResponse,
  EventType,
  TicketWithEvent,
  PaginatedResponse,
} from "@/types";

export interface CreateEventRequest {
  name: string;
  description: string;
  type: EventType;
  amount: number;
  capacity?: number;
  eventDate?: string | null;
}

export interface UpdateEventRequest {
  id: string;
  name?: string;
  description?: string;
  type?: EventType;
  capacity?: number;
  eventDate?: string | null;
}

export async function getEvent(id: string) {
  return apiFetch<Event>(`/api/events/get/${id}`, { method: "GET" });
}

export async function getAllEvents(page = 1, limit = 10) {
  return apiFetch<PaginatedResponse<Event>>(
    `/api/events/get-all?page=${page}&limit=${limit}`,
    { method: "GET" },
  );
}

export async function getAllTickets(page = 1, limit = 10, eventId?: string) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (eventId) params.set("eventId", eventId);

  return apiFetch<PaginatedResponse<TicketWithEvent>>(
    `/api/events/get-all-tickets?${params.toString()}`,
    { method: "GET" },
  );
}

export async function createEvent(data: CreateEventRequest) {
  return apiFetch<ApiMessageResponse>("/api/events/create", {
    method: "POST",
    body: data,
  });
}

export async function updateEvent(data: UpdateEventRequest) {
  return apiFetch<ApiMessageResponse>("/api/events/update", {
    method: "PUT",
    body: data,
  });
}

export async function deleteEvent(id: string) {
  return apiFetch<ApiMessageResponse>("/api/events/delete", {
    method: "DELETE",
    body: { id },
  });
}
