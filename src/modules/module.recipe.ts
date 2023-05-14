import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecipeController } from '@controllers/controller.recipe';
import { RecipeService } from '@services/service.recipe';
import { Recipe } from '@models/model.recipe';
import { User } from '@models/model.user';
import { Purchase } from '@models/model.puchase';
import { Product } from '@models/model.product';
import { RecipeDetail } from '@models/model.recipeDetail';
import { Clinic } from '@models/model.clinic';
import { Doctor } from '@models/model.doctor';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, User, Purchase, Product, RecipeDetail, Clinic, Doctor])],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
