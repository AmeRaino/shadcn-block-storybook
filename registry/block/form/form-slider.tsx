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
import { ComponentProps } from "react";
import { Slider } from "@/components/ui/slider";

type TFormSlider<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TFieldName;
  control: Control<TFieldValues>;
  label?: string | React.ReactNode;
  formLabelProps?: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;
  onChangeCallBack?: (e: number[]) => void;
  required?: boolean;
} & Omit<ComponentProps<typeof Slider>, "onChange" | "value">;

export const FormSlider = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  formLabelProps,
  name,
  control,
  label,
  step = 1,
  onChangeCallBack,
  required,
  ...props
}: TFormSlider<TFieldValues, TFieldName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value, ...fieldProps } }) => {
        // Convert the value to a number to ensure type safety
        const numericValue = typeof value === "number" ? value : Number(value);

        return (
          <FormItem>
            {label && (
              <FormLabel {...formLabelProps}>
                {label}
                {required && <span className="text-destructive">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <Slider
                {...fieldProps}
                {...props}
                step={step}
                value={[numericValue]}
                onValueChange={(values) => {
                  onChangeCallBack?.(values);
                  onChange(values[0]);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
