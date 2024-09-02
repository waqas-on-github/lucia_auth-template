import { z } from "zod";

// -------------------------------auth schema ------------------------------
// Shared base schema for email and password
export const baseSchema = z.object({
  email: z.string().email().trim(),
  password: z
    .string({ message: "password is required" })
    .min(8, { message: "at least 8 characters required and max 32" }),
});

// Signup schema with confirmation password
export const signupSchema = baseSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords don't match",
  });

// Login schema without confirmation password
export const loginSchema = baseSchema;
