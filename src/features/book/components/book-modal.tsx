"use client";

// External Imports
import { useClickAway } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TbBook2 } from "react-icons/tb";
import { RotatingLines } from "react-loader-spinner";

// Local Imports
import { addBook } from "@/features/my-books/actions/add-book";
import { getMyBooks } from "@/features/my-books/actions/get-my-books";
import { removeBook } from "@/features/my-books/actions/remove-book";
import { Button } from "@/shared/components/button";
import { cn } from "@/shared/lib/utils/cn";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { SimpleBook } from "@/shared/types/google-book";
import { ServerActionResponse } from "@/shared/types/shared-types";
import { alegreya } from "@/styles/fonts";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const MotionTbBook2 = motion.create(TbBook2);

const addButtonCopy = {
  idle: "Add",
  loading: <RotatingLines visible width="18" strokeColor="#faf2e8" />,
  success: "Book added successfully!",
  error: "Something went wrong",
};

const removeButtonCopy = {
  idle: "Remove",
  loading: <RotatingLines visible width="18" strokeColor="#faf2e8" />,
  success: "Book removed successfully!",
  error: "Something went wrong",
};

export const BookModal = ({
  book,
  setSelectedBook,
  allowBookAdding = false,
  allowBookRemoving = false,
}: {
  book: SimpleBook | null;
  setSelectedBook: Dispatch<SetStateAction<SimpleBook | null>>;
  allowBookAdding?: boolean;
  allowBookRemoving?: boolean;
}) => {
  // States object to store add button states for each book by ID
  const [addButtonStates, setAddButtonStates] = useState<
    Record<string, "idle" | "loading" | "success" | "error">
  >({});
  const addButtonState = book ? addButtonStates[book.id] || "idle" : "idle";

  // States object to store remove button states for each book by ID
  const [removeButtonStates, setRemoveButtonStates] = useState<
    Record<string, "idle" | "loading" | "success" | "error">
  >({});
  const removeButtonState = book
    ? removeButtonStates[book.id] || "idle"
    : "idle";

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
  }, [setSelectedBook]);

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

  const queryClient = useQueryClient();

  // Function to add book
  const handleAddBook = async () => {
    if (!book) return;

    try {
      setAddButtonStates((prev) => ({
        ...prev,
        [book.id]: "loading",
      }));

      const response: ServerActionResponse = await addBook(book);

      if (response.status === "error") {
        return setAddButtonStates((prev) => ({
          ...prev,
          [book.id]: "error",
        }));
      }

      queryClient.invalidateQueries({
        queryKey: ["my-books"],
      });
      setAddButtonStates((prev) => ({
        ...prev,
        [book.id]: "success",
      }));
      setTimeout(() => {
        setSelectedBook(null);
      }, 800);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }

      setAddButtonStates((prev) => ({
        ...prev,
        [book.id]: "error",
      }));
    } finally {
      setTimeout(() => {
        setAddButtonStates((prev) => ({
          ...prev,
          [book.id]: "idle",
        }));
      }, 3000);
    }
  };

  // Function to remove book
  const handleRemoveBook = async () => {
    if (!book) return;

    try {
      setRemoveButtonStates((prev) => ({
        ...prev,
        [book.id]: "loading",
      }));

      const response: ServerActionResponse = await removeBook(book);

      if (response.status === "error") {
        return setRemoveButtonStates((prev) => ({
          ...prev,
          [book.id]: "error",
        }));
      }

      setSelectedBook(null);
      setRemoveButtonStates((prev) => ({
        ...prev,
        [book.id]: "success",
      }));

      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["my-books"],
        });
      }, 1000);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }

      setRemoveButtonStates((prev) => ({
        ...prev,
        [book.id]: "error",
      }));
    } finally {
      setTimeout(() => {
        setRemoveButtonStates((prev) => ({
          ...prev,
          [book.id]: "idle",
        }));
      }, 3000);
    }
  };

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
              className="group relative flex max-h-[95dvh] w-full max-w-4xl flex-col gap-4 overflow-auto border-neutral-300 bg-background p-4 shadow-md md:p-6"
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
                  className="relative z-65 aspect-2/3 h-60 self-start shadow-md sm:h-70 smd:h-88 md:h-full"
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-[#e1d8cf] text-neutral-400">
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
                        "text-xl leading-tight font-semibold text-brand-500 transition-colors duration-200 md:text-2xl",
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
                      className="max-h-[8dvh] overflow-auto text-[13px]/[18px] font-semibold text-neutral-600 md:text-sm"
                    >
                      {book.authors?.join(", ")}
                    </motion.p>
                  </div>

                  {/* Description */}
                  {book?.description ? (
                    <motion.p
                      layoutId={`book-desc-${book.id}`}
                      transition={{
                        type: "spring",
                        duration: 0.5,
                        bounce: 0.2,
                      }}
                      className="mt-2 max-h-[15dvh] overflow-auto text-[13px]/[18px] text-neutral-600 sm:max-h-[20dvh] smd:mt-2 smd:max-h-[25dvh] md:max-h-auto md:text-sm"
                    >
                      {book?.description}
                    </motion.p>
                  ) : null}
                </div>
              </div>

              {/* Buttons */}
              <div className="sticky bottom-0 bg-background">
                {/* Small */}
                <BookModalButtons
                  book={book}
                  handleAddBook={handleAddBook}
                  handleRemoveBook={handleRemoveBook}
                  setSelectedBook={setSelectedBook}
                  size="lg"
                  addButtonState={addButtonState}
                  removeButtonState={removeButtonState}
                  allowBookAdding={allowBookAdding}
                  allowBookRemoving={allowBookRemoving}
                />

                {/* Large */}
                <BookModalButtons
                  book={book}
                  handleAddBook={handleAddBook}
                  handleRemoveBook={handleRemoveBook}
                  setSelectedBook={setSelectedBook}
                  size="xl"
                  addButtonState={addButtonState}
                  removeButtonState={removeButtonState}
                  allowBookAdding={allowBookAdding}
                  allowBookRemoving={allowBookRemoving}
                />
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
};

const BookModalButtons = ({
  book,
  handleAddBook,
  handleRemoveBook,
  setSelectedBook,
  size,
  addButtonState,
  removeButtonState,
  allowBookAdding,
  allowBookRemoving,
}: {
  book: SimpleBook;
  handleAddBook: () => Promise<void>;
  handleRemoveBook: () => Promise<void>;
  setSelectedBook: Dispatch<SetStateAction<SimpleBook | null>>;
  size: "lg" | "xl";
  addButtonState: "idle" | "loading" | "success" | "error";
  removeButtonState: "idle" | "loading" | "success" | "error";
  allowBookAdding: boolean;
  allowBookRemoving: boolean;
}) => {
  const variants = {
    initial: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  };

  // Get my books
  const { data: { data: myBooks } = {} } = useQuery({
    queryKey: ["my-books"],
    queryFn: () => runParallelAction(getMyBooks()),
  });

  const isBookAdded = myBooks?.some(
    (myBook) => myBook.isbn === book?.isbn13 || myBook.isbn === book?.isbn10,
  );

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -30,
      }}
      transition={{ duration: 0.1 }}
      className={
        size === "xl"
          ? "hidden flex-col-reverse gap-3 smd:flex-row md:flex"
          : "flex flex-col-reverse gap-3 smd:flex-row md:hidden"
      }
    >
      {/* Close */}
      <Button
        size={size}
        variant={"secondary"}
        onClick={() => setSelectedBook(null)}
        className="relative w-full gap-2 overflow-hidden"
      >
        Close
      </Button>

      {/* Add */}
      {allowBookAdding ? (
        <Button
          size={size}
          variant={addButtonState === "error" ? "destructive" : "brand"}
          onClick={handleAddBook}
          disabled={addButtonState !== "idle" || isBookAdded}
          className="relative w-full gap-2 overflow-hidden"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={addButtonState}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              initial="initial"
              animate="visible"
              exit="exit"
              variants={variants}
            >
              {isBookAdded && addButtonState === "idle"
                ? "Added"
                : addButtonCopy[addButtonState]}
            </motion.div>
          </AnimatePresence>
        </Button>
      ) : null}

      {/* Remove */}
      {allowBookRemoving ? (
        <Button
          size={size}
          variant={removeButtonState === "error" ? "destructive" : "brand"}
          onClick={handleRemoveBook}
          disabled={removeButtonState !== "idle"}
          className="relative w-full gap-2 overflow-hidden"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={removeButtonState}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              initial="initial"
              animate="visible"
              exit="exit"
              variants={variants}
            >
              {removeButtonCopy[removeButtonState]}
            </motion.div>
          </AnimatePresence>
        </Button>
      ) : null}
    </motion.div>
  );
};
