import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ProductItem, SalesItem } from "../@types";

const API_URL = process.env.BASE_API_URL || "http://localhost:3000/api";

export const inventoryApi = {
  addProduct: (productData: ProductItem) =>
    axios.post(`${API_URL}/inventory/products`, productData),

  sellProduct: (saleData: SalesItem) =>
    axios.post(`${API_URL}/inventory/sell`, saleData),

  getInventoryReport: () => axios.get(`${API_URL}/inventory/report`),

  getDailyProfit: (date?: string) =>
    axios.get(`${API_URL}/inventory/daily-profit`, { params: { date } }),

  getTotalInventoryValue: () => axios.get(`${API_URL}/inventory/total-value`),

  getSalesHistory: () => axios.get(`${API_URL}/inventory/sales-history`),
};

const addProduct = async (productData: ProductItem) => {
  try {
    const response = await inventoryApi.addProduct(productData);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const useAddProductMutation = () => {
  return useMutation({
    mutationFn: addProduct,
  });
};

const sellProduct = async (saleData: SalesItem) => {
  try {
    const response = await inventoryApi.sellProduct(saleData);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const useSellProductMutation = () => {
  return useMutation({
    mutationFn: sellProduct,
  });
};
