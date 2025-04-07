"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { ComponentProps, useMemo, useState } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  MyCombobox,
  MyComboboxTrigger,
  MyPopoverContent,
} from "@/components/base-component/my-combobox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverTrigger } from "@/components/ui/popover";

type TFormCombobox<
  TData,
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TFieldName;
  control: Control<TFieldValues>;
  label?: string;
  formLabelProps?: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;
} & Omit<ComponentProps<typeof MyCombobox<TData>>, "valueState">;

export const FormCombobox = <
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
  renderLabel,
  onChangeCallBack,
}: TFormCombobox<TData, TFieldValues, TFieldName>) => {
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
      render={({ field }) => (
        <FormItem className="flex flex-col">
          {label && <FormLabel {...formLabelProps}>{label}</FormLabel>}
          <Popover modal={true} open={open} onOpenChange={setOpen}>
            <FormControl>
              <PopoverTrigger asChild>
                {children ? (
                  children({
                    value: field.value,
                    placeholder,
                    options,
                    select,
                    className: triggerClassName,
                    open,
                    allowClear,
                    loading,
                    onClear: () => field.onChange(undefined),
                    ...restTriggerProps,
                  })
                ) : (
                  <MyComboboxTrigger
                    loading={loading}
                    allowClear={allowClear}
                    value={field.value}
                    placeholder={placeholder}
                    options={options}
                    select={select}
                    className={triggerClassName}
                    open={open}
                    buttonProps={restTriggerProps}
                    onClear={() => field.onChange(undefined)}
                  />
                )}
              </PopoverTrigger>
            </FormControl>
            <MyPopoverContent
              fieldFilter={fieldFilter}
              searchPlaceholder={searchPlaceholder}
              onSearch={onSearch}
              emptyMessage={emptyMessage}
              filteredOptions={filteredOptions}
              select={select}
              value={field.value}
              onChangeCallBack={onChangeCallBack}
              onChangeValue={(val) => field.onChange(val)}
              onClosePopover={onClosePopover}
              renderLabel={renderLabel}
            />
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
