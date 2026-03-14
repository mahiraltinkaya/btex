"use server";

import { apiFetchWithCookieForward } from "@/lib/api-client";
import { createSession, deleteSession } from "@/lib/auth";
import type { User } from "@/types";

// ── Request Types ──────────────────────────────────────

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiFetchWithCookieForward<AuthResponse>(
    "/api/auth/register",
    { method: "POST", body: data },
  );
  await createSession(response.user);
  return response;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiFetchWithCookieForward<AuthResponse>(
    "/api/auth/login",
    { method: "POST", body: data },
  );
  await createSession(response.user);
  return response;
}

export async function refreshToken(): Promise<AuthResponse> {
  const response = await apiFetchWithCookieForward<AuthResponse>(
    "/api/auth/refresh-token",
    { method: "POST" },
  );
  await createSession(response.user);
  return response;
}

export async function logout(): Promise<void> {
  await deleteSession();
}
