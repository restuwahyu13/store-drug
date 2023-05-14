import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from '@app.controller';
import { AppService } from '@app.service';
import { Doctor } from '@models/model.doctor';
import { ProductModule } from '@modules/module.product';
import { RecipeModule } from '@modules/module.recipe';
import { DoctorModule } from '@modules/module.doctor';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: +process.env.PG_PORT,
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      entities: ['dist/models/*.js'],
      synchronize: ['development'].includes(process.env.NODE_ENV) ? true : false,
      autoLoadEntities: ['development'].includes(process.env.NODE_ENV) ? true : false,
      logger: ['development'].includes(process.env.NODE_ENV) ? 'advanced-console' : undefined,
      logging: ['development'].includes(process.env.NODE_ENV) ? true : false,
      verboseRetryLog: process.env.NODE_ENV === 'development' ? true : false,
    }),
    TypeOrmModule.forFeature([Doctor]),
    ProductModule,
    RecipeModule,
    DoctorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
