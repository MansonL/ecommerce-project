/* eslint-disable no-unused-vars */

import { ObjectId } from "mongodb";
import { ApiError } from "../api/errorApi";
import { CUDResponse } from "./others";
import { UserAddresses } from "./users";

export interface IMongoOrderPopulated {
  user: {
    username: string;
  };
  orders: IOrderPopulated[];
}

export interface IOrderPopulated {
  _id: ObjectId;
  createdAt: string;
  products: OrderProducts[];
  status: "created" | "paid" | "delivering" | "completed";
  total: number;
  address: UserAddresses;
}

export interface OrderProducts {
  product_id: ObjectId;
  product_title: string;
  quantity: number;
  price: number;
}

export interface IOrder {
  _id: ObjectId;
  createdAt: string;
  products: OrderProducts[];
  status: "created" | "paid" | "delivering" | "completed";
  total: number;
  address: ObjectId;
}

export interface IUserOrder {
  user: ObjectId; // After population it will be username: string;
  orders: IOrder[];
}

export interface DBOrdersClass {
  init?(): Promise<void>;
  get(
    type: "user" | "order" | undefined,
    _id: string | undefined
  ): Promise<IMongoOrderPopulated[] | IOrderPopulated[] | ApiError>;
  createUpdate(order: IOrder, user_id: string): Promise<CUDResponse | ApiError>;
  modifyStatus(
    order_id: string,
    user_id: string,
    newStatus: "created" | "paid" | "delivering" | "completed"
  ): Promise<CUDResponse | ApiError>;
}
