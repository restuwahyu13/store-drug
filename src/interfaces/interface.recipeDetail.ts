export interface IRecipeDetail {
  id: number;
  doctor_id: number;
  clinic_id: number;
  medication_guide: string;
  notes?: string;
  created_at?: Date;
}
