import { prisma } from "@/lib/prisma";
import { ok, fail, parseBody } from "@/lib/api";
import { updateTaskSchema } from "@/lib/validation";

const notFound = () => fail(404, "Task not found");

// GET /api/tasks/:id
export async function GET(_req, { params }) {
  try {
    const { id } = await params;
    const task = await prisma.task.findUnique({ where: { id } });
    return task ? ok(task) : notFound();
  } catch (err) {
    console.error(err);
    return fail(500, "Could not load the task. Please try again.");
  }
}

// PUT /api/tasks/:id  (partial updates are allowed)
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const { data, response } = await parseBody(req, updateTaskSchema);
    if (response) return response;

    const task = await prisma.task.update({ where: { id }, data });
    return ok(task);
  } catch (err) {
    if (err.code === "P2025") return notFound(); // Prisma: record does not exist
    console.error(err);
    return fail(500, "Could not update the task. Please try again.");
  }
}

// DELETE /api/tasks/:id
export async function DELETE(_req, { params }) {
  try {
    const { id } = await params;
    await prisma.task.delete({ where: { id } });
    return ok({ message: "Task deleted" });
  } catch (err) {
    if (err.code === "P2025") return notFound();
    console.error(err);
    return fail(500, "Could not delete the task. Please try again.");
  }
}
