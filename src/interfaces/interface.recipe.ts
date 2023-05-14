export interface IRecipe {
  id: number;
  user_id: number;
  recipe_detail_id: number;
  doctor_name: string;
  clinic_name: string;
  status: string;
  total_price?: number;
  created_at?: Date;
}
