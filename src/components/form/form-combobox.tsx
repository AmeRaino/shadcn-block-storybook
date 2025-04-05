"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { useMemo, useState } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { commonIcon } from "@/shared/common-icon";
import { MyIconfy } from "../base-component/my-icon";

type TMapOption<T> = {
  value: keyof T;
  label: keyof T;
};

type TFormCombobox<
  TData,
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TFieldName;
  control: Control<TFieldValues>;
  label?: string;
  formLabelProps?: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  buttonProps?: React.ComponentPropsWithoutRef<typeof Button>;
  options: TData[];
  select?: TMapOption<TData>;
  fieldFilter?: Array<keyof TData>;
  renderLabel?: (option: TData) => string | React.ReactNode;
  onChangeCallBack?: (value: string) => void | string;
};

type ComboboxTriggerProps<TData> = {
  value: string;
  placeholder: string;
  options: TData[];
  select: TMapOption<TData>;
  className?: string;
  open: boolean;
  buttonProps?: React.ComponentPropsWithoutRef<typeof Button>;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value">;

const ComboboxTrigger = <TData,>({
  value,
  placeholder,
  options,
  select,
  className,
  open,
  buttonProps,
  ...props
}: ComboboxTriggerProps<TData>) => {
  const displayValue = useMemo(() => {
    if (!value) return <p className="opacity-50">{placeholder}</p>;

    const selectedOption = options.find(
      (option) => String(option[select.value]) === value
    );

    if (!selectedOption) return <p className="opacity-50">{placeholder}</p>;

    return String(selectedOption[select.label]);
  }, [value, options, select.value, select.label, placeholder]);

  return (
    <Button
      type="button"
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className={cn(
        "w-full",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:text-destructive aria-invalid:bg-[#FEF2F2]",
        className
      )}
      {...buttonProps}
      {...props}
    >
      {displayValue}
      <MyIconfy
        icon={commonIcon.chevronDown}
        className="ml-auto h-4 w-4 opacity-50"
      />
    </Button>
  );
};

export const FormCombobox = <
  TData,
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  buttonProps,
  formLabelProps,
  name,
  control,
  label,
  placeholder = "",
  searchPlaceholder = "Tìm kiếm...",
  emptyMessage = "Không có dữ liệu",
  options,
  select = {
    value: "Id" as keyof TData,
    label: "Name" as keyof TData,
  },
  fieldFilter,
  renderLabel,
  onChangeCallBack,
}: TFormCombobox<TData, TFieldValues, TFieldName>) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { className, ...restButtonProps } = buttonProps || {};

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
                <ComboboxTrigger
                  value={field.value}
                  placeholder={placeholder}
                  options={options}
                  select={select}
                  className={className}
                  open={open}
                  buttonProps={restButtonProps}
                />
              </PopoverTrigger>
            </FormControl>
            <PopoverContent
              className="w-full p-0"
              style={{ width: "var(--radix-popover-trigger-width)" }}
            >
              <Command>
                {!fieldFilter && (
                  <CommandInput placeholder={searchPlaceholder} />
                )}
                {!!fieldFilter && (
                  <div
                    data-slot="command-input-wrapper"
                    className="flex h-9 items-center gap-2 border-b px-3"
                  >
                    <MyIconfy
                      icon={commonIcon.searchIcon}
                      className="size-4 shrink-0 opacity-50"
                    />
                    <input
                      data-slot="command-input"
                      className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder={searchPlaceholder}
                    />
                  </div>
                )}
                <CommandList>
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                  <CommandGroup>
                    {filteredOptions.map((option) => (
                      <CommandItem
                        key={String(option[select.value])}
                        value={String(option[select.value])}
                        onSelect={(currentValue) => {
                          const newValue =
                            currentValue === field.value ? "" : currentValue;
                          if (typeof onChangeCallBack !== "function") {
                            field.onChange(newValue);
                          } else {
                            const formatValue = onChangeCallBack(newValue);
                            field.onChange(
                              typeof formatValue === "string"
                                ? formatValue
                                : newValue
                            );
                          }
                          setOpen(false);
                        }}
                      >
                        {renderLabel
                          ? renderLabel(option)
                          : String(option[select.label])}
                        <MyIconfy
                          icon={commonIcon.check}
                          className={cn(
                            "ml-auto h-4 w-4",
                            field.value === String(option[select.value])
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
