import { model, Model, Schema } from 'mongoose';
import { ApiError } from '../../../api/errorApi';
import { EUsersErrors } from '../../../common/EErrors';
import moment from 'moment';
import { IMongoUser, INew_User } from '../../../common/interfaces/users';
import { CUDResponse } from '../../../common/interfaces/others';
import bcrypt from 'bcrypt';
import { logger } from '../../../services/logger';
import { Config } from '../../../config/config';
import cluster from 'cluster';

const usersSchema = new Schema({
    createdAt: { type: String, required: true },
    modifiedAt: { type: String, required: true },
    data: {
        username: { type: String, required: true },
        password: { type: String, required: true },
        repeatedPassword: { type: String, required: true },
        name: { type: String, required: true },
        surname: { type: String, required: true },
        age: { type: String, required: true },
        avatar: { type: String, required: true },
        photos : [{
        type: String,
        }],
        facebookID: { type: String },
        addresses: [
            {
                street1: {
                    name: { type: String },
                    number: { type: String },
                },
                street2: { type: String },
                street3: { type: String },
                zipcode: { type: String },
                floor: { type: String },
                department: { type: String },
                city: { type: String }
            }
        ],
        isAdmin: { type: Boolean, required: true }
    },
});

usersSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        delete returnedDocument.__v;
        delete returnedDocument.data.password;
        delete returnedDocument.data.repeatedPassword;
    }
});

usersSchema.methods.isValidPassword = async function(password: string)  {
    const valid = await bcrypt.compare(password, this.data.password)
    return valid
}

usersSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.data.password, 10);
    this.password = hash;
    this.repeatedPassword = hash;
    next()
})

const usersModel = model<INew_User, Model<INew_User>>('users', usersSchema)

const botData: INew_User = {
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    modifiedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    data: {
        username: `test@gmail.com`,
        password: 'test123',
        repeatedPassword: 'test123',
        name: `Manson`,
        surname: `Bot`,
        age: "27/12/2000",
        avatar: `https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png`,
        facebookID: '',
        photos: [],
        isAdmin: true,
    },
};

export const WelcomeBot = new usersModel(botData);

export class MongoUsers {
    private users: Model<INew_User>;
    constructor(type: string) {
        this.users = usersModel;
        this.init();
    }
    async init() {
        if(Config.MODE === 'CLUSTER'){
            if(cluster.isMaster){
                await this.users.deleteMany({});
                await WelcomeBot.save();
                logger.info(`Users initialized`);
            }
        }else{
            await this.users.deleteMany({});
            await WelcomeBot.save();
            logger.info(`Users initialized`);
        } 
    }
    async get(id?: string | undefined): Promise<IMongoUser[] | ApiError > {
      try {
        if (id != null) {
            const doc = await this.users.findOne({ _id: id });
            if (doc) 
                return [doc] as unknown as IMongoUser[]
            else 
                return ApiError.badRequest(EUsersErrors.UserNotFound)
        } else {
            const docs = await this.users.find({});
            if (docs.length > 0) 
                return docs as unknown as IMongoUser[]
            else 
                return ApiError.notFound(EUsersErrors.NoUsers)
        }
       } catch (error) {
          return ApiError.internalError(`An error occured.`)
        }   
    } 
    /* PASSPORT SIGNUP LOCAL */
    async getByUser(username: string): Promise<IMongoUser | ApiError > {
        try {
            const doc = await this.users.findOne({ "data.username" : username });
            if(doc)
                return doc as unknown as IMongoUser
            else
                return ApiError.notFound(EUsersErrors.UserNotFound);
        } catch (error) {
            return ApiError.internalError(`An error occured.`)
        }
    }
    /* PASSPORT SIGNUP & LOGIN FACEBOOK */
    async getByFacebookID (id: string): Promise<IMongoUser | ApiError > {
        try {
            const doc = await this.users.findOne({ "data.facebookID": id });
            if(doc)
                return doc as unknown as IMongoUser
            else
                return ApiError.notFound(EUsersErrors.UserNotFound);
        } catch (error) {
            return ApiError.internalError(`An error occured.`)
        }
    }

    async add(user: INew_User): Promise<CUDResponse | ApiError> {
        try {
            const doc = await this.users.create(user);
            return {
                message: `User successfully created.`,
                data: doc as unknown as IMongoUser,
            };
        }catch (error) {
            return ApiError.internalError(`An error occured.`)
        }
}

    
}