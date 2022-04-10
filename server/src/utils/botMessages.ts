import moment from "moment";
import { cartApi } from "../api/cart";
import { ApiError } from "../api/errorApi";
import { messagesApi } from "../api/messages";
import { ordersApi } from "../api/order";
import { productsApi } from "../api/products";
import { IMongoOrderPopulated, IOrderPopulated } from "../interfaces/orders";
import { CUDResponse } from "../interfaces/others";
import { IMongoCart, IMongoProduct } from "../interfaces/products";

// In next line we have the already created user bot,  which is stored in DB, id. This will be implemented by creating a new ObjectId to be assigned to the BOT at the moment of its storing in DB and therefore being available to be used here.

const BOTID = "62314984224672161087f8e4";

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
          to: user_id,
          type: "bot",
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
          to: user_id,
          type: "bot",
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
          to: user_id,
          type: "bot",
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
