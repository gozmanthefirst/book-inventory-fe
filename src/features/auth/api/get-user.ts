"use server";

import axios from "axios";

import { ServerActionResponse, UserCustom } from "@/shared/types/shared-types";
import { handleApiError } from "@/shared/utils/handle-api-error";
import { createParallelAction } from "@/shared/utils/parallel-server-action";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";

// get user
export const getUser = createParallelAction(
  async (): Promise<
    ServerActionResponse | ServerActionResponse<UserCustom>
  > => {
    try {
      const response = await axios.get(`${API_BASE}/user/me`);

      return {
        status: "success",
        details: "User gotten!",
        data: response.data.data,
      };
    } catch (error) {
      return handleApiError(error, {
        errorDescription: "Error getting user",
      });
    }
  },
);
