"use server";

// External Imports
import axios from "axios";

// Local Imports
import { getUser } from "@/shared/actions/get-user";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { SimpleBook } from "@/shared/types/google-book";
import { ServerActionResponse } from "@/shared/types/shared-types";

const API_BASE = process.env.BACKEND_URL || "";

// add book
export const addBook = async (
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

    const response = await axios.post(`${API_BASE}/books/user/${user.id}`, {
      title: book.title,
      subtitle: book.subtitle,
      bookDesc: book.description,
      imageUrl: book.image,
      isbn: book.isbn13 || book.isbn10,
      publisher: book.publisher,
      publishedDate: book.publishedDate,
      pageCount: book.pageCount,
      authors: book.authors,
      genres: book.categories,
    });

    if (response.data.status === "error") {
      console.log(response.data);

      return {
        status: response.data.status,
        details: response.data.details,
      };
    }

    return {
      status: "success",
      details: "Book succesfully added!",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      details: `Error adding book: ${error}`,
    };
  }
};
