import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ProductItem, SalesItem } from "../@types";

const API_URL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_BASE_API_URL
    : import.meta.env.VITE_BASE_API_URL_LOCAL;

export const inventoryApi = {
  addProduct: (productData: ProductItem) =>
    axios.post(`${API_URL}/inventory/products`, productData),

  sellProduct: (saleData: SalesItem) =>
    axios.post(`${API_URL}/inventory/sell`, saleData),

  getInventoryReport: (search: string) =>
    axios.get(`${API_URL}/inventory/report?search=${search}`),

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

export const useGetInventoryReportQuery = ({ search }: { search: string }) => {
  return useQuery({
    queryKey: ["inventory-report", search],
    queryFn: () => inventoryApi.getInventoryReport(search),
  });
};
