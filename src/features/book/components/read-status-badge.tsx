"use client";

// External Imports
import { useClickAway } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "motion/react";
import { Dispatch, SetStateAction, useState } from "react";
import { RotatingLines } from "react-loader-spinner";

// Local Imports
import { updateBook } from "@/features/my-books/actions/update-book";
import { cn } from "@/shared/lib/utils/cn";
import { SimpleBook } from "@/shared/types/google-book";
import { ServerActionResponse } from "@/shared/types/shared-types";
import { useQueryClient } from "@tanstack/react-query";
import { TbCircleCheck, TbExclamationCircle } from "react-icons/tb";

export const ReadStatusBadge = ({
  book,
  layoutId,
  showChangeIcon = false,
  setSelectedBook,
}: {
  book: SimpleBook;
  layoutId: string;
  showChangeIcon?: boolean;
  setSelectedBook?: Dispatch<SetStateAction<SimpleBook | null>>;
}) => {
  // States object to store update icon states for each book by ID
  const [updateIconStates, setUpdateIconStates] = useState<
    Record<string, "idle" | "loading" | "success" | "error">
  >({});
  const updateIconState = book ? updateIconStates[book.id] || "idle" : "idle";

  // State to store 'read status' dropdown status
  const [readStatusDdOpen, setReadStatusDdOpen] = useState(false);

  // State to store chosen read status
  const [readStatus, setReadStatus] = useState<"UNREAD" | "READING" | "READ">(
    book.readStatus,
  );

  // Close modal when a anywhere outside the modal is clicked
  const readStatusDdRef = useClickAway<HTMLDivElement>(() => {
    setReadStatusDdOpen(false);
    setReadStatus(book.readStatus);
  });

  const queryClient = useQueryClient();

  // Function to update book
  const handleUpdateBook = async () => {
    if (!book) return;

    try {
      setUpdateIconStates((prev) => ({
        ...prev,
        [book.id]: "loading",
      }));

      const response: ServerActionResponse = await updateBook(
        book.id,
        readStatus,
      );

      if (response.status === "error") {
        return setUpdateIconStates((prev) => ({
          ...prev,
          [book.id]: "error",
        }));
      }

      queryClient.invalidateQueries({
        queryKey: ["my-books"],
      });
      setUpdateIconStates((prev) => ({
        ...prev,
        [book.id]: "success",
      }));
      setTimeout(() => {
        setSelectedBook ? setSelectedBook(null) : () => {};
      }, 800);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }

      setUpdateIconStates((prev) => ({
        ...prev,
        [book.id]: "error",
      }));
    } finally {
      setTimeout(() => {
        setUpdateIconStates((prev) => ({
          ...prev,
          [book.id]: "idle",
        }));
      }, 3000);
    }
  };

  return (
    <div className="relative flex items-center gap-1 self-start">
      {/* Read status */}
      <motion.div
        layoutId={`${layoutId}-${book.id}`}
        onClick={() => setReadStatusDdOpen((o) => !o)}
        transition={{
          type: "spring",
          duration: 0.5,
          bounce: 0.2,
        }}
        className={cn(
          "relative cursor-pointer self-start rounded-full px-2 py-0.5 text-[10px] font-semibold",
          book.readStatus.toLowerCase() === "read"
            ? "bg-green-200 text-green-800"
            : book.readStatus.toLowerCase() === "reading"
              ? "bg-blue-200 text-blue-800"
              : "bg-red-200 text-red-800",
        )}
      >
        {book.readStatus}
      </motion.div>

      {/* Loader */}
      {updateIconState === "loading" ? (
        <RotatingLines visible width="14" strokeColor="#2563eb" />
      ) : updateIconState === "error" ? (
        <TbExclamationCircle className="text-red-600" />
      ) : updateIconState === "success" ? (
        <TbCircleCheck className="text-green-600" />
      ) : null}

      <AnimatePresence initial={false}>
        {readStatusDdOpen ? (
          <motion.div
            ref={readStatusDdRef}
            initial={{
              scale: 0.95,
              opacity: 0,
              y: -5,
              x: -5,
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
              y: -5,
              x: -5,
            }}
            transition={{
              type: "spring",
              duration: 0.3,
              bounce: 0.2,
            }}
            className={cn(
              "absolute top-[calc(100%_+_0.5rem)] left-0 z-5 w-64 rounded-3xl border border-neutral-300 bg-neutral-200 p-3 text-sm text-brand-500 shadow-sm",
            )}
          >
            {["UNREAD", "READING", "READ"].map((option) => (
              <motion.div
                key={option.toLowerCase()}
                onClick={() => {
                  setReadStatus(option as "UNREAD" | "READING" | "READ");
                  setReadStatusDdOpen((o) => !o);
                  handleUpdateBook();
                  setReadStatus(book.readStatus);
                }}
                tabIndex={1}
                onFocus={() =>
                  setReadStatus(option as "UNREAD" | "READING" | "READ")
                }
                onMouseEnter={() =>
                  setReadStatus(option as "UNREAD" | "READING" | "READ")
                }
                onMouseLeave={() => setReadStatus(book.readStatus)}
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

      {/* Alternate read status change trigger */}
      {/* {showChangeIcon ? (
        <motion.div className="cursor-pointer text-neutral-500 transition duration-300 lg:hover:bg-neutral-200">
          <TbSwitch2 />
        </motion.div>
      ) : null} */}
    </div>
  );
};
