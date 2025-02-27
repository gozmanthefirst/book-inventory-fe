"use client";

// External Imports
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { TbSearch } from "react-icons/tb";

// Local Imports
import { BookListLoader } from "@/features/book/components/book-list-loader";
import { BookModal } from "@/features/book/components/book-modal";
import { SingleBook } from "@/features/book/components/single-book";
import { searchBook } from "@/features/search/actions/search-book";
import { Input } from "@/shared/components/input";
import { InputIcon } from "@/shared/components/input-icon";
import { cn } from "@/shared/lib/utils/cn";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { SimpleBook } from "@/shared/types/google-book";
import { alegreya } from "@/styles/fonts";

export const Search = () => {
  const [query, setQuery] = useQueryState("q", { defaultValue: "" });
  const debouncedQuery = useDebounce(query.trim(), 1000);

  const [selectedBook, setSelectedBook] = useState<SimpleBook | null>(null);

  // Search book
  const {
    data: books = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["book", debouncedQuery],
    queryFn: () => runParallelAction(searchBook(debouncedQuery)),
    enabled: !!debouncedQuery,
    staleTime: 1000 * 60 * 60 * 12,
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Search Input */}
      <div className="flex flex-col gap-3">
        <h1
          className={cn(
            "text-3xl font-semibold text-brand-500",
            alegreya.className,
          )}
        >
          Search
        </h1>

        <div className="relative">
          <InputIcon>
            <TbSearch size={20} />
          </InputIcon>
          <Input
            placeholder="enter name of book"
            type="text"
            value={query || ""}
            onChange={(e) => setQuery(e.target.value)}
            className="h-14 border-brand-200 px-5 pl-12 text-base"
          />
        </div>
      </div>

      {/* Skeleton */}
      {isLoading ? (
        <BookListLoader />
      ) : isError ? (
        debouncedQuery && <p className="text-red-500">Something went wrong!</p>
      ) : books.length > 0 ? (
        <ul className="flex w-full flex-col">
          {books.map((book) => (
            <SingleBook
              key={book.id}
              book={book}
              setSelectedBook={setSelectedBook}
            />
          ))}
        </ul>
      ) : (
        debouncedQuery && <p className="text-neutral-500">No results found</p>
      )}

      {/* Book Modal */}
      <BookModal
        book={selectedBook}
        setSelectedBook={setSelectedBook}
        allowBookAdding
      />
    </div>
  );
};
