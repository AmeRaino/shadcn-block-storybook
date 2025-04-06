"use client";

import { useMemo, useState } from "react";

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
import { MyIconfy } from "@/components/base-component/my-icon";
import useSet from "@/hooks/useSet";
import { Badge } from "../ui/badge";

type TOnChangeCallBackParams = {
  eventSelect: boolean;
  value: string;
  values: Set<string>;
};

type TMapOption<T> = {
  value: keyof T;
  label: keyof T;
};

type TMyMultiCombobox<TData> = {
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  triggerProps?: React.ComponentPropsWithoutRef<typeof Button>;
  options: TData[];
  select?: TMapOption<TData>;
  fieldFilter?: Array<keyof TData>;
  allowClear?: boolean;
  loading?: boolean;
  truncate?: number;
  badgeProps?: React.ComponentPropsWithoutRef<typeof Badge>;
  renderLabel?: (option: TData) => string | React.ReactNode;
  onChangeCallBack?: (params: TOnChangeCallBackParams) => void;
  children?: (props: TMyMultiComboboxTriggerProps<TData>) => React.ReactNode;
};

export const MyMultiCombobox = <TData,>({
  children,
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
  truncate,
  badgeProps,
  renderLabel,
  onChangeCallBack,
}: TMyMultiCombobox<TData>) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedValues, selectedValuesActions] = useSet<string>();

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
    selectedValuesActions.reset();
  };

  const onRemoveValue = (value: string) => {
    onChangeCallBack?.({ eventSelect: false, value, values: selectedValues });
    selectedValuesActions.remove(value);
  };

  const onAddValue = (value: string) => {
    onChangeCallBack?.({ eventSelect: true, value, values: selectedValues });
    selectedValuesActions.add(value);
  };

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children ? (
          children({
            values: selectedValues,
            placeholder,
            options,
            select,
            className: triggerClassName,
            open,
            allowClear,
            loading,
            truncate,
            badgeProps,
            onClear,
            onRemoveValue,
            ...restTriggerProps,
          })
        ) : (
          <MyMultiComboboxTrigger
            truncate={truncate}
            badgeProps={badgeProps}
            loading={loading}
            allowClear={allowClear}
            values={selectedValues}
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
      <MyMultiPopoverContent
        fieldFilter={fieldFilter}
        searchPlaceholder={searchPlaceholder}
        onSearch={onSearch}
        emptyMessage={emptyMessage}
        filteredOptions={filteredOptions}
        select={select}
        selectedValues={selectedValues}
        onChangeCallBack={onChangeCallBack}
        onAddValue={onAddValue}
        onRemoveValue={onRemoveValue}
        onClosePopover={onClosePopover}
        renderLabel={renderLabel}
      />
    </Popover>
  );
};

MyMultiCombobox.displayName = "MyMultiCombobox";

type TMyMultiPopoverContentProps<TData> = {
  selectedValues: Set<string>;
  fieldFilter?: Array<keyof TData>;
  searchPlaceholder: string;
  emptyMessage: string;
  filteredOptions: TData[];
  select: TMapOption<TData>;
  onSearch: (value: string) => void;
  onChangeCallBack?: (params: TOnChangeCallBackParams) => void;
  onAddValue: (key: string) => void;
  onRemoveValue: (key: string) => void;
  onClosePopover: (open: boolean) => void;
  renderLabel?: (option: TData) => string | React.ReactNode;
};

export const MyMultiPopoverContent = <TData,>({
  fieldFilter,
  searchPlaceholder,
  onSearch,
  emptyMessage,
  filteredOptions,
  select,
  selectedValues,
  onChangeCallBack,
  onAddValue,
  onRemoveValue,
  onClosePopover,
  renderLabel,
}: TMyMultiPopoverContentProps<TData>) => {
  const handleClose = () => onClosePopover(false);

  return (
    <PopoverContent
      className="w-full p-0"
      style={{ width: "var(--radix-popover-trigger-width)" }}
      onEscapeKeyDown={handleClose}
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
            {filteredOptions.map((option) => {
              const optionValue = String(option[select.value]);
              const isSelected = selectedValues.has(optionValue);

              return (
                <CommandItem
                  key={optionValue}
                  value={optionValue}
                  onSelect={(currentValue) => {
                    if (isSelected) {
                      onRemoveValue(currentValue);
                    } else {
                      onAddValue(currentValue);
                    }

                    const newSet = new Set(selectedValues);
                    if (isSelected) {
                      onChangeCallBack?.({
                        eventSelect: false,
                        value: currentValue,
                        values: newSet,
                      });
                      newSet.delete(currentValue);
                    } else {
                      onChangeCallBack?.({
                        eventSelect: true,
                        value: currentValue,
                        values: newSet,
                      });
                      newSet.add(currentValue);
                    }
                  }}
                >
                  {renderLabel
                    ? renderLabel(option)
                    : String(option[select.label])}
                  <MyIconfy
                    icon={commonIcon.check}
                    className={cn(
                      "ml-auto h-4 w-4",
                      isSelected ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  );
};

MyMultiPopoverContent.displayName = "MyMultiPopoverContent";

type TMyMultiComboboxTriggerProps<TData> = {
  truncate?: number;
  badgeProps?: React.ComponentPropsWithoutRef<typeof Badge>;
  loading?: boolean;
  values: Set<string>;
  placeholder: string;
  options: TData[];
  select: TMapOption<TData>;
  className?: string;
  open: boolean;
  buttonProps?: React.ComponentPropsWithoutRef<typeof Button>;
  allowClear?: boolean;
  onClear: () => void;
  onRemoveValue?: (value: string) => void;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value">;

export const MyMultiComboboxTrigger = <TData,>({
  truncate = 3,
  badgeProps,
  loading = false,
  values,
  placeholder,
  options,
  select,
  className,
  open,
  buttonProps,
  allowClear = true,
  onClear,
  onRemoveValue,
  ...props
}: TMyMultiComboboxTriggerProps<TData>) => {
  const { className: badgeClassName, ...restBadgeProps } = badgeProps || {};

  const displayData = useMemo(() => {
    const hasValues = values.size > 0;

    const selectedOptions = options.filter((option) =>
      values.has(String(option[select.value]))
    );

    const visibleOptions = selectedOptions.slice(0, truncate);
    const remainingCount = selectedOptions.length - truncate;

    return {
      hasValues,
      isEmpty: selectedOptions.length === 0,
      selectedOptions,
      visibleOptions,
      remainingCount: remainingCount > 0 ? remainingCount : 0,
    };
  }, [values, options, select.value, truncate]);

  return (
    <Button
      type="button"
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className={cn(
        "group relative w-full text-left justify-start h-auto",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:bg-[#FEF2F2]",
        className
      )}
      {...buttonProps}
      {...props}
    >
      {!displayData.hasValues || displayData.isEmpty ? (
        <p className="opacity-50">{placeholder}</p>
      ) : (
        <div className="flex flex-wrap gap-1 items-start py-1 pr-6 overflow-hidden w-full">
          {displayData.visibleOptions.map((option) => {
            const optionValue = String(option[select.value]);
            const label = String(option[select.label]);

            return (
              <Badge
                key={optionValue}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs cursor-default border-transparent bg-muted text-foreground hover:bg-muted max-w-[100px]",
                  badgeClassName
                )}
                {...restBadgeProps}
              >
                <span className="truncate">{label}</span>
                <MyIconfy
                  size="sm"
                  icon={commonIcon.close}
                  className="h-3.5 w-3.5 cursor-pointer opacity-70 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveValue?.(optionValue);
                  }}
                />
              </Badge>
            );
          })}

          {displayData.remainingCount > 0 && (
            <div className="text-sm font-medium text-muted-foreground">
              +{displayData.remainingCount}
            </div>
          )}
        </div>
      )}
      <MyIconfy
        icon={loading ? commonIcon.loader : commonIcon.chevronDown}
        className={cn(
          "ml-auto h-4 w-4 opacity-50 shrink-0",
          displayData.hasValues && allowClear && "group-hover:opacity-0",
          loading && "animate-spin"
        )}
      />
      <MyIconfy
        size="sm"
        icon={commonIcon.cancel}
        className={cn(
          "text-neutral-400 h-4 w-4 absolute right-2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity",
          displayData.hasValues &&
            allowClear &&
            "group-hover:opacity-100 cursor-pointer"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onClear();
        }}
      />
    </Button>
  );
};

MyMultiComboboxTrigger.displayName = "MyMultiComboboxTrigger";
