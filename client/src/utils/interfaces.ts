import { IMongoCart, IMongoProduct, INew_Product } from '../../../server/src/interfaces/products';
import {
    IMongoUser,
} from '../../../server/src/interfaces/users';
import { IOrderPopulated } from '../../../server/src/interfaces/orders';
import {
    IMessageSentPopulated,
    IMongoPopulatedMessages,
} from '../../../server/src/interfaces/messages';

export interface AppContext {
    user: IUser | undefined;
    setUser: (user: IUser) => void;
    loggedIn: boolean;
    setLoggedIn: (boolean: boolean) => void;
    loading: boolean;
    setLoading: (boolean: boolean) => void;
    cart: IMongoCart | undefined;
    setCart: (cart: IMongoCart) => void;
    selectedAddress: string | undefined;
    setSelectedAddress: (address: string) => void;
    cartConfirmated: boolean;
    setCartConfirmated: (boolean: boolean) => void;
    updateLoginStatus: (userData: Authenticated | undefined) => void;
}

export type Authenticated = IUser & {
    user_cart: IMongoCart;
};

export type IUser = Omit<INew_User, 'password' | 'repeatedPassword'> & {
    _id: string;
};

export type UserAddresses = {
    _id: string;
    alias: string;
    street1: {
      name: string;
      number: number;
    };
    street2?: string;
    street3?: string;
    zipcode: string;
    floor?: string;
    department?: string;
    city: string;
    extra_info: string;
  };

export interface INew_User extends UserInfo {
    createdAt: string;
    modifiedAt: string;
  }
  
export type UserInfo = {
    username: string;
    password: string;
    repeatedPassword: string;
    name: string;
    surname: string;
    age: string;
    avatar?: string;
    phoneNumber: string;
    facebookID?: string;
    addresses?: UserAddresses[];
    isAdmin: boolean;
    connectionID?: string;
  };

export interface authResponse {
    message: string;
    data: Authenticated;
}

export interface UserCUDResponse {
    message: string;
    data: IUser;
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
