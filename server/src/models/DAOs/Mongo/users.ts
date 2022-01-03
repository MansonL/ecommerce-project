import { model, Model, Schema } from 'mongoose';
import { Utils } from '../../../common/utils';
import { ApiError } from '../../../api/errorApi';
import { EUsersErrors } from '../../../common/EErrors';
import moment from 'moment';
import { IMongoUser, INew_User } from '../../../common/interfaces/users';
import { CUDResponse, InternalError } from '../../../common/interfaces/others';


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
                    name: { type: String, required: true },
                    number: { type: String, required: true },
                },
                street2: { type: String },
                street3: { type: String },
                zipcode: { type: String, required: true },
                floor: { type: String },
                department: { type: String },
                city: { type: String, required: true }
            }
        ]
    },
    isAdmin: { type: Boolean, required: true }
});

const usersModel = model<INew_User, Model<INew_User>>('users', usersSchema)

const botData: INew_User = {
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    modifiedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    data: {
        username: `test@gmail.com`,
        password: Utils.createHash('test123'),
        repeatedPassword: Utils.createHash('test123'),
        name: `Manson`,
        surname: `Bot`,
        age: "27/12/2000",
        avatar: `https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png`,
        facebookID: '',
        photos: [],
        addresses: {
            street1: {
                name: '',
                number: 0,
            },
            street2: '',
            street3: '',
            floor: '',
            department: '',
            zipcode: '',
            city: '',
        }
    },
    isAdmin: false,
};

export const WelcomeBot = new usersModel(botData);

export class MongoUsers {
    private users: Model<INew_User>;
    constructor(type: string) {
        this.users = usersModel;
        this.init();
    }
    async init() {
        await this.users.deleteMany({});
        await WelcomeBot.save();
        console.log(`Users initialized`);
    }
    async get(id?: string | undefined): Promise<IMongoUser[] | ApiError | InternalError> {
      try {
        if (id != null) {
            const docs = await this.users.find({ _id: id });
            if (docs.length > 0) {
                const user: IMongoUser[] = Utils.extractMongoUsers(docs);
                return user;
            } else {
                return ApiError.badRequest(EUsersErrors.UserNotFound)
            }
        } else {
            const docs = await this.users.find({});
            if (docs.length > 0) {
                const users: IMongoUser[] = Utils.extractMongoUsers(docs);
                return users;
            } else {
                return ApiError.notFound(EUsersErrors.NoUsers)
            }
        }
       } catch (error) {
          return {
              error: error,
              message: "An error occured",
          } 
    }
    }
    /* PASSPORT SIGNUP LOCAL */
    async getByUser(username: string): Promise<IMongoUser | ApiError | InternalError> {
        try {
            const doc = await this.users.findOne({ username: username });
            console.log(doc);
            if(doc){
                const user : IMongoUser = Utils.extractMongoUsers([doc])[0]
                return user
            }else{
                return ApiError.notFound(EUsersErrors.UserNotFound);
            }
        } catch (error) {
            return {
                error: error,
                message: "An error occured" 
            }
        }
    }
    /* PASSPORT SIGNUP & LOGIN FACEBOOK */
    async getByFacebookID (id: string): Promise<IMongoUser | ApiError | InternalError> {
        try {
            const doc = await this.users.findOne({ facebookID: id });
            if(doc){
                const user : IMongoUser = Utils.extractMongoUsers([doc])[0]
                return user
            }else{
                return ApiError.notFound(EUsersErrors.UserNotFound);
            }
        } catch (error) {
            return {
                error: error,
                message: "An error occured" 
            }
        }
    }

    async add(user: INew_User): Promise<CUDResponse | InternalError> {
        try {
            const doc = await this.users.create(user);
            const result = Utils.extractMongoUsers([doc])[0];
            return {
                message: `User successfully created.`,
                data: result,
            };
        }catch (error) {
            return {
                error: error,
                message: "An error occured",
            }
        }
}

    
}