import { createServerFn } from "@tanstack/react-start";
import axios from "axios";

import { handleApiError } from "@/shared/utils/handle-api-error";

const API_BASE = process.env.BACKEND_URL || "";

// resend verification email
export const resendVerificationEmail = createServerFn({
  method: "POST",
})
  .validator((email: string) => email)
  .handler(async ({ data: email }) => {
    try {
      await axios.post(`${API_BASE}/auth/resend-verification`, {
        email,
      });

      return {
        status: "success",
        details: "Verification email successfully resent!",
      };
    } catch (error) {
      return handleApiError(error, {
        errorDescription: "Error resending verification email",
      });
    }
  });
