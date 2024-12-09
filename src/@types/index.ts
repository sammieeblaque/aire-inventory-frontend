export interface ProductItem {
  id?: string;
  name: string;
  costPrice: string;
  sellingPrice: string;
  quantity: string;
}

export type SalesItem = Pick<ProductItem, "name" | "quantity">;
