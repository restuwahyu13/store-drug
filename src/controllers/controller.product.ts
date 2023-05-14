import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { OutgoingMessage } from 'http';

import { ApiResponse, apiResponse } from '@helpers/helper.apiResponse';
import { ProductService } from '@services/service.product';
import { ProductBodyDTO, ProductParamsDTO, ProductQueryDTO } from '@dtos/dto.product';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Req() req: Request, @Res() res: Response, @Body() body: ProductBodyDTO): Promise<OutgoingMessage> {
    try {
      const service: ApiResponse = await this.productService.createProduct(body);
      return res.status(service.stat_code).json(apiResponse(service));
    } catch (e: any) {
      return res.status(e.stat_code).json(apiResponse(e));
    }
  }

  @Get()
  async listProduct(@Req() req: Request, @Res() res: Response, @Query() query: ProductQueryDTO): Promise<OutgoingMessage> {
    try {
      const service: ApiResponse = await this.productService.listProduct(query);
      return res.status(service.stat_code).json(apiResponse(service));
    } catch (e: any) {
      return res.status(e.stat_code).json(apiResponse(e));
    }
  }

  @Get(':id')
  async listProductById(@Req() req: Request, @Res() res: Response, @Param() params: ProductParamsDTO): Promise<OutgoingMessage> {
    try {
      const service: ApiResponse = await this.productService.listProductById(params);
      return res.status(service.stat_code).json(apiResponse(service));
    } catch (e: any) {
      return res.status(e.stat_code).json(apiResponse(e));
    }
  }

  @Delete(':id')
  async deleteProductById(@Req() req: Request, @Res() res: Response, @Param() params: ProductParamsDTO): Promise<OutgoingMessage> {
    try {
      const service: ApiResponse = await this.productService.deleteProductById(params);
      return res.status(service.stat_code).json(apiResponse(service));
    } catch (e: any) {
      return res.status(e.stat_code).json(apiResponse(e));
    }
  }

  @Put(':id')
  async updateProductById(@Req() req: Request, @Res() res: Response, @Param() params: ProductParamsDTO, @Body() body: ProductBodyDTO): Promise<OutgoingMessage> {
    try {
      const service: ApiResponse = await this.productService.updateProductById(params, body);
      return res.status(service.stat_code).json(apiResponse(service));
    } catch (e: any) {
      return res.status(e.stat_code).json(apiResponse(e));
    }
  }
}
