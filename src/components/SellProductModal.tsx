import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useSellProductMutation } from "../lib/api";
import { SalesItem } from "../@types";
import { useQueryClient } from "@tanstack/react-query";

interface Product {
  id: string;
  name: string;
  quantity: number;
}

interface SellProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

const SellProductModal: React.FC<SellProductModalProps> = ({
  isOpen,
  onClose,
  products,
}) => {
  const [saleData, setSaleData] = useState<SalesItem>({
    name: "",
    quantity: "",
  });

  const queryClient = useQueryClient();

  const sellProductMutation = useSellProductMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sellProductMutation.mutate(
      {
        name: saleData.name,
        quantity: parseInt(saleData.quantity),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      {
        onSuccess: () => {
          onClose();
          setSaleData({
            name: "",
            quantity: "",
          });
          queryClient.invalidateQueries({
            queryKey: [
              "inventory-report",
              "daily-profit",
              "total-inventory-value",
            ],
          });
        },
        onError: (error) => {
          console.error("Error selling product:", error);
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <ShoppingCart className="mr-2" /> Sell Product
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={saleData.name}
            onChange={(e) => setSaleData({ ...saleData, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option
                key={product.id}
                value={product.name}
                disabled={product.quantity === 0}
              >
                {product.name} (Stock: {product.quantity})
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantity to Sell"
            value={saleData.quantity}
            onChange={(e) =>
              setSaleData({ ...saleData, quantity: e.target.value })
            }
            className="w-full p-2 border rounded"
            max={products.find((p) => p.name === saleData.name)?.quantity || 0}
            min="1"
            required
          />
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={sellProductMutation.isPending}
            >
              {sellProductMutation.isPending ? "Selling..." : "Sell Product"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellProductModal;
