"use client";

// External Imports
import Link from "next/link";
import {
  TbAt,
  TbBrandGoogleFilled,
  TbEye,
  TbLockPassword,
} from "react-icons/tb";

// Local Imports
import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { InputIcon } from "@/shared/components/input-icon";
import { cn } from "@/shared/lib/utils/cn";
import { alegreya } from "@/styles/fonts";

export const SignInForm = () => {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1
          className={cn(
            "text-3xl font-semibold text-brand-400",
            alegreya.className,
          )}
        >
          Sign in
        </h1>
        <p className="text-sm text-neutral-700">
          {`Don't have an account?`}{" "}
          <Link
            href={"/sign-up"}
            className="text-brand-400 lg:hover:underline lg:hover:underline-offset-2"
          >
            Sign up
          </Link>
          .
        </p>
      </div>

      <form>
        <>
          <div className="group relative">
            <InputIcon>
              <TbAt size={18} />
            </InputIcon>
            <Input placeholder="email" type="email" className="pl-10" />
          </div>
          <div className="group relative">
            <InputIcon>
              <TbLockPassword size={18} />
            </InputIcon>
            <Input placeholder="password" type="password" className="px-10" />
            <InputIcon
              direction="end"
              onClick={() => {}}
              className="cursor-pointer"
            >
              <TbEye size={18} />
            </InputIcon>
          </div>
        </>
      </form>

      <div className="flex flex-col gap-3">
        <Button className="w-full" size={"lg"}>
          Sign in
        </Button>

        {/* Forgot Password */}
        <Link
          href={"/forgot-password"}
          className="text-xs text-brand-400 lg:hover:underline lg:hover:underline-offset-2"
        >
          Forgot your password?
        </Link>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="my-2 h-px w-full bg-neutral-300" />
        <div className="absolute top-0.5 bg-background px-2 text-xs font-bold text-neutral-400">
          OR
        </div>
      </div>

      <div>
        <Button className="w-full gap-2" size={"lg"} variant={"secondary"}>
          <TbBrandGoogleFilled size={18} />
          <span className="mt-0.5">Continue with Google</span>
        </Button>
      </div>
    </div>
  );
};
