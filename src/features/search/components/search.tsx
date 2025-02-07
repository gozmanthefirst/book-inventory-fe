"use client";

// External Imports
import { useQuery } from "@tanstack/react-query";
import { useDebounce, useLockBodyScroll } from "@uidotdev/usehooks";
import { useQueryState } from "nuqs";
import { TbBook2, TbSearch } from "react-icons/tb";

// Local Imports
import { searchBook } from "@/features/search/actions/search-book";
import { Input } from "@/shared/components/input";
import { InputIcon } from "@/shared/components/input-icon";
import { Skeleton } from "@/shared/components/skeleton";
import { cn } from "@/shared/lib/utils/cn";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { BookSearchResult } from "@/shared/types/google-book";
import { alegreya } from "@/styles/fonts";
import Image from "next/image";

export const Search = () => {
  const [query, setQuery] = useQueryState("q", { defaultValue: "" });
  const debouncedQuery = useDebounce(query.trim(), 800);

  // Search book
  const {
    data: books = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["book", debouncedQuery],
    queryFn: () => runParallelAction(searchBook(debouncedQuery)),
    enabled: !!debouncedQuery,
    staleTime: 1000 * 60 * 60 * 12, // Cached for 12 hours
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Search Input */}
      <div className="flex flex-col gap-3">
        <h1
          className={cn(
            "text-3xl font-semibold text-brand-400",
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
        <SearchLoadingSkeleton />
      ) : books.length > 0 ? (
        <div className="flex w-full flex-col gap-4">
          {books.map((book) => (
            <SingleBook key={book.id} book={book} />
          ))}
        </div>
      ) : (
        debouncedQuery && <p className="text-neutral-500">No results found</p>
      )}
    </div>
  );
};

const SingleBook = ({ book }: { book: BookSearchResult }) => {
  return (
    <div
      onClick={() => console.log(book)}
      className="group flex cursor-pointer flex-col gap-4"
    >
      <div className="flex h-32 w-full gap-3 smd:h-40 smd:gap-4">
        {/* Book image */}
        <div className="relative aspect-2/3 h-full shadow-md">
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 text-neutral-400">
            <TbBook2 size={40} />
          </div>
          {book.image ? (
            <Image
              src={book.image}
              alt={""}
              fill
              className="object-cover object-center"
            />
          ) : null}
        </div>

        {/* Book title, author */}
        <div className="flex flex-col gap-1">
          {/* Title */}
          <p
            className={cn(
              "line-clamp-2 text-lg leading-tight font-semibold text-neutral-800 transition-colors duration-200 group-hover:text-brand-400 sm:text-xl md:text-2xl",
              alegreya.className,
            )}
          >
            {book.title}
          </p>

          {/* Authors */}
          <p className="text-[13px]/[18px] font-semibold text-neutral-600 md:text-sm">
            {book.authors?.join(", ")}
          </p>

          {/* Description */}
          <p className="mt-2 line-clamp-2 text-[13px]/[18px] text-neutral-600 smd:mt-2 smd:line-clamp-3 md:text-sm">
            {book?.description}
          </p>
        </div>
      </div>

      <div className="h-px w-full bg-neutral-300 group-last:hidden" />
    </div>
  );
};

const SearchLoadingSkeleton = () => {
  useLockBodyScroll();

  return (
    <div className="flex w-full flex-col gap-3">
      {[...Array(20)].map((_, i) => (
        <Skeleton key={i} className="h-40 w-full rounded-none" />
      ))}
    </div>
  );
};
