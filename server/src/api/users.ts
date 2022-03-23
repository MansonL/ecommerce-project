import { UsersFactory } from "../models/usersFactory";
import { MongoUsers } from "../models/DAOs/Mongo/users";
import { ApiError } from "./errorApi";
import { IMongoUser, INew_User, UserAddresses } from "../interfaces/users";
import { CUDResponse } from "../interfaces/others";
import { storage } from "../config/config";

export class UsersApi {
  private users: MongoUsers;
  constructor() {
    this.users = UsersFactory.get(storage);
  }
  async getUsers(): Promise<IMongoUser[] | ApiError> {
    const result: IMongoUser[] | ApiError = await this.users.get();
    return result;
  }
  async getUserByUsername(username: string): Promise<IMongoUser | ApiError> {
    const result = await this.users.getByUser(username);
    return result;
  }

  async getUserByFacebookID(user_id: string): Promise<IMongoUser | ApiError> {
    const result: IMongoUser | ApiError = await this.users.getByFacebookID(
      user_id
    );
    return result;
  }

  async getUserByFullname(fullname: string): Promise<IMongoUser | ApiError> {
    const result: IMongoUser | ApiError = await this.users.getByFullname(
      fullname
    );
    return result;
  }

  async getAdmins(): Promise<string[] | ApiError> {
    const result: string[] | ApiError = await this.users.getAdmins();
    return result;
  }

  async addUser(user: INew_User): Promise<CUDResponse | ApiError> {
    const result: CUDResponse | ApiError = await this.users.add(user);
    return result;
  }

  async addAddress(
    user_id: string,
    address: UserAddresses
  ): Promise<CUDResponse | ApiError> {
    const result: CUDResponse | ApiError = await this.users.addAddress(
      user_id,
      address
    );
    return result;
  }
}

export const usersApi = new UsersApi();
