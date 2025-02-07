// Local Imports
import { cn } from "@/shared/lib/utils/cn";
import { alegreya } from "@/styles/fonts";

const HomePage = () => {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center text-5xl font-semibold text-brand-400",
        alegreya.className,
      )}
    >
      Home
    </div>
  );
};

export default HomePage;
