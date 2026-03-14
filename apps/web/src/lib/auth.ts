"use server";

import { EncryptJWT, jwtDecrypt, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import type { User } from "@/types";
import type { UserRole } from "@/types";

const SESSION_COOKIE = "session";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not defined in environment variables");
  }
  return Uint8Array.from(atob(secret), (c) => c.charCodeAt(0));
}

interface SessionPayload extends JWTPayload {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
  };
}

export async function createSession(user: User): Promise<void> {
  const secret = getSecret();

  const token = await new EncryptJWT({ user } as SessionPayload)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .encrypt(secret);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function decryptSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const secret = getSecret();
    const { payload } = await jwtDecrypt<SessionPayload>(sessionCookie, secret);

    if (!payload.user?.id || !payload.user?.email || !payload.user?.role) {
      return null;
    }

    return payload.user as User;
  } catch {
    return null;
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}
