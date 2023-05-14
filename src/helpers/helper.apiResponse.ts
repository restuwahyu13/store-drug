import validator from 'validator';

export interface ApiResponse {
  stat_code: number;
  stat_message?: string;
  err_message?: string;
  data?: any;
  pagination?: Record<string, any>;
}

export const apiResponse = (res: ApiResponse): ApiResponse => {
  let apiRes: Record<string, any> = {};

  if (validator.isEmpty('stat_message') && validator.isEmpty('pagination')) {
    let customApiRes: Omit<ApiResponse, 'stat_message' | 'pagination'>;
    customApiRes.stat_code = res.stat_code;
    customApiRes.err_message = res.err_message;
    customApiRes.data = null;
    apiRes = apiRes;
  } else if (validator.isEmpty('err_message') && validator.isEmpty('data') && validator.isEmpty('pagination')) {
    let customApiRes: Omit<ApiResponse, 'err_message' | 'data' | 'pagination'>;
    customApiRes.stat_code = res.stat_code;
    customApiRes.stat_message = res.stat_message;
    apiRes = apiRes;
  } else if (validator.isEmpty('err_message') && validator.isEmpty('pagination')) {
    let customApiRes: Omit<ApiResponse, 'err_message' | 'pagination'>;
    customApiRes.stat_code = res.stat_code;
    customApiRes.stat_message = res.stat_message;
    customApiRes.data = res.data;
    apiRes = apiRes;
  } else {
    apiRes = res;
  }

  return apiRes as ApiResponse;
};
