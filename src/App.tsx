import { useDeferredValue, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Warehouse,
  PlusCircle,
} from "lucide-react";
import { inventoryApi, useGetInventoryReportQuery } from "./lib/api";
import SellProductModal from "./components/SellProductModal";
import { AddProductModal } from "./components/AddProductModal";
import { ProductItem } from "./@types";

export default function App() {
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [sellisModalOpen, setIsSellModalOpen] = useState(false);

  const [search, setSearch] = useState("");

  const deferredSearch = useDeferredValue(search);
  const params = { search: deferredSearch };

  const { data: inventoryReport, isLoading: isInventoryLoading } =
    useGetInventoryReportQuery(params);

  const { data: dailyProfitData, isLoading: isDailyProfitLoading } = useQuery({
    queryKey: ["daily-profit"],
    queryFn: () => inventoryApi.getDailyProfit(),
  });

  const { data: totalInventoryValueData, isLoading: isInventoryValueLoading } =
    useQuery({
      queryKey: ["total-inventory-value"],
      queryFn: () => inventoryApi.getTotalInventoryValue(),
    });

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="">
        <h1 className="mb-6 text-3xl font-bold text-center">
          Aire Inventory Management System
        </h1>

        {/* Quick Stats */}
        <div className="grid gap-4 mb-6 md:grid-cols-3">
          <div className="flex items-center p-4 bg-white rounded-lg shadow">
            <Warehouse className="mr-4 text-blue-500" />
            <div>
              <h3 className="text-gray-500">Total Inventory Value</h3>
              <p className="text-xl font-bold">
                {isInventoryValueLoading
                  ? "Loading..."
                  : `N${totalInventoryValueData?.data.toLocaleString() || 0}`}
              </p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white rounded-lg shadow">
            <TrendingUp className="mr-4 text-green-500" />
            <div>
              <h3 className="text-gray-500">Daily Profit</h3>
              <p className="text-xl font-bold">
                {isDailyProfitLoading
                  ? "Loading..."
                  : `N${dailyProfitData?.data.toLocaleString() || 0}`}
              </p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white rounded-lg shadow">
            <Package className="mr-4 text-purple-500" />
            <div>
              <h3 className="text-gray-500">Total Products</h3>
              <p className="text-xl font-bold">
                {isInventoryLoading
                  ? "Loading..."
                  : inventoryReport?.data?.data.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mb-6 space-x-4">
          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="flex items-center px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            <PlusCircle className="mr-2" /> Add Product
          </button>
          <button
            className="flex items-center px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={() => setIsSellModalOpen(true)}
          >
            <ShoppingCart className="mr-2" /> Sell Product
          </button>
        </div>

        <div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name"
            className="w-1/3 p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Product Name</th>
                <th className="p-3 text-right">Quantity</th>
                <th className="p-3 text-right">Cost Price</th>
                <th className="p-3 text-right">Selling Price</th>
                <th className="p-3 text-right">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {isInventoryLoading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center">
                    Loading inventory...
                  </td>
                </tr>
              ) : (
                inventoryReport?.data?.data?.map((product: ProductItem) => (
                  <tr key={product.id} className="border-t">
                    <td className="p-3">{product.name}</td>
                    <td className="p-3 text-right">{product.quantity}</td>
                    <td className="p-3 text-right">
                      N{Number(product.costPrice).toFixed(2)}
                    </td>
                    <td className="p-3 text-right">
                      N{Number(product.sellingPrice).toFixed(2)}
                    </td>
                    <td className="p-3 text-right">
                      N
                      {Number(+product.quantity * +product.costPrice).toFixed(
                        2
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Sell Product Modal */}
        <SellProductModal
          isOpen={sellisModalOpen} // TODO: Implement sell product modal state
          onClose={() => setIsSellModalOpen(false)} // TODO: Implement close handler
          products={inventoryReport?.data?.data || []}
        />

        {/* Add Product Modal */}
        <AddProductModal
          isOpen={isAddProductModalOpen}
          onClose={() => setIsAddProductModalOpen(false)}
        />
      </div>
    </div>
  );
}
