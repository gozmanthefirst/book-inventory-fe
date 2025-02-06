"use client";

// External Imports
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import {
  TbAt,
  TbBrandGoogleFilled,
  TbEye,
  TbLockPassword,
  TbUser,
} from "react-icons/tb";

// Local Imports
import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { InputIcon } from "@/shared/components/input-icon";
import { cn } from "@/shared/lib/utils/cn";
import { alegreya } from "@/styles/fonts";

export const SignUpForm = () => {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1
          className={cn(
            "text-3xl font-semibold text-brand-400",
            alegreya.className,
          )}
        >
          Sign up
        </h1>
        <p className="text-sm text-neutral-700">
          Already have an account?{" "}
          <Link
            href={"/sign-in"}
            className="text-brand-400 lg:hover:underline lg:hover:underline-offset-2"
          >
            Sign in
          </Link>
          .
        </p>
      </div>

      <form
        id="sign-up-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <>
          {/* Name */}
          <div className="group relative">
            <InputIcon>
              <TbUser size={18} />
            </InputIcon>
            <form.Field
              name="name"
              children={(field) => {
                field.state.meta.errors;

                return (
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="name"
                    type="text"
                    className="pl-10"
                  />
                );
              }}
            />
          </div>

          {/* Email */}
          <div className="group relative">
            <InputIcon>
              <TbAt size={18} />
            </InputIcon>
            <Input placeholder="email" type="email" className="pl-10" />
          </div>

          {/* Password */}
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
        <Button form="sign-up-form" className="w-full" size={"lg"}>
          Sign up
        </Button>
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
