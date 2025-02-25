"use client";

// External Imports
// import { useClickAway } from "@uidotdev/usehooks";
import { useQuery } from "@tanstack/react-query";
import {
  useClickAway,
  useDebounce,
  useLockBodyScroll,
} from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useQueryState } from "nuqs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TbBook2, TbSearch } from "react-icons/tb";

// Local Imports
import { searchBook } from "@/features/search/actions/search-book";
import { Input } from "@/shared/components/input";
import { InputIcon } from "@/shared/components/input-icon";
import { Skeleton } from "@/shared/components/skeleton";
import { cn } from "@/shared/lib/utils/cn";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { SearchedBook } from "@/shared/types/google-book";
import { alegreya } from "@/styles/fonts";

const MotionTbBook2 = motion.create(TbBook2);

export const Search = () => {
  const [query, setQuery] = useQueryState("q", { defaultValue: "" });
  const debouncedQuery = useDebounce(query.trim(), 800);

  const [selectedBook, setSelectedBook] = useState<SearchedBook | null>(null);

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
      ) : isError ? (
        debouncedQuery && <p className="text-red-500">Something went wrong!</p>
      ) : books.length > 0 ? (
        <ul className="flex w-full flex-col gap-4">
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

      {/* Selected Book */}
      <SelectedBook book={selectedBook} setSelectedBook={setSelectedBook} />
    </div>
  );
};

const SingleBook = ({
  book,
  setSelectedBook,
}: {
  book: SearchedBook;
  setSelectedBook: Dispatch<SetStateAction<SearchedBook | null>>;
}) => {
  return (
    <motion.li
      layoutId={`book-${book.id}`}
      transition={{
        type: "spring",
        duration: 0.5,
        bounce: 0.2,
      }}
      onClick={() => setSelectedBook(book)}
      style={{ borderRadius: 0 }}
      className="group flex cursor-pointer flex-col gap-4"
    >
      <div className="flex h-32 w-full gap-3 smd:h-40 smd:gap-4">
        {/* Book image */}
        <motion.div
          layoutId={`book-image-${book.id}`}
          transition={{
            type: "spring",
            duration: 0.5,
            bounce: 0.2,
          }}
          className="relative aspect-2/3 h-full shadow-md"
        >
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 text-neutral-400">
            <MotionTbBook2
              layoutId={`book-icon-${book.id}`}
              transition={{
                type: "spring",
                duration: 0.5,
                bounce: 0.2,
              }}
              size={40}
            />
          </div>
          {book.image ? (
            <Image
              src={book.image}
              alt={""}
              fill
              className="object-cover object-center"
            />
          ) : null}
        </motion.div>

        {/* Book title, author */}
        <div className="flex flex-col gap-1">
          {/* Title */}
          <motion.p
            layoutId={`book-title-${book.id}`}
            transition={{
              type: "spring",
              duration: 0.5,
              bounce: 0.2,
            }}
            className={cn(
              "line-clamp-2 text-lg leading-tight font-semibold text-neutral-800 transition-colors duration-200 group-hover:text-brand-400 sm:text-xl md:text-2xl",
              alegreya.className,
            )}
          >
            {book.title}
          </motion.p>

          {/* Authors */}
          <motion.p
            layoutId={`book-author-${book.id}`}
            transition={{
              type: "spring",
              duration: 0.5,
              bounce: 0.2,
            }}
            className="text-[13px]/[18px] font-semibold text-neutral-600 md:text-sm"
          >
            {book.authors?.join(", ")}
          </motion.p>

          {/* Description */}
          <motion.p
            layoutId={`book-desc-${book.id}`}
            transition={{
              type: "spring",
              duration: 0.5,
              bounce: 0.2,
            }}
            className="mt-2 line-clamp-2 text-[13px]/[18px] text-neutral-600 smd:mt-2 smd:line-clamp-3 md:text-sm"
          >
            {book?.description}
          </motion.p>
        </div>
      </div>

      <div className="h-px w-full bg-neutral-300 group-last:hidden" />
    </motion.li>
  );
};

const SelectedBook = ({
  book,
  setSelectedBook,
}: {
  book: SearchedBook | null;
  setSelectedBook: Dispatch<SetStateAction<SearchedBook | null>>;
}) => {
  const ref = useClickAway<HTMLDivElement>(() => {
    setSelectedBook(null);
  });

  // Close modal when the `esc` key is pressed
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedBook(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Stop page from scrolling when the modal is open
  useEffect(() => {
    if (book) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [book]);

  return (
    <AnimatePresence>
      {book ? (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              duration: 0.5,
              bounce: 0.2,
            }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          />

          {/* Selected Book */}
          <div className="fixed inset-0 z-50 grid place-items-center px-2">
            <motion.div
              ref={ref}
              layoutId={`book-${book.id}`}
              transition={{
                type: "spring",
                duration: 0.5,
                bounce: 0.2,
              }}
              style={{ borderRadius: 0 }}
              className="group flex w-full max-w-4xl cursor-pointer flex-col gap-4 border-neutral-300 bg-background p-4 shadow-md md:p-6"
            >
              <div className="flex w-full flex-col gap-4 smd:gap-4 md:h-80 md:flex-row">
                {/* Book image */}
                <motion.div
                  layoutId={`book-image-${book.id}`}
                  transition={{
                    type: "spring",
                    duration: 0.5,
                    bounce: 0.2,
                  }}
                  className="relative z-65 aspect-2/3 h-75 self-start shadow-md sm:h-84 smd:h-96 md:h-full"
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 text-neutral-400">
                    <MotionTbBook2
                      layoutId={`book-icon-${book.id}`}
                      transition={{
                        type: "spring",
                        duration: 0.5,
                        bounce: 0.2,
                      }}
                      size={40}
                    />
                  </div>
                  {book.image ? (
                    <Image
                      src={book.image}
                      alt={""}
                      fill
                      className="object-cover object-center"
                    />
                  ) : null}
                </motion.div>

                {/* Book title, author and desc */}
                <div className="relative flex flex-col gap-1">
                  <div className="flex flex-col gap-1">
                    {/* Title */}
                    <motion.p
                      layoutId={`book-title-${book.id}`}
                      transition={{
                        type: "spring",
                        duration: 0.5,
                        bounce: 0.2,
                      }}
                      className={cn(
                        "text-xl leading-tight font-semibold text-brand-400 transition-colors duration-200 sm:text-xl md:text-2xl",
                        alegreya.className,
                      )}
                    >
                      {book.title}
                    </motion.p>

                    {/* Authors */}
                    <motion.p
                      layoutId={`book-author-${book.id}`}
                      transition={{
                        type: "spring",
                        duration: 0.5,
                        bounce: 0.2,
                      }}
                      className="text-[13px]/[18px] font-semibold text-neutral-600 md:text-sm"
                    >
                      {book.authors?.join(", ")}
                    </motion.p>
                  </div>

                  {/* Description */}
                  <motion.p
                    layoutId={`book-desc-${book.id}`}
                    transition={{
                      type: "spring",
                      duration: 0.5,
                      bounce: 0.2,
                    }}
                    className="mt-2 h-64 overflow-auto text-[13px]/[18px] text-neutral-600 smd:mt-2 md:text-sm"
                  >
                    {book?.description}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
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
