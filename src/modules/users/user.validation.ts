import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(100)
    .optional(),

  bio: z
    .string()
    .max(500)
    .optional(),

  profileImage: z
    .string()
    .url()
    .optional(),
});

export const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(8, "Old password is required"),

  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters"),
});