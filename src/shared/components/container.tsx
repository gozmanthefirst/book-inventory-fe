// External Imports
import { HTMLAttributes, Ref } from "react";

// Local Imports
import { cn } from "../lib/utils/cn";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export const Container = ({ className, ref, ...props }: ContainerProps) => {
  return (
    <div
      ref={ref}
      className={cn("container max-w-3xl", className)}
      {...props}
    />
  );
};
