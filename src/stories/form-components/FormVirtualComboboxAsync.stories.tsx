import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  useInfiniteQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React from "react";

import { FormVirtualComboboxAsync } from "../../../registry/block/form/form-virtual-combobox-async";
import { MyVirtualComboboxAsync } from "../../../registry/block/base-component/my-virtual-combobox-async";
import { Form } from "@/components/ui/form";
import { commonIcon } from "../../../registry/shared/common-icon";
import { MyButton } from "../../../registry/block/base-component/my-button";
import useSet from "@/hooks/useSet";
import { useBoolean } from "@/hooks/useBoolean";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

// Sample data for the async combobox component
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail?: string;
}

// Mock products for the story
const mockProducts: Product[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Product ${i + 1}`,
  description: `Description for product ${i + 1}`,
  price: Math.floor(Math.random() * 1000) + 10,
  thumbnail:
    i % 5 === 0
      ? `https://via.placeholder.com/150?text=Product+${i + 1}`
      : undefined,
}));

// Create a new client for each story to avoid shared state issues
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: Infinity,
      },
    },
  });

// Updated mock hook for the async combobox with real useInfiniteQuery and delay
const useMockCatalogueProduct = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const comboboxController = useBoolean();
  const selectedState = useSet<number>();

  // Mock async fetch function
  const fetchProducts = async ({
    pageParam = 0,
  }): Promise<{
    products: Product[];
    total: number;
    skip: number;
    limit: number;
  }> => {
    // Add a 300ms delay to simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 300));

    const limit = 10;
    const filteredProducts = searchQuery
      ? mockProducts.filter(
          (product) =>
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
      : mockProducts;

    const skip = pageParam as number;
    const slicedProducts = filteredProducts.slice(skip, skip + limit);

    return {
      products: slicedProducts,
      total: filteredProducts.length,
      skip,
      limit,
    };
  };

  // Use real useInfiniteQuery with mock data
  const { data, ...infiniteQuery } = useInfiniteQuery({
    queryKey: ["mock-products", searchQuery],
    queryFn: fetchProducts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.skip + lastPage.limit < lastPage.total
        ? lastPage.skip + lastPage.limit
        : undefined;
    },
    enabled: comboboxController.value,
  });

  const allProducts = data?.pages.flatMap((page) => page.products) || [];

  // Add debounced search
  const debouncedSetFilterSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
  }, 300);

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

type FormVirtualComboboxAsyncProps = React.ComponentProps<
  typeof FormVirtualComboboxAsync
>;

// Wrapper component for the form to provide the React Hook Form context
const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const formSchema = z.object({
    product: z.number().min(1, "Please select a product"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: null as unknown as number,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => console.log(data))}
        className="w-[350px] space-y-4 p-4 border rounded-md bg-white"
      >
        {children}
        <MyButton
          type="submit"
          icon={commonIcon.checkCircle}
          iconPlacement="right"
        >
          Submit
        </MyButton>
      </form>
    </Form>
  );
};

// Individual story components with proper React function components
const DefaultStory = () => {
  const [submittedValue, setSubmittedValue] = React.useState<number | null>(
    null
  );

  // Define schema with proper validation
  const formSchema = z.object({
    product: z.number().min(1, "Please select a product"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: null as unknown as number,
    },
  });

  const productCatalogue = useMockCatalogueProduct();

  const onSubmit = (data: { product: number }) => {
    console.log(data);
    setSubmittedValue(data.product);
  };

  return (
    <div className="w-[350px] space-y-4 p-4 border rounded-md bg-white">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormVirtualComboboxAsync
            name="product"
            label="Product"
            control={form.control}
            placeholder="Select a product"
            select={{ value: "id", label: "title" }}
            {...productCatalogue}
          />
          <MyButton
            type="submit"
            icon={commonIcon.checkCircle}
            iconPlacement="right"
          >
            Submit
          </MyButton>
        </form>
      </Form>

      {submittedValue !== null && (
        <div className="mt-4 p-2 bg-gray-100 rounded-md space-y-2">
          <div>
            <p className="text-sm font-medium">Selected Product:</p>
            <p className="text-sm">
              {mockProducts.find((product) => product.id === submittedValue)
                ?.title || "None"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Raw Value:</p>
            <p className="text-sm font-mono bg-slate-200 p-1 rounded">
              {submittedValue}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const MultiSelectStory = () => {
  const [submittedValues, setSubmittedValues] = React.useState<{
    raw: number[] | null;
    formatted: string | null;
  }>({
    raw: null,
    formatted: null,
  });

  // Define schema with Set for multi-selection
  const formSchema = z.object({
    products: z.set(z.number()),
  });

  // Define form type from schema
  type TForm = z.infer<typeof formSchema>;

  // Define API type - convert Set to string for API
  type TApi = { products: string } & Omit<TForm, "products">;

  const form = useForm<TForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      products: new Set<number>(),
    },
  });

  const productCatalogue = useMockCatalogueProduct();

  const onSubmit = (data: TForm) => {
    // Convert Set to string for API
    const apiPayload: TApi = {
      products: Array.from(data.products).join(","),
    };

    console.log("API Payload:", apiPayload);
    setSubmittedValues({
      raw: Array.from(data.products),
      formatted: apiPayload.products,
    });
  };

  return (
    <div className="w-[350px] space-y-4 p-4 border rounded-md bg-white">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormVirtualComboboxAsync
            name="products"
            label="Products (Multiple Selection)"
            control={form.control}
            placeholder="Select products"
            select={{ value: "id", label: "title" }}
            mode="multiple"
            truncate={2}
            {...productCatalogue}
          />
          <MyButton
            type="submit"
            icon={commonIcon.checkCircle}
            iconPlacement="right"
          >
            Submit
          </MyButton>
        </form>
      </Form>

      {submittedValues.raw !== null && (
        <div className="mt-4 p-2 bg-gray-100 rounded-md space-y-2">
          <div>
            <p className="text-sm font-medium">Selected Products:</p>
            <p className="text-sm">
              {submittedValues.raw.length > 0
                ? submittedValues.raw
                    .map(
                      (id) =>
                        mockProducts.find((product) => product.id === id)?.title
                    )
                    .join(", ")
                : "None"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">API Payload Format:</p>
            <p className="text-sm font-mono bg-slate-200 p-1 rounded">
              products: &ldquo;{submittedValues.formatted}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const BaseVirtualComboboxStory = () => {
  const productCatalogue = useMockCatalogueProduct();

  return (
    <div className="w-[350px] p-4 space-y-4 border rounded-md bg-white">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Base MyVirtualComboboxAsync
        </label>
        <MyVirtualComboboxAsync
          placeholder="Select a product"
          select={{ value: "id", label: "title" }}
          {...productCatalogue}
        />
      </div>
      <div className="pt-2">
        <p className="text-sm text-muted-foreground">
          Selected Value:{" "}
          {productCatalogue.selectedState[0].size > 0
            ? Array.from(productCatalogue.selectedState[0])[0]
            : "None"}
        </p>
      </div>
    </div>
  );
};

// Add a new story component that uses the FormWrapper
const BasicFormStory = () => {
  const form = useForm({
    defaultValues: {
      product: null as unknown as number,
    },
  });

  const productCatalogue = useMockCatalogueProduct();

  return (
    <FormWrapper>
      <FormVirtualComboboxAsync
        name="product"
        label="Product with FormWrapper"
        control={form.control}
        placeholder="Select a product"
        select={{ value: "id", label: "title" }}
        {...productCatalogue}
      />
    </FormWrapper>
  );
};

// Create a decorator that wraps all stories with QueryClientProvider
const withQueryClient = (StoryFn: React.FC) => {
  // Create a new client for each story render to avoid shared state issues
  const queryClient = createQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <StoryFn />
    </QueryClientProvider>
  );
};

// Story objects using the proper React components
export const Default: StoryObj<Meta<typeof FormVirtualComboboxAsync>> = {
  args: {} as FormVirtualComboboxAsyncProps,
  parameters: {
    docs: {
      source: {
        code: `
// Default FormVirtualComboboxAsync with validation and submission display
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormVirtualComboboxAsync } from "@/components/form/form-virtual-combobox-async";
import { Form } from "@/components/ui/form";
import { useProductCatalogue } from "@/hooks/catalogue/useProductCatalogue";

function ProductForm() {
  const [submittedValue, setSubmittedValue] = useState<number | null>(null);

  // Define schema with proper validation
  const formSchema = z.object({
    product: z.number().min(1, "Please select a product"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: null as unknown as number,
    },
  });

  const productCatalogue = useProductCatalogue();

  const onSubmit = (data: { product: number }) => {
    console.log(data);
    setSubmittedValue(data.product);
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormVirtualComboboxAsync
            name="product"
            label="Product"
            control={form.control}
            placeholder="Select a product"
            select={{ value: "id", label: "title" }}
            {...productCatalogue}
          />
          <button type="submit">Submit</button>
        </form>
      </Form>

      {submittedValue !== null && (
        <div className="mt-4 p-2 bg-gray-100 rounded-md space-y-2">
          <div>
            <p className="font-medium">Selected Product:</p>
            <p>
              {products.find((product) => product.id === submittedValue)?.title || "None"}
            </p>
          </div>
          <div>
            <p className="font-medium">Raw Value:</p>
            <p className="font-mono bg-slate-200 p-1 rounded">
              {submittedValue}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}`,
      },
    },
  },
  render: () => <DefaultStory />,
};

export const MultipleSelection: StoryObj<
  Meta<typeof FormVirtualComboboxAsync>
> = {
  args: {} as FormVirtualComboboxAsyncProps,
  parameters: {
    docs: {
      source: {
        code: `
// FormVirtualComboboxAsync with multiple selection
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormVirtualComboboxAsync } from "@/components/form/form-virtual-combobox-async";
import { Form } from "@/components/ui/form";
import { useProductCatalogue } from "@/hooks/catalogue/useProductCatalogue";

function MultiProductForm() {
  const [submittedValues, setSubmittedValues] = useState<{
    raw: number[] | null;
    formatted: string | null;
  }>({
    raw: null,
    formatted: null,
  });

  // Define schema with Set for multi-selection
  const formSchema = z.object({
    products: z.set(z.number()),
  });

  // Define form type from schema
  type TForm = z.infer<typeof formSchema>;

  // Define API type - convert Set to string for API
  type TApi = { products: string } & Omit<TForm, "products">;

  const form = useForm<TForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      products: new Set<number>(),
    },
  });

  const productCatalogue = useProductCatalogue();

  const onSubmit = (data: TForm) => {
    // Convert Set to string for API
    const apiPayload: TApi = {
      products: Array.from(data.products).join(","),
    };

    console.log("API Payload:", apiPayload);
    setSubmittedValues({
      raw: Array.from(data.products),
      formatted: apiPayload.products,
    });
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormVirtualComboboxAsync
            name="products"
            label="Products (Multiple Selection)"
            control={form.control}
            placeholder="Select products"
            select={{ value: "id", label: "title" }}
            mode="multiple"
            truncate={2}
            {...productCatalogue}
          />
          <button type="submit">Submit</button>
        </form>
      </Form>

      {submittedValues.raw !== null && (
        <div className="mt-4 p-2 bg-gray-100 rounded-md space-y-2">
          <div>
            <p className="font-medium">Selected Products:</p>
            <p>
              {submittedValues.raw.length > 0
                ? submittedValues.raw
                    .map(
                      (id) =>
                        products.find((product) => product.id === id)?.title
                    )
                    .join(", ")
                : "None"}
            </p>
          </div>
          <div>
            <p className="font-medium">API Payload Format:</p>
            <p className="font-mono bg-slate-200 p-1 rounded">
              products: "{submittedValues.formatted}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}`,
      },
    },
  },
  render: () => <MultiSelectStory />,
};

export const BaseVirtualCombobox: StoryObj<
  Meta<typeof FormVirtualComboboxAsync>
> = {
  args: {} as FormVirtualComboboxAsyncProps,
  parameters: {
    docs: {
      source: {
        code: `
// Using the base MyVirtualComboboxAsync component directly
import { MyVirtualComboboxAsync } from '@/components/base-component/my-virtual-combobox-async';
import { useProductCatalogue } from '@/hooks/catalogue/useProductCatalogue';

function BaseVirtualComboboxExample() {
  const productCatalogue = useProductCatalogue();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Base MyVirtualComboboxAsync</label>
      <MyVirtualComboboxAsync
        placeholder="Select a product"
        select={{ value: "id", label: "title" }}
        {...productCatalogue}
      />
      <div className="pt-2">
        <p className="text-sm text-muted-foreground">
          Selected Value:{" "}
          {productCatalogue.selectedState[0].size > 0
            ? Array.from(productCatalogue.selectedState[0])[0]
            : "None"}
        </p>
      </div>
    </div>
  );
}`,
      },
    },
  },
  render: () => <BaseVirtualComboboxStory />,
};

export const BasicForm: StoryObj<Meta<typeof FormVirtualComboboxAsync>> = {
  args: {} as FormVirtualComboboxAsyncProps,
  parameters: {
    docs: {
      source: {
        code: `
// Basic usage with FormVirtualComboboxAsync and FormWrapper
import { useForm } from "react-hook-form";
import { FormVirtualComboboxAsync } from "@/components/form/form-virtual-combobox-async";
import { useProductCatalogue } from "@/hooks/catalogue/useProductCatalogue";
import { FormWrapper } from "./FormWrapper"; // Your form wrapper component

function BasicFormExample() {
  const form = useForm({
    defaultValues: {
      product: null as unknown as number,
    },
  });

  const productCatalogue = useProductCatalogue();

  return (
    <FormWrapper>
      <FormVirtualComboboxAsync
        name="product"
        label="Product with FormWrapper"
        control={form.control}
        placeholder="Select a product"
        select={{ value: "id", label: "title" }}
        {...productCatalogue}
      />
    </FormWrapper>
  );
}`,
      },
    },
  },
  render: () => <BasicFormStory />,
};

/**
 * `FormVirtualComboboxAsync` is a form component that integrates a virtualized, async-loading combobox with React Hook Form.
 *
 * ## Features
 * - Fully integrated with React Hook Form
 * - Displays validation errors
 * - Virtual scrolling for large datasets
 * - Infinite scrolling with React Query
 * - Async data loading
 * - Supports single and multiple selection modes
 *
 * ## Installation
 * ```bash
 * npx shadcn@latest add form-virtual-combobox-async
 * ```
 *
 * ## Creating a Custom Hook for Virtual Combobox
 *
 * To use this component, you'll need to create a custom hook that provides the necessary props.
 * Below is a template for creating such a hook:
 *
 * ```tsx
 * // useYourEntityCatalogue.ts
 * import { useBoolean } from "@/hooks/useBoolean";
 * import useSet from "@/hooks/useSet";
 * import { useInfiniteQuery } from "@tanstack/react-query";
 * import { useState } from "react";
 * import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
 *
 * interface YourEntity {
 *   id: number;
 *   name: string;
 *   // other properties
 * }
 *
 * interface EntityResponse {
 *   items: YourEntity[];
 *   total: number;
 *   skip: number;
 *   limit: number;
 * }
 *
 * export const useYourEntityCatalogue = (debounce = 500) => {
 *   const [searchQuery, setSearchQuery] = useState<string>("");
 *   const comboboxController = useBoolean();
 *   const selectedState = useSet<number>();
 *
 *   const fetchEntities = async ({ pageParam = 0 }): Promise<EntityResponse> => {
 *     // Replace with your API endpoint
 *     const url = `https://your-api.com/entities?q=${searchQuery}&limit=10&skip=${pageParam}`;
 *     const response = await fetch(url);
 *     return response.json();
 *   };
 *
 *   const { data, ...infiniteQuery } = useInfiniteQuery({
 *     queryKey: ["entities", searchQuery],
 *     queryFn: fetchEntities,
 *     initialPageParam: 0,
 *     getNextPageParam: (lastPage) => {
 *       return lastPage.skip + lastPage.limit < lastPage.total
 *         ? lastPage.skip + lastPage.limit
 *         : undefined;
 *     },
 *     enabled: comboboxController.value,
 *   });
 *
 *   const allEntities = data?.pages.flatMap((page) => page.items);
 *
 *   const debouncedSetFilterSearch = useDebouncedCallback((value: string) => {
 *     setSearchQuery(value);
 *   }, debounce);
 *
 *   return {
 *     infiniteQueryProps: {
 *       query: infiniteQuery,
 *       onSearch: debouncedSetFilterSearch,
 *     },
 *     options: allEntities,
 *     selectedState,
 *     openControllerProps: comboboxController,
 *   };
 * };
 * ```
 *
 * ## Usage with React Hook Form
 * ```tsx
 * import { useForm } from 'react-hook-form';
 * import { z } from 'zod';
 * import { zodResolver } from '@hookform/resolvers/zod';
 * import { FormVirtualComboboxAsync } from '@/components/form/form-virtual-combobox-async';
 * import { Form } from '@/components/ui/form';
 * import { useYourEntityCatalogue } from '@/hooks/catalogue/useYourEntityCatalogue';
 * import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
 *
 * // Create a client
 * const queryClient = new QueryClient();
 *
 * function YourForm() {
 *   // Define your form schema with Zod
 *   const formSchema = z.object({
 *     entity: z.number().min(1, 'Please select an entity'),
 *   });
 *
 *   // Create your form with React Hook Form
 *   const form = useForm({
 *     resolver: zodResolver(formSchema),
 *     defaultValues: {
 *       entity: null,
 *     },
 *   });
 *
 *   // Use the entity catalogue hook to fetch data
 *   const entityCatalogue = useYourEntityCatalogue();
 *
 *   return (
 *     <QueryClientProvider client={queryClient}>
 *       <Form {...form}>
 *         <form onSubmit={form.handleSubmit(onSubmit)}>
 *           <FormVirtualComboboxAsync
 *             name="entity"
 *             control={form.control}
 *             label="Entity"
 *             placeholder="Select an entity"
 *             select={{ value: 'id', label: 'name' }}
 *             {...entityCatalogue}
 *           />
 *           <button type="submit">Submit</button>
 *         </form>
 *       </Form>
 *     </QueryClientProvider>
 *   );
 * }
 * ```
 *
 * ## Handling Types for Multiple Selection and API Requests
 *
 * When working with multiple selection mode, you need to properly type your form and API payloads:
 *
 * ```tsx
 * // Define schema with Set for multi-selection
 * const formSchema = z.object({
 *   entities: z.set(z.number()),
 * });
 *
 * // Define form type from schema
 * type TForm = z.infer<typeof formSchema>;
 *
 * // Define API type - convert Set to string for API
 * type TApi = { entities: string } & Omit<TForm, "entities">;
 *
 * const form = useForm<TForm>({
 *   resolver: zodResolver(formSchema),
 *   defaultValues: {
 *     entities: new Set<number>(),
 *   },
 * });
 *
 * const onSubmit = (data: TForm) => {
 *   // Convert Set to string for API
 *   const apiPayload: TApi = {
 *     entities: Array.from(data.entities).join(","),
 *   };
 *
 *   // Send apiPayload to your API
 *   console.log("API Payload:", apiPayload);
 * };
 * ```
 *
 * ## Displaying Submitted Values
 *
 * You can display the submitted values after form submission:
 *
 * ```tsx
 * const [submittedValues, setSubmittedValues] = React.useState<{
 *   raw: number[] | null;
 *   formatted: string | null;
 * }>({
 *   raw: null,
 *   formatted: null,
 * });
 *
 * const onSubmit = (data: TForm) => {
 *   const apiPayload: TApi = {
 *     entities: Array.from(data.entities).join(","),
 *   };
 *
 *   setSubmittedValues({
 *     raw: Array.from(data.entities),
 *     formatted: apiPayload.entities,
 *   });
 * };
 *
 * // In your JSX:
 * {submittedValues.raw !== null && (
 *   <div className="mt-4 p-2 bg-gray-100 rounded-md space-y-2">
 *     <div>
 *       <p className="font-medium">Selected Entities:</p>
 *       <p>
 *         {submittedValues.raw.length > 0
 *           ? submittedValues.raw
 *               .map(id => entities.find(e => e.id === id)?.name)
 *               .join(", ")
 *           : "None"}
 *       </p>
 *     </div>
 *     <div>
 *       <p className="font-medium">API Payload Format:</p>
 *       <p className="font-mono bg-slate-200 p-1 rounded">
 *         entities: "{submittedValues.formatted}"
 *       </p>
 *     </div>
 *   </div>
 * )}
 * ```
 *
 * ## Using MyVirtualComboboxAsync directly (without form integration)
 * ```tsx
 * import { MyVirtualComboboxAsync } from '@/components/base-component/my-virtual-combobox-async';
 * import { useYourEntityCatalogue } from '@/hooks/catalogue/useYourEntityCatalogue';
 * import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
 *
 * // Create a client
 * const queryClient = new QueryClient();
 *
 * function YourComponent() {
 *   // Use the entity catalogue hook to fetch data
 *   const entityCatalogue = useYourEntityCatalogue();
 *
 *   return (
 *     <QueryClientProvider client={queryClient}>
 *       <MyVirtualComboboxAsync
 *         placeholder="Select an entity"
 *         select={{ value: 'id', label: 'name' }}
 *         {...entityCatalogue}
 *       />
 *     </QueryClientProvider>
 *   );
 * }
 * ```
 */
const meta: Meta<typeof FormVirtualComboboxAsync> = {
  title: "Form Components/FormVirtualComboboxAsync",
  component: FormVirtualComboboxAsync,
  decorators: [withQueryClient],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
