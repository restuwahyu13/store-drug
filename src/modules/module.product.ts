import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductController } from '@controllers/controller.product';
import { ProductService } from '@services/service.product';
import { Product } from '@models/model.product';
import { RedisService } from '@libs/lib.redis';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService, RedisService],
})
export class ProductModule {}
