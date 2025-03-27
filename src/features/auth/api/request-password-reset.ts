import { createServerFn } from "@tanstack/react-start";
import axios from "axios";

import { handleApiError } from "@/shared/utils/handle-api-error";

const API_BASE = process.env.BACKEND_URL || "";

// request password reset
export const requestPasswordReset = createServerFn({
  method: "POST",
})
  .validator((email: string) => email)
  .handler(async ({ data: email }) => {
    try {
      await axios.post(`${API_BASE}/auth/request-reset`, {
        email,
      });

      return {
        status: "success",
        details: "Password reset email successfully sent!",
      };
    } catch (error) {
      return handleApiError(error, {
        errorDescription: "Error sending password reset email",
      });
    }
  });
