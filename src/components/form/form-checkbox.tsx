"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CheckedState } from "@radix-ui/react-checkbox";
import { ComponentProps } from "react";
import { MyCheckbox } from "@/components/base-component/my-checkbox";
import { cn } from "@/lib/utils";

type TFormCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TFieldName;
  control: Control<TFieldValues>;
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  formLabelProps?: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;
  containerProps?: ComponentProps<"div">;
  onCheckedChangeCallBack?: (e: CheckedState) => void | CheckedState;
} & Omit<ComponentProps<typeof MyCheckbox>, "onChange" | "checked">;

export const FormCheckbox = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  description,
  formLabelProps,
  name,
  control,
  containerProps,
  onCheckedChangeCallBack,
  ...props
}: TFormCheckbox<TFieldValues, TFieldName>) => {
  const { className: containerClassName, ...restContainerProps } =
    containerProps || {};

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange, ...fieldProps } }) => (
        <FormItem>
          {label && <FormLabel {...formLabelProps}>{label}</FormLabel>}
          <div
            className={cn("flex items-center gap-2", containerClassName)}
            {...restContainerProps}
          >
            <FormControl className={containerProps?.className}>
              <MyCheckbox
                {...props}
                {...fieldProps}
                checked={value}
                onCheckedChange={(e) => {
                  const valueCallBack = onCheckedChangeCallBack?.(e);
                  onChange(
                    typeof valueCallBack === "boolean" ? valueCallBack : e
                  );
                }}
              />
            </FormControl>
            {description}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
