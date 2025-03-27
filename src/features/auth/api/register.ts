import { createServerFn } from "@tanstack/react-start";
import axios from "axios";

import { handleApiError } from "@/shared/utils/handle-api-error";

const API_BASE = process.env.BACKEND_URL || "";

type RegisterUserData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

// register user
export const registerUser = createServerFn({
  method: "POST",
})
  .validator((data: RegisterUserData) => data)
  .handler(async ({ data }) => {
    try {
      await axios.post(`${API_BASE}/auth/register`, {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      return {
        status: "success",
        details: "User successfully registered!",
      };
    } catch (error) {
      return handleApiError(error, {
        errorDescription: "Error registering user",
        errorMapping: {
          USER_EXISTS: "This email belongs to another user.",
        },
      });
    }
  });
