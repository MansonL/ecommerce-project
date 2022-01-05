import cluster from 'cluster';
import { Config } from '../config/config';
import { logger } from '../services/logger';
import { MongoProducts } from './DAOs/Mongo/products';
import { MemoryType } from './usersFactory';


/**
 *
 *
 * Factory of Products DAOs
 *
 * This class will return the selected type of memory storage
 *
 *
 */

export class ProductsFactory {
    static get(type: string): MongoProducts {
        switch (type) {
            case MemoryType.MongoAtlas:
                if(Config.MODE === 'CLUSTER'){
                    if(cluster.isMaster){
                        logger.info(`Using MongoAtlas`);
                        return new MongoProducts('atlas');
                    }
                    return new MongoProducts('atlas');
                }else{
                    logger.info(`Using MongoAtlas`);
                    return new MongoProducts('atlas');
            } 
            case MemoryType.LocalMongo:
                if(Config.MODE === 'CLUSTER'){
                    if(cluster.isMaster){
                        logger.info(`Using Local Mongo`);
                        return new MongoProducts('local');
                    }
                    return new MongoProducts('local');
                }else{
                    logger.info(`Using Local Mongo`);
                    return new MongoProducts('local');
                } 
            
            default:
                if(Config.MODE === 'CLUSTER'){
                    if(cluster.isMaster){
                        logger.info(`DEFAULT: MongoAtlas`);
                        
                    }
                    return new MongoProducts('atlas');
                }else{
                    logger.info(`DEFAULT: MongoAtlas`);
                    return new MongoProducts('atlas');
            } 
            
        }
    }
}
