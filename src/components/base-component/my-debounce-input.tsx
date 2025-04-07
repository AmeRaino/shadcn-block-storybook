import React, { useState } from "react";
import { MyInput } from "./my-input";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

type TProps = {
  debounce?: number;
  onChange?: (value: string | number | readonly string[] | undefined) => void;
} & Omit<React.ComponentPropsWithoutRef<typeof MyInput>, "value" | "onChange">;

export const MyDebounceInput = ({
  defaultValue,
  debounce = 500,
  onChange,
  ...props
}: TProps) => {
  const [value, setValue] = useState<
    string | number | readonly string[] | undefined
  >(defaultValue || "");

  const debouncedSetFilterSearch = useDebouncedCallback(
    (value: string | number | readonly string[] | undefined) => {
      onChange?.(value);
    },
    debounce
  );

  return (
    <MyInput
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
        debouncedSetFilterSearch(event.target.value);
      }}
      {...props}
    />
  );
};
