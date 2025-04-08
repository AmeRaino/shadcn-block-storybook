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
import { ComponentProps, useId } from "react";
import { MyInput } from "../base-component/my-input";

type TFormFloatLabelInput<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  required?: boolean;
  float?: boolean;
  name: TFieldName;
  control: Control<TFieldValues>;
  label?: string | React.ReactNode;
  formLabelProps?: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;
  onChangeCallBack?: (e: React.ChangeEvent<HTMLInputElement>) => void | string;
} & Omit<ComponentProps<typeof MyInput>, "onChange" | "value">;

export const FormFloatLabelInput = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  required,
  float = false,
  id,
  name,
  control,
  label,
  placeholder = "",
  formLabelProps,
  onChangeCallBack,
  ...props
}: TFormFloatLabelInput<TFieldValues, TFieldName>) => {
  const { className: formLabelClassName, ...restFormLabelProps } =
    formLabelProps || {};

  const { className: formInputClassName, ...restFormInputProps } = props || {};

  const uniqueId = useId();
  const formatPlaceholder = placeholder || (!float ? "" : undefined);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, ...fieldProps } }) => (
        <FormItem>
          <FormControl>
            <MyInput
              {...fieldProps}
              {...restFormInputProps}
              className={cn(
                !float && "placeholder:opacity-0 focus:placeholder:opacity-100",
                formInputClassName
              )}
              id={id || uniqueId}
              placeholder={formatPlaceholder}
              onChange={(e) => {
                if (typeof onChangeCallBack !== "function") {
                  onChange(e);
                  return;
                }

                const formatValue = onChangeCallBack(e);
                onChange(typeof formatValue === "string" ? formatValue : e);
              }}
            >
              {label && (
                <FormLabel
                  className={cn(
                    "absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-background px-2 text-sm text-gray-500 duration-300",
                    !float && [
                      "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100",
                      "peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:px-2",
                    ],
                    float && "top-2 -translate-y-5 scale-75 px-2",
                    "dark:bg-background rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 cursor-text",
                    formLabelClassName
                  )}
                  htmlFor={id || uniqueId}
                  {...restFormLabelProps}
                >
                  {label}
                  {required && <span className="text-destructive">*</span>}
                </FormLabel>
              )}
            </MyInput>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
