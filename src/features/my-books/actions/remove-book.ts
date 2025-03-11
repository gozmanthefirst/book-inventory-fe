"use server";

import axios from "axios";

import { getUser } from "@/shared/actions/get-user";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { SimpleBook } from "@/shared/types/google-book";
import { ServerActionResponse } from "@/shared/types/shared-types";

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
        details: "Something went wrong! Please try again.",
      };
    }

    const response = await axios.delete(
      `${API_BASE}/books/user/${user.id}/${book.id}`,
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
      details: "Book succesfully removed!",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      details: `Error removing book: ${error}`,
    };
  }
};
