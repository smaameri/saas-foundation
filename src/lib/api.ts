import type { ZodSchema } from "zod";

export function validateQuery<T>(request: Request, schema: ZodSchema<T>): T {
  const { searchParams } = new URL(request.url);
  return schema.parse(Object.fromEntries(searchParams));
}
