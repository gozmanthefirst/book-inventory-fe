"use server";

import axios, { AxiosError } from "axios";

import { getUser } from "@/shared/api/get-user";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { SimpleBook } from "@/shared/types/google-book";
import {
  BackendError,
  ServerActionResponse,
} from "@/shared/types/shared-types";

const API_BASE = process.env.BACKEND_URL || "";

// remove book
export const removeBook = async (
  book: SimpleBook,
): Promise<ServerActionResponse> => {
  try {
    const [{ data: user }] = await Promise.all([runParallelAction(getUser())]);

    if (!user) {
      return {
        status: "error",
        details: "User authentication required.",
      };
    }

    await axios.delete(`${API_BASE}/books/user/${user.id}/${book.id}`);

    return {
      status: "success",
      details: "Book succesfully removed!",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const backendError = (error as AxiosError<BackendError>).response?.data;

      console.error("Error removing book:", backendError);

      if (backendError) {
        // Handle specific error cases
        switch (backendError.code) {
          case "NOT_FOUND":
            return {
              status: "error",
              details: Array.isArray(backendError.details)
                ? backendError.details.join(", ")
                : backendError.details,
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
};
