"use server";

import axios, { AxiosError } from "axios";

import { getUser } from "@/shared/api/get-user";
import {
  createParallelAction,
  runParallelAction,
} from "@/shared/lib/utils/parallel-server-action";
import {
  BackendError,
  ComplexBook,
  ServerActionResponse,
} from "@/shared/types/shared-types";

const API_BASE = process.env.BACKEND_URL || "";

// get my books
export const getMyBooks = createParallelAction(
  async (): Promise<
    ServerActionResponse | ServerActionResponse<ComplexBook[]>
  > => {
    try {
      const [{ data: user }] = await Promise.all([
        runParallelAction(getUser()),
      ]);

      if (!user) {
        return {
          status: "error",
          details: "User authentication required.",
        };
      }

      const response = await axios.get(`${API_BASE}/books/user/${user.id}`);

      return {
        status: "success",
        details: "Books found!",
        data: response.data.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const backendError = (error as AxiosError<BackendError>).response?.data;

        console.error("Error getting user's books:", backendError);

        if (backendError) {
          // Handle specific error cases
          switch (backendError.code) {
            case "NOT_FOUND":
              return {
                status: "error",
                details: "User not found.",
              };
            default:
              return {
                status: "error",
                details: "Something went wrong! Please try again.",
              };
          }
        }

        // Handle network or other Axios errors
        return {
          status: "error",
          details: "Network error. Please check your connection and try again.",
        };
      }

      // Handle unexpected errors
      console.error("Unexpected error:", error);
      return {
        status: "error",
        details: "An unexpected error occurred. Please try again later.",
      };
    }
  },
);
