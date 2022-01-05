import cluster from 'cluster';
import { Config } from '../config/config';
import { logger } from '../services/logger';
import { MongoCart } from './DAOs/Mongo/cart';
import { MemoryType } from './usersFactory';

export class CartFactory {
    static get(type: string): MongoCart {
        switch (type) {
            case MemoryType.MongoAtlas:
            if(Config.MODE === 'CLUSTER'){
                if(cluster.isMaster){
                    logger.info(`Using MongoAtlas`);
                    return new MongoCart('Atlas'); 
                }
                return new MongoCart('Atlas');
            }else{
                logger.info(`Using MongoAtlas`);
                return new MongoCart('Atlas');
            }    
            case MemoryType.LocalMongo:
            if(Config.MODE === 'CLUSTER'){
                if(cluster.isMaster){
                    logger.info(`Using Local Mongo`);
                    return new MongoCart('local');
                }
                return new MongoCart('local');
            }else{
                logger.info(`Using Local Mongo`);
                return new MongoCart('local');
            }    
            default:
            if(Config.MODE === 'CLUSTER'){
                if(cluster.isMaster){
                    logger.info(`DEFAULT: MongoAtlas`);
                    
                }
                return new MongoCart('atlas');
            }else{
                logger.info(`DEFAULT: MongoAtlas`);
                return new MongoCart('atlas');
            }    
        }
    }
}
