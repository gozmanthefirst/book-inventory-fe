"use client";

// External Imports
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import { TbBook, TbChartDonut3, TbSearch } from "react-icons/tb";

// Local Imports
import { cn } from "@/shared/lib/utils/cn";

const NAVS = [
  {
    value: "/my-books",
    icon: TbBook,
  },
  {
    value: "/search",
    icon: TbSearch,
  },
  {
    value: "/portfolio",
    icon: TbChartDonut3,
  },
];

export const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      const tabs = containerRef.current?.querySelectorAll("[data-nav-tab]");

      if (tabs && tabs.length) {
        const tabsArray = Array.from(tabs) as HTMLElement[];

        const currentIndex = tabsArray.findIndex(
          (tab) => tab === document.activeElement,
        );

        let nextIndex = 0;

        if (e.key === "ArrowRight") {
          nextIndex = (currentIndex + 1) % tabsArray.length;
        } else if (e.key === "ArrowLeft") {
          nextIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
        }

        tabsArray[nextIndex].focus();

        // Optionally navigate to the focused tab's route.
        const newTabValue = tabsArray[nextIndex].getAttribute("data-nav-value");
        if (newTabValue) router.push(newTabValue);
      }
    }
  };

  return (
    <div className="pointer-events-none sticky bottom-0 flex items-center justify-center py-4">
      <div className="pointer-events-auto">
        <div
          ref={containerRef}
          onKeyDown={handleKeyDown}
          className="flex h-auto items-center rounded-full border border-neutral-300 bg-neutral-200 p-1.5 text-foreground shadow-sm"
        >
          {NAVS.map((tab) => {
            const Icon = tab.icon;

            return (
              <Link prefetch href={tab.value} key={tab.value} tabIndex={-1}>
                <div
                  data-nav-tab
                  data-nav-value={tab.value}
                  tabIndex={1}
                  onFocus={() => router.push(tab.value)}
                  onKeyDown={(e) => {}}
                  className={cn(
                    "group relative flex w-full cursor-pointer items-center justify-center rounded-full px-4 py-2 text-brand-500 transition duration-200 focus-visible:outline-0 md:px-6",
                    pathname === tab.value && "text-background",
                  )}
                >
                  {pathname === tab.value ? (
                    <motion.div
                      layoutId="bottom-nav-tab-bg"
                      transition={{
                        type: "spring",
                        duration: 0.3,
                        bounce: 0.2,
                      }}
                      className="absolute inset-0 z-[20] rounded-full bg-brand-500 group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-brand-500 group-disabled:pointer-events-none group-disabled:opacity-70"
                    />
                  ) : null}

                  <div className="relative z-[30]">
                    <Icon size={20} strokeWidth={2.5} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
