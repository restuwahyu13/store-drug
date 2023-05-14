import { IsArray, IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class RecipeParamsDTO {
  @IsNumberString()
  userId: string;
}

export class RecipeDrugsParamsDTO {
  @IsNumberString()
  recipeId: number;

  @IsNumberString()
  userId: string;
}

export class RecipeBodyDTO {
  @IsNotEmpty()
  @IsString()
  doctorName: string;

  @IsNotEmpty()
  @IsString()
  clinicName: string;

  @IsOptional()
  @IsArray()
  products: Record<string, any>[];
}

export class RecipeDrugsBodyDTO {
  @IsNotEmpty()
  @IsArray()
  products: Record<string, any>[];
}

export class RecipeDrugsStatusBodyDTO {
  @IsNotEmpty()
  @IsEnum(['confirmed', 'cancelled'])
  status: string;
}
