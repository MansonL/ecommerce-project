import { model, Model, Schema } from 'mongoose';
import { ApiError } from '../../../api/errorApi';
import { EUsersErrors } from '../../../common/EErrors';
import moment from 'moment';
import { IMongoUser, INew_User, UserAddresses } from '../../../common/interfaces/users';
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
        avatar: { type: String },
        phoneNumber: { type: String, required: true },
        images : [{
            url: { type: String, required: true },
            photo_id: { type: String, required: true },
            _id: false,
        }],
        facebookID: { type: String },
        addresses: [
            {
                alias: { type: String },
                street1: {
                    name: { type: String },
                    number: { type: String },
                },
                street2: { type: String },
                street3: { type: String },
                zipcode: { type: String },
                floor: { type: String },
                department: { type: String },
                city: { type: String },
                extra_info: { type: String },
                _id: false,
            }
        ],
        isAdmin: { type: Boolean, required: true }
    },
});

usersSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        delete returnedDocument.__v;
        if(returnedDocument.data.password && returnedDocument.data.repeatedPassword){
            delete returnedDocument.data.password;
            delete returnedDocument.data.repeatedPassword
        
            // Cause this function executes on every doc retrieving, so in some populated documents this fields won't be defined, such as cart populated doc...
        }
    }
});

usersSchema.methods.isValidPassword = async function(password: string)  {
    const valid = await bcrypt.compare(password, this.data.password)
    return valid
}

usersSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.data.password, 10);
    this.data.password = hash;
    this.data.repeatedPassword = hash;
    if(this.data.images.length === 0)
        this.data.images.push({
            url: 'https://www.pinclipart.com/picdir/middle/169-1692839_default-avatar-transparent-clipart.png',
            photo_id: 'default_avatar_image'
        });
        if(this.data.avatar)
            this.data.avatar = 'https://www.pinclipart.com/picdir/middle/169-1692839_default-avatar-transparent-clipart.png'
    next()
})

const usersModel = model<INew_User, Model<INew_User>>('users', usersSchema)

const botData: INew_User = {
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    modifiedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    data: {
        username: Config.GOOGLE_EMAIL,
        password: 'test123',
        repeatedPassword: 'test123',
        name: `Manson`,
        surname: `Bot`,
        age: "27/12/2000",
        phoneNumber: '+5492612345678',
        avatar: '',
        facebookID: '',
        isAdmin: true,
    },
};

const customerTest: INew_User = {
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    modifiedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    data: {
        username: `lautaromanson@outlook.es`,
        password: 'test123',
        repeatedPassword: 'test123',
        name: `Manson`,
        surname: `Lautaro`,
        age: "27/12/2000",
        phoneNumber: '+5492612345678',
        avatar: '',
        facebookID: '',
        isAdmin: true,
    },
};

const WelcomeBot = new usersModel(botData);
const CustomerTest = new usersModel(customerTest)


export class MongoUsers {
    private users: Model<INew_User>;
    constructor() {
        this.users = usersModel;
        this.init();
    }
    async init() {
        if(Config.MODE === 'CLUSTER'){
            if(cluster.isMaster){
                await this.users.deleteMany({});
                await WelcomeBot.save();
                await CustomerTest.save();
                logger.info(`Users initialized`);
            }
        }else{
            await this.users.deleteMany({});
            await WelcomeBot.save();
            await CustomerTest.save()
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
    /* NEW USER CREATION */
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
    /*  FOR EMAILING TO ALL ADMINS AT A NEW ORDER   */
    async getAdmins(): Promise<string[] | ApiError> {
        try {
            const docs = await this.users.find({ "data.isAdmin": true });
            if(docs.length > 0){
                const emails = docs.map(document => document.data.username);
                return emails
            }else
                // This line is just for any error at app launching. At launching there should be at least
                // one user as administrator.
                return ApiError.notFound(`No admin users created.`)
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
    async addAddress(user_id: string, address: UserAddresses): Promise<CUDResponse | ApiError> {
        try {
            const doc = await this.users.findOne({ _id: user_id });
            if(doc){
                doc.data.addresses ? doc.data.addresses.push(address) : doc.data.addresses = [address];
                await doc.save();
                return {
                    message: `Address added succesfully`,
                    data: doc as unknown as IMongoUser
                }
            }else
                return ApiError.notFound(EUsersErrors.UserNotFound)
        } catch (error) {
            return ApiError.internalError(`An error occured.`)
        }
    }
    
}