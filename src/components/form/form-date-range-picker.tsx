"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { format } from "date-fns";
import {
  Control,
  FieldPath,
  FieldValues,
  useForm,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
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
import { commonIcon } from "@/shared/common-icon";
import { zodResolver } from "@hookform/resolvers/zod";
import { ComponentProps, useEffect } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import { z } from "zod";
import { MyIconfy } from "../base-component/my-icon";

type TFormDateRangePicker<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  names: [TFieldName, TFieldName];
  control: Control<TFieldValues>;
  label?: string | React.ReactNode;
  placeholder?: string;
  formLabelProps?: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;
  onChangeCallBack?: (e: DateRange | undefined) => void;
} & Omit<ComponentProps<typeof DayPicker>, "selected" | "onSelect" | "mode">;

export const FormDateRangePicker = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  formLabelProps,
  names,
  control,
  label,
  placeholder = "Chọn ngày",
  onChangeCallBack,
  ...props
}: TFormDateRangePicker<TFieldValues, TFieldName>) => {
  const [fromDateName, toDateName] = names;
  const { isSubmitting } = useFormState({ control });

  const { setValue, getValues } = useFormContext<TFieldValues>();

  return (
    <div>
      <FormDateRangePickerPortal
        defaultValues={{
          from: getValues(fromDateName),
          to: getValues(toDateName),
        }}
        isSubmitting={isSubmitting}
        label={label}
        placeholder={placeholder}
        formLabelProps={formLabelProps}
        onChangeCallBack={(range) => {
          onChangeCallBack?.(range);
          setValue(fromDateName, range?.from as TFieldValues[TFieldName]);
          setValue(toDateName, range?.to as TFieldValues[TFieldName]);
        }}
        {...props}
      />
    </div>
  );
};

const dateRangerPickerPortalSchema = z.object({
  dateRange: z.object({ from: z.date(), to: z.date() }),
});

type TFormDateRangePickerPortal = {
  defaultValues: { from: Date; to: Date };
  isSubmitting: boolean;
  label?: string | React.ReactNode;
  placeholder?: string;
  formLabelProps?: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;
  onChangeCallBack: (e: DateRange | undefined) => void;
} & Omit<ComponentProps<typeof DayPicker>, "selected" | "onSelect" | "mode">;

const FormDateRangePickerPortal = ({
  defaultValues,
  isSubmitting,
  formLabelProps,
  label,
  placeholder = "Chọn ngày",
  onChangeCallBack,
  ...props
}: TFormDateRangePickerPortal) => {
  const form = useForm<z.infer<typeof dateRangerPickerPortalSchema>>({
    resolver: zodResolver(dateRangerPickerPortalSchema),
  });

  useEffect(() => {
    form.reset({ dateRange: defaultValues });
  }, [defaultValues.from, defaultValues.to]);

  useEffect(() => {
    if (isSubmitting) {
      form.trigger("dateRange");
    }
  }, [isSubmitting]);

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name={"dateRange"}
        render={({ field: { value, onChange, ...fieldProps } }) => (
          <FormItem>
            {label && <FormLabel {...formLabelProps}>{label}</FormLabel>}
            <Popover
              onOpenChange={(open) => !open && form.trigger("dateRange")}
            >
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal justify-start",
                      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:bg-[#FEF2F2]",
                      !value && "text-muted-foreground"
                    )}
                  >
                    <MyIconfy icon={commonIcon.calendar} size="sm" />
                    {value?.from ? (
                      value.to ? (
                        <>
                          {format(value.from, "dd/MM/yyyy")} -{" "}
                          {format(value.to, "dd/MM/yyyy")}
                        </>
                      ) : (
                        format(value.from, "dd/MM/yyyy")
                      )
                    ) : (
                      <span>{placeholder}</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={value}
                  onSelect={(e) => {
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
    </Form>
  );
};
