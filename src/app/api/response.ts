export type {ValidationError as ValidationErrorDetail} from "@/validators/BaseValidator";

export type ValidationErrorResponse = {
  code: "validation_failed";
  message: string;
  details: ValidationErrorDetail[];
};

export type ErrorResponse = {
  code: string;
  message: string;
};

export type SuccessResponse<T = void> = T extends void
  ? { message: string }
  : { message: string; data: T };

export function validationErrorResponse(details: ValidationErrorDetail[]): Response {
  return Response.json(
    {
      code: "validation_failed",
      message: "One or more fields are invalid.",
      details,
    } satisfies ValidationErrorResponse,
    {status: 400}
  );
}

export function notFoundResponse(message = "Not found."): Response {
  return Response.json(
    {code: "not_found", message} satisfies ErrorResponse,
    {status: 404}
  );
}

export function conflictResponse(message: string): Response {
  return Response.json(
    {code: "conflict", message} satisfies ErrorResponse,
    {status: 409}
  );
}

export function createdResponse(message: string): Response {
  return Response.json({message}, {status: 201});
}
