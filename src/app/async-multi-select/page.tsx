"use client";

import { MyVirtualComboboxAsync } from "@/components/base-component/my-virtual-combobox-async";
import { useCatalogueProduct } from "@/hooks/catalogue/useCatalogueProduct";

export default function AsyncMultiSelectPage() {
  const catalogueProduct = useCatalogueProduct();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center my-6">
        Async Multi-select Combobox with Virtualization
      </h1>

      <div className="space-y-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Product Selector</h2>
          <p className="text-gray-600 mb-6">
            Search and select multiple products from DummyJSON API with infinite
            scrolling and virtualization
          </p>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Products
            </label>

            <MyVirtualComboboxAsync
              select={{ value: "id", label: "title" }}
              placeholder="Select products..."
              {...catalogueProduct}
            />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">How It Works</h2>
          <ul className="list-disc ml-5 space-y-2 text-gray-700">
            <li>
              <span className="font-medium">Separation of Concerns:</span> Data
              fetching is now handled outside the component
            </li>
            <li>
              <span className="font-medium">Debounced Search:</span> Search API
              calls are debounced to prevent excessive requests
            </li>
            <li>
              <span className="font-medium">Infinite Loading:</span> Additional
              products are loaded as you scroll down
            </li>
            <li>
              <span className="font-medium">Virtualization:</span> Only visible
              items are rendered for optimal performance
            </li>
            <li>
              <span className="font-medium">Multi-selection:</span> Multiple
              products can be selected with badge display
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
