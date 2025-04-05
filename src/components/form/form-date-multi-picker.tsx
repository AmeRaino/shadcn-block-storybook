"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { format } from "date-fns";
import { Control, FieldPath, FieldValues } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { DayPicker } from "react-day-picker";
import { MyIconfy } from "../base-component/my-icon";
import { commonIcon } from "@/shared/common-icon";

type TFormDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TFieldName;
  control: Control<TFieldValues>;
  label?: string | React.ReactNode;
  placeholder?: string;
  formLabelProps?: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;
  onChangeCallBack?: (e: Date[] | undefined) => void;
} & Omit<ComponentProps<typeof DayPicker>, "selected" | "onSelect" | "mode">;

export const FormDateMultiPicker = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  formLabelProps,
  name,
  control,
  label,
  placeholder = "Chọn ngày",
  onChangeCallBack,
  ...props
}: TFormDatePicker<TFieldValues, TFieldName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange, ...fieldProps } }) => (
        <FormItem>
          {label && <FormLabel {...formLabelProps}>{label}</FormLabel>}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !value && "text-muted-foreground"
                  )}
                >
                  <MyIconfy icon={commonIcon.calendar} />
                  {value?.length <= 2 ? (
                    <span className="ml-1">
                      {value
                        .map((date: Date) => format(date, "dd/MM/yyyy"))
                        .join(" - ")}
                    </span>
                  ) : (
                    <span>{placeholder}</span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="multiple"
                selected={value}
                onSelect={(e) => {
                  if (typeof onChangeCallBack !== "function") {
                    onChange(e);
                    return;
                  }

                  onChangeCallBack(e);
                  onChange(e);
                }}
                initialFocus
                {...fieldProps}
                {...props}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
