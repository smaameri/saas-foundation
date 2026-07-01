import type { ZodSchema } from "zod";

export function parseQuery<T>(request: Request, schema: ZodSchema<T>): T {
  const { searchParams } = new URL(request.url);
  return schema.parse(Object.fromEntries(searchParams));
}
