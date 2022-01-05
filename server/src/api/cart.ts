import { CartFactory } from '../models/cartFactory';
import { MongoCart } from '../models/DAOs/Mongo/cart';
import { ApiError } from './errorApi';
import { storage } from '../models/usersFactory';
import { IMongoCart } from '../common/interfaces/products';
import { CUDResponse } from '../common/interfaces/others';

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
    async get(
        username?: string | undefined
    ): Promise<IMongoCart[] | ApiError > {
        if (username != null) {
            const product: IMongoCart[] | ApiError  = await this.products.get(
                username
            );
            return product;
        } else {
            const product: IMongoCart[] | ApiError  = await this.products.get();
            return product;
        }
    }
    async addProduct(username: string, product_id: string ): Promise<CUDResponse | ApiError> {
        const result : CUDResponse | ApiError = await this.products.add(username, product_id);
        return result;
    }
    async deleteProduct(username: string, product_id: string): Promise<CUDResponse | ApiError > {
        const result : CUDResponse | ApiError = await this.products.delete(username, product_id);
        return result;
    }
}
export const cartApi = new CartApi();
