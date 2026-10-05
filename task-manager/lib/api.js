import { NextResponse } from "next/server";

export const ok = (data, status = 200) => NextResponse.json(data, { status });

export const fail = (status, error, details) =>
  NextResponse.json({ error, ...(details && { details }) }, { status });

export const formatIssues = (zodError) =>
  zodError.issues.map((i) => ({ field: i.path[0] ?? "body", message: i.message }));

// Reads the JSON body and validates it. Returns { data } or { response }.
export async function parseBody(req, schema) {
  let body;
  try {
    body = await req.json();
  } catch {
    return { response: fail(400, "Request body must be valid JSON") };
  }
  const result = schema.safeParse(body);
  if (!result.success) {
    return { response: fail(400, "Validation failed", formatIssues(result.error)) };
  }
  return { data: result.data };
}
