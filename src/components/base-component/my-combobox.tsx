"use client";

import { Dispatch, SetStateAction, useMemo, useState } from "react";

import { MyIconfy } from "@/components/base-component/my-icon";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { commonIcon } from "@/shared/common-icon";
import { TComboboxValue } from "@/types/share";

type TValueState = [TComboboxValue, Dispatch<SetStateAction<TComboboxValue>>];

type TMapOption<T> = {
  value: keyof T;
  label: keyof T;
};

type TMyCombobox<TData> = {
  valueState: TValueState;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  triggerProps?: React.ComponentPropsWithoutRef<typeof Button>;
  options: TData[];
  select?: TMapOption<TData>;
  fieldFilter?: Array<keyof TData>;
  allowClear?: boolean;
  loading?: boolean;
  renderLabel?: (option: TData) => string | React.ReactNode;
  onChangeCallBack?: (value: string) => void | string;
  children?: (props: TMyComboboxTriggerProps<TData>) => React.ReactNode;
};

export const MyCombobox = <TData,>({
  children,
  valueState,
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
}: TMyCombobox<TData>) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [value, setValue] = valueState;

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

  const onClear = () => {
    setValue(undefined);
  };

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children ? (
          children({
            value,
            placeholder,
            options,
            select,
            className: triggerClassName,
            open,
            allowClear,
            loading,
            onClear,
            ...restTriggerProps,
          })
        ) : (
          <MyComboboxTrigger
            loading={loading}
            allowClear={allowClear}
            value={value}
            placeholder={placeholder}
            options={options}
            select={select}
            className={triggerClassName}
            open={open}
            buttonProps={restTriggerProps}
            onClear={onClear}
          />
        )}
      </PopoverTrigger>
      <MyPopoverContent
        fieldFilter={fieldFilter}
        searchPlaceholder={searchPlaceholder}
        onSearch={onSearch}
        emptyMessage={emptyMessage}
        filteredOptions={filteredOptions}
        select={select}
        value={value}
        onChangeCallBack={onChangeCallBack}
        onChangeValue={(val) => setValue(val)}
        onClosePopover={onClosePopover}
        renderLabel={renderLabel}
      />
    </Popover>
  );
};

MyCombobox.displayName = "MyCombobox";

type TMyPopoverContentProps<TData> = {
  value: string | number | readonly string[] | undefined;
  fieldFilter?: Array<keyof TData>;
  searchPlaceholder: string;
  emptyMessage: string;
  filteredOptions: TData[];
  select: TMapOption<TData>;
  onSearch: (value: string) => void;
  onChangeCallBack?: (value: string) => void | string;
  onChangeValue: (
    value: string | number | readonly string[] | undefined
  ) => void;
  onClosePopover: (open: boolean) => void;
  renderLabel?: (option: TData) => string | React.ReactNode;
};

export const MyPopoverContent = <TData,>({
  fieldFilter,
  searchPlaceholder,
  onSearch,
  emptyMessage,
  filteredOptions,
  select,
  value,
  onChangeCallBack,
  onChangeValue,
  onClosePopover,
  renderLabel,
}: TMyPopoverContentProps<TData>) => {
  return (
    <PopoverContent
      className="w-full p-0"
      style={{ width: "var(--radix-popover-trigger-width)" }}
    >
      <Command>
        {!fieldFilter && <CommandInput placeholder={searchPlaceholder} />}
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
              onChange={(e) => onSearch(e.target.value)}
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
                title={String(option[select.label])}
                onSelect={(currentValue) => {
                  const newValue = currentValue === value ? "" : currentValue;
                  if (typeof onChangeCallBack !== "function") {
                    onChangeValue(newValue);
                  } else {
                    const formatValue = onChangeCallBack(newValue);
                    onChangeValue(
                      typeof formatValue === "string" ? formatValue : newValue
                    );
                  }
                  onClosePopover(false);
                }}
              >
                <div className="flex-1 truncate pr-2">
                  {renderLabel
                    ? renderLabel(option)
                    : String(option[select.label])}
                </div>
                <MyIconfy
                  icon={commonIcon.check}
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === String(option[select.value])
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
  );
};

MyPopoverContent.displayName = "MyPopoverContent";

type TMyComboboxTriggerProps<TData> = {
  loading?: boolean;
  value: string | number | readonly string[] | undefined;
  placeholder: string;
  options: TData[];
  select: TMapOption<TData>;
  className?: string;
  open: boolean;
  buttonProps?: React.ComponentPropsWithoutRef<typeof Button>;
  allowClear?: boolean;
  onClear: () => void;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value">;

export const MyComboboxTrigger = <TData,>({
  loading = false,
  value,
  placeholder,
  options,
  select,
  className,
  open,
  buttonProps,
  allowClear = true,
  onClear,
  ...props
}: TMyComboboxTriggerProps<TData>) => {
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
        "group relative w-full",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:bg-[#FEF2F2]",
        className
      )}
      {...buttonProps}
      {...props}
    >
      {displayValue}
      <MyIconfy
        icon={loading ? commonIcon.loader : commonIcon.chevronDown}
        className={cn(
          "ml-auto h-4 w-4 opacity-50",
          !!value && allowClear && "group-hover:opacity-0",
          loading && "animate-spin"
        )}
      />
      <MyIconfy
        size="sm"
        icon={commonIcon.cancel}
        className={cn(
          "text-neutral-400 h-4 w-4 absolute right-2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity",
          !!value && allowClear && "group-hover:opacity-100 cursor-pointer"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onClear();
        }}
      />
    </Button>
  );
};

MyComboboxTrigger.displayName = "MyComboboxTrigger";

export const MyComboboxTriggerLabel = ({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"span">) => {
  return (
    <span className="overflow-hidden text-ellipsis flex-1" {...props}>
      {children}
    </span>
  );
};

MyComboboxTriggerLabel.displayName = "MyComboboxTriggerLabel";
