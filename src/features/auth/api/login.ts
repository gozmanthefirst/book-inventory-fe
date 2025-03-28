"use server";

import axios from "axios";

import { ServerActionResponse } from "@/shared/types/shared-types";
import { handleApiError } from "@/shared/utils/handle-api-error";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";

// login user
export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<ServerActionResponse> => {
  try {
    await axios.post(`${API_BASE}/auth/login`, {
      email: data.email,
      password: data.password,
    });

    return {
      status: "success",
      details: "User successfully logged in!",
    };
  } catch (error) {
    return handleApiError(error, {
      errorDescription: "Error logging user in",
      errorMapping: {
        INVALID_CREDENTIALS: "The email or password is invalid.",
        EMAIL_NOT_VERIFIED:
          "This email is not verified. A verification email has been sent.",
      },
    });
  }
};
