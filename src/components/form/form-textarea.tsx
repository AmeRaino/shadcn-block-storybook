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
import { ChangeEvent, ComponentProps } from "react";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";

type TFormInput<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TFieldName;
  control: Control<TFieldValues>;
  label?: string | React.ReactNode;
  formLabelProps?: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;
  onChangeCallBack?: (e: ChangeEvent<HTMLTextAreaElement>) => void | string;
} & Omit<ComponentProps<typeof Textarea>, "onChange" | "value">;

export const FormTextArea = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  className,
  formLabelProps,
  name,
  control,
  label,
  onChangeCallBack,
  ...props
}: TFormInput<TFieldValues, TFieldName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, ...fieldProps } }) => (
        <FormItem>
          {label && <FormLabel {...formLabelProps}>{label}</FormLabel>}
          <FormControl>
            <Textarea
              className={cn(
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:text-destructive aria-invalid:bg-[#FEF2F2]",
                className
              )}
              {...fieldProps}
              {...props}
              onChange={(e) => {
                if (typeof onChangeCallBack !== "function") {
                  onChange(e);
                  return;
                }

                const formatValue = onChangeCallBack?.(e);
                onChange(typeof formatValue === "string" ? formatValue : e);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
