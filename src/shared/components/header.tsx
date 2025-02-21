"use client";

// External Imports
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { HTMLAttributes, Ref, useState } from "react";

// Local Imports
import { signOut } from "@/features/auth/actions/sign-out";
import { RotatingLines } from "react-loader-spinner";
import { cn } from "../lib/utils/cn";
import { Button } from "./button";

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

const buttonCopy = {
  idle: "Sign Out",
  loading: <RotatingLines visible width="16" strokeColor="#faf2e8" />,
  success: "Signed Out!",
  error: "Error",
};

export const Header = ({ className, ref, ...props }: HeaderProps) => {
  const [signOutBtnState, setSignOutBtnState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const variants = {
    initial: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  };

  const handleSignOut = async () => {
    try {
      setSignOutBtnState("loading");
      const response = await signOut();

      if (response.success) {
        setSignOutBtnState("success");

        setTimeout(() => {
          window.location.href = "/sign-in";
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setSignOutBtnState("error");

      setTimeout(() => {
        setSignOutBtnState("idle");
      }, 3000);
    }
  };

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

      <div>
        <Button
          size={"sm"}
          disabled={signOutBtnState !== "idle"}
          onClick={handleSignOut}
          className={cn("relative w-30 overflow-hidden")}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={signOutBtnState}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              initial="initial"
              animate="visible"
              exit="exit"
              variants={variants}
            >
              {buttonCopy[signOutBtnState]}
            </motion.div>
          </AnimatePresence>
        </Button>
      </div>
    </header>
  );
};
