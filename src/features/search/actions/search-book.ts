"use server";

// External Imports
import { ReadStatus } from "@prisma/client";
import axios from "axios";

// Local Imports
import { createParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { GoogleBookResponse, SimpleBook } from "@/shared/types/google-book";

const API_BASE = "https://www.googleapis.com/books/v1/volumes";

export const searchBook = createParallelAction(
  async (query: string): Promise<SimpleBook[]> => {
    try {
      const response = await axios.get<GoogleBookResponse>(API_BASE, {
        params: {
          q: query,
          key: process.env.GOOGLE_BOOKS_API_KEY,
          maxResults: 20,
          orderBy: "relevance",
        },
      });

      const formattedResult: SimpleBook[] = (response.data.items || []).map(
        (book) => {
          const formattedBook = {
            id: book.id,
            title: book.volumeInfo.title,
            subtitle: book.volumeInfo.subtitle || "",
            authors: book.volumeInfo.authors,
            description: book.volumeInfo.description || "",
            publisher: book.volumeInfo.publisher,
            publishedDate: book.volumeInfo.publishedDate,
            isbn10:
              book.volumeInfo.industryIdentifiers?.find(
                (identifier) => identifier.type === "ISBN_10",
              )?.identifier || "",
            isbn13:
              book.volumeInfo.industryIdentifiers?.find(
                (identifier) => identifier.type === "ISBN_13",
              )?.identifier || "",
            pageCount: book.volumeInfo.pageCount,
            readStatus: "UNREAD" as ReadStatus,
            categories: book.volumeInfo.categories,
            image: book.volumeInfo.imageLinks?.thumbnail || "",
          };

          return formattedBook;
        },
      );

      const result = formattedResult.filter(
        (book) =>
          book.pageCount > 0 &&
          Array.isArray(book.authors) &&
          book.authors.length > 0,
      );

      return result;
    } catch (error) {
      console.error("Google Books API error:", error);
      throw new Error("Failed to fetch books");
    }
  },
);
