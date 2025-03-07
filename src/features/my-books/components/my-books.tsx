"use client";

// External Imports
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { TbBooksOff, TbExclamationCircle } from "react-icons/tb";

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
        <div className="my-10 flex flex-col">
          <div className="flex-1">
            <div className="mx-auto flex aspect-square h-full max-h-[400px] flex-col items-center justify-center text-red-500">
              <TbExclamationCircle size={144} strokeWidth={1.5} className="" />
              <p className={cn("text-xl")}>No added books</p>
            </div>
          </div>
        </div>
      ) : Array.isArray(myBooks) && myBooks.length > 0 ? (
        <ul className="flex w-full flex-col">
          {[...myBooks]
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .map((complexBook) => {
              const simpleBook = complexBookToSimpleBook(complexBook);

              return (
                <SingleBook
                  key={simpleBook.id}
                  book={simpleBook}
                  setSelectedBook={setSelectedBook}
                  showReadStatus
                />
              );
            })}
        </ul>
      ) : (
        <div className="my-10 flex flex-col">
          <div className="flex-1">
            <div className="mx-auto flex aspect-square h-full max-h-[400px] flex-col items-center justify-center text-neutral-400">
              <TbBooksOff size={144} strokeWidth={1.5} className="" />
              <p className={cn("text-xl")}>No added books</p>
            </div>
          </div>
        </div>
      )}

      {/* Book Modal */}
      <BookModal
        book={selectedBook}
        setSelectedBook={setSelectedBook}
        allowBookRemoving
        showReadStatus
      />
    </div>
  );
};
