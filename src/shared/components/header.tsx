"use client";

// External Imports
import Image from "next/image";
import Link from "next/link";
import { HTMLAttributes, Ref } from "react";
import { TbLogout } from "react-icons/tb";

// Local Imports
import { signOut } from "@/features/auth/actions/sign-out";
import { cn } from "../lib/utils/cn";
import { Button } from "./button";

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export const Header = ({ className, ref, ...props }: HeaderProps) => {
  return (
    <header
      ref={ref}
      className={cn(
        "sticky top-0 z-50 flex items-center justify-between py-6",
        className,
      )}
      {...props}
    >
      <Link href={"/"}>
        <div className="relative size-10 md:size-11">
          <Image src={"/images/logo.png"} alt="Logo" fill />
        </div>
      </Link>

      <Button onClick={async () => await signOut()} size={"icon"}>
        <TbLogout size={22} strokeWidth={2} />
      </Button>
    </header>
  );
};
