import {
    CUDResponse,
    IMongoCartProduct,
    INew_Product,
    InternalError,
} from '../interfaces/interfaces';
import { CartFactory } from '../models/cartFactory';
import { MongoCart } from '../models/DAOs/Mongo/cart';
import { ApiError } from '../utils/errorApi';
import { storage } from '../models/usersFactory';

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
    async getProduct(
        id?: string | undefined
    ): Promise<IMongoCartProduct[] | ApiError | InternalError> {
        if (id != null) {
            const product: IMongoCartProduct[] | ApiError | InternalError = await this.products.get(
                id
            );
            return product;
        } else {
            const product: IMongoCartProduct[] | ApiError | InternalError = await this.products.get();
            return product;
        }
    }
    async addProduct(id: string, product: INew_Product): Promise<CUDResponse | InternalError> {
        const result : CUDResponse | InternalError = await this.products.add(id, product);
        return result;
    }
    async deleteProduct(id: string): Promise<CUDResponse | InternalError> {
        const result : CUDResponse | InternalError = await this.products.delete(id);
        return result;
    }
}
export const cartApi = new CartApi();
