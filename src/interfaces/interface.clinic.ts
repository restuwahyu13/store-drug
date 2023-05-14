export interface IClinic {
  id: number;
  name: string;
  address: string;
  city: string;
  province: string;
  district: string;
  country: string;
  postal_code: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
