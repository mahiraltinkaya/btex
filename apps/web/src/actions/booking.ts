"use server";

import { apiFetch } from "@/lib/api-client";
import type { ApiMessageResponse } from "@/types";

export async function booking(ticketId: string) {
  return apiFetch<ApiMessageResponse>("/api/booking/booking", {
    method: "POST",
    body: { ticketId },
  });
}

export async function reserveByEvent(eventId: string) {
  return apiFetch<ApiMessageResponse>("/api/booking/reserve-by-event", {
    method: "POST",
    body: { eventId },
  });
}

export async function cancelBooking(ticketId: string) {
  return apiFetch<ApiMessageResponse>("/api/booking/cancel", {
    method: "POST",
    body: { ticketId },
  });
}

export async function payment(
  transactionId: string,
  cardNumber: string,
  expiry: string,
  cvv: string,
) {
  return apiFetch<ApiMessageResponse>("/api/booking/payment", {
    method: "POST",
    body: { transactionId, cardNumber, expiry, cvv },
  });
}
