import { prisma } from "@/lib/prisma";
import { ok, fail, parseBody, formatIssues } from "@/lib/api";
import { createTaskSchema, listQuerySchema } from "@/lib/validation";

// GET /api/tasks?search=&status=&priority=
export async function GET(req) {
  try {
    const params = Object.fromEntries(new URL(req.url).searchParams);
    const parsed = listQuerySchema.safeParse(params);
    if (!parsed.success) return fail(400, "Invalid query parameters", formatIssues(parsed.error));

    const { search, status, priority } = parsed.data;
    const tasks = await prisma.task.findMany({
      where: {
        ...(status && { status }),
        ...(priority && { priority }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: { createdAt: "desc" },
    });
    return ok(tasks);
  } catch (err) {
    console.error(err);
    return fail(500, "Could not load tasks. Please try again.");
  }
}

// POST /api/tasks
export async function POST(req) {
  try {
    const { data, response } = await parseBody(req, createTaskSchema);
    if (response) return response;

    const task = await prisma.task.create({ data });
    return ok(task, 201);
  } catch (err) {
    console.error(err);
    return fail(500, "Could not create the task. Please try again.");
  }
}
