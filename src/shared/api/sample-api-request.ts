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

//* Sample action to add a book using fetch
export const sampleActionFetch = async (
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

    const response = await fetch(`${API_BASE}/books/user/${user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: book.title,
        subtitle: book.subtitle,
        bookDesc: book.description,
        imageUrl: book.image,
        isbn: book.isbn13 || book.isbn10,
        publisher: book.publisher,
        publishedDate: book.publishedDate,
        pageCount: book.pageCount,
        readStatus: (book.readStatus || "UNREAD").toLowerCase(),
        authors: book.authors,
        genres: book.categories,
      }),
    });

    if (!response.ok) {
      const errorData: BackendError = await response.json();

      switch (errorData.code) {
        case "NOT_FOUND":
          return {
            status: "error",
            details: "User not found.",
          };
        case "INVALID_DATA":
          return {
            status: "error",
            details: Array.isArray(errorData.details)
              ? errorData.details.join(", ")
              : errorData.details,
          };
        case "ISBN_ALREADY_EXIST":
          return {
            status: "error",
            details: "You already have a book with this ISBN in your library.",
          };
        default:
          return {
            status: "error",
            details: Array.isArray(errorData.details)
              ? errorData.details.join(", ")
              : errorData.details,
          };
      }
    }

    return {
      status: "success",
      details: "Book successfully added!",
    };
  } catch (error) {
    // Handle network errors or JSON parsing errors
    console.error("Unexpected error:", error);
    return {
      status: "error",
      details: "Network error. Please check your connection and try again.",
    };
  }
};

//* Axios version of the sample action
export const addBookAxios = async (
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

    await axios.post(`${API_BASE}/books/user/${user.id}`, {
      title: book.title,
      subtitle: book.subtitle,
      bookDesc: book.description,
      imageUrl: book.image,
      isbn: book.isbn13 || book.isbn10,
      publisher: book.publisher,
      publishedDate: book.publishedDate,
      pageCount: book.pageCount,
      readStatus: (book.readStatus || "UNREAD").toLowerCase(),
      authors: book.authors,
      genres: book.categories,
    });

    return {
      status: "success",
      details: "Book successfully added!",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<BackendError>;
      const backendError = axiosError.response?.data;

      console.error(backendError);

      if (backendError) {
        // Handle specific error cases
        switch (backendError.code) {
          case "NOT_FOUND":
            return {
              status: "error",
              details: "User not found.",
            };
          case "INVALID_DATA":
            return {
              status: "error",
              details: Array.isArray(backendError.details)
                ? backendError.details.join(", ")
                : backendError.details,
            };
          case "ISBN_ALREADY_EXIST":
            return {
              status: "error",
              details:
                "You already have a book with this ISBN in your library.",
            };
          default:
            return {
              status: "error",
              details: Array.isArray(backendError.details)
                ? backendError.details.join(", ")
                : backendError.details,
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
