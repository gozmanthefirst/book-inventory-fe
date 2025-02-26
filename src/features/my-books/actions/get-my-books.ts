"use server";

// External Imports
import axios from "axios";

// Local Imports
import { getUser } from "@/shared/actions/get-user";
import {
  createParallelAction,
  runParallelAction,
} from "@/shared/lib/utils/parallel-server-action";
import { ComplexBook, ServerActionResponse } from "@/shared/types/shared-types";

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
          details: "Something went wrong! Please try again.",
        };
      }

      const response = await axios.get(`${API_BASE}/books/user/${user.id}`);

      if (!response.data) {
        return {
          status: "error",
          details: "Books not found!",
        };
      }

      return {
        status: "success",
        details: "Books found!",
        data: response.data.data,
      };
    } catch (error) {
      console.log(error);
      return {
        status: "error",
        details: `Error fetching tots: ${error}`,
      };
    }
  },
);
