"use client";

// External Imports
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useClickAway } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TbBook2 } from "react-icons/tb";
import { RotatingLines } from "react-loader-spinner";

// Local Imports
import { ReadStatusBadge } from "@/features/book/components/read-status-badge";
import { addBook } from "@/features/my-books/actions/add-book";
import { getMyBooks } from "@/features/my-books/actions/get-my-books";
import { removeBook } from "@/features/my-books/actions/remove-book";
import { Button } from "@/shared/components/button";
import { cn } from "@/shared/lib/utils/cn";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { SimpleBook } from "@/shared/types/google-book";
import { ServerActionResponse } from "@/shared/types/shared-types";
import { alegreya } from "@/styles/fonts";

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
  showReadStatus = false,
}: {
  book: SimpleBook | null;
  setSelectedBook: Dispatch<SetStateAction<SimpleBook | null>>;
  allowBookAdding?: boolean;
  allowBookRemoving?: boolean;
  showReadStatus?: boolean;
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

  // State to store chosen read status
  const [readStatus, setReadStatus] = useState<
    "UNREAD" | "READING" | "READ" | null
  >(null);

  // Close modal when a anywhere outside the modal is clicked
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

      const response: ServerActionResponse = await addBook({
        ...book,
        readStatus: readStatus || "UNREAD",
      });

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
                  className="relative aspect-2/3 h-60 self-start shadow-md sm:h-70 smd:h-88 md:h-full"
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

                    {showReadStatus ? (
                      <ReadStatusBadge
                        layoutId="book-read-status"
                        book={book}
                        showChangeIcon
                        setSelectedBook={setSelectedBook}
                      />
                    ) : null}
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
                  readStatus={readStatus}
                  setReadStatus={setReadStatus}
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
                  readStatus={readStatus}
                  setReadStatus={setReadStatus}
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
  readStatus,
  setReadStatus,
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
  readStatus: "UNREAD" | "READING" | "READ" | null;
  setReadStatus: Dispatch<SetStateAction<"UNREAD" | "READING" | "READ" | null>>;
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
        <AddButton
          size={size}
          addButtonState={addButtonState}
          handleAddBook={handleAddBook}
          isBookAdded={!!isBookAdded}
          readStatus={readStatus}
          setReadStatus={setReadStatus}
        />
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

const AddButton = ({
  size,
  addButtonState,
  handleAddBook,
  isBookAdded,
  readStatus,
  setReadStatus,
}: {
  size: "lg" | "xl";
  addButtonState: "idle" | "loading" | "success" | "error";
  handleAddBook: () => Promise<void>;
  isBookAdded: boolean;
  readStatus: "UNREAD" | "READING" | "READ" | null;
  setReadStatus: Dispatch<SetStateAction<"UNREAD" | "READING" | "READ" | null>>;
}) => {
  // State to store 'read status' dropdown status
  const [readStatusDdOpen, setReadStatusDdOpen] = useState(false);

  // Close modal when a anywhere outside the modal is clicked
  const readStatusDdRef = useClickAway<HTMLDivElement>(() => {
    setReadStatusDdOpen(false);
  });

  const variants = {
    initial: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  };

  return (
    <div className="relative w-full">
      <Button
        size={size}
        variant={addButtonState === "error" ? "destructive" : "brand"}
        type="button"
        onClick={() => setReadStatusDdOpen((o) => !o)}
        disabled={addButtonState !== "idle" || isBookAdded}
        className="relative w-full gap-2 overflow-hidden lg:hover:bg-brand-500"
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

      {/* To prevent the dropdown from opening again if it's currently and the trigger is pressed to close it */}
      {readStatusDdOpen ? (
        <div className="absolute inset-0 cursor-pointer rounded-2xl" />
      ) : null}

      {/* Read Status Dropdown */}
      <AnimatePresence initial={false}>
        {readStatusDdOpen ? (
          <motion.div
            ref={readStatusDdRef}
            initial={{
              scale: 0.95,
              opacity: 0,
              y: 5,
              x: 5,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              x: 0,
            }}
            exit={{
              scale: 0.95,
              opacity: 0,
              y: 5,
              x: 5,
            }}
            transition={{
              type: "spring",
              duration: 0.3,
              bounce: 0.2,
            }}
            className={cn(
              "absolute right-0 bottom-[calc(100%_+_0.5rem)] left-0 z-5 rounded-3xl border border-neutral-300 bg-neutral-200 p-3 text-sm text-brand-500 shadow-sm",
            )}
          >
            {["UNREAD", "READING", "READ"].map((option) => (
              <motion.div
                key={option.toLowerCase()}
                onClick={() => {
                  setReadStatus(option as "UNREAD" | "READING" | "READ");
                  setReadStatusDdOpen((o) => !o);
                  handleAddBook();
                  setReadStatus(null);
                }}
                tabIndex={1}
                onFocus={() =>
                  setReadStatus(option as "UNREAD" | "READING" | "READ")
                }
                onMouseEnter={() =>
                  setReadStatus(option as "UNREAD" | "READING" | "READ")
                }
                onMouseLeave={() => setReadStatus(null)}
                className={cn(
                  "group relative flex h-10 cursor-pointer items-center justify-center bg-transparent font-semibold text-brand-500 transition duration-200 focus-visible:outline-0 md:h-12",
                  option === readStatus || (!readStatus && option === "UNREAD")
                    ? "text-background"
                    : "",
                )}
              >
                {option === readStatus ||
                (!readStatus && option === "UNREAD") ? (
                  <motion.div
                    layoutId="option-bg"
                    transition={{
                      type: "spring",
                      duration: 0.3,
                      bounce: 0.2,
                    }}
                    className="absolute inset-0 rounded-xl bg-brand-500 group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-brand-500"
                  />
                ) : null}
                <div className="relative">{option}</div>
              </motion.div>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
