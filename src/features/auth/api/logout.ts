"use server";

import axios from "axios";

import { ServerActionResponse } from "@/shared/types/shared-types";
import { handleApiError } from "@/shared/utils/handle-api-error";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";

// logout user
export const logoutUser = async (): Promise<ServerActionResponse> => {
  try {
    await axios.post(`${API_BASE}/auth/logout`);

    return {
      status: "success",
      details: "User successfully logged out!",
    };
  } catch (error) {
    return handleApiError(error, {
      errorDescription: "Error logging user out",
    });
  }
};
