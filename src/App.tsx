import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Warehouse,
  PlusCircle,
} from "lucide-react";
import { inventoryApi } from "./lib/api";
import SellProductModal from "./components/SellProductModal";
import { AddProductModal } from "./components/AddProductModal";
import { ProductItem } from "./@types";

export default function App() {
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [sellisModalOpen, setIsSellModalOpen] = useState(false);

  const { data: inventoryReport, isLoading: isInventoryLoading } = useQuery({
    queryKey: ["inventory-report"],
    queryFn: () => inventoryApi.getInventoryReport(),
  });

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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Aire Inventory Management System
        </h1>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow flex items-center">
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
          <div className="bg-white p-4 rounded-lg shadow flex items-center">
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
          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <Package className="mr-4 text-purple-500" />
            <div>
              <h3 className="text-gray-500">Total Products</h3>
              <p className="text-xl font-bold">
                {isInventoryLoading
                  ? "Loading..."
                  : inventoryReport?.data.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mb-6">
          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center hover:bg-green-600"
          >
            <PlusCircle className="mr-2" /> Add Product
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600"
            onClick={() => setIsSellModalOpen(true)}
          >
            <ShoppingCart className="mr-2" /> Sell Product
          </button>
        </div>

        {/* Inventory Table */}
        <div className="bg-white shadow rounded-lg">
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
                  <td colSpan={5} className="text-center p-4">
                    Loading inventory...
                  </td>
                </tr>
              ) : (
                inventoryReport?.data.map((product: ProductItem) => (
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
          products={inventoryReport?.data || []}
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
