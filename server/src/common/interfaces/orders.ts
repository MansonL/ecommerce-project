import { ObjectId, Document } from "mongodb";
import { ApiError } from "../../api/errorApi";
import { CUDResponse } from "./others";

export interface IMongoOrder extends IOrder, Document {
    _id: string;
}

export interface IOrder {
    user: ObjectId;
    orders: {
        createdAt: string;
        products: {
            product_id: ObjectId;
            quantity: number;
            price: number;
        }[];
        status: 'created' | 'paid' | 'delivering' | 'completed',
        total: number;
    }[]
}

export interface DBOrdersClass {
    init?(): Promise<void>;
    get(type: 'user' | 'order' | undefined, _id: string | undefined): Promise<IMongoOrder[] | ApiError>;
    create(order: IOrder): Promise<CUDResponse | ApiError>;
    modifyStatus(order_id: string, newStatus: string): Promise<CUDResponse | ApiError>;
}