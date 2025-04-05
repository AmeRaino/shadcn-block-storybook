import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type TProps = {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
} & Omit<React.ComponentProps<typeof Input>, "prefix" | "ref">;

function MyInput({ className, suffix, prefix, ...props }: TProps) {
  return (
    <div className="relative">
      <Input
        className={cn(
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:text-destructive aria-invalid:bg-[#FEF2F2]",
          "peer",
          prefix && "ps-9",
          suffix && "pe-9",
          className
        )}
        {...props}
      />
      {prefix && (
        <span className="[&>svg]:size-4 text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
          {prefix}
        </span>
      )}
      {suffix && (
        <span className="[&>svg]:size-4 text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
          {suffix}
        </span>
      )}
    </div>
  );
}

export { MyInput };
