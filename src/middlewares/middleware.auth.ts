import { Injectable, NestMiddleware, HttpStatus as status } from '@nestjs/common';
import { Request, Response } from 'express';
import { OutgoingMessage } from 'http';

import { apiResponse } from '@helpers/helper.apiResponse';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: (error?: Error | any) => void): OutgoingMessage {
    try {
      const headers: Record<string, any> = req.headers;
      if (!headers.hasOwnProperty('authorization')) throw apiResponse({ stat_code: status.UNAUTHORIZED, err_message: 'Authorization is required on headers' });

      const authorization: string = headers.authorization.split(' ');
      const bearer: string = authorization[0];
      const token: string = authorization[1];

      if (!bearer.includes('Bearer')) throw apiResponse({ stat_code: status.UNAUTHORIZED, err_message: 'Bearer is required on authorization' });
      else if (token != process.env.AUTH_KEY) throw apiResponse({ stat_code: status.UNAUTHORIZED, err_message: 'Invalid token' });

      next();
    } catch (e: any) {
      if (e instanceof Error) return res.status(status.UNAUTHORIZED).json(apiResponse({ stat_code: status.UNAUTHORIZED, err_message: e.message }));
      else return res.status(e.stat_code).json(e);
    }
  }
}
