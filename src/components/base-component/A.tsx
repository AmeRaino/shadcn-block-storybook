import { UseInfiniteQueryOptions, InfiniteData } from "@tanstack/react-query";

type TProps<
  TOption,
  TQueryFnData,
  TError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends readonly unknown[] = readonly unknown[],
  TPageParam = unknown
> =
  | {
      queryOptions: UseInfiniteQueryOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryFnData,
        TQueryKey,
        TPageParam
      >;
      select: { value: keyof TQueryFnData; label: keyof TQueryFnData };
    }
  | {
      options: TOption[];
      select: { value: keyof TOption; label: keyof TOption };
    };
export const A = <
  TOption,
  TQueryFnData,
  TError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends readonly unknown[] = readonly unknown[],
  TPageParam = unknown
>({}: TProps<TOption, TQueryFnData, TError, TData, TQueryKey, TPageParam>) => {
  return null;
};
