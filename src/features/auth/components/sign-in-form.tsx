"use client";

// External Imports
import { useForm, useStore } from "@tanstack/react-form";
import Link from "next/link";
import {
  TbAt,
  TbBrandGoogleFilled,
  TbEye,
  TbLockPassword,
} from "react-icons/tb";
import { z } from "zod";

// Local Imports
import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { InputIcon } from "@/shared/components/input-icon";
import { cn } from "@/shared/lib/utils/cn";
import { alegreya } from "@/styles/fonts";

const signInSchema = z.object({
  email: z
    .string({ required_error: "An email is required" })
    .trim()
    .email({ message: "The email is invalid" }),
  password: z
    .string({ required_error: "A password is required" })
    .trim()
    .min(8, { message: "The password must have at least 8 characters" })
    .max(32, { message: "The password can't have more than 32 characters" })
    .refine((data) => !/\s/.test(data), {
      message: "The password can't contain any whitespace",
    }),
});

export const SignInForm = () => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: signInSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  const formErrors = useStore(form.store, (state) => state.errorMap);

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

      <form
        id="sign-in-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <>
          {/* Email */}
          <form.Field name="email">
            {(field) => (
              <div className="group relative">
                <InputIcon>
                  <TbAt size={18} />
                </InputIcon>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  errors={field.state.meta.errors}
                  placeholder="email"
                  type="email"
                  className="pl-10"
                />
              </div>
            )}
          </form.Field>

          {/* Password */}
          <form.Field name="password">
            {(field) => (
              <div className="group relative">
                <InputIcon>
                  <TbLockPassword size={18} />
                </InputIcon>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  errors={field.state.meta.errors}
                  placeholder="password"
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
            )}
          </form.Field>
        </>
      </form>

      {formErrors.onChange ? (
        <div className="-mt-4 flex items-center gap-1 text-xs text-red-600">
          {`${(formErrors.onChange as string)?.split(", ")[0]}`}
        </div>
      ) : null}

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
