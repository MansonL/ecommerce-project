import { Document, ObjectId } from "mongodb";
import { ApiError } from "../../api/errorApi";
import { CUDResponse, } from "./others";

/**
 * 
 * Type of Mongo DB Product to be queried.
 * 
 */
export interface IMongoCart extends Document {
    _id: ObjectId;
    createdAt: string;
    modifiedAt: string;
    user: ObjectId;
    products: {
        product: {
            _id: ObjectId;
            title: string;
            images: {
                url: string;
                photo_id: string;
            }[];
            price: number;
        },
        quantity: number;
    }[];
}

/**
 * 
 * Type of Mongo Cart to be stored in DB (just for schemas & models)
 * 
 */
export interface ICart {
    createdAt: string;
    user: ObjectId;
    products: {
        product: ObjectId;
        quantity: number;
    }[];

}

/**
 *
 * Type of Mongo DB Product to be queried.
 *
 */
 export interface IMongoProduct extends INew_Product, Document{
    _id: string;
}

/**
 *
 * Type of Product Object we are receiving from the frontend.
 *
 */
export interface INew_Product {
    title: string;
    description: string;
    createdAt: string; 
    modifiedAt: string;
    code: string; 
    images: { url: string; photo_id: string; }[]
    stock: number;
    price: number;
    category: string;
}




/**
 *
 * Type of the possible Update Object properties in an update request.
 *
 */
export interface IUpdate {
    title?: string;
    description?: string;
    code?: string;
    category?: string;
    images?: {
        photo_id: string;
        url: string;   
    }[]
    stock?: number;
    price?: number;
}

/**
 *
 * Type of the possible Query Object properties in a query request.
 *
 */
export interface IQuery {
    title: string;
    code: string;
    category: string;
    stock: {
        minStock: number;
        maxStock: number;
    };
    price: {
        minPrice: number;
        maxPrice: number;
    };
}


/**
 *
 * Product Storage Classes structure.
 *
 */
 export interface DBProductsClass {
    init?(): Promise<void>;
    get(id?: string | undefined): Promise<IMongoProduct[] | ApiError>;
    add(newProduct: INew_Product): Promise<CUDResponse | ApiError>;
    update(id: string | number, data: IUpdate): Promise<CUDResponse | ApiError>;
    delete(id: string | number): Promise<CUDResponse | ApiError>;
    query(options: IQuery): Promise<IMongoProduct[] | ApiError>;
}

/**
 *
 * Cart Storage Classes structure.
 *
 */
export interface DBCartClass {
    init?(): Promise<void>;
    get(
        user_id?: string | undefined
    ): Promise<IMongoCart[] | ApiError>;
    add(user_id: string, product_id: string, quantity: number): Promise<CUDResponse | ApiError>;
    delete(user_id: string, product_id: string, quantity: number): Promise<CUDResponse | ApiError>;
}

/**
 * 
 * @param data Possible product object
 * @returns whether the passed data is the desired Mongo DB Object or not
 */

export const isCartProduct = (data: any): data is IMongoCart  => {
    return data.length ? 'product_id' in data[0] : 'product_id' in data                                 
 }
 
 export const isProduct = (data: any): data is IMongoProduct => {
     return data.length ? '_id' in data[0] : '_id' in data  
 }