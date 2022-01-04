import { MemoryType } from './usersFactory';
import { MongoMessages } from './DAOs/Mongo/messages';

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
                console.log(`Using MongoAtlas`);
                return new MongoMessages('atlas');
            case MemoryType.LocalMongo:
                console.log(`Using Local Mongo`);
                return new MongoMessages('local');
            default:
                console.log(`DEFAULT: MongoAtlas`);
                return new MongoMessages('atlas');
        }
    }
}
