import { Catch, HttpException, ExceptionFilter, ArgumentsHost, Logger, HttpStatus as status } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { OutgoingMessage } from 'http';
import validator from 'validator';

import { apiResponse } from '@helpers/helper.apiResponse';

@Catch()
export class ErrorException implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): OutgoingMessage {
    const args: HttpArgumentsHost = host.switchToHttp();
    const res: Response = args.getResponse<Response>();
    const logger: Logger = new Logger('ErrorException');

    logger.error(`
      ==================================
      ======== Error Exception =========
      ==================================

        name: ${exception.name}
        code: ${exception.getStatus()}
        message: ${exception.message}
        response: ${JSON.stringify(exception.getResponse())}
        Stack: ${exception.stack}

      ==================================
      ==================================
      ==================================
    `);

    const statusCode: number = exception && !Number.isNaN(exception.getStatus()) ? exception.getStatus() : status.INTERNAL_SERVER_ERROR;
    const resMessage: any = exception.getResponse();

    const customErrMessage = resMessage.hasOwnProperty('message') ? resMessage.message : resMessage;
    const errMessage: any = exception && !validator.isEmpty(exception.message) ? customErrMessage : 'Internal server error';

    return res.status(statusCode).json(apiResponse({ stat_code: statusCode, err_message: errMessage }));
  }
}
