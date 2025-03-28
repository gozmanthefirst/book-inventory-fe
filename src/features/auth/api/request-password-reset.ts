"use server";

import axios from "axios";

import { ServerActionResponse } from "@/shared/types/shared-types";
import { handleApiError } from "@/shared/utils/handle-api-error";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";

// request password reset
export const requestPasswordReset = async (data: {
  email: string;
}): Promise<ServerActionResponse> => {
  try {
    await axios.post(`${API_BASE}/auth/request-reset`, {
      email: data.email,
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
};
