"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { ComponentProps } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MyCombobox } from "../base-component/my-combobox";

type TFormCombobox<
  TData,
  TValue extends keyof TData = keyof TData,
  TLabel extends keyof TData = keyof TData,
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TFieldName;
  control: Control<TFieldValues>;
  label?: string;
  formLabelProps?: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;
} & Omit<
  ComponentProps<typeof MyCombobox<TData, TValue, TLabel>>,
  "selectedState"
>;

// Utility function to convert a value to a Set
const valueToSet = <T,>(value: unknown): Set<T> => {
  if (!value) return new Set<T>();
  if (value instanceof Set) return value as Set<T>;
  return new Set(Array.isArray(value) ? value : [value]);
};

export const FormCombobox = <
  TData,
  TValue extends keyof TData = keyof TData,
  TLabel extends keyof TData = keyof TData,
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  formLabelProps,
  triggerProps,
  placeholder = "",
  searchPlaceholder = "Tìm kiếm...",
  emptyMessage = "Không có dữ liệu",
  options,
  select = {
    value: "Id" as TValue,
    label: "Name" as TLabel,
  },
  fieldFilter,
  allowClear = true,
  loading = false,
  truncate = 3,
  renderLabel,
  onChangeCallBack,
  mode = "single",
}: TFormCombobox<TData, TValue, TLabel, TFieldValues, TFieldName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Convert field.value to a Set using the utility function
        const valuesSet = valueToSet<TData[TValue]>(field.value);
        const selectedState: readonly [
          Set<TData[TValue]>,
          {
            readonly add: (key: TData[TValue]) => void;
            readonly remove: (key: TData[TValue]) => void;
            readonly reset: () => void;
          }
        ] = [
          valuesSet,
          {
            add: (value: TData[TValue]) => {
              const newValues = new Set(valuesSet);
              newValues.add(value);
              field.onChange(mode === "single" ? value : newValues);
              onChangeCallBack?.({
                eventSelect: true,
                value,
                values: newValues,
              });
            },
            remove: (value: TData[TValue]) => {
              const newValues = new Set(valuesSet);
              newValues.delete(value);
              field.onChange(mode === "single" ? null : newValues);
              onChangeCallBack?.({
                eventSelect: false,
                value,
                values: newValues,
              });
            },
            reset: () => {
              field.onChange(
                mode === "single" ? null : new Set<TData[TValue]>()
              );
            },
          },
        ];

        return (
          <FormItem className="flex flex-col">
            {label && <FormLabel {...formLabelProps}>{label}</FormLabel>}
            <FormControl>
              <div className="group">
                <MyCombobox
                  selectedState={selectedState}
                  triggerProps={triggerProps}
                  placeholder={placeholder}
                  searchPlaceholder={searchPlaceholder}
                  emptyMessage={emptyMessage}
                  options={options}
                  select={select}
                  fieldFilter={fieldFilter}
                  allowClear={allowClear}
                  loading={loading}
                  truncate={truncate}
                  renderLabel={renderLabel}
                  onChangeCallBack={onChangeCallBack}
                  mode={mode}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
