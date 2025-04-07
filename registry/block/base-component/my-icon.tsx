"use client";

import * as React from "react";
import {
  Icon,
  IconifyIconHTMLElement,
  IconifyIconProps,
} from "@iconify-icon/react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const myIconVariants = cva("inline-flex", {
  variants: {
    variant: {
      primary: "text-primary",
      secondary: "text-secondary",
      white: "text-white",
      danger: "text-red-500",
    },
    size: {
      sm: "h-4 w-4", // size small
      md: "h-6 w-6", // size medium
      lg: "h-8 w-8", // size large
    },
  },
  defaultVariants: {
    // variant: "primary",
    size: "md",
  },
});

export interface IconfyProps
  extends Omit<IconifyIconProps, "size" | "ref">,
    VariantProps<typeof myIconVariants> {}

const MyIconfy = React.forwardRef<IconifyIconHTMLElement, IconfyProps>(
  ({ className, variant, size, icon, ...props }, ref) => {
    return (
      <Icon
        icon={icon}
        ref={ref}
        height="none"
        className={cn(myIconVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

MyIconfy.displayName = "MyIconfy";

export { MyIconfy, myIconVariants };
