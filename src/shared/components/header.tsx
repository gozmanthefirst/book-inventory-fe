"use client";

// External Imports
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HTMLAttributes, Ref, useState } from "react";
import { RotatingLines } from "react-loader-spinner";

// Local Imports
import { authClient } from "@/shared/lib/auth/auth-client";
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
  const router = useRouter();

  const [buttonState, setButtonState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const variants = {
    initial: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onRequest() {
            setButtonState("loading");
          },
          onError(ctx) {
            if (process.env.NODE_ENV !== "production") {
              console.error(ctx.error);
            }

            setButtonState("error");
          },
          onSuccess() {
            setButtonState("success");
            router.push("/sign-in");
          },
        },
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }

      setButtonState("error");
    } finally {
      setTimeout(() => {
        setButtonState("idle");
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
          disabled={buttonState !== "idle"}
          onClick={handleSignOut}
          className={cn("relative w-30 overflow-hidden")}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={buttonState}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              initial="initial"
              animate="visible"
              exit="exit"
              variants={variants}
            >
              {buttonCopy[buttonState]}
            </motion.div>
          </AnimatePresence>
        </Button>
      </div>
    </header>
  );
};
