// External Imports
import Image from "next/image";
import Link from "next/link";
import { HTMLAttributes, Ref } from "react";

// Local Imports
import { cn } from "../lib/utils/cn";

interface LogoHeaderProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export const LogoHeader = ({
  className,
  children,
  ref,
  ...props
}: LogoHeaderProps) => {
  return (
    <header
      ref={ref}
      className={cn("sticky top-0 z-50 flex justify-start py-6", className)}
      {...props}
    >
      <Link href={"/"}>
        <div className="relative size-10 md:size-11">
          <Image src={"/images/logo.png"} alt="Logo" fill />
        </div>
      </Link>

      {children}
    </header>
  );
};
