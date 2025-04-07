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
import useSet from "@/hooks/useSet";
import { cn } from "@/lib/utils";
import { commonIcon } from "@/shared/common-icon";
import * as React from "react";
import { ComponentProps, useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { MyIconfy } from "./my-icon";

type TSelectMode = "single" | "multiple";

type TOnChangeCallBackParams<T> = {
  eventSelect: boolean;
  value: T;
  values: ReturnType<typeof useSet<T>>["0"];
};

type TNorComboboxProps<
  TData,
  TValue extends keyof TData = keyof TData,
  TLabel extends keyof TData = keyof TData
> = {
  height?: string;
  selectedState: ReturnType<typeof useSet<TData[TValue]>>;
  options?: TData[];
  select: { value: TValue; label: TLabel };
  fieldFilter?: Array<keyof TData>;
  truncate?: number;
  allowClear?: boolean;
  loading?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  triggerProps?: ComponentProps<"button">;
  badgeProps?: React.ComponentPropsWithoutRef<typeof Badge>;
  renderLabel?: (option: TData) => string | React.ReactNode;
  onChangeCallBack?: (params: TOnChangeCallBackParams<TData[TValue]>) => void;
  renderTrigger?: (
    props: TMyNorMultiComboboxTriggerProps<TData, TValue, TLabel>
  ) => React.ReactNode;
  mode?: TSelectMode;
};

export function NorCombobox<
  TData,
  TValue extends keyof TData = keyof TData,
  TLabel extends keyof TData = keyof TData
>({
  selectedState,
  triggerProps,
  placeholder = "",
  searchPlaceholder = "Tìm kiếm...",
  emptyMessage = "Không có dữ liệu",
  options = [],
  select = {
    value: "Id" as TValue,
    label: "Name" as TLabel,
  },
  fieldFilter,
  allowClear = true,
  loading = false,
  truncate,
  badgeProps,
  renderLabel,
  onChangeCallBack,
  renderTrigger,
  mode = "single",
}: TNorComboboxProps<TData, TValue, TLabel>) {
  const [open, setOpen] = React.useState(false);
  const [selectedValues, selectedValuesActions] = selectedState;
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

  const onSearch = (value: string) => {
    setSearchValue(value);
  };

  const onClear = () => {
    selectedValuesActions.reset();
  };

  const onRemoveValue = (value: TData[TValue]) => {
    onChangeCallBack?.({ eventSelect: false, value, values: selectedValues });
    selectedValuesActions.remove(value);
  };

  const onAddValue = (value: TData[TValue]) => {
    if (mode === "single") {
      selectedValuesActions.reset();
    }

    onChangeCallBack?.({ eventSelect: true, value, values: selectedValues });
    selectedValuesActions.add(value);

    if (mode === "single") {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {renderTrigger ? (
          renderTrigger({
            selectedValues,
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
            mode,
            ...restTriggerProps,
          })
        ) : (
          <MyNorMultiComboboxTrigger
            truncate={truncate}
            badgeProps={badgeProps}
            loading={loading}
            allowClear={allowClear}
            selectedValues={selectedValues}
            placeholder={placeholder}
            options={options}
            select={select}
            className={triggerClassName}
            open={open}
            buttonProps={restTriggerProps}
            onClear={onClear}
            onRemoveValue={onRemoveValue}
            mode={mode}
          />
        )}
      </PopoverTrigger>
      <PopoverContent
        className="p-0 w-full"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <NorCommand
          emptyMessage={emptyMessage}
          filteredOptions={filteredOptions}
          searchPlaceholder={searchPlaceholder}
          select={select}
          selectedValues={selectedValues}
          onSearch={onSearch}
          onAddValue={onAddValue}
          onRemoveValue={onRemoveValue}
          renderLabel={renderLabel}
          mode={mode}
        />
      </PopoverContent>
    </Popover>
  );
}

type TNorCommandProps<
  TData,
  TValue extends keyof TData = keyof TData,
  TLabel extends keyof TData = keyof TData
> = {
  selectedValues: ReturnType<typeof useSet<TData[TValue]>>[0];
  filteredOptions: TData[];
  select: { value: TValue; label: TLabel };
  searchPlaceholder?: string;
  emptyMessage?: string;
  onSearch: (value: string) => void;
  onAddValue: (key: TData[TValue]) => void;
  onRemoveValue: (key: TData[TValue]) => void;
  renderLabel?: (option: TData) => string | React.ReactNode;
  onChangeCallBack?: (params: TOnChangeCallBackParams<TData[TValue]>) => void;
  mode?: TSelectMode;
};

const NorCommand = <
  TData,
  TValue extends keyof TData = keyof TData,
  TLabel extends keyof TData = keyof TData
>({
  searchPlaceholder,
  emptyMessage,
  filteredOptions,
  select,
  selectedValues,
  onSearch,
  onChangeCallBack,
  onAddValue,
  onRemoveValue,
  renderLabel,
  mode = "single",
}: TNorCommandProps<TData, TValue, TLabel>) => {
  return (
    <Command shouldFilter={false}>
      <CommandInput onValueChange={onSearch} placeholder={searchPlaceholder} />
      <CommandList>
        <CommandEmpty>{emptyMessage}</CommandEmpty>
        <CommandGroup>
          {filteredOptions.map((option) => {
            const optionValue = option[select.value];

            const optionLabel = option[select.label];

            const isSelected = optionValue
              ? selectedValues.has(optionValue)
              : false;
            const coerceStringValue = String(optionValue);

            return (
              <CommandItem
                key={coerceStringValue}
                value={coerceStringValue}
                title={String(optionLabel)}
                onSelect={(currentValue) => {
                  const coerceCurrentValue =
                    typeof option[select.value] === "string"
                      ? currentValue
                      : Number(currentValue);

                  if (mode === "single" || !isSelected) {
                    onAddValue(coerceCurrentValue as TData[TValue]);
                  } else if (isSelected) {
                    onRemoveValue(coerceCurrentValue as TData[TValue]);
                  }

                  const newSet = new Set(selectedValues);
                  if (mode === "single") {
                    newSet.clear();
                    newSet.add(coerceCurrentValue as TData[TValue]);
                    onChangeCallBack?.({
                      eventSelect: true,
                      value: coerceCurrentValue as TData[TValue],
                      values: newSet,
                    });
                  } else if (isSelected) {
                    onChangeCallBack?.({
                      eventSelect: false,
                      value: coerceCurrentValue as TData[TValue],
                      values: newSet,
                    });
                    newSet.delete(coerceCurrentValue as TData[TValue]);
                  } else {
                    onChangeCallBack?.({
                      eventSelect: true,
                      value: coerceCurrentValue as TData[TValue],
                      values: newSet,
                    });
                    newSet.add(coerceCurrentValue as TData[TValue]);
                  }
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
                    "ml-auto h-4 w-4 shrink-0",
                    isSelected ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

type TMyNorMultiComboboxTriggerProps<
  TData,
  TValue extends keyof TData = keyof TData,
  TLabel extends keyof TData = keyof TData
> = {
  truncate?: number;
  badgeProps?: React.ComponentPropsWithoutRef<typeof Badge>;
  loading?: boolean;
  selectedValues: ReturnType<typeof useSet<TData[TValue]>>[0];
  options: TData[];
  select: { value: TValue; label: TLabel };
  placeholder: string;
  className?: string;
  open: boolean;
  buttonProps?: React.ComponentPropsWithoutRef<typeof Button>;
  allowClear?: boolean;
  onClear: () => void;
  onRemoveValue?: (value: TData[TValue]) => void;
  mode?: TSelectMode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value">;

export const MyNorMultiComboboxTrigger = <
  TData,
  TValue extends keyof TData = keyof TData,
  TLabel extends keyof TData = keyof TData
>({
  truncate = 3,
  badgeProps,
  loading = false,
  selectedValues,
  placeholder,
  options,
  select,
  className,
  open,
  buttonProps,
  allowClear = true,
  onClear,
  onRemoveValue,
  mode = "single",
  ...props
}: TMyNorMultiComboboxTriggerProps<TData, TValue, TLabel>) => {
  const { className: badgeClassName, ...restBadgeProps } = badgeProps || {};

  const displayData = useMemo(() => {
    const hasValues = selectedValues.size > 0;

    const selectedOptions = options.filter((option) =>
      selectedValues.has(option[select.value])
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
  }, [selectedValues, options, select.value, truncate]);

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
      ) : mode === "single" ? (
        <div className="flex items-center py-1 pr-6 overflow-hidden w-full">
          <span className="truncate">
            {displayData.selectedOptions[0]
              ? String(displayData.selectedOptions[0][select.label])
              : placeholder}
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap gap-1 items-start py-1 pr-6 overflow-hidden w-full">
          {displayData.visibleOptions.map((option) => {
            const optionValue = option[select.value];
            const label = String(option[select.label]);

            return (
              <Badge
                key={String(optionValue)}
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

                    onRemoveValue?.(optionValue as TData[TValue]);
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

MyNorMultiComboboxTrigger.displayName = "MyNorMultiComboboxTrigger";

export const MyNorMultiComboboxTriggerLabel = ({
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

MyNorMultiComboboxTriggerLabel.displayName = "MyNorMultiComboboxTriggerLabel";
