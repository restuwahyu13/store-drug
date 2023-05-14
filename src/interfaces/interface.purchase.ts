export interface IPurchase {
  id: number;
  recipe_id: number;
  product_id: number;
  qty: number;
  price: number;
  final_price: number;
  total_price: number;
  created_at?: Date;
}
