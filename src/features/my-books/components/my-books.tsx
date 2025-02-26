// Local Imports
import { cn } from "@/shared/lib/utils/cn";
import { alegreya } from "@/styles/fonts";

export const MyBooks = () => {
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
    </div>
  );
};
