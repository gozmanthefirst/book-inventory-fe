"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useStore } from "@tanstack/react-form";
import { AnimatePresence, motion } from "motion/react";
import {
  TbAt,
  TbBrandGoogleFilled,
  TbEye,
  TbEyeOff,
  TbLockPassword,
} from "react-icons/tb";
import { RotatingLines } from "react-loader-spinner";
import { z } from "zod";

import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { InputIcon } from "@/shared/components/input-icon";
import { authClient } from "@/shared/lib/auth/auth-client";
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

const emailButtonCopy = {
  idle: "Sign in",
  loading: <RotatingLines visible width="18" strokeColor="#faf2e8" />,
  success: "Sign in successful!",
  error: "Something went wrong",
  verifyEmail: "Verify your email",
  invalidCredentials: "Invalid email or password",
};

export const SignInForm = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [buttonState, setButtonState] = useState<
    | "idle"
    | "loading"
    | "success"
    | "error"
    | "verifyEmail"
    | "invalidCredentials"
  >("idle");

  const variants = {
    initial: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: signInSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await authClient.signIn.email(
          {
            email: value.email,
            password: value.password,
            callbackURL: "/search",
          },
          {
            onRequest() {
              setButtonState("loading");
            },
            onError(ctx) {
              if (process.env.NODE_ENV !== "production") {
                console.error(ctx.error);
              }

              if (ctx.error.status === 403) {
                setButtonState("verifyEmail");
              } else if (ctx.error.status === 401) {
                setButtonState("invalidCredentials");
              } else {
                setButtonState("error");
              }
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
          Sign in
        </h1>
        <p className="text-sm text-neutral-700">
          {`Don't have an account?`}{" "}
          <Link
            href={"/sign-up"}
            className="text-brand-500 lg:hover:underline lg:hover:underline-offset-2"
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
                  type={showPwd ? "text" : "password"}
                  className="px-10"
                />
                <InputIcon
                  direction="end"
                  onClick={() => setShowPwd((state) => !state)}
                  className="cursor-pointer"
                >
                  {showPwd ? <TbEyeOff size={18} /> : <TbEye size={18} />}
                </InputIcon>
              </div>
            )}
          </form.Field>
        </>
      </form>

      {formErrors.onChange ? (
        <div className="-mt-4 flex items-center gap-1 text-xs text-red-600">
          {Object.values(formErrors.onChange)[0]?.[0]?.message}
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        <Button
          form="sign-in-form"
          size={"lg"}
          variant={
            buttonState === "error" ||
            buttonState === "verifyEmail" ||
            buttonState === "invalidCredentials"
              ? "destructive"
              : "brand"
          }
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
              {emailButtonCopy[buttonState]}
            </motion.div>
          </AnimatePresence>
        </Button>

        {/* Forgot Password */}
        <Link
          href={"/forgot-password"}
          className="self-start text-xs text-brand-500 lg:hover:underline lg:hover:underline-offset-2"
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

      <GoogleButton />
    </div>
  );
};

const googleButtonCopy = {
  idle: (
    <div className="flex items-center gap-2">
      <TbBrandGoogleFilled size={18} />
      <span className="mt-0.5">Continue with Google</span>
    </div>
  ),
  loading: <RotatingLines visible width="18" strokeColor="#005cff" />,
  success: "Signing in...",
  error: "Something went wrong",
};

const GoogleButton = () => {
  const [buttonState, setButtonState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const variants = {
    initial: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social(
        {
          provider: "google",
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
  };

  return (
    <div>
      <Button
        size={"lg"}
        variant={"secondary"}
        disabled={buttonState !== "idle"}
        onClick={handleGoogleSignIn}
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
            {googleButtonCopy[buttonState]}
          </motion.div>
        </AnimatePresence>
      </Button>
    </div>
  );
};
