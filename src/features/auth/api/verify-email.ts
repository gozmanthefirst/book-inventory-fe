import { createServerFn } from "@tanstack/react-start";
import axios from "axios";

import { handleApiError } from "@/shared/utils/handle-api-error";

const API_BASE = process.env.BACKEND_URL || "";

// verify email
export const verifyEmail = createServerFn({
  method: "GET",
})
  .validator((token: string) => token)
  .handler(async ({ data: token }) => {
    try {
      await axios.get(`${API_BASE}/auth/verify-email?token=${token}`);

      return {
        status: "success",
        details: "Email successfully verified!",
      };
    } catch (error) {
      return handleApiError(error, {
        errorDescription: "Error verifying email",
      });
    }
  });
