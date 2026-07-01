import { ZodError } from "zod";

type RouteHandler = (request: Request, context: { params: Promise<Record<string, string>> }) => Promise<Response>;

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (err) {
      if (err instanceof ZodError) {
        return Response.json({ errors: err.flatten() }, { status: 400 });
      }
      throw err;
    }
  };
}
