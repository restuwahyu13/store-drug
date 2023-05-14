import { Injectable, HttpStatus as status } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindCondition, Repository } from 'typeorm';
import omitEmpty from 'omit-empty';

import { Product } from '@models/model.product';
import { ApiResponse, apiResponse } from '@helpers/helper.apiResponse';
import { ProductBodyDTO, ProductParamsDTO, ProductQueryDTO } from '@dtos/dto.product';
import { RedisService } from '@libs/lib.redis';
import { filterProperty } from '@helpers/helper.filterProperty';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private readonly product: Repository<Product>, private readonly redisService: RedisService) {}

  async createProduct(body: ProductBodyDTO): Promise<ApiResponse> {
    try {
      const checkProduct = await this.product.findOne({ where: { name: body.name } });
      if (checkProduct) throw apiResponse({ stat_code: status.CONFLICT, err_message: 'Product already exist' });

      const createProduct = await this.product.save(this.product.create(body), { reload: true });
      if (!createProduct) throw apiResponse({ stat_code: status.FORBIDDEN, err_message: 'Create product failed' });

      return apiResponse({ stat_code: status.OK, stat_message: 'Create product success', data: createProduct });
    } catch (e: any) {
      if (e instanceof Error) return apiResponse({ stat_code: status.UNPROCESSABLE_ENTITY, err_message: e.message });
      else return apiResponse(e);
    }
  }

  async listProduct(query: ProductQueryDTO): Promise<ApiResponse> {
    try {
      let filter: FindCondition<Omit<ProductQueryDTO, 'limit | page'>> = {};

      query.limit = +query.limit || 10;
      query.page = +query.page || 1;

      if (query.limit > 100) query.limit = 1000;
      if (query.page <= 0) query.page = 1;

      const mainPage: number = query.page;
      query.page = !query.page ? 0 : (query.page - 1) * query.limit;

      if (query.name) {
        filter.name = query.name;
      }

      if (query.sku) {
        filter.sku = query.sku;
      }

      if (query.stock) {
        filter.stock = query.stock;
      }

      if (query.margin) {
        filter.margin = query.margin;
      }

      if (query.tax) {
        filter.tax = query.tax;
      }

      let productsCache: Product[] = [];
      const existProductsCache: number = await this.redisService.hkeyCacheDataExist('cache', 'products');
      const countProducts: number = await this.product.count({ select: ['id'], where: { deleted_at: null } });

      if (!existProductsCache) {
        const [products, allProducts] = await Promise.all([
          this.product.find({ where: { ...omitEmpty(filter), deleted_at: null }, take: query.limit, skip: query.page, order: { id: 'DESC' } }),
          this.product.find({ where: { deleted_at: null }, take: +process.env.CACHE_LIMIT_DATA, order: { id: 'DESC' } }),
        ]);

        await this.redisService.hsetCacheData('cache', 'products', 3600, allProducts);
        productsCache = products;
      } else {
        const countCacheProduct: number = await this.redisService.countCacheData('cache', 'products');
        if (countCacheProduct != countProducts) await this.redisService.hdelCacheData('cache', 'products');

        const products: Product[] = await this.redisService.hgetCacheData('cache', 'products');
        if (products.length) {
          productsCache = filterProperty(products, filter).slice(query.page, query.limit);
        }
      }

      const totalPage: number = Math.ceil(countProducts / query.limit);
      const paginationMetadata: Record<string, any> = {
        count: countProducts,
        main_page: mainPage,
        per_page: query.limit,
        total_page: totalPage,
      };

      return apiResponse({ stat_code: status.OK, stat_message: 'Product success', pagination: { ...paginationMetadata }, data: productsCache });
    } catch (e: any) {
      if (e instanceof Error) return apiResponse({ stat_code: status.UNPROCESSABLE_ENTITY, err_message: e.message });
      else return apiResponse(e);
    }
  }

  async listProductById(params: ProductParamsDTO): Promise<ApiResponse> {
    try {
      const product: Product = await this.product.findOne({ where: { id: params.id, deleted_at: null } });
      if (!product) throw apiResponse({ stat_code: status.NOT_FOUND, err_message: 'Product not exist' });

      return apiResponse({ stat_code: status.OK, stat_message: 'Product success', data: product });
    } catch (e: any) {
      if (e instanceof Error) return apiResponse({ stat_code: status.UNPROCESSABLE_ENTITY, err_message: e.message });
      else return apiResponse(e);
    }
  }

  async deleteProductById(params: ProductParamsDTO): Promise<ApiResponse> {
    try {
      const checkProduct = await this.product.findOne({ where: { id: params.id, deleted_at: null }, select: ['id'] });
      if (!checkProduct) throw apiResponse({ stat_code: status.NOT_FOUND, err_message: 'Product not exist' });

      const deleteProduct = await this.product.update({ ...checkProduct }, { deleted_at: new Date() });
      if (!deleteProduct) throw apiResponse({ stat_code: status.FORBIDDEN, err_message: 'Deleted product failed' });

      return apiResponse({ stat_code: status.OK, stat_message: 'Deleted product success' });
    } catch (e: any) {
      if (e instanceof Error) return apiResponse({ stat_code: status.UNPROCESSABLE_ENTITY, err_message: e.message });
      else return apiResponse(e);
    }
  }

  async updateProductById(params: ProductParamsDTO, body: ProductBodyDTO): Promise<ApiResponse> {
    try {
      const checkProduct = await this.product.findOne({ where: { id: params.id, deleted_at: null }, select: ['id'] });
      if (!checkProduct) throw apiResponse({ stat_code: status.NOT_FOUND, err_message: 'Product not exist' });

      const updateProduct = await this.product.update({ ...checkProduct }, body);
      if (!updateProduct) throw apiResponse({ stat_code: status.FORBIDDEN, err_message: 'Updated product failed' });

      return apiResponse({ stat_code: status.OK, stat_message: 'Updated product success' });
    } catch (e: any) {
      if (e instanceof Error) return apiResponse({ stat_code: status.UNPROCESSABLE_ENTITY, err_message: e.message });
      else return apiResponse(e);
    }
  }
}
