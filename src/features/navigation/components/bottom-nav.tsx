"use client";

// External Imports
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { TbBook, TbSearch } from "react-icons/tb";

// Local Imports
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/tabs";
import { cn } from "@/shared/lib/utils/cn";
import Link from "next/link";

const NAVS = [
  {
    value: "/my-books",
    icon: TbBook,
  },
  {
    value: "/search",
    icon: TbSearch,
  },
];

export const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="pointer-events-none sticky bottom-0 flex items-center justify-center py-4">
      <Tabs
        defaultValue="/search"
        value={pathname}
        onValueChange={(value) => router.push(value)}
        className="pointer-events-auto"
      >
        <TabsList className="border border-neutral-300 shadow-sm">
          {NAVS.map((tab) => {
            const Icon = tab.icon;

            return (
              <Link prefetch href={tab.value} key={tab.value}>
                <TabsTrigger
                  value={tab.value}
                  // onClick={() => setActiveTab(tab.value)}
                  className={cn(
                    "group text-brand-500",
                    pathname === tab.value && "text-background",
                  )}
                >
                  {/* Active Tab BG */}
                  {pathname === tab.value ? (
                    <motion.div
                      layoutId="bet-history-tab-bg"
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
                </TabsTrigger>
              </Link>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
};
