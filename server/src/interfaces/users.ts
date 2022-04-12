import { Document, ObjectId } from "mongodb";
import { ApiError } from "../api/errorApi";
import { CUDResponse } from "./others";

export interface IUserUpdate {
  password?: string;
  repeatedPassword?: string;
  connectionID?: string;
  address?: string | string[]; // This property is gonna hold the addresses or one address id in order to modify the user addresses array stored at DB
}

/**
 * Users data for requests from other users without admin permissions.
 */
export interface IUserShortInfo {
  _id: ObjectId;
  username: string;
  name: string;
  surname: string;
  avatar: string;
}

/**
 * Type of User Object to be stored and query from Mongo.
 */
export interface IMongoUser extends Document, INew_User {
  _id: ObjectId;
  // eslint-disable-next-line no-unused-vars
  isValidPassword: (password: string) => Promise<boolean>;
}

/**
 *
 * Type of User Object receiving from the frontend.
 *
 */
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

export type UserAddresses = {
  _id: ObjectId;
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

/**
 *
 * Users Storage Classes structure
 *
 */
export interface DBUsersClass {
  init?(): Promise<void>;

  // eslint-disable-next-line no-unused-vars
  get(id?: string | undefined): Promise<IMongoUser[] | ApiError>;

  // eslint-disable-next-line no-unused-vars
  getByUser(username: string): Promise<IMongoUser | ApiError>; // This method is for checking and not storing repeated users.

  // eslint-disable-next-line no-unused-vars
  add(user: INew_User): Promise<CUDResponse | ApiError>;
}

/**
 *
 * @param data Possible user object
 * @returns whether the passed data is the desired Mongo DB Object or not
 */

export const isUser = (data: any): data is IMongoUser => {
  return data.length ? "username" in data[0] : "username" in data;
};
