"use client";

// External Imports
import { useQuery } from "@tanstack/react-query";

// Local Imports
import { getMyBooks } from "@/features/my-books/actions/get-my-books";
import { cn } from "@/shared/lib/utils/cn";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { alegreya } from "@/styles/fonts";

export const Portfolio = () => {
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
      {/* Portfolio */}
      <div className="flex flex-col gap-3">
        <h1
          className={cn(
            "text-3xl font-semibold text-brand-500",
            alegreya.className,
          )}
        >
          Portfolio
        </h1>
      </div>
    </div>
  );
};
