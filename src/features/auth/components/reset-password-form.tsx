"use client";

// External Imports
import Link from "next/link";
import { TbEye, TbLockPassword } from "react-icons/tb";

// Local Imports
import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { InputIcon } from "@/shared/components/input-icon";
import { cn } from "@/shared/lib/utils/cn";
import { alegreya } from "@/styles/fonts";

export const ResetPasswordForm = () => {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1
          className={cn(
            "text-3xl font-semibold text-brand-400",
            alegreya.className,
          )}
        >
          Reset password
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

      <form>
        <>
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
          <div className="group relative">
            <InputIcon>
              <TbLockPassword size={18} />
            </InputIcon>
            <Input
              placeholder="confirm password"
              type="password"
              className="px-10"
            />
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

      <div>
        <Button className="w-full" size={"lg"}>
          Reset password
        </Button>
      </div>
    </div>
  );
};
