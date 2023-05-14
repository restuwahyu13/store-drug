import { Injectable, HttpStatus as status } from '@nestjs/common';
import { ApiResponse, apiResponse } from '@helpers/helper.apiResponse';

@Injectable()
export class AppService {
  constructor() {}

  ping(): ApiResponse {
    return apiResponse({ stat_code: status.OK, stat_message: 'Ping Success' });
  }
}
