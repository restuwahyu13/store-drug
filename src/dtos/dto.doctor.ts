import { IsArray, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class DoctorQueryDTO {
  @IsNotEmpty()
  @IsNumberString()
  limit: number;

  @IsNotEmpty()
  @IsNumberString()
  page: number;
}

export class DoctorParamsDTO {
  @IsNumberString()
  id: number;
}

export class DoctorRecipeParamsDTO {
  @IsNumberString()
  id: number;

  @IsNumberString()
  recipeId: number;
}

export class DoctorRecipeBodyDTO {
  @IsNotEmpty()
  @IsArray()
  medicalGuide: string;

  @IsNotEmpty()
  @IsString()
  notes: string;
}
