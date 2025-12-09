
import { toast } from "react-toastify";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { BackendFieldError } from "../../types/api/api";
import { ApiError } from "../../services/fetchWrapper"; 

export function handleApiError<T extends FieldValues = FieldValues>(
  err: unknown,
  setError?: UseFormSetError<T>
) {
  console.log('🔍 handleApiError called with:', err); 
  const showToast = (msg?: string) => {
    const text = msg ?? "Something went wrong";
    toast.error(text);
  };

  if (err instanceof ApiError) {
     console.log('✅ Is ApiError');
  console.log('📦 err.body:', err.body);
  console.log('📦 err.status:', err.status);
  console.log('📦 typeof err.body:', typeof err.body);
    const body = err.body;
    
    const maybeErrors: BackendFieldError[] | undefined =
      (body && Array.isArray((body as any).errors) && (body as any).errors) ||
      (body && (body as any).data && Array.isArray((body as any).data.errors) && (body as any).data.errors) ||
      undefined;

    if (maybeErrors && setError) {
      maybeErrors.forEach((e: BackendFieldError) => {
        try {
          const field = e.field as Path<T>;
          setError(field, { type: "server", message: e.message });
        } catch {}
      });
    }

    const maybeMessage =
      (body && (body as any).message) ||(body && (body as any).error) || (body && (body as any).data && (body as any).data.message)|| (body && (body as any).data && (body as any).data.error);
   

    console.log('📨 Extracted message:', maybeMessage);
    if (maybeMessage) {
      showToast(maybeMessage);
      return;
    }

    showToast(`Server error (${err.status})`);
    return;
  }

  if (typeof err === "object" && err !== null) {
    const anyErr = err as any;

    const backend = anyErr?.response?.data ?? anyErr;
    const maybeErrors =
      backend?.errors || (backend?.data && backend.data.errors) || undefined;

    if (maybeErrors && setError && Array.isArray(maybeErrors)) {
      maybeErrors.forEach((e: BackendFieldError) => {
        try {
          const field = e.field as Path<T>;
          setError(field, { type: "server", message: e.message });
        } catch {}
      });
    }

    const maybeMessage = backend?.message ?? anyErr?.message;
    if (maybeMessage) {
      showToast(maybeMessage);
      return;
    }
  }

  if (err instanceof Error) {
    showToast(err.message);
    return;
  }


  console.log('❌ Not an ApiError');
  showToast("An unknown error occurred");
}
