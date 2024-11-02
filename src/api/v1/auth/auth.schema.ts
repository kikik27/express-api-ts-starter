import { z } from "zod";

export const userRegistrationSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const userForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const userResetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

export interface UserCredentials {
  id: string;
  name: string;
  email: string;
  role: string | null | undefined;
}