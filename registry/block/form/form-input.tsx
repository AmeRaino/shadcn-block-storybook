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
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { MyInput } from "../base-component/my-input";

type TFormInput<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TFieldName;
  control: Control<TFieldValues>;
  label?: string | React.ReactNode;
  direction?: "vertical" | "horizontal";
  formLabelProps?: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;
  containerProps?: React.ComponentPropsWithoutRef<"div">;
  onChangeCallBack?: (e: React.ChangeEvent<HTMLInputElement>) => void | string;
  required?: boolean;
} & Omit<ComponentProps<typeof MyInput>, "onChange" | "value">;

export const FormInput = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  required,
  name,
  control,
  label,
  direction = "vertical",
  formLabelProps,
  containerProps,
  onChangeCallBack,
  ...props
}: TFormInput<TFieldValues, TFieldName>) => {
  const { className: containerClassName, ...restContainerProps } =
    containerProps || {};

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, ...fieldProps } }) => (
        <FormItem
          className={cn(
            direction === "horizontal" &&
              "grid grid-cols-[max-content_1fr] gap-2",
            containerClassName
          )}
          {...restContainerProps}
        >
          {label && (
            <FormLabel {...formLabelProps}>
              {label}
              {required && <span className="text-destructive">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <MyInput
              {...fieldProps}
              {...props}
              onChange={(e) => {
                if (typeof onChangeCallBack !== "function") {
                  onChange(e);
                  return;
                }

                const formatValue = onChangeCallBack(e);
                onChange(typeof formatValue === "string" ? formatValue : e);
              }}
            />
          </FormControl>
          <FormMessage
            className={cn(direction === "horizontal" && "col-start-2")}
          />
        </FormItem>
      )}
    />
  );
};
