import type { ApiError } from "@/types/auth";
import type { Middleware } from "@reduxjs/toolkit";
import { isRejected, isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const errorToastMiddleware: Middleware = () => (next) => (action) => {
  // RTK thunks: rejected actions
  if (isRejected(action) || isRejectedWithValue(action)) {
    const payload = action.payload as ApiError | undefined;

    // Only toast if payload looks like ApiError and has a message
    if (payload && typeof payload.message === "string" && payload.message.trim() !== "") {
      toast.error(payload.message);
    }
  }

  return next(action);
};
