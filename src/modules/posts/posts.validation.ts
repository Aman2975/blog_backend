import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(3)
    .max(255),

  description: z
    .string()
    .min(10),

  visibility: z.enum([
    "PUBLIC",
    "PRIVATE",
    "DRAFT",
  ]),
});

export const updatePostSchema = z.object({
  title: z
    .string()
    .min(3)
    .max(255)
    .optional(),

  description: z
    .string()
    .min(10)
    .optional(),

  visibility: z
    .enum([
      "PUBLIC",
      "PRIVATE",
      "DRAFT",
    ])
    .optional(),
});