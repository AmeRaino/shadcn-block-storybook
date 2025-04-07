import { useBoolean } from "@/hook/useBoolean";
import useSet from "@/hook/useSet";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebouncedCallback } from "../use-debounced-callback";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail?: string;
  [key: string]: string | number | boolean | undefined;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

type TProps = {
  debounce?: number;
};

export const useCatalogueProduct = ({ debounce = 500 }: TProps = {}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const comboboxController = useBoolean();
  const selectedState = useSet<number>();

  const fetchProducts = async ({
    pageParam = 0,
  }): Promise<ProductsResponse> => {
    const baseUrl = "https://dummyjson.com/products/";
    const url = `${baseUrl}/search?q=${searchQuery}&limit=10&skip=${pageParam}`;

    const response = await fetch(url);
    return response.json();
  };

  const { data, ...infiniteQuery } = useInfiniteQuery({
    queryKey: ["products", searchQuery],
    queryFn: fetchProducts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.skip + lastPage.limit < lastPage.total
        ? lastPage.skip + lastPage.limit
        : undefined;
    },
    enabled: comboboxController.value,
  });

  const allProducts = data?.pages.flatMap((page) => page.products);

  const debouncedSetFilterSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
  }, debounce);

  return {
    infiniteQueryProps: {
      query: infiniteQuery,
      onSearch: debouncedSetFilterSearch,
    },
    options: allProducts,
    selectedState,
    openControllerProps: comboboxController,
  };
};
