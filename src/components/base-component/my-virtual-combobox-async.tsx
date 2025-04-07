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
import { useVirtualizer } from "@tanstack/react-virtual";
import * as React from "react";
import { ComponentProps, useEffect, useMemo } from "react";
import { Badge } from "../ui/badge";
import { MyIconfy } from "./my-icon";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useBoolean } from "@/hooks/useBoolean";

type TInfiniteQueryProps = {
  query: Omit<ReturnType<typeof useInfiniteQuery>, "data">;
  onSearch: (value: string) => void;
};

type TOnChangeCallBackParams<T> = {
  eventSelect: boolean;
  value: T;
  values: ReturnType<typeof useSet<T>>["0"];
};

type TSelectMode = "single" | "multiple";

type TMyVirtualComboboxAsyncProps<
  TData,
  TValue extends keyof TData = keyof TData,
  TLabel extends keyof TData = keyof TData
> = {
  height?: string;
  selectedState: ReturnType<typeof useSet<TData[TValue]>>;
  options?: TData[];
  select: { value: TValue; label: TLabel };
  truncate?: number;
  allowClear?: boolean;
  loading?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  triggerProps?: ComponentProps<"button">;
  badgeProps?: React.ComponentPropsWithoutRef<typeof Badge>;
  infiniteQueryProps: TInfiniteQueryProps;
  openControllerProps: ReturnType<typeof useBoolean>;
  renderLabel?: (option: TData) => string | React.ReactNode;
  onChangeCallBack?: (params: TOnChangeCallBackParams<TData[TValue]>) => void;
  renderTrigger?: (
    props: TMyVirtualComboboxTriggerProps<TData, TValue, TLabel>
  ) => React.ReactNode;
  mode?: TSelectMode;
};

export function MyVirtualComboboxAsync<
  TData,
  TValue extends keyof TData = keyof TData,
  TLabel extends keyof TData = keyof TData
>({
  selectedState,
  height = "400px",
  triggerProps,
  placeholder = "",
  searchPlaceholder = "Tìm kiếm...",
  emptyMessage = "Không có dữ liệu",
  options = [],
  select = {
    value: "Id" as TValue,
    label: "Name" as TLabel,
  },
  allowClear = true,
  loading = false,
  truncate,
  badgeProps,
  infiniteQueryProps,
  openControllerProps,
  renderLabel,
  onChangeCallBack,
  renderTrigger,
  mode = "single",
}: TMyVirtualComboboxAsyncProps<TData, TValue, TLabel>) {
  const [selectedValues, selectedValuesActions] = selectedState;

  const { className: triggerClassName, ...restTriggerProps } =
    triggerProps || {};

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
      openControllerProps.setFalse();
    }
  };

  return (
    <Popover
      open={openControllerProps.value}
      onOpenChange={openControllerProps.toggle}
    >
      <PopoverTrigger asChild>
        {renderTrigger ? (
          renderTrigger({
            selectedValues,
            placeholder,
            options,
            select,
            className: triggerClassName,
            open: openControllerProps.value,
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
          <MyVirtualComboboxTrigger
            truncate={truncate}
            badgeProps={badgeProps}
            loading={loading}
            allowClear={allowClear}
            selectedValues={selectedValues}
            placeholder={placeholder}
            options={options}
            select={select}
            className={triggerClassName}
            open={openControllerProps.value}
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
        <MyVirtualComboboxContent
          height={height}
          emptyMessage={emptyMessage}
          filteredOptions={options}
          searchPlaceholder={searchPlaceholder}
          select={select}
          selectedValues={selectedValues}
          infiniteQueryProps={infiniteQueryProps}
          onAddValue={onAddValue}
          onRemoveValue={onRemoveValue}
          renderLabel={renderLabel}
          mode={mode}
        />
      </PopoverContent>
    </Popover>
  );
}

type TMyVirtualComboboxContentProps<
  TData,
  TValue extends keyof TData = keyof TData,
  TLabel extends keyof TData = keyof TData
> = {
  height: string;
  selectedValues: ReturnType<typeof useSet<TData[TValue]>>[0];
  filteredOptions: TData[];
  select: { value: TValue; label: TLabel };
  searchPlaceholder?: string;
  emptyMessage?: string;
  infiniteQueryProps: TInfiniteQueryProps;
  onAddValue: (key: TData[TValue]) => void;
  onRemoveValue: (key: TData[TValue]) => void;
  renderLabel?: (option: TData) => string | React.ReactNode;
  onChangeCallBack?: (params: TOnChangeCallBackParams<TData[TValue]>) => void;
  mode?: TSelectMode;
};

const MyVirtualComboboxContent = <
  TData,
  TValue extends keyof TData = keyof TData,
  TLabel extends keyof TData = keyof TData
>({
  height,
  searchPlaceholder,
  emptyMessage,
  filteredOptions,
  select,
  selectedValues,
  infiniteQueryProps,
  onChangeCallBack,
  onAddValue,
  onRemoveValue,
  renderLabel,
  mode = "multiple",
}: TMyVirtualComboboxContentProps<TData, TValue, TLabel>) => {
  const parentRef = React.useRef(null);
  const { isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    infiniteQueryProps.query;

  const totalCount = filteredOptions.length;

  const virtualizer = useVirtualizer({
    count: hasNextPage ? totalCount + 1 : totalCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  const virtualOptions = virtualizer.getVirtualItems();
  const lastVirtualItem = virtualizer.getVirtualItems().at(-1);

  useEffect(() => {
    // Check if we need to load more items
    const isLastItemVisible =
      lastVirtualItem &&
      !isFetchingNextPage &&
      hasNextPage &&
      lastVirtualItem.index >= totalCount - 1;

    if (isLastItemVisible) {
      fetchNextPage();
    }
  }, [
    lastVirtualItem,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    totalCount,
  ]);

  return (
    <Command shouldFilter={false}>
      <CommandInput
        onValueChange={infiniteQueryProps.onSearch}
        placeholder={searchPlaceholder}
      />
      <CommandList
        ref={parentRef}
        style={{
          height: height,
          width: "100%",
          overflow: "auto",
        }}
      >
        <CommandEmpty>
          {isLoading ? (
            <MyIconfy
              icon={commonIcon.loader}
              className="animate-spin"
              size="sm"
            />
          ) : (
            emptyMessage
          )}
        </CommandEmpty>
        <CommandGroup>
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {virtualOptions.map((virtualOption) => {
              const isLoaderRow = virtualOption.index >= totalCount;
              const optionValue = isLoaderRow
                ? null
                : filteredOptions[virtualOption.index][select.value];

              const optionLabel = isLoaderRow
                ? null
                : filteredOptions[virtualOption.index][select.label];

              const isSelected = optionValue
                ? selectedValues.has(optionValue)
                : false;
              const coerceStringValue = String(optionValue);

              return (
                <CommandItem
                  key={coerceStringValue}
                  className={cn(
                    "absolute left-0 top-0 w-full bg-transparent",
                    isLoaderRow
                      ? "flex items-center justify-center"
                      : "hover:bg-gray-50 transition-colors flex items-center"
                  )}
                  style={{
                    height: `${virtualOption.size}px`,
                    transform: `translateY(${virtualOption.start}px)`,
                  }}
                  value={coerceStringValue}
                  onSelect={(currentValue) => {
                    const coerceCurrentValue =
                      typeof optionValue === "string"
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
                  {isLoaderRow
                    ? isFetchingNextPage && (
                        <MyIconfy
                          icon={commonIcon.loader}
                          className="animate-spin"
                          size="sm"
                        />
                      )
                    : optionLabel && (
                        <>
                          <div className="flex-1 truncate pr-2">
                            {renderLabel
                              ? renderLabel(
                                  filteredOptions[virtualOption.index]
                                )
                              : (filteredOptions[virtualOption.index][
                                  select.label
                                ] as string)}
                          </div>
                          <MyIconfy
                            icon={commonIcon.check}
                            className={cn(
                              "ml-auto h-4 w-4 shrink-0",
                              isSelected ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </>
                      )}
                </CommandItem>
              );
            })}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

type TMyVirtualComboboxTriggerProps<
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

export const MyVirtualComboboxTrigger = <
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
  mode = "multiple",
  ...props
}: TMyVirtualComboboxTriggerProps<TData, TValue, TLabel>) => {
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
        "group-aria-invalid:ring-destructive/20 dark:group-aria-invalid:ring-destructive/40 group-aria-invalid:border-destructive group-aria-invalid:bg-[#FEF2F2]",
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

MyVirtualComboboxTrigger.displayName = "MyVirtualComboboxTrigger";

export const MyVirtualComboboxTriggerLabel = ({
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

MyVirtualComboboxTriggerLabel.displayName = "MyVirtualComboboxTriggerLabel";
