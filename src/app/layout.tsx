// External Imports
import type { Metadata } from "next";
import { ReactNode } from "react";

// Local Imports
import { cn } from "@/shared/lib/utils/cn";
import { notoSans } from "@/styles/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Books FE",
  description: "Books FE",
};

interface Props {
  children: ReactNode;
}

const RootLayout = async ({ children }: Props) => {
  return (
    <html lang="en">
      <body
        className={cn(
          `bg-background text-foreground antialiased`,
          notoSans.className,
        )}
      >
        <div className="flex min-h-dvh flex-col">
          {/* Header */}
          <div className="flex-1 py-4 md:py-6">{children}</div>
          {/* Footer */}
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
