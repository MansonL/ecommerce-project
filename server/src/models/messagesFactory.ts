import { MemoryType } from './usersFactory';
import { MongoMessages } from './DAOs/Mongo/messages';
import { logger } from '../services/logger';
import { Config } from '../config/config';
import cluster from 'cluster';

/**
 *
 *
 * Factory of Messages DAOs
 *
 * This class will return the selected type of memory storage
 *
 *
 */

export class MessagesFactory {
    static get(type: string): MongoMessages {
        switch (type) {
            case MemoryType.MongoAtlas:
            if(Config.MODE === 'CLUSTER'){
                if(cluster.isMaster){
                    logger.info(`Using MongoAtlas`);
                    return new MongoMessages('atlas');
                }
                return new MongoMessages('atlas');
            }else{
                logger.info(`Using MongoAtlas`);
                return new MongoMessages('atlas');
            }
            
            case MemoryType.LocalMongo:
            if(Config.MODE === 'CLUSTER'){
                if(cluster.isMaster){
                    logger.info(`Using Local Mongo`);
                    return new MongoMessages('local');
                }
                return new MongoMessages('local');
            }else{
                logger.info(`Using Local Mongo`);
                return new MongoMessages('local');
            }
            
            default:
            if(Config.MODE === 'CLUSTER'){
                if(cluster.isMaster){
                    logger.info(`DEFAULT: MongoAtlas`);
                    return new MongoMessages('atlas');
                }
                return new MongoMessages('atlas');
            }else{
                logger.info(`DEFAULT: MongoAtlas`);
                return new MongoMessages('atlas');
            }
        }
    }
}
