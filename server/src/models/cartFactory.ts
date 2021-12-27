import { MongoCart } from './DAOs/Mongo/cart';
import { MemoryType } from './usersFactory';

export class CartFactory {
    static get(type: MemoryType): MongoCart {
        switch (type) {
            case MemoryType.MongoAtlas:
                console.log(`Using ATLAS`);
                return new MongoCart('Atlas');
            case MemoryType.LocalMongo:
                console.log(`Using Local Mongo`);
                return new MongoCart('local');
            default:
                console.log(`DEFAULT: MongoAtlas`);
                return new MongoCart('atlas');
        }
    }
}
