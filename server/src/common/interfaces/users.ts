import { Document } from "mongodb"
import { ApiError } from "../../api/errorApi"
import { CUDResponse, InternalError } from "./others"

/**
 *
 * Type of User Object to be stored and query from Mongo.
 *
 */
 export interface IMongoUser extends Document{
    _id: string;
    createdAt: string;
    modifiedAt: string;
    data: {
        username: string; 
        name: string;
        surname: string;
        age: string;
        avatar: string;
        photos: string[];
        facebookID?: string;
        addresses?: UserAddresses;
    },
    isAdmin: boolean;
}

export type UserAddresses = {
    street1: {
        name: string;
        number: number;
    }
    street2?: string;
    street3?: string;
    zipcode: string;
    floor?: string;
    department?: string;
    city: string;
}

export type UserInfo = {
    username: string;
    password: string;
    repeatedPassword: string;
    name: string;
    surname: string;
    age: string;
    avatar: string;
    photos: string[];
    facebookID?: string;
    addresses?: UserAddresses;
}
/**
 *
 * Type of User Object receiving from the frontend.
 *
 */
export interface INew_User {
    createdAt: string;
    modifiedAt: string;
    data: UserInfo;
    isAdmin: boolean;
}

/**
 *
 * Users Storage Classes structure
 *
 */
 export interface DBUsersClass {
    init?(): Promise<void>;
    get(id?: string | undefined): Promise<IMongoUser[] | ApiError >;
    getByUser(username: string): Promise <IMongoUser | ApiError >  // This method is for checking and not storing repeated users.
    add(user: INew_User): Promise<CUDResponse | ApiError>;
}

/**
 * 
 * @param data Possible user object
 * @returns whether the passed data is the desired Mongo DB Object or not
 */

export const isUser = (data: any): data is IMongoUser => {
    return data.length ? 'username' in data[0] : 'username' in data 
}