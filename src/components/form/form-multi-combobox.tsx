"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { ComponentProps, useMemo, useState } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  MyMultiCombobox,
  MyMultiComboboxTrigger,
  MyMultiPopoverContent,
} from "@/components/base-component/my-multi-combobox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverTrigger } from "@/components/ui/popover";

type TFormMultiCombobox<
  TData,
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TFieldName;
  control: Control<TFieldValues>;
  label?: string;
  formLabelProps?: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;
} & ComponentProps<typeof MyMultiCombobox<TData>>;

// Utility function to convert a value to a Set
const valueToSet = (value: unknown): Set<string> => {
  if (!value) return new Set<string>();
  if (value instanceof Set) return value as Set<string>;
  return new Set(Array.isArray(value) ? value : [value]);
};

export const FormMultiCombobox = <
  TData,
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  children,
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
    value: "Id" as keyof TData,
    label: "Name" as keyof TData,
  },
  fieldFilter,
  allowClear = true,
  loading = false,
  truncate = 3,
  renderLabel,
  onChangeCallBack,
}: TFormMultiCombobox<TData, TFieldValues, TFieldName>) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { className: triggerClassName, ...restTriggerProps } =
    triggerProps || {};

  const filteredOptions = useMemo(() => {
    if (!searchValue) {
      return options;
    }

    const fieldsToFilter =
      fieldFilter && fieldFilter.length > 0 ? fieldFilter : [select.value];

    return options.filter((option) => {
      return fieldsToFilter.some((field) => {
        const fieldValue = String(option[field] || "").toLowerCase();
        return fieldValue.includes(searchValue.toLowerCase());
      });
    });
  }, [options, searchValue, fieldFilter, select.value]);

  const onClosePopover = () => {
    setOpen(false);
  };

  const onSearch = (value: string) => {
    setSearchValue(value);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Convert field.value to a Set using the utility function
        const valuesSet = valueToSet(field.value);

        const onClear = () => {
          field.onChange(new Set<string>());
        };

        const onRemoveValue = (value: string) => {
          const newValues = new Set(valuesSet);
          newValues.delete(value);
          field.onChange(newValues);
          onChangeCallBack?.({
            eventSelect: false,
            value,
            values: newValues,
          });
        };

        const onAddValue = (value: string) => {
          const newValues = new Set(valuesSet);
          newValues.add(value);
          field.onChange(newValues);
          onChangeCallBack?.({
            eventSelect: true,
            value,
            values: newValues,
          });
        };

        return (
          <FormItem className="flex flex-col">
            {label && <FormLabel {...formLabelProps}>{label}</FormLabel>}
            <Popover modal={true} open={open} onOpenChange={setOpen}>
              <FormControl>
                <PopoverTrigger asChild>
                  {children ? (
                    children({
                      values: valuesSet,
                      placeholder,
                      options,
                      select,
                      className: triggerClassName,
                      open,
                      allowClear,
                      loading,
                      truncate,
                      onClear,
                      onRemoveValue,
                      ...restTriggerProps,
                    })
                  ) : (
                    <MyMultiComboboxTrigger
                      truncate={truncate}
                      loading={loading}
                      allowClear={allowClear}
                      values={valuesSet}
                      placeholder={placeholder}
                      options={options}
                      select={select}
                      className={triggerClassName}
                      open={open}
                      buttonProps={restTriggerProps}
                      onClear={onClear}
                      onRemoveValue={onRemoveValue}
                    />
                  )}
                </PopoverTrigger>
              </FormControl>
              <MyMultiPopoverContent
                fieldFilter={fieldFilter}
                searchPlaceholder={searchPlaceholder}
                onSearch={onSearch}
                emptyMessage={emptyMessage}
                filteredOptions={filteredOptions}
                select={select}
                selectedValues={valuesSet}
                onChangeCallBack={onChangeCallBack}
                onAddValue={onAddValue}
                onRemoveValue={onRemoveValue}
                onClosePopover={onClosePopover}
                renderLabel={renderLabel}
              />
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
