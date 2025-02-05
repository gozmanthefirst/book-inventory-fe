// External Imports
import type { Metadata } from "next";
import { ReactNode } from "react";

// Local Imports
import { ScreenSize } from "@/shared/components/screen-size";
import { cn } from "@/shared/lib/utils/cn";
import { notoSans } from "@/styles/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Book Inventory",
  description: "Book Inventory",
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
        <ScreenSize />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
