import { ApiError } from "../api/errorApi";

/**
 *
 * Type of Product to be stored and query from Mongo
 *
 */
export interface IMongoProduct extends INew_Product {
    _id: string;
}

/**
 *
 * Type of Cart Product to be query from Mongo
 *
 */
export interface IMongoCartProduct extends ICartProduct {
    _id: string;
}

/**
 * Type of Cart Product to be stored to Mongo DB
 *
 */
export interface ICartProduct extends INew_Product {
    product_id: string;
}

/**
 *
 * Type of Product Object we are receiving from the frontend.
 *
 */
export interface INew_Product {
    title: string;
    description: string;
    timestamp: string; // Will have this type after the controller set product's
    code: string; // timestamp.
    img: string;
    stock: number;
    price: number;
}

/**
 *
 * Type of Message Object to be stored and query from Mongo.
 *
 */
export interface IMongoMessage extends INew_Message {
    _id: string;
}

/**
 *
 * Type of Message Object receiving from the frontend.
 *
 */
export interface INew_Message {
    timestamp: string;
    author: IMongoUser;
    message: string;
}

/**
 *
 * Type of User Object to be stored and query from Mongo.
 *
 */
export interface IMongoUser extends INew_User {
    _id: string;
}

/**
 *
 * Type of User Object receiving from the frontend.
 *
 */
export interface INew_User {
    timestamp: string;
    username: string;
    password: string;
    name: string;
    surname: string;
    age: string;
    alias: string;
    avatar: string;
    photos: string[];
    facebookID: string;
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
    img?: string;
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
 * Response type of adding, deleting & updating products from storage.
 *
 */

export interface CUDResponse {
    message: string;
    data: IMongoProduct | IMongoMessage | IMongoUser | [];
}

/**
 * 
 * Internal Error Response type
 * 
 */
export interface InternalError {
    error: any;
    message: string;
}

/**
 *
 * Product Storage Classes structure.
 *
 */
export interface DBProductsClass {
    init?(): Promise<void>;
    get(id?: string | undefined): Promise<IMongoProduct[] | ApiError | InternalError>;
    add(newProduct: INew_Product): Promise<CUDResponse | InternalError>;
    update(id: string | number, data: IUpdate): Promise<CUDResponse | InternalError>;
    delete(id: string | number): Promise<CUDResponse | InternalError>;
    query(options: IQuery): Promise<IMongoProduct[] | ApiError | InternalError>;
}

/**
 *
 * Cart Storage Classes structure.
 *
 */
export interface DBCartClass {
    init?(): Promise<void>;
    get(
        id?: string | undefined
    ): Promise<IMongoCartProduct[] | ApiError | InternalError>;
    add(id: string, product: INew_Product): Promise<CUDResponse | InternalError>;
    delete(id: string): Promise<CUDResponse | InternalError>;
}

/**
 *
 * Message Storage Classes structure
 *
 */
export interface DBMessagesClass {
    init?(): Promise<void>;
    get(): Promise<IMongoMessage[] | ApiError | InternalError>;
    add(msg: INew_Message): Promise<CUDResponse | InternalError>;
}

/**
 *
 * Users Storage Classes structure
 *
 */
export interface DBUsersClass {
    init?(): Promise<void>;
    get(id?: string | undefined): Promise<IMongoUser[] | ApiError | InternalError>;
    getByUser(username: string): Promise <IMongoUser | ApiError | InternalError>  // This method is for checking and not storing repeated users.
    add(user: INew_User): Promise<CUDResponse | ApiError>;
}
