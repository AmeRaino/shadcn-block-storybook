import * as React from "react";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

type TProps = React.ComponentProps<typeof Checkbox>;
function MyCheckbox({ className, ...props }: TProps) {
  return (
    <Checkbox
      className={cn(
        "aria-[invalid=true]:ring-destructive/20 dark:aria-[invalid=true]:ring-destructive/40 aria-[invalid=true]:border-destructive aria-[invalid=true]:text-destructive aria-[invalid=true]:bg-[#FEF2F2]",
        className
      )}
      {...props}
    />
  );
}

export { MyCheckbox };
