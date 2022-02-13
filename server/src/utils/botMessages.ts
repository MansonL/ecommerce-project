import moment from "moment";
import { Types } from "mongoose";
import { cartApi } from "../api/cart";
import { ApiError } from "../api/errorApi";
import { messagesApi } from "../api/messages";
import { ordersApi } from "../api/order";
import { productsApi } from "../api/products";
import { IMongoOrderPopulated, IOrderPopulated } from "../interfaces/orders";
import { CUDResponse } from "../interfaces/others";
import { IMongoCart, IMongoProduct } from "../interfaces/products";

const BOTID = new Types.ObjectId();

export const botAnswer = async (
  message: string,
  user_id: string,
  username: string
): Promise<string> => {
  switch (message.toLowerCase()) {
    case "stock": {
      const result: IMongoProduct[] | ApiError = await productsApi.getStock();
      if (result instanceof ApiError) return result.message;
      else {
        const result2: CUDResponse | ApiError = await messagesApi.addMsg({
          timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
          from: BOTID,
          to: new Types.ObjectId(user_id),
          type: "system",
          message: JSON.stringify(result, null, "\t"),
        });
        if (result2 instanceof ApiError) return result2.message;
        else {
          const message = JSON.stringify(result2.data, null, "\n");
          return message;
        }
      }
    }
    case "order": {
      const result: IOrderPopulated[] | IMongoOrderPopulated[] | ApiError =
        await ordersApi.get("user", user_id);
      if (result instanceof ApiError) return result.message;
      else {
        const result2: CUDResponse | ApiError = await messagesApi.addMsg({
          timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
          from: BOTID,
          to: new Types.ObjectId(user_id),
          type: "system",
          message: JSON.stringify(result, null, "\t"),
        });
        if (result2 instanceof ApiError) return result2.message;
        else {
          const message = JSON.stringify(result2.data, null, "\t");
          return message;
        }
      }
    }
    case "cart": {
      const result: IMongoCart[] | ApiError = await cartApi.get(username);
      if (result instanceof ApiError) return result.message;
      else {
        const result2: CUDResponse | ApiError = await messagesApi.addMsg({
          timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
          from: BOTID,
          to: new Types.ObjectId(user_id),
          type: "system",
          message: JSON.stringify(result, null, "\t"),
        });
        if (result2 instanceof ApiError) return result2.message;
        else {
          const message = JSON.stringify(result2.data, null, "\t");
          return message;
        }
      }
    }
    default:
      return `Please, type a valid option among the followings: order, stock or cart.`;
  }
};
