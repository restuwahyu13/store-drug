import { Body, Controller, Get, Param, Put, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { OutgoingMessage } from 'http';

import { ApiResponse, apiResponse } from '@helpers/helper.apiResponse';
import { DoctorParamsDTO, DoctorQueryDTO, DoctorRecipeBodyDTO, DoctorRecipeParamsDTO } from '@dtos/dto.doctor';
import { DoctorService } from '@services/service.doctor';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get(':id/recipe')
  async listRecipe(@Req() req: Request, @Res() res: Response, @Param() params: DoctorParamsDTO, @Query() query: DoctorQueryDTO): Promise<OutgoingMessage> {
    try {
      const service: ApiResponse = await this.doctorService.listRecipe(params, query);
      return res.status(service.stat_code).json(apiResponse(service));
    } catch (e: any) {
      return res.status(e.stat_code).json(apiResponse(e));
    }
  }

  @Get(':id/recipe/:recipeId')
  async listProductById(@Req() req: Request, @Res() res: Response, @Param() params: DoctorRecipeParamsDTO): Promise<OutgoingMessage> {
    try {
      const service: ApiResponse = await this.doctorService.listProductById(params);
      return res.status(service.stat_code).json(apiResponse(service));
    } catch (e: any) {
      return res.status(e.stat_code).json(apiResponse(e));
    }
  }

  @Put(':id/recipe/:recipeId')
  async updateProductById(@Req() req: Request, @Res() res: Response, @Param() params: DoctorRecipeParamsDTO, @Body() body: DoctorRecipeBodyDTO): Promise<OutgoingMessage> {
    try {
      const service: ApiResponse = await this.doctorService.updateProductById(params, body);
      return res.status(service.stat_code).json(apiResponse(service));
    } catch (e: any) {
      return res.status(e.stat_code).json(apiResponse(e));
    }
  }

  @Get()
  async listDoctor(@Req() req: Request, @Res() res: Response, @Query() query: DoctorQueryDTO): Promise<OutgoingMessage> {
    try {
      const service: ApiResponse = await this.doctorService.listDoctor(query);
      return res.status(service.stat_code).json(apiResponse(service));
    } catch (e: any) {
      return res.status(e.stat_code).json(apiResponse(e));
    }
  }

  @Get('clinic')
  async listClinic(@Req() req: Request, @Res() res: Response, @Query() query: DoctorQueryDTO): Promise<OutgoingMessage> {
    try {
      const service: ApiResponse = await this.doctorService.listClinic(query);
      return res.status(service.stat_code).json(apiResponse(service));
    } catch (e: any) {
      return res.status(e.stat_code).json(apiResponse(e));
    }
  }
}
