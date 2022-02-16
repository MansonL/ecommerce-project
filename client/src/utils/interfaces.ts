import {
  IMongoCart,
  IMongoProduct,
  INew_Product,
} from "../../../server/src/interfaces/products";
import {
  IMongoUser,
  UserAddresses,
  UserInfo,
} from "../../../server/src/interfaces/users";
import { Types } from "mongoose";
import { IOrderPopulated } from "../../../server/src/interfaces/orders";
import {
  IMessageSentPopulated,
  IMongoPopulatedMessages,
} from "../../../server/src/interfaces/messages";
import { ObjectId } from "mongodb";

export interface IUserInfo {
  username: string;
  password: string;
  repeatedPassword: string;
  name: string;
  surname: string;
  age: string;
  avatar?: string | undefined;
  phoneNumber: string;
  facebookID?: string | undefined;
  addresses?: UserAddresses[] | undefined;
  isAdmin: boolean;
  _id: string;
}

export const userDefault: IUserInfo = {
  _id: "",
  username: "",
  password: "",
  repeatedPassword: "",
  name: "",
  surname: "",
  age: "",
  avatar: "",
  phoneNumber: "",
  facebookID: "",
  addresses: [
    {
      _id: "",
      alias: "",
      street1: {
        name: "",
        number: 0,
      },
      street2: "",
      street3: "",
      zipcode: "",
      floor: "",
      department: "",
      city: "",
      extra_info: "",
    },
  ],
  isAdmin: false,
};

export const newUserDefault: UserInfo = {
  username: "",
  password: "",
  repeatedPassword: "",
  name: "",
  surname: "",
  age: "",
  avatar: "",
  phoneNumber: "",
  facebookID: "",
  isAdmin: false,
};

export const cartDefault: IMongoCart = {
  user: new Types.ObjectId(),
  createdAt: "",
  modifiedAt: "",
  _id: new Types.ObjectId(),
  products: [],
};

export const defaultAddress: UserAddresses = {
  _id: "",
  alias: "",
  street1: {
    name: "",
    number: 0,
  },
  street2: "",
  street3: "",
  zipcode: "",
  floor: "",
  department: "",
  city: "",
  extra_info: "",
};

export const defaultProduct: INew_Product = {
  createdAt: "",
  modifiedAt: "",
  title: "",
  description: "",
  images: [],
  price: 0,
  stock: 0,
  code: "",
  category: "",
};

export const defaultProductFromDB: IMongoProduct = {
  ...defaultProduct,
  _id: new ObjectId(),
};

export interface authResponse {
  message: string;
  data: string;
}

export interface UserCUDResponse {
  message: string;
  data: IMongoUser;
}

export interface cartResponse {
  data: IMongoCart[];
}
export interface orderResponse {
  message: string;
  data: IOrderPopulated;
}
export interface CartCUDResponse {
  message: string;
  data: IMongoCart;
}
export interface ProductCUDResponse {
  message: string;
  data: IMongoProduct[];
}
export interface messagesGetResponse {
  data: IMongoPopulatedMessages[];
}
export interface messageSentResponse {
  message: string;
  data: IMessageSentPopulated;
}
