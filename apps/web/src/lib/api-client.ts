"use server";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

// ── Main API Fetch (reads accessToken, auto-refreshes on 401) ──

export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await rawFetch(endpoint, options);

  // Auto-refresh on 401
  if (response.status === 401) {
    const refreshed = await attemptTokenRefresh();
    if (refreshed) {
      const retryResponse = await rawFetch(endpoint, options);
      if (!retryResponse.ok) {
        const errorData = await retryResponse.json().catch(() => ({
          message: "An unexpected error occurred",
        }));
        throw new Error(errorData.message ?? "An unexpected error occurred");
      }
      return retryResponse.json() as Promise<T>;
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: "An unexpected error occurred",
    }));
    throw new Error(errorData.message ?? "An unexpected error occurred");
  }

  return response.json() as Promise<T>;
}

// ── Auth API Fetch (forwards Set-Cookie from BE to client) ─────

export async function apiFetchWithCookieForward<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers: customHeaders, ...rest } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    ...(body !== undefined && { body: JSON.stringify(body) }),
    ...rest,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: "An unexpected error occurred",
    }));
    throw new Error(errorData.message ?? "An unexpected error occurred");
  }

  // Forward Set-Cookie headers from API response
  const cookieStore = await cookies();
  const setCookieHeaders = response.headers.getSetCookie();

  for (const header of setCookieHeaders) {
    const parsed = parseSetCookie(header);
    if (parsed) {
      cookieStore.set(parsed.name, parsed.value, {
        httpOnly: parsed.httpOnly,
        secure: parsed.secure,
        sameSite: parsed.sameSite,
        maxAge: parsed.maxAge,
        path: parsed.path ?? "/",
      });
    }
  }

  return response.json() as Promise<T>;
}

// ── Internal Helpers ───────────────────────────────────

async function rawFetch(
  endpoint: string,
  options: RequestOptions = {},
): Promise<Response> {
  const { body, headers: customHeaders, ...rest } = options;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...customHeaders,
  };

  return fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    ...(body !== undefined && { body: JSON.stringify(body) }),
    ...rest,
  });
}

async function attemptTokenRefresh(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) return false;

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (!response.ok) return false;

    // Forward new cookies from refresh response
    const setCookieHeaders = response.headers.getSetCookie();
    for (const header of setCookieHeaders) {
      const parsed = parseSetCookie(header);
      if (parsed) {
        cookieStore.set(parsed.name, parsed.value, {
          httpOnly: parsed.httpOnly,
          secure: parsed.secure,
          sameSite: parsed.sameSite,
          maxAge: parsed.maxAge,
          path: parsed.path ?? "/",
        });
      }
    }

    return true;
  } catch {
    return false;
  }
}

// ── Set-Cookie Header Parser ───────────────────────────

interface ParsedCookie {
  name: string;
  value: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  maxAge: number | undefined;
  path: string | undefined;
}

function parseSetCookie(header: string): ParsedCookie | null {
  const parts = header.split(";").map((p) => p.trim());
  const [nameValue, ...attributes] = parts;

  if (!nameValue) return null;

  const eqIndex = nameValue.indexOf("=");
  if (eqIndex === -1) return null;

  const name = nameValue.substring(0, eqIndex);
  const value = nameValue.substring(eqIndex + 1);

  const result: ParsedCookie = {
    name,
    value,
    httpOnly: false,
    secure: false,
    sameSite: undefined,
    maxAge: undefined,
    path: undefined,
  };

  for (const attr of attributes) {
    const lower = attr.toLowerCase();
    if (lower === "httponly") {
      result.httpOnly = true;
    } else if (lower === "secure") {
      result.secure = true;
    } else if (lower.startsWith("samesite=")) {
      const val = attr.split("=")[1]?.toLowerCase();
      if (val === "lax" || val === "strict" || val === "none") {
        result.sameSite = val;
      }
    } else if (lower.startsWith("max-age=")) {
      const val = parseInt(attr.split("=")[1] ?? "", 10);
      if (!isNaN(val)) {
        result.maxAge = val;
      }
    } else if (lower.startsWith("path=")) {
      result.path = attr.split("=")[1];
    }
  }

  return result;
}
