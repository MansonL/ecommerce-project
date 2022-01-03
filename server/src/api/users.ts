
import { storage } from '../models/usersFactory';
import { UsersFactory } from '../models/usersFactory';
import { MongoUsers } from '../models/DAOs/Mongo/users';
import { ApiError } from './errorApi';
import { IMongoUser, INew_User } from '../common/interfaces/users';
import { CUDResponse } from '../common/interfaces/others';

export class UsersApi {
    private users: MongoUsers;
    constructor() {
        this.users = UsersFactory.get(storage);
    }
    async getUser(id: string): Promise<IMongoUser[] | ApiError > {
        const result: IMongoUser[] | ApiError  = await this.users.get(id);
        return result;
    }
    async getUsers(): Promise<IMongoUser[] | ApiError > {
        const result: IMongoUser[] | ApiError  = await this.users.get();
        return result;
    }
    async getUserByUsername(username: string): Promise <IMongoUser | ApiError > {
        const result = await this.users.getByUser(username);
        return result
    }
    
    async getUserByFacebookID(id: string): Promise <IMongoUser | ApiError > {
        const result : IMongoUser | ApiError  = await this.users.getByFacebookID(id);
        return result
    }

    async addUser(message: INew_User): Promise<CUDResponse | ApiError> {
        const result: CUDResponse | ApiError = await this.users.add(message);
        return result;
    }
}

export const usersApi = new UsersApi();
