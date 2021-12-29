import mongoose from 'mongoose';
import { storage } from '../../usersFactory';
import { MemoryType } from '../../usersFactory';
import { atlasURI, mongoURI } from './models';

const mongoURL = storage === MemoryType.MongoAtlas ? atlasURI : mongoURI;


export const mongoConnection = ()   => {
        return mongoose.connect(mongoURL).then((data) => {
            console.log(`MongoDB Connected`);
            return data.connection.getClient();
        })
    
};
