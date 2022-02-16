import { CartFactory } from "../models/cartFactory";
import { MongoCart } from "../models/DAOs/Mongo/cart";
import { ApiError } from "./errorApi";
import { IMongoCart } from "../interfaces/products";
import { CUDResponse } from "../interfaces/others";
import { storage } from "../config/config";

/**
 *
 * ApiProducts Class: here we are receiving the type of storage
 * & connecting with the product controller
 *
 */
class CartApi {
  private products: MongoCart; // Ir cambiando tipo de clase cuando se agreguen más persistencias
  constructor() {
    this.products = CartFactory.get(storage);
  }
  async get(user_id?: string | undefined): Promise<IMongoCart[] | ApiError> {
    if (user_id != null) {
      const product: IMongoCart[] | ApiError = await this.products.get(user_id);
      return product;
    } else {
      const product: IMongoCart[] | ApiError = await this.products.get();
      return product;
    }
  }
  async createEmptyCart(user_id: string): Promise<CUDResponse | ApiError> {
    const result: CUDResponse | ApiError = await this.products.createEmpty(
      user_id
    );
    return result;
  }
  async addProduct(
    username: string,
    product_id: string,
    quantity: number
  ): Promise<CUDResponse | ApiError> {
    const result: CUDResponse | ApiError = await this.products.add(
      username,
      product_id,
      quantity
    );
    return result;
  }
  async deleteProduct(
    username: string,
    product_id: string,
    quantity: number
  ): Promise<CUDResponse | ApiError> {
    const result: CUDResponse | ApiError = await this.products.delete(
      username,
      product_id,
      quantity
    );
    return result;
  }
}
export const cartApi = new CartApi();
