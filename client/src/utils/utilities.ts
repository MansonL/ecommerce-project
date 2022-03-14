import { verify } from "jsonwebtoken";
import { IMongoPopulatedMessages } from "../../../server/src/interfaces/messages";
import { IMongoCart } from "../../../server/src/interfaces/products";
import { UserInfo, UserAddresses } from "../../../server/src/interfaces/users";
import { IUser } from "./interfaces";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    user: IUser & {
      user_cart: IMongoCart;
    };
  }
}

export const verifyToken = async (token: string) => {
  const userData = await verify(token, "secret");
  return userData;
};

export const cleanEmptyProperties: (user: UserInfo) => UserInfo = (
  user: UserInfo
) => {
  if (user.avatar === "") delete user.avatar;
  if (user.addresses && user.addresses[0].street1.name !== "")
    delete user.addresses;
  return user;
};

export const takeChats = (
  user_id: string,
  messages: IMongoPopulatedMessages[]
) => {
  const receivedMessages: {
    [index: string]: IMongoPopulatedMessages[];
  } = {};
  const sentMessages: {
    [index: string]: IMongoPopulatedMessages[];
  } = {};
  messages.forEach((message) => {
    if (message.from._id) {
      if (receivedMessages[message.from._id])
        receivedMessages[message.from._id].push(message);
      else receivedMessages[message.from._id] = [message];
    } else {
      if (sentMessages[message.to._id])
        sentMessages[message.to._id].push(message);
      else sentMessages[message.to._id] = [message];
    }
  });
  return { receivedMessages, sentMessages };
};

export const formatAddress = (address: UserAddresses): string => {
  return `${address.street1.name} ${address.street1.number},${
    address.department && address.floor
      ? ` ${address.department} ${address.floor}, `
      : " "
  }${address.city} ${address.zipcode}`;
};
