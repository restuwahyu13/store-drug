import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DoctorController } from '@controllers/controller.doctor';
import { DoctorService } from '@services/service.doctor';
import { RedisService } from '@libs/lib.redis';
import { RecipeDetail } from '@models/model.recipeDetail';
import { Clinic } from '@models/model.clinic';
import { Doctor } from '@models/model.doctor';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeDetail, Doctor, Clinic])],
  controllers: [DoctorController],
  providers: [DoctorService, RedisService],
})
export class DoctorModule {}
