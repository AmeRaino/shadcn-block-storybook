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
import { MyInput } from "@/components/base-component/my-input";

type TFormInput<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TFieldName;
  control: Control<TFieldValues>;
  label?: string | React.ReactNode;
  formLabelProps?: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;
  onChangeCallBack?: (e: React.ChangeEvent<HTMLInputElement>) => void | string;
} & Omit<ComponentProps<typeof MyInput>, "onChange" | "value">;

export const FormInput = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
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
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
