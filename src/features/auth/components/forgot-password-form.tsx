"use client";

// External Imports
import Link from "next/link";
import { TbAt } from "react-icons/tb";

// Local Imports
import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { InputIcon } from "@/shared/components/input-icon";
import { cn } from "@/shared/lib/utils/cn";
import { alegreya } from "@/styles/fonts";

export const ForgotPasswordForm = () => {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1
          className={cn(
            "text-3xl font-semibold text-brand-400",
            alegreya.className,
          )}
        >
          Forgot password
        </h1>
        <p className="text-sm text-neutral-700">
          Remembered your password?{" "}
          <Link
            href={"/sign-in"}
            className="text-brand-400 lg:hover:underline lg:hover:underline-offset-2"
          >
            Sign in
          </Link>
          .
        </p>
      </div>

      <form className="flex flex-col gap-6">
        <div>
          <div className="group relative">
            <InputIcon>
              <TbAt size={18} />
            </InputIcon>
            <Input placeholder="email" type="email" className="pl-10" />
          </div>
        </div>

        <div>
          <Button className="w-full" size={"lg"}>
            Request reset link
          </Button>
        </div>
      </form>
    </div>
  );
};
