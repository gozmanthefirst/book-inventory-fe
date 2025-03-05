"use server";

// External Imports
import { ReadStatus } from "@prisma/client";
import axios from "axios";

// Local Imports
import { getUser } from "@/shared/actions/get-user";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { ServerActionResponse } from "@/shared/types/shared-types";

const API_BASE = process.env.BACKEND_URL || "";

// update book
export const updateBook = async (
  bookId: string,
  readStatus: ReadStatus,
): Promise<ServerActionResponse> => {
  try {
    const [{ data: user }] = await Promise.all([runParallelAction(getUser())]);

    if (!user) {
      return {
        status: "error",
        details: "Something went wrong! Please try again.",
      };
    }

    const response = await axios.patch(
      `${API_BASE}/books/user/${user.id}/${bookId}`,
      {
        readStatus: readStatus || "UNREAD",
      },
    );

    if (response.data.status === "error") {
      console.log(response.data);

      return {
        status: response.data.status,
        details: response.data.details,
      };
    }

    return {
      status: "success",
      details: "Book succesfully updated!",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      details: `Error updating book: ${error}`,
    };
  }
};
