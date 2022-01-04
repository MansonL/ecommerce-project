import mongoose from 'mongoose';
import { Config } from '../../../config/config';
import { storage } from '../../usersFactory';
import { MemoryType } from '../../usersFactory';
import * as dotenv from 'dotenv';


const atlasURI = `mongodb+srv://${Config.ATLAS_DB_USER}:${Config.ATLAS_DB_PASSWORD}@project.lofof.mongodb.net/${Config.DB_NAME}?retryWrites=true&w=majority`;

const mongoURI = `mongodb://${Config.ATLAS_DB_USER}:${Config.ATLAS_DB_PASSWORD}@localhost:27018/${Config.DB_NAME}`;

const mongoURL = storage === MemoryType.MongoAtlas ? atlasURI : mongoURI;

console.log(Config)
export const mongoConnection = ()   => {
        return mongoose.connect(mongoURL).then((data) => {
            console.log(`MongoDB Connected`);
            return data.connection.getClient();
        })
    
};
