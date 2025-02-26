"use client";

// External Imports
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

// Local Imports
import { BookListLoader } from "@/features/book/components/book-list-loader";
import { BookModal } from "@/features/book/components/book-modal";
import { SingleBook } from "@/features/book/components/single-book";
import { complexBookToSimpleBook } from "@/shared/lib/utils/book";
import { cn } from "@/shared/lib/utils/cn";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { SimpleBook } from "@/shared/types/google-book";
import { alegreya } from "@/styles/fonts";
import { getMyBooks } from "../actions/get-my-books";

export const MyBooks = () => {
  const [selectedBook, setSelectedBook] = useState<SimpleBook | null>(null);

  // Get my books
  const {
    data: { data: myBooks } = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-books"],
    queryFn: () => runParallelAction(getMyBooks()),
  });

  return (
    <div className="flex flex-col gap-8">
      {/* My Books */}
      <div className="flex flex-col gap-3">
        <h1
          className={cn(
            "text-3xl font-semibold text-brand-500",
            alegreya.className,
          )}
        >
          My Books
        </h1>
      </div>

      {isLoading ? (
        <BookListLoader />
      ) : isError ? (
        <p className="text-red-500">Something went wrong!</p>
      ) : Array.isArray(myBooks) && myBooks.length > 0 ? (
        <ul className="flex w-full flex-col">
          {myBooks.map((complexBook) => {
            const simpleBook = complexBookToSimpleBook(complexBook);

            return (
              <SingleBook
                key={simpleBook.id}
                book={simpleBook}
                setSelectedBook={setSelectedBook}
              />
            );
          })}
        </ul>
      ) : (
        <p className="text-neutral-500">No books found</p>
      )}

      {/* Book Modal */}
      <BookModal
        book={selectedBook}
        setSelectedBook={setSelectedBook}
        allowBookAdding={false}
      />
    </div>
  );
};
