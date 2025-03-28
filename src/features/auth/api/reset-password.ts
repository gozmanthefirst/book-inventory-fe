"use server";

import axios from "axios";

import { ServerActionResponse } from "@/shared/types/shared-types";
import { handleApiError } from "@/shared/utils/handle-api-error";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export const resetPassword = async (data: {
  token: string;
  password: string;
  confirmPassword: string;
}): Promise<ServerActionResponse> => {
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
};
