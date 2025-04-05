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
import { Switch } from "@/components/ui/switch";
import { ComponentProps } from "react";

type TFormSwitch<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TFieldName;
  control: Control<TFieldValues>;
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  formLabelProps?: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;
  containerProps?: ComponentProps<"div">;
  onCheckedChangeCallBack?: (e: boolean) => void | boolean;
} & Omit<ComponentProps<typeof Switch>, "onChange" | "checked">;

export const FormSwitch = <
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
}: TFormSwitch<TFieldValues, TFieldName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange, ...fieldProps } }) => (
        <FormItem>
          {label && <FormLabel {...formLabelProps}>{label}</FormLabel>}
          <div {...containerProps}>
            <FormControl>
              <Switch
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
