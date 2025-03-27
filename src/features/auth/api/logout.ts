import { createServerFn } from "@tanstack/react-start";
import axios from "axios";

import { handleApiError } from "@/shared/utils/handle-api-error";

const API_BASE = process.env.BACKEND_URL || "";

// logout user
export const logoutUser = createServerFn({
  method: "POST",
}).handler(async () => {
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
});
