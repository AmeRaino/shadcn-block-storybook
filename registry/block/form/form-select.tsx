"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { SelectProps, SelectTriggerProps } from "@radix-ui/react-select";
import { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type TMapOption<T> = {
  value: keyof T;
  label: keyof T;
};

type TFormSelect<
  TData,
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TFieldName;
  control: Control<TFieldValues>;
  label?: string;
  formLabelProps?: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;
  placeholder?: string;
  triggerProps?: SelectTriggerProps;
  options: TData[];
  select?: TMapOption<TData>;
  renderLabel?: (option: TData) => string | React.ReactNode;
  onChangeCallBack?: (value: string) => void | string;
  required?: boolean;
} & Omit<SelectProps, "onValueChange" | "value">;

export const FormSelect = <
  TData,
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  children,
  triggerProps,
  formLabelProps,
  name,
  control,
  label,
  placeholder,
  options,
  select = {
    value: "Id" as keyof TData,
    label: "Name" as keyof TData,
  },
  renderLabel,
  onChangeCallBack,
  required,
  ...props
}: TFormSelect<TData, TFieldValues, TFieldName>) => {
  const { className, ...restTriggerProps } = triggerProps || {};

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel {...formLabelProps}>
              {label}
              {required && <span className="text-destructive">*</span>}
            </FormLabel>
          )}
          <Select
            {...props}
            onValueChange={(e) => {
              if (typeof onChangeCallBack !== "function") {
                field.onChange(e);
                return;
              }

              const formatValue = onChangeCallBack(e);
              field.onChange(typeof formatValue === "string" ? formatValue : e);
            }}
          >
            <FormControl>
              <SelectTrigger
                className={cn(
                  "w-full",
                  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:text-destructive aria-invalid:bg-[#FEF2F2]",
                  className
                )}
                {...restTriggerProps}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem
                  key={String(option[select.value])}
                  value={String(option[select.value])}
                >
                  {renderLabel
                    ? renderLabel(option)
                    : String(option[select.label])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {children}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
