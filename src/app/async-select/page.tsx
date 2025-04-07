"use client";

import React, { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";

// Define types for API responses
interface Product {
  id: number;
  title: string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
  </div>
);

// Wrapper component for React Query
const AsyncSelectPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center my-6">
        Infinite Query Demo with Virtualization
      </h1>
      <ProductListWithInfiniteScroll />
    </div>
  );
};

// Product list component with infinite scrolling and virtualization
const ProductListWithInfiniteScroll = () => {
  // Create a ref for the parent container
  const parentRef = useRef<HTMLDivElement>(null);

  // Define the fetch function for products
  const fetchProducts = async ({
    pageParam = 0,
  }): Promise<ProductsResponse> => {
    const response = await fetch(
      `https://dummyjson.com/products?limit=10&skip=${pageParam}&select=title`
    );
    return response.json();
  };

  // Set up infinite query
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // Check if there are more pages to load
      return lastPage.skip + lastPage.limit < lastPage.total
        ? lastPage.skip + lastPage.limit
        : undefined;
    },
  });

  // Calculate the total number of items across all pages
  const allItems = data?.pages.flatMap((page) => page.products) || [];
  const totalCount = allItems.length;

  // Set up virtualizer
  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? totalCount + 1 : totalCount, // +1 for loading more indicator
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72, // estimated height of each row in pixels
    overscan: 5, // number of items to render outside of the viewport (for smoother scrolling)
  });

  // Load more when the last row comes into view
  const lastVirtualItem = rowVirtualizer.getVirtualItems().at(-1);

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

  // Show loading state
  if (status === "pending") {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    );
  }

  // Show error state
  if (status === "error") {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Error Loading Data</h3>
        <p className="mt-2 text-red-700">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h2 className="text-2xl font-bold">Products List</h2>
        <p className="text-blue-100">
          Showing {totalCount} of {data?.pages?.[0]?.total || 0} products
        </p>
      </div>

      {/* Virtualized list container */}
      <div
        ref={parentRef}
        className="divide-y divide-gray-200 h-[500px] overflow-auto"
        style={{
          contain: "strict",
        }}
      >
        {/* Inner container with proper height for scrolling */}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {/* Only the visible items get rendered */}
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const isLoaderRow = virtualRow.index >= totalCount;
            const product = isLoaderRow ? null : allItems[virtualRow.index];

            return (
              <div
                key={virtualRow.index}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                className={`absolute top-0 left-0 w-full p-4 ${
                  isLoaderRow
                    ? "flex items-center justify-center"
                    : "hover:bg-gray-50 transition-colors flex items-center"
                }`}
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                  height: `${virtualRow.size}px`,
                }}
              >
                {isLoaderRow ? (
                  isFetchingNextPage ? (
                    <div className="flex items-center space-x-3">
                      <LoadingSpinner />
                      <p className="text-gray-500">Loading more products...</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      You&apos;ve reached the end of the list
                    </p>
                  )
                ) : (
                  product && (
                    <>
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-4">
                        {product.id}
                      </div>
                      <p className="font-medium text-gray-800">
                        {product.title}
                      </p>
                    </>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual load more button */}
      {!isFetchingNextPage && hasNextPage && (
        <div className="p-4 flex justify-center border-t border-gray-200">
          <button
            onClick={() => fetchNextPage()}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                clipRule="evenodd"
              />
            </svg>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default AsyncSelectPage;
