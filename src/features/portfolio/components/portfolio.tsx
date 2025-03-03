"use client";

// External Imports
import { useQuery } from "@tanstack/react-query";

// Local Imports
import { getMyBooks } from "@/features/my-books/actions/get-my-books";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/chart";
import { cn } from "@/shared/lib/utils/cn";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { alegreya } from "@/styles/fonts";
import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";

const chartConfig = {
  books: {
    label: "Books",
    color: "",
  },
  unread: {
    label: "Unread",
    color: "var(--color-unread-books)",
  },
  read: {
    label: "Read",
    color: "var(--color-read-books)",
  },
  reading: {
    label: "Reading",
    color: "var(--color-reading-books)",
  },
} satisfies ChartConfig;

export const Portfolio = () => {
  // Get my books
  const {
    data: queryData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-books"],
    queryFn: () => runParallelAction(getMyBooks()),
  });

  // Safely extract books
  const myBooks = queryData?.data;

  const booksData = useMemo(() => {
    return [
      {
        status: "unread",
        books:
          myBooks?.filter((book) => book.readStatus === "UNREAD").length ?? 0,
        fill: "var(--color-unread)",
      },
      {
        status: "read",
        books:
          myBooks?.filter((book) => book.readStatus === "READ").length ?? 0,
        fill: "var(--color-read)",
      },
      {
        status: "reading",
        books:
          myBooks?.filter((book) => book.readStatus === "READING").length ?? 0,
        fill: "var(--color-reading)",
      },
    ];
  }, [myBooks]);

  const totalBooks = useMemo(() => {
    return booksData.reduce((acc, curr) => acc + curr.books, 0);
  }, [booksData]);

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

      {/* Legend */}
      <div className="flex flex-col gap-1">
        {["UNREAD", "READING", "READ"].map((readStatus) => (
          <div key={readStatus} className="flex items-center gap-2">
            <div
              className={cn(
                "size-3",
                readStatus.toLowerCase() === "read"
                  ? "bg-read-books"
                  : readStatus.toLowerCase() === "reading"
                    ? "bg-reading-books"
                    : "bg-unread-books",
              )}
            />

            <p className="text-sm font-semibold text-neutral-600">
              {readStatus.toLowerCase() === "read"
                ? "Books you've read."
                : readStatus.toLowerCase() === "reading"
                  ? "Books you're currently reading."
                  : "Books you haven't read but plan on reading."}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-colmy-10 flex">
        <div className="flex-1">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[400px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={booksData}
                dataKey="books"
                nameKey="status"
                innerRadius={64}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-neutral-600 text-4xl font-bold"
                          >
                            {totalBooks.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-neutral-600 text-sm"
                          >
                            Books
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};
