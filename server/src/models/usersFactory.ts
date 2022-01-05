import cluster from "cluster";
import { Config } from "../config/config";
import { logger } from "../services/logger";
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

export const storage = Config.PERSISTANCE

export class UsersFactory {
    static get(type: string): MongoUsers {
        switch (type) {
            case MemoryType.MongoAtlas:
                if(Config.MODE === 'CLUSTER'){
                    if(cluster.isMaster){
                        logger.info(`Using MongoAtlas`);
                        return new MongoUsers('atlas');
                    }
                    return new MongoUsers('atlas');
                }else{
                    logger.info(`Using MongoAtlas`);
                    return new MongoUsers('atlas');
                }
                
            case MemoryType.LocalMongo:
                if(Config.MODE === 'CLUSTER'){
                    if(cluster.isMaster){
                        logger.info(`Using Local Mongo`);
                        return new MongoUsers('local');
                    }
                    return new MongoUsers('local');
                }else{
                    logger.info(`Using Local Mongo`);
                    return new MongoUsers('local');
                }
                
            default:
                if(Config.MODE === 'CLUSTER'){
                    if(cluster.isMaster){
                        logger.info(`DEFAULT: MongoAtlas`);
                        return new MongoUsers('atlas');
                    }
                    return new MongoUsers('atlas');
                }else{
                    logger.info(`DEFAULT: MongoAtlas`);
                    return new MongoUsers('atlas');
                }
                
        }
    }
}