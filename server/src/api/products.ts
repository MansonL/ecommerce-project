import { ProductsFactory } from '../models/productsFactory';
import {
    INew_Product,
    CUDResponse,
    IUpdate,
    IMongoProduct,
    IQuery,
    InternalError,
} from '../interfaces/interfaces';
import { MongoProducts } from '../models/DAOs/Mongo/products';
import { ApiError } from '../utils/errorApi';
import { storage } from '../models/usersFactory';

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
    async getProduct(id?: string | undefined): Promise<IMongoProduct[] | ApiError | InternalError> {
        if (id != null) {
            const result : IMongoProduct[] | ApiError | InternalError = await this.products.get(id);
            return result;
        } else {
            const result : IMongoProduct[] | ApiError | InternalError = await this.products.get();
            return result;
        }
    }
    async addProduct(product: INew_Product): Promise<CUDResponse | InternalError> {
        const result : CUDResponse | InternalError = await this.products.add(product);
        return result;
    }
    async updateProduct(id: string, product: IUpdate): Promise<CUDResponse | InternalError> {
        const result : CUDResponse | InternalError = await this.products.update(id, product);
        return result;
    }
    async deleteProduct(id: string): Promise<CUDResponse | InternalError> {
        const result : CUDResponse | InternalError = await this.products.delete(id);
        return result;
    }
    async query(options: IQuery): Promise<IMongoProduct[] | ApiError | InternalError> {
        const result : IMongoProduct[] | ApiError | InternalError = await this.products.query(options);
        return result;
    }
    
}

export const productsApi = new ProductsApi();
