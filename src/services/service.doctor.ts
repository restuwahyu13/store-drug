import { Injectable, HttpStatus as status } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { ApiResponse, apiResponse } from '@helpers/helper.apiResponse';
import { RedisService } from '@libs/lib.redis';
import { DoctorParamsDTO, DoctorQueryDTO, DoctorRecipeBodyDTO, DoctorRecipeParamsDTO } from '@dtos/dto.doctor';
import { RecipeDetail } from '@models/model.recipeDetail';
import { Doctor } from '@models/model.doctor';
import { Clinic } from '@models/model.clinic';
import { Recipe } from '@models/model.recipe';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(RecipeDetail) private readonly recipeDetail: Repository<RecipeDetail>,
    @InjectRepository(Recipe) private readonly recipe: Repository<Recipe>,
    @InjectRepository(Doctor) private readonly doctor: Repository<Doctor>,
    @InjectRepository(Clinic) private readonly clinic: Repository<Clinic>,
    private readonly redisService: RedisService,
  ) {}

  async listRecipe(params: DoctorParamsDTO, query: DoctorQueryDTO): Promise<ApiResponse> {
    try {
      query.limit = +query.limit || 10;
      query.page = +query.page || 1;

      if (query.limit > 100) query.limit = 1000;
      if (query.page <= 0) query.page = 1;

      const mainPage: number = query.page;
      query.page = !query.page ? 0 : (query.page - 1) * query.limit;

      let recipesCache: RecipeDetail[] = [];
      const existRecipesCache: number = await this.redisService.hkeyCacheDataExist('cache', 'recipeDoctor');
      const countRecipes: number = await this.recipeDetail.count({ where: { recipe: { status: 'confirmed' } }, relations: ['recipe', 'recipe.user'] });

      if (!existRecipesCache) {
        const [recipes, allRecipes]: [RecipeDetail[], RecipeDetail[]] = await Promise.all([
          this.recipeDetail.find({
            where: { doctor_id: +params.id, recipe: { status: 'confirmed' } },
            take: query.limit,
            skip: query.page,
            order: { id: 'DESC' },
            relations: ['recipe', 'recipe.user'],
          }),
          this.recipeDetail.find({
            where: { doctor_id: +params.id, recipe: { status: 'confirmed' } },
            take: +process.env.CACHE_LIMIT_DATA,
            order: { id: 'DESC' },
            relations: ['recipe', 'recipe.user'],
          }),
        ]);

        if (!recipes.length || !allRecipes.length) throw apiResponse({ stat_code: status.NOT_FOUND, err_message: 'Recipe not found' });
        await this.redisService.hsetCacheData('cache', 'recipeDoctor', 3600, allRecipes);

        recipesCache = recipes;
      } else {
        const countCacheRecipe: number = await this.redisService.countCacheData('cache', 'recipeDoctor');
        if (countCacheRecipe != countRecipes) await this.redisService.hdelCacheData('cache', 'recipeDoctor');

        const recipes: RecipeDetail[] = await this.redisService.hgetCacheData('cache', 'recipeDoctor');
        recipesCache = recipes.slice(query.page, query.limit);
      }

      const totalPage: number = Math.ceil(countRecipes / query.limit);
      const paginationMetadata: Record<string, any> = {
        count: countRecipes,
        main_page: mainPage,
        per_page: query.limit,
        total_page: totalPage,
      };

      const newRecipesCache: Record<string, any>[] = recipesCache.map((val: any) => ({
        id: val.id,
        recipeId: val.recipe.id,
        doctorName: val.recipe.doctor_name,
        clinicName: val.recipe.clinic_name,
        passientName: val.recipe.user.name,
        status: val.recipe.status,
        medicalGuide: val.medication_guide,
      }));

      return apiResponse({ stat_code: status.OK, stat_message: 'Recipe success', pagination: { ...paginationMetadata }, data: newRecipesCache });
    } catch (e: any) {
      if (e instanceof Error) return apiResponse({ stat_code: status.UNPROCESSABLE_ENTITY, err_message: e.message });
      else return apiResponse(e);
    }
  }

  async listProductById(params: DoctorRecipeParamsDTO): Promise<ApiResponse> {
    try {
      const recipeDetail: Record<string, any> = await this.recipeDetail.findOne({
        where: { doctor_id: +params.id, recipe: { status: 'confirmed' } },
        order: { id: 'DESC' },
        relations: ['recipe', 'recipe.user', 'recipe.purchases', 'recipe.purchases.product'],
      });
      if (!recipeDetail) throw apiResponse({ stat_code: status.OK, stat_message: 'Recipe Sucess' });

      const purchasesDrug: Record<string, any>[] = recipeDetail.recipe.purchases.map((val: Record<string, any>) => ({
        id: val.product.id,
        name: val.product.name,
        category: val.product.category,
        sku: val.product.sku,
      }));

      const detailRecipeDrugs: Record<string, any> = {
        recipe: {
          id: recipeDetail.id,
          doctorName: recipeDetail.recipe.doctor_name,
          clinicName: recipeDetail.recipe.clinic_name,
          passienName: recipeDetail.recipe.user.name,
          status: recipeDetail.status,
        },
        recipeDetail: {
          id: recipeDetail.id,
          medicalGuide: recipeDetail.medication_guide,
          notes: recipeDetail.notes,
        },
        drug: purchasesDrug,
      };

      return apiResponse({ stat_code: status.OK, stat_message: 'Recipe success', data: detailRecipeDrugs });
    } catch (e: any) {
      if (e instanceof Error) return apiResponse({ stat_code: status.UNPROCESSABLE_ENTITY, err_message: e.message });
      else return apiResponse(e);
    }
  }

  async updateProductById(params: DoctorRecipeParamsDTO, body: DoctorRecipeBodyDTO): Promise<ApiResponse> {
    try {
      const checkRecipeDetail: RecipeDetail = await this.recipeDetail.findOne({
        where: { id: params.recipeId, doctor_id: params.id },
        relations: ['recipe'],
        select: ['id'],
      });

      if (!checkRecipeDetail) throw apiResponse({ stat_code: status.NOT_FOUND, err_message: 'Recipe not found' });
      else if (checkRecipeDetail.recipe.status != 'confirmed') throw apiResponse({ stat_code: status.FORBIDDEN, err_message: "Can't add recipe detail, status must be confirmed" });
      else if (checkRecipeDetail.recipe.updated_at != undefined) throw apiResponse({ stat_code: status.FORBIDDEN, err_message: "Can't add recipe detail, latest status confirmed" });

      const updateRecipeDetail: UpdateResult = await this.recipeDetail.update({ id: checkRecipeDetail.id }, { medication_guide: body.medicalGuide, notes: body.notes });
      if (!updateRecipeDetail) throw apiResponse({ stat_code: status.FORBIDDEN, err_message: 'Updated recipe detail failed' });

      const updateRecipe: UpdateResult = await this.recipe.update({ id: checkRecipeDetail.recipe.id, recipe_detail_id: checkRecipeDetail.id }, { updated_at: new Date() });
      if (!updateRecipe) throw apiResponse({ stat_code: status.FORBIDDEN, err_message: 'Updated recipe detail failed' });

      return apiResponse({ stat_code: status.OK, stat_message: 'Updated recipe detail success' });
    } catch (e: any) {
      if (e instanceof Error) return apiResponse({ stat_code: status.UNPROCESSABLE_ENTITY, err_message: e.message });
      else return apiResponse(e);
    }
  }

  async listDoctor(query: DoctorQueryDTO): Promise<ApiResponse> {
    try {
      query.limit = +query.limit || 10;
      query.page = +query.page || 1;

      if (query.limit > 100) query.limit = 1000;
      if (query.page <= 0) query.page = 1;

      const mainPage: number = query.page;
      query.page = !query.page ? 0 : (query.page - 1) * query.limit;

      let doctorsCache: Doctor[] = [];
      const existDoctorsCache: number = await this.redisService.hkeyCacheDataExist('cache', 'doctors');
      const countDoctors: number = await this.doctor.count();

      if (!existDoctorsCache) {
        const [doctors, allDoctors]: [Doctor[], Doctor[]] = await Promise.all([
          this.doctor.find({ take: query.limit, skip: query.page, order: { id: 'DESC' } }),
          this.doctor.find({ order: { id: 'DESC' } }),
        ]);

        await this.redisService.hsetCacheData('cache', 'doctors', 3600, allDoctors);
        doctorsCache = doctors;
      } else {
        const countCacheDoctors: number = await this.redisService.countCacheData('cache', 'doctors');
        if (countCacheDoctors != countDoctors) await this.redisService.hdelCacheData('cache', 'doctors');

        const doctors: Doctor[] = await this.redisService.hgetCacheData('cache', 'doctors');
        doctorsCache = doctors.slice(query.page, query.limit);
      }

      const totalPage: number = Math.ceil(countDoctors / query.limit);
      const paginationMetadata: Record<string, any> = {
        count: countDoctors,
        main_page: mainPage,
        per_page: query.limit,
        total_page: totalPage,
      };

      return apiResponse({ stat_code: status.OK, stat_message: 'Doctor success', pagination: { ...paginationMetadata }, data: doctorsCache });
    } catch (e: any) {
      if (e instanceof Error) return apiResponse({ stat_code: status.UNPROCESSABLE_ENTITY, err_message: e.message });
      else return apiResponse(e);
    }
  }

  async listClinic(query: DoctorQueryDTO): Promise<ApiResponse> {
    try {
      query.limit = +query.limit || 10;
      query.page = +query.page || 1;

      if (query.limit > 100) query.limit = 1000;
      if (query.page <= 0) query.page = 1;

      const mainPage: number = query.page;
      query.page = !query.page ? 0 : (query.page - 1) * query.limit;

      let clinicsCache: Clinic[] = [];
      const existClinicsCache: number = await this.redisService.hkeyCacheDataExist('cache', 'clinics');
      const countClinics: number = await this.clinic.count();

      if (!existClinicsCache) {
        const [doctors, allDoctors]: [Clinic[], Clinic[]] = await Promise.all([
          this.clinic.find({ take: query.limit, skip: query.page, order: { id: 'DESC' } }),
          this.clinic.find({ order: { id: 'DESC' } }),
        ]);

        await this.redisService.hsetCacheData('cache', 'clinics', 3600, allDoctors);
        clinicsCache = doctors;
      } else {
        const countCacheClinics: number = await this.redisService.countCacheData('cache', 'clinics');
        if (countCacheClinics != countClinics) await this.redisService.hdelCacheData('cache', 'clinics');

        const clinics: Clinic[] = await this.redisService.hgetCacheData('cache', 'clinics');
        clinicsCache = clinics.slice(query.page, query.limit);
      }

      const totalPage: number = Math.ceil(countClinics / query.limit);
      const paginationMetadata: Record<string, any> = {
        count: countClinics,
        main_page: mainPage,
        per_page: query.limit,
        total_page: totalPage,
      };

      return apiResponse({ stat_code: status.OK, stat_message: 'Clinic success', pagination: { ...paginationMetadata }, data: clinicsCache });
    } catch (e: any) {
      if (e instanceof Error) return apiResponse({ stat_code: status.UNPROCESSABLE_ENTITY, err_message: e.message });
      else return apiResponse(e);
    }
  }
}
