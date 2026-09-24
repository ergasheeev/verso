import type { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError, type z } from "zod";

interface ValidateTargets {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

function formatZodError(err: ZodError): string {
  return err.issues
    .map((i) => `${i.path.join(".") || "value"}: ${i.message}`)
    .join("; ");
}

export function validate(targets: ValidateTargets) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (targets.body) {
        req.body = targets.body.parse(req.body) as z.infer<typeof targets.body>;
      }
      if (targets.query) {
        req.query = targets.query.parse(req.query) as z.infer<typeof targets.query>;
      }
      if (targets.params) {
        req.params = targets.params.parse(req.params) as z.infer<typeof targets.params>;
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(422).json({
          success: false,
          message: "Validation failed",
          errors: err.issues.map((i) => ({
            field: i.path.join(".") || "value",
            message: i.message,
            code: i.code,
          })),
          error: formatZodError(err),
        });
        return;
      }
      next(err);
    }
  };
}

export function validateBody(schema: ZodSchema) {
  return validate({ body: schema });
}

export function validateQuery(schema: ZodSchema) {
  return validate({ query: schema });
}

export function validateParams(schema: ZodSchema) {
  return validate({ params: schema });
}
