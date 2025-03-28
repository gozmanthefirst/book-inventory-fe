import { ReadStatus } from "@prisma/client";
import axios from "axios";

import { ServerActionResponse } from "@/shared/types/shared-types";
import { handleApiError } from "@/shared/utils/handle-api-error";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";

// update book
export const updateBook = async (data: {
  bookId: string;
  readStatus: ReadStatus;
}): Promise<ServerActionResponse> => {
  try {
    await axios.patch(`${API_BASE}/books/${data.bookId}`, {
      readStatus: data.readStatus || "UNREAD",
    });

    return {
      status: "success",
      details: "Book succesfully updated!",
    };
  } catch (error) {
    return handleApiError(error, {
      errorDescription: "Error updating book",
      errorMapping: {
        NOT_FOUND: "This book was not found.",
      },
    });
  }
};
