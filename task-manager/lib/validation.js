import { z } from "zod";

const statusEnum = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"], {
  message: "Status must be PENDING, IN_PROGRESS or COMPLETED",
});
const priorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"], {
  message: "Priority must be LOW, MEDIUM or HIGH",
});

export const createTaskSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or fewer"),
  description: z.string().trim().max(500, "Description must be 500 characters or fewer").default(""),
  status: statusEnum.default("PENDING"),
  priority: priorityEnum.default("MEDIUM"),
});

// For updates every field is optional, but at least one must be sent.
export const updateTaskSchema = createTaskSchema
  .partial()
  .refine((d) => Object.keys(d).length > 0, { message: "Send at least one field to update" });

export const listQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: statusEnum.optional(),
  priority: priorityEnum.optional(),
});
