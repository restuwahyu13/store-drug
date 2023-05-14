import { NestApplication, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import bodyparser from 'body-parser';
import hpp from 'hpp';
import helmet from 'helmet';
import { AppModule } from '@app.module';
import { ErrorException } from '@app.exception';

class Application {
  app: NestApplication;

  async setup(): Promise<void> {
    this.app = await NestFactory.create<NestApplication>(AppModule);
  }

  private config(): void {
    this.app.enableCors();
    this.app.useGlobalPipes(new ValidationPipe());
    this.app.useGlobalFilters(new ErrorException());
    if (process.env.NODE_ENV == 'development') {
      this.app.flushLogs();
    }
  }

  private middleware(): void {
    this.app.use(bodyparser.json({ limit: +process.env.INBOUND_SIZE_MAX }));
    this.app.use(bodyparser.raw({ limit: +process.env.INBOUND_SIZE_MAX }));
    this.app.use(bodyparser.urlencoded({ limit: +process.env.INBOUND_SIZE_MAX, extended: true }));
    this.app.use(hpp({ checkBody: true, checkQuery: true }));
    this.app.use(helmet());
  }

  private run(): void {
    this.app.listen(process.env.PORT);
  }

  async boostraping(): Promise<void> {
    await this.setup();
    this.config();
    this.middleware();
    this.run();
  }
}

/**
 * @description boostraping app and run app with env development | production | staging | testing
 */

(async () => {
  await new Application().boostraping();
})();
