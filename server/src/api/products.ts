import { ProductsFactory } from "../models/productsFactory";
import { MongoProducts } from "../models/DAOs/Mongo/products";
import { ApiError } from "./errorApi";
import {
  IMongoProduct,
  INew_Product,
  IQuery,
  IUpdate,
} from "../interfaces/products";
import { CUDResponse } from "../interfaces/others";
import { storage } from "../config/config";

/**
 *
 * ApiProducts Class: here we are receiving the type of storage
 * & connecting with the product controller
 *
 */

export class ProductsApi {
  private products: MongoProducts;
  constructor() {
    this.products = ProductsFactory.get(storage);
  }
  async getProduct(
    id?: string | undefined
  ): Promise<IMongoProduct[] | ApiError> {
    if (id != null) {
      const result: IMongoProduct[] | ApiError = await this.products.get(id);
      return result;
    } else {
      const result: IMongoProduct[] | ApiError = await this.products.get();
      return result;
    }
  }
  async getByCategory(category: string): Promise<IMongoProduct[] | ApiError> {
    const result: IMongoProduct[] | ApiError =
      await this.products.getByCategory(category);
    return result;
  }
  async getByIds(ids: string[]): Promise<
    | {
        _id: string;
        stock: number;
      }[]
    | ApiError
  > {
    const result: { _id: string; stock: number }[] | ApiError =
      await this.products.getByIds(ids);
    return result;
  }
  async getStock(): Promise<IMongoProduct[] | ApiError> {
    const result: IMongoProduct[] | ApiError = await this.products.getStock();
    return result;
  }
  async addProduct(product: INew_Product): Promise<CUDResponse | ApiError> {
    const result: CUDResponse | ApiError = await this.products.add(product);
    return result;
  }
  async updateProduct(
    id: string,
    product: IUpdate
  ): Promise<CUDResponse | ApiError> {
    const result: CUDResponse | ApiError = await this.products.update(
      id,
      product
    );
    return result;
  }
  async deleteProduct(id: string): Promise<CUDResponse | ApiError> {
    const result: CUDResponse | ApiError = await this.products.delete(id);
    return result;
  }
  async deleteImages(
    photos_id: string[],
    product_id: string
  ): Promise<CUDResponse | ApiError> {
    const result: CUDResponse | ApiError = await this.products.deleteImages(
      photos_id,
      product_id
    );
    return result;
  }
  async query(options: IQuery): Promise<IMongoProduct[] | ApiError> {
    const result: IMongoProduct[] | ApiError = await this.products.query(
      options
    );
    return result;
  }
}

export const productsApi = new ProductsApi();
