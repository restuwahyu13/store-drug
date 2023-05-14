import { Injectable, HttpStatus as status } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';

import { Recipe } from '@models/model.recipe';
import { User } from '@models/model.user';
import { Purchase } from '@models/model.puchase';
import { Product } from '@models/model.product';
import { RecipeDetail } from '@models/model.recipeDetail';
import { Doctor } from '@models/model.doctor';
import { ApiResponse, apiResponse } from '@helpers/helper.apiResponse';
import { RecipeBodyDTO, RecipeDrugsBodyDTO, RecipeDrugsParamsDTO, RecipeParamsDTO } from '@dtos/dto.recipe';
import { countDuplicate } from '@helpers/helper.countDuplicate';
import { Clinic } from '@models/model.clinic';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe) private readonly recipe: Repository<Recipe>,
    @InjectRepository(User) private readonly user: Repository<User>,
    @InjectRepository(Purchase) private readonly purchase: Repository<Purchase>,
    @InjectRepository(Product) private readonly product: Repository<Product>,
    @InjectRepository(RecipeDetail) private readonly recipeDetail: Repository<RecipeDetail>,
    @InjectRepository(Doctor) private readonly doctor: Repository<Doctor>,
    @InjectRepository(Clinic) private readonly clinic: Repository<Clinic>,
  ) {}

  async createRecipe(params: RecipeParamsDTO, body: RecipeBodyDTO): Promise<ApiResponse> {
    try {
      const [checkUser, checkDoctor, checkClinic]: [User, Doctor, Clinic] = await Promise.all([
        this.user.findOne({ where: { id: +params.userId, deleted_at: null }, select: ['id'] }),
        this.doctor.findOne({ where: { name: body.doctorName, deleted_at: null }, select: ['id', 'name'] }),
        this.clinic.findOne({ where: { name: body.clinicName }, select: ['id', 'name'] }),
      ]);

      if (!checkUser) throw apiResponse({ stat_code: status.NOT_FOUND, stat_message: 'User not found' });
      else if (!checkDoctor) throw apiResponse({ stat_code: status.NOT_FOUND, stat_message: 'Doctor not found' });
      else if (!checkClinic) throw apiResponse({ stat_code: status.NOT_FOUND, stat_message: 'Clinic not found' });

      const createRecipeDetail: RecipeDetail = await this.recipeDetail.save(this.recipeDetail.create({ doctor_id: checkDoctor.id, clinic_id: checkClinic.id }), { reload: true });
      if (!createRecipeDetail) throw apiResponse({ stat_code: status.FORBIDDEN, err_message: 'Create recipe detail failed' });

      const createRecipe = await this.recipe.save(
        this.recipe.create({
          user_id: checkUser.id,
          recipe_detail_id: createRecipeDetail.id,
          doctor_name: checkDoctor.name,
          clinic_name: checkClinic.name,
          status: 'created',
        }),
        { reload: true },
      );
      if (!createRecipe) throw apiResponse({ stat_code: status.FORBIDDEN, err_message: 'Create recipe failed' });

      return apiResponse({ stat_code: status.OK, stat_message: 'Create recipe success', data: createRecipe });
    } catch (e: any) {
      if (e instanceof Error) return apiResponse({ stat_code: status.UNPROCESSABLE_ENTITY, err_message: e.message });
      else return apiResponse(e);
    }
  }

  async createRecipeDrugs(params: RecipeDrugsParamsDTO, body: RecipeDrugsBodyDTO): Promise<ApiResponse> {
    try {
      const [checkUser, checkRecipe]: [User, Recipe] = await Promise.all([this.user.findOne({ where: { id: params.userId } }), this.recipe.findOne({ where: { id: params.recipeId, user_id: params.userId, status: 'created' } })]);

      if (!checkUser) apiResponse({ stat_code: status.NOT_FOUND, stat_message: 'User not found' });
      if (!checkRecipe) apiResponse({ stat_code: status.NOT_FOUND, stat_message: 'Recipe not found' });

      if (!checkRecipe) {
        body.products.forEach(async (val: Record<string, any>) => {
          const getProduct: Product = await this.product.findOne({ id: val.id }, { select: ['id', 'margin', 'tax', 'price'] });
          if (!getProduct) throw apiResponse({ stat_code: status.NOT_FOUND, err_message: 'Product not found' });

          let finalPrice: number = 0;
          let totalPrice: number = 0;

          if (getProduct.margin && getProduct.tax) {
            const margin: number = (10 / 100) * getProduct.price;
            const price: number = margin + getProduct.price;
            const priceTax: number = (11 / 100) * getProduct.price;

            finalPrice = priceTax + price;
          } else if (getProduct.margin && !getProduct.tax) {
            const margin: number = (10 / 100) * getProduct.price;
            const priceMargin: number = margin + getProduct.price;

            finalPrice = priceMargin;
          } else if (!getProduct.margin && !getProduct.tax) {
            finalPrice = getProduct.price;
          }

          totalPrice = finalPrice * val.qty;
          const purchaseReq: Record<string, any> = { recipe_id: +params.recipeId, product_id: getProduct.id, qty: val.qty, price: getProduct.price, final_price: finalPrice, total_price: totalPrice };

          const createPurchase: InsertResult = await this.purchase.insert(purchaseReq);
          if (!createPurchase) throw apiResponse({ stat_code: status.FORBIDDEN, err_message: 'Add drugs to recipe failed' });
        });
      } else {
        return await new Promise(async (resolve, reject) => {
          body.products.forEach(async (val: Record<string, any>) => {
            try {
              const [getProduct, getPurchaseProduct]: [Product, Purchase] = await Promise.all([
                this.product.findOne({ id: val.id }, { select: ['id', 'margin', 'tax', 'price'] }),
                this.purchase.findOne({ where: { recipe_id: +params.recipeId, product_id: val.id }, select: ['product_id'] }),
              ]);

              if (!getProduct) throw apiResponse({ stat_code: status.NOT_FOUND, err_message: 'Product not found' });
              else if (countDuplicate(body.products, 'id') > 0) throw apiResponse({ stat_code: status.CONFLICT, err_message: 'Duplicate order drugs' });

              let finalPrice: number = 0;
              let totalPrice: number = 0;

              if (getProduct.margin && getProduct.tax) {
                const margin: number = (10 / 100) * getProduct.price;
                const price: number = margin + getProduct.price;
                const priceTax: number = (11 / 100) * getProduct.price;

                finalPrice = priceTax + price;
              } else if (getProduct.margin && !getProduct.tax) {
                const margin: number = (10 / 100) * getProduct.price;
                const priceMargin: number = margin + getProduct.price;

                finalPrice = priceMargin;
              } else if (!getProduct.margin && !getProduct.tax) {
                finalPrice = getProduct.price;
              }

              totalPrice = finalPrice * val.qty;

              if (!getPurchaseProduct) {
                await this.purchase.insert({ recipe_id: params.recipeId, product_id: getProduct.id, qty: val.qty, price: getProduct.price, final_price: finalPrice, total_price: totalPrice });
              } else {
                await this.purchase.update({ recipe_id: params.recipeId, product_id: getProduct.id }, { qty: val.qty, price: getProduct.price, final_price: finalPrice, total_price: totalPrice });
              }
            } catch (e: any) {
              reject(e);
            }
          });

          const calculateBalance: Record<string, any> = await this.purchase.createQueryBuilder('pc').select('SUM(pc.total_price) as price').where('pc.recipe_id = :recipeId', { recipeId: +params.recipeId }).getRawOne();
          if (!calculateBalance) reject(apiResponse({ stat_code: status.UNPROCESSABLE_ENTITY, err_message: 'Calculate balance failed' }));

          const updateTotalbalance: UpdateResult = await this.recipe.update({ id: +params.recipeId }, { total_price: calculateBalance.price });
          if (!updateTotalbalance) reject(apiResponse({ stat_code: status.FORBIDDEN, err_message: 'Update total balance failed' }));

          resolve(apiResponse({ stat_code: status.OK, stat_message: 'Add drugs to recipe success' }));
        });
      }

      return apiResponse({ stat_code: status.OK, stat_message: 'Add drugs to recipe success' });
    } catch (e: any) {
      if (e instanceof Error) return apiResponse({ stat_code: status.UNPROCESSABLE_ENTITY, err_message: e.message });
      else return apiResponse(e);
    }
  }

  async listRecipe(params: RecipeParamsDTO) {
    try {
      const listRecipe = await this.recipe.find({ where: { user_id: +params.userId }, relations: ['user'] });
      if (!listRecipe.length) throw apiResponse({ stat_code: status.OK, stat_message: 'Recipe success', data: listRecipe });

      const listRecipeDrugs: Record<string, any> = listRecipe.map((val: Record<string, any>) => ({
        id: val.id,
        doctorName: val.doctor_name,
        clinicName: val.clinic_name,
        passienName: val.user.name,
        status: val.status,
        paidAmount: +val.total_price,
      }));

      return apiResponse({ stat_code: status.OK, stat_message: 'Recipe success', data: listRecipeDrugs });
    } catch (e: any) {
      if (e instanceof Error) return apiResponse({ stat_code: status.UNPROCESSABLE_ENTITY, err_message: e.message });
      else return apiResponse(e);
    }
  }

  async listRecipeById(params: RecipeDrugsParamsDTO) {
    const detailRecipe: Record<string, any> = await this.recipe.findOne({ where: { id: +params.recipeId, user_id: +params.userId }, relations: ['user', 'recipeDetail', 'purchases', 'purchases.product'] });
    if (!detailRecipe) throw apiResponse({ stat_code: status.OK, stat_message: 'Recipe success' });

    const purchasesDrug: Record<string, any>[] = detailRecipe.purchases.map((val: Record<string, any>) => ({
      id: val.product.id,
      name: val.product.name,
      category: val.product.category,
      sku: val.product.sku,
      qty: val.qty,
      price: +val.price,
      finalPrice: +val.final_price,
      totalPrice: +val.total_price,
    }));

    const detailRecipeDrugs: Record<string, any> = {
      id: detailRecipe.id,
      doctorName: detailRecipe.doctor_name,
      clinicName: detailRecipe.clinic_name,
      passientName: detailRecipe.name,
      status: detailRecipe.status,
      paidAmount: +detailRecipe.total_price,
      recipedetail: {
        medicalGuide: detailRecipe.recipeDetail.medication_guide, // medical guide can't exist, after doctor add this
      },
      drug: purchasesDrug,
    };

    return apiResponse({ stat_code: status.OK, stat_message: 'Recipe success', data: detailRecipeDrugs });
  }
  catch(e: any) {
    if (e instanceof Error) return apiResponse({ stat_code: status.UNPROCESSABLE_ENTITY, err_message: e.message });
    else return apiResponse(e);
  }
}
