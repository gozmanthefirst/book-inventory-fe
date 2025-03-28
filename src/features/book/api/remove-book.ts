"use server";

import axios from "axios";

import { SimpleBook } from "@/shared/types/google-book";
import { ServerActionResponse } from "@/shared/types/shared-types";
import { handleApiError } from "@/shared/utils/handle-api-error";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";

// remove book
export const removeBook = async (
  book: SimpleBook,
): Promise<ServerActionResponse> => {
  try {
    await axios.delete(`${API_BASE}/books/${book.id}`);

    return {
      status: "success",
      details: "Book succesfully removed!",
    };
  } catch (error) {
    return handleApiError(error, {
      errorDescription: "Error removing book",
      errorMapping: {
        NOT_FOUND: "This book was not found.",
      },
    });
  }
};
