import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId } from "react";

type TProps = {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  wrapperContainerProps?: React.ComponentProps<"div">;
} & Omit<React.ComponentProps<typeof Input>, "prefix" | "ref">;

function MyInput({
  className,
  suffix,
  prefix,
  children,
  wrapperContainerProps,
  ...props
}: TProps) {
  const { className: wrapperContainerClassName, ...restWrapperContainerProps } =
    wrapperContainerProps || {};

  return (
    <div
      className={cn("relative flex-1", wrapperContainerClassName)}
      {...restWrapperContainerProps}
    >
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
      {children}
    </div>
  );
}

const MyFloatingLabel = ({
  className,
  float = false,
  ...props
}: React.ComponentProps<typeof Label> & { float?: boolean }) => {
  return (
    <Label
      className={cn(
        "absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-background px-2 text-sm text-gray-500 duration-300",
        !float && [
          "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100",
          "peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:px-2",
        ],
        float && "top-2 -translate-y-5 scale-75 px-2",
        "dark:bg-background rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 cursor-text",
        className
      )}
      {...props}
    />
  );
};
MyFloatingLabel.displayName = "MyFloatingLabel";

const MyFloatingLabelInput = ({
  label,
  placeholder = "",
  float = false,
  ...props
}: React.ComponentProps<typeof Input> & {
  label?: string | React.ReactNode;
  float?: boolean;
}) => {
  const id = useId();
  const { className: inputClassName, ...restInputProps } = props || {};

  return (
    <MyInput
      id={id}
      placeholder={placeholder}
      className={cn(
        !float && "placeholder:opacity-0 focus:placeholder:opacity-100",
        inputClassName
      )}
      {...restInputProps}
    >
      <MyFloatingLabel htmlFor={id} float={float}>
        {label}
      </MyFloatingLabel>
    </MyInput>
  );
};
MyFloatingLabelInput.displayName = "MyFloatingLabelInput";

export { MyInput, MyFloatingLabel, MyFloatingLabelInput };
