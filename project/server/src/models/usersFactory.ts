import { MongoUsers } from "./DAOs/Mongo/users";

/**
 *
 * Different types of memory storage
 *
 */

 export enum MemoryType {
    MongoAtlas = 'Mongo-Atlas',
    LocalMongo = 'Local-Mongo',
}

export const storage = MemoryType.MongoAtlas;

export class UsersFactory {
    static get(type: MemoryType): MongoUsers {
        switch (type) {
            case MemoryType.MongoAtlas:
                console.log(`Using MongoAtlas`);
                return new MongoUsers('atlas');
            case MemoryType.LocalMongo:
                console.log(`Using Local Mongo`);
                return new MongoUsers('local');
            default:
                console.log(`DEFAULT: MongoAtlas`);
                return new MongoUsers('atlas');
        }
    }
}