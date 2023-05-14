import { IsBoolean, IsBooleanString, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class ProductBodyDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsNumberString()
  price: number;

  @IsNotEmpty()
  @IsNumberString()
  stock: number;

  @IsNotEmpty()
  @IsBoolean()
  margin: boolean;

  @IsNotEmpty()
  @IsBoolean()
  tax: boolean;

  @IsOptional()
  @IsBoolean()
  for_sale: boolean;
}

export class ProductQueryDTO {
  @IsNotEmpty()
  @IsNumberString()
  limit: number;

  @IsNotEmpty()
  @IsNumberString()
  page: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsNumberString()
  stock?: string;

  @IsOptional()
  @IsBooleanString()
  margin?: string;

  @IsOptional()
  @IsBooleanString()
  tax?: string;
}

export class ProductParamsDTO {
  @IsNumberString()
  id: number;
}
