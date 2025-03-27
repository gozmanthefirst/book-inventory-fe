import { createServerFn } from "@tanstack/react-start";
import axios from "axios";

import { handleApiError } from "@/shared/utils/handle-api-error";

const API_BASE = process.env.BACKEND_URL || "";

type LoginUserData = {
  email: string;
  password: string;
};

// login user
export const loginUser = createServerFn({
  method: "POST",
})
  .validator((data: LoginUserData) => data)
  .handler(async ({ data }) => {
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
  });
