import { IMongoCart } from "../../../server/src/common/interfaces/products";
import { INew_User, UserAddresses } from "../../../server/src/common/interfaces/users";

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
    user_id: string;
}

export const userDefaultValue : IUserInfo = {
    user_id: '',
username: '',
password: '',
repeatedPassword: '',
name: '',
surname: '',
age: '',
avatar: '',
phoneNumber: '',
facebookID: '',
addresses: [{
    _id: '',
    alias: '',
    street1: {
        name: '',
        number: 0,
    },
    street2: '',
    street3: '',
    zipcode: '',
    floor: '',
    department: '',
    city: '',
}],
isAdmin: false,
}

export const newUserDefault : INew_User = { 
    createdAt: '',
    modifiedAt: '',
    data: {
        username: '',
    password: '',
    repeatedPassword: '',
    name: '',
    surname: '',
    age: '',
    avatar: '',
    phoneNumber: '',
    facebookID: '',
    addresses: [{
    _id: '',
    alias: '',
    street1: {
        name: '',
        number: 0,
    },
    street2: '',
    street3: '',
    zipcode: '',
    floor: '',
    department: '',
    city: '',
    }],
    isAdmin: false,
    }
}

export interface authResponse {
    message: string;
    data: {} | string; 
}

export interface cartGetResponse {
    message: string;
    data: IMongoCart[];
}
export interface cartModificationResponse {
    message: string;
    data: IMongoCart
}