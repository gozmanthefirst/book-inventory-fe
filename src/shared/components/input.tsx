// External Imports
import * as React from "react";
import { Ref } from "react";

// Local Imports
import { cn } from "../lib/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
}

export const Input = ({ className, ref, type, ...props }: InputProps) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full border border-neutral-300 bg-transparent px-4 py-1 text-sm text-neutral-900 transition-colors duration-200 group-first:rounded-t-2xl group-last:rounded-b-2xl file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 hover:border-brand-200 focus-visible:border-brand-400 focus-visible:ring-4 focus-visible:ring-brand-400/20 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
};
