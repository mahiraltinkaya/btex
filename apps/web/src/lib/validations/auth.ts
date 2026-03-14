import { z } from "zod";

// ── Login Schema ───────────────────────────────────────
// Mirror of: apps/api/src/controllers/auth-controller.ts → loginSchema

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ── Register Schema ────────────────────────────────────
// Mirror of: apps/api/src/controllers/auth-controller.ts → registerSchema

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
