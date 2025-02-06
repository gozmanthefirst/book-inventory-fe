"use client";

// External Imports
import { useForm, useStore } from "@tanstack/react-form";
import Link from "next/link";
import { TbAt } from "react-icons/tb";
import { z } from "zod";

// Local Imports
import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { InputIcon } from "@/shared/components/input-icon";
import { cn } from "@/shared/lib/utils/cn";
import { alegreya } from "@/styles/fonts";

const forgotPwdSchema = z.object({
  email: z
    .string({ required_error: "An email is required" })
    .trim()
    .email({ message: "The email is invalid" }),
});

export const ForgotPasswordForm = () => {
  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onChange: forgotPwdSchema,
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

      <form
        id="forgot-pwd-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <>
          {/* Email */}
          <form.Field
            name="email"
            children={(field) => (
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
          />
        </>
      </form>

      {formErrors.onChange ? (
        <div className="-mt-4 flex items-center gap-1 text-xs text-red-600">
          {`${(formErrors.onChange as string)?.split(", ")[0]}`}
        </div>
      ) : null}

      <div>
        <Button className="w-full" size={"lg"}>
          Request reset link
        </Button>
      </div>
    </div>
  );
};
