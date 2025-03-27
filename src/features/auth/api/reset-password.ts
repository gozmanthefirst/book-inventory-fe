import { createServerFn } from "@tanstack/react-start";
import axios from "axios";

import { handleApiError } from "@/shared/utils/handle-api-error";

const API_BASE = process.env.BACKEND_URL || "";

type ResetPasswordData = {
  token: string;
  password: string;
  confirmPassword: string;
};

// reset password
export const resetPassword = createServerFn({
  method: "POST",
})
  .validator((data: ResetPasswordData) => data)
  .handler(async ({ data }) => {
    try {
      await axios.post(`${API_BASE}/auth/reset-password`, {
        token: data.token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      return {
        status: "success",
        details: "Password successfully reset!",
      };
    } catch (error) {
      return handleApiError(error, {
        errorDescription: "Error resetting password",
      });
    }
  });
