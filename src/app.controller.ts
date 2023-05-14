import { Controller, Get, Res, HttpStatus as status } from '@nestjs/common';
import { OutgoingMessage } from 'http';
import { Response } from 'express';

import { ApiResponse } from '@helpers/helper.apiResponse';
import { AppService } from '@app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  ping(@Res() res: Response): OutgoingMessage {
    const service: ApiResponse = this.appService.ping();
    return res.status(status.OK).json(service);
  }
}
