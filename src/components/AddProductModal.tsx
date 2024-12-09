import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { ProductItem } from "../@types";
import { useAddProductMutation } from "../lib/api";
import { useQueryClient } from "@tanstack/react-query";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [productData, setProductData] = useState<ProductItem>({
    name: "",
    costPrice: "",
    sellingPrice: "",
    quantity: "",
  });

  const queryClient = useQueryClient();

  const addProductMutation = useAddProductMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProductMutation.mutate(
      {
        ...productData,
        costPrice: parseFloat(productData.costPrice),
        sellingPrice: parseFloat(productData.sellingPrice),
        quantity: parseInt(productData.quantity),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      {
        onSuccess: () => {
          onClose();
          setProductData({
            name: "",
            costPrice: "",
            sellingPrice: "",
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
          console.error("Error adding product:", error);
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <PlusCircle className="mr-2" /> Add New Product
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            value={productData.name}
            onChange={(e) =>
              setProductData({ ...productData, name: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Cost Price"
            value={productData.costPrice}
            onChange={(e) =>
              setProductData({ ...productData, costPrice: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Selling Price"
            value={productData.sellingPrice}
            onChange={(e) =>
              setProductData({ ...productData, sellingPrice: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={productData.quantity}
            onChange={(e) =>
              setProductData({ ...productData, quantity: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={addProductMutation.isPending}
            >
              {addProductMutation.isPending ? "Adding..." : "Add Product"}
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
