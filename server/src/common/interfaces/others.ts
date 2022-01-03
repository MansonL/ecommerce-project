import { IMongoMessage } from "./messages";
import { IMongoCart, IMongoProduct } from "./products";
import { IMongoUser } from "./users";


/**
 *
 * Response type of adding, deleting & updating products from storage.
 *
 */

export interface CUDResponse {
    message: string;
    data: IMongoProduct | IMongoMessage | IMongoUser | IMongoCart | [];
}

export const isCUDResponse = (data: any): data is CUDResponse => {
    return 'data' in data
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






