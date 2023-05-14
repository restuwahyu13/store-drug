import { Injectable, CanActivate, ExecutionContext, HttpStatus as status, HttpException } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { apiResponse } from '@helpers/helper.apiResponse';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const args: HttpArgumentsHost = context.switchToHttp();
    const req: Request = args.getRequest();

    try {
      const headers: Record<string, any> = req.headers;
      if (!headers.hasOwnProperty('authorization')) throw apiResponse({ stat_code: status.UNAUTHORIZED, err_message: 'Authorization is required on headers' });

      const authorization: string[] = headers.authorization.split(' ');
      if (authorization.length && !authorization.includes('Bearer')) throw apiResponse({ stat_code: status.UNAUTHORIZED, err_message: 'Bearer is required on authorization headers' });

      const token: string = authorization[1];
      if (token != process.env.AUTH_KEY) throw apiResponse({ stat_code: status.UNAUTHORIZED, err_message: 'Invalid token' });

      return true;
    } catch (e: any) {
      if (e instanceof Error) throw new HttpException(e.message, status.UNAUTHORIZED);
      else throw new HttpException(e.err_message, status.UNAUTHORIZED);
    }
  }
}
