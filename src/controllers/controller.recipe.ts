import { Body, Controller, Get, Param, Post, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { OutgoingMessage } from 'http';

import { ApiResponse, apiResponse } from '@helpers/helper.apiResponse';
import { RecipeService } from '@services/service.recipe';
import { RecipeBodyDTO, RecipeDrugsBodyDTO, RecipeDrugsParamsDTO, RecipeParamsDTO } from '@dtos/dto.recipe';

@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post('user/:userId')
  async createRecipe(@Req() req: Request, @Res() res: Response, @Param() params: RecipeParamsDTO, @Body() body: RecipeBodyDTO): Promise<OutgoingMessage> {
    try {
      const service: ApiResponse = await this.recipeService.createRecipe(params, body);
      return res.status(service.stat_code).json(apiResponse(service));
    } catch (e: any) {
      return res.status(e.stat_code).json(apiResponse(e));
    }
  }

  @Put(':recipeId/user/:userId')
  async createRecipeDrugs(@Req() req: Request, @Res() res: Response, @Param() params: RecipeDrugsParamsDTO, @Body() body: RecipeDrugsBodyDTO): Promise<OutgoingMessage> {
    try {
      const service: ApiResponse = await this.recipeService.createRecipeDrugs(params, body);
      return res.status(service.stat_code).json(apiResponse(service));
    } catch (e: any) {
      return res.status(e.stat_code).json(apiResponse(e));
    }
  }

  @Get('user/:userId')
  async listRecipe(@Req() req: Request, @Res() res: Response, @Param() params: RecipeParamsDTO): Promise<OutgoingMessage> {
    try {
      const service: ApiResponse = await this.recipeService.listRecipe(params);
      return res.status(service.stat_code).json(apiResponse(service));
    } catch (e: any) {
      return res.status(e.stat_code).json(apiResponse(e));
    }
  }

  @Get(':recipeId/user/:userId')
  async listRecipeById(@Req() req: Request, @Res() res: Response, @Param() params: RecipeDrugsParamsDTO): Promise<OutgoingMessage> {
    try {
      const service: ApiResponse = await this.recipeService.listRecipeById(params);
      return res.status(service.stat_code).json(apiResponse(service));
    } catch (e: any) {
      return res.status(e.stat_code).json(apiResponse(e));
    }
  }

  // @Put(':recipeId/user/:userId')
  // async updateRecipeById(@Req() req: Request, @Res() res: Response): Promise<OutgoingMessage> {
  //   try {
  //     const service: ApiResponse = await this.recipeService.createRecipe(req.body);
  //     return res.status(service.stat_code).json(apiResponse(service));
  //   } catch (e: any) {
  //     return res.status(e.stat_code).json(apiResponse(e));
  //   }
  // }
}
