import { INew_User, CUDResponse, IMongoUser, InternalError } from '../common/interfaces/others';
import { storage } from '../models/usersFactory';
import { UsersFactory } from '../models/usersFactory';
import { MongoUsers } from '../models/DAOs/Mongo/users';
import { ApiError } from './errorApi';

export class UsersApi {
    private users: MongoUsers;
    constructor() {
        this.users = UsersFactory.get(storage);
    }
    async getUser(id: string): Promise<IMongoUser[] | ApiError | InternalError> {
        const result: IMongoUser[] | ApiError | InternalError = await this.users.get(id);
        return result;
    }
    async getUsers(): Promise<IMongoUser[] | ApiError | InternalError> {
        const result: IMongoUser[] | ApiError | InternalError = await this.users.get();
        return result;
    }
    async getUserByUsername(username: string): Promise <IMongoUser | ApiError | InternalError> {
        const result = await this.users.getByUser(username);
        return result
    }
    
    async getUserByFacebookID(id: string): Promise <IMongoUser | ApiError | InternalError> {
        const result : IMongoUser | ApiError | InternalError = await this.users.getByFacebookID(id);
        return result
    }

    async addUser(message: INew_User): Promise<CUDResponse | InternalError> {
        const result: CUDResponse | InternalError = await this.users.add(message);
        return result;
    }
}

export const usersApi = new UsersApi();
