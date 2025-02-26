"use client";

// External Imports
import { useForm, useStore } from "@tanstack/react-form";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { TbAt } from "react-icons/tb";
import { RotatingLines } from "react-loader-spinner";
import { z } from "zod";

// Local Imports
import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { InputIcon } from "@/shared/components/input-icon";
import { authClient } from "@/shared/lib/auth/auth-client";
import { cn } from "@/shared/lib/utils/cn";
import { alegreya } from "@/styles/fonts";

const forgotPwdSchema = z.object({
  email: z
    .string({ required_error: "An email is required" })
    .trim()
    .email({ message: "The email is invalid" }),
});

const buttonCopy = {
  idle: "Request reset link email",
  loading: <RotatingLines visible width="18" strokeColor="#faf2e8" />,
  success: "Reset link email sent!",
  error: "Something went wrong",
};

export const ForgotPasswordForm = () => {
  const [buttonState, setButtonState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const variants = {
    initial: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  };

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onChange: forgotPwdSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await authClient.forgetPassword(
          {
            email: value.email,
            redirectTo: "/reset-password",
          },
          {
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
            },
          },
        );
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
    },
  });

  const formErrors = useStore(form.store, (state) => state.errorMap);

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1
          className={cn(
            "text-3xl font-semibold text-brand-500",
            alegreya.className,
          )}
        >
          Forgot password
        </h1>
        <p className="text-sm text-neutral-700">
          Remembered your password?{" "}
          <Link
            href={"/sign-in"}
            className="text-brand-500 lg:hover:underline lg:hover:underline-offset-2"
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
        </>
      </form>

      {formErrors.onChange ? (
        <div className="-mt-4 flex items-center gap-1 text-xs text-red-600">
          {`${(formErrors.onChange as string)?.split(", ")[0]}`}
        </div>
      ) : null}

      <div>
        <Button
          form="forgot-pwd-form"
          size={"lg"}
          variant={buttonState === "error" ? "destructive" : "brand"}
          disabled={buttonState !== "idle"}
          className="relative w-full gap-2 overflow-hidden"
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
    </div>
  );
};
