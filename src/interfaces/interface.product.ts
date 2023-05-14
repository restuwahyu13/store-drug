export interface IProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  sku: string;
  stock: number;
  margin: boolean;
  tax: boolean;
  for_sale?: boolean;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
