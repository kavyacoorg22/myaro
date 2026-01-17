export class ConflictError extends Error {
  constructor(message = "Conflict") { super(message); this.name = "ConflictError"; }
}
export class UnexpectedError extends Error {
  constructor(message = "UnexpectedError") { super(message); this.name = "UnexpectedError"; }
}

export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "Server Error";
}