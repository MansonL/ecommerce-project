import { storage } from "../config/config";
import {
  IMongoOrderPopulated,
  IOrder,
  IOrderPopulated,
} from "../interfaces/orders";
import { CUDResponse } from "../interfaces/others";
import { MongoOrders } from "../models/DAOs/Mongo/orders";
import { OrdersFactory } from "../models/orderFactory";
import { ApiError } from "./errorApi";

export class OrdersApi {
  private orders: MongoOrders;
  constructor() {
    this.orders = OrdersFactory.get(storage);
  }

  async get(
    type: "user" | "order" | undefined,
    _id: string | undefined
  ): Promise<IMongoOrderPopulated[] | IOrderPopulated[] | ApiError> {
    const result: IMongoOrderPopulated[] | IOrderPopulated[] | ApiError =
      await this.orders.get(type, _id);
    return result;
  }

  async create(
    order: IOrder,
    user_id: string
  ): Promise<CUDResponse | ApiError> {
    const result: CUDResponse | ApiError = await this.orders.create(
      order,
      user_id
    );
    return result;
  }

  async modifyOrder(
    order_id: string,
    newStatus: "created" | "paid" | "delivering" | "completed"
  ): Promise<CUDResponse | ApiError> {
    const result: CUDResponse | ApiError = await this.orders.modifyStatus(
      order_id,
      newStatus
    );
    return result;
  }
}

export const ordersApi = new OrdersApi();
