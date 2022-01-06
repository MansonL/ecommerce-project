import { IMongoMessage } from "./messages";
import { IOrder, IOrderPopulated } from "./orders";
import { IMongoCart, IMongoProduct } from "./products";
import { IMongoUser } from "./users";


/**
 *
 * Response type of adding, deleting & updating products from storage.
 *
 */

export interface CUDResponse {
    message: string;
    data: IMongoProduct | IMongoMessage | IMongoUser | IMongoCart | IOrderPopulated | IOrder | [];
}





