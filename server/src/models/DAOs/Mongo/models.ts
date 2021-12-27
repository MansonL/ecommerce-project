import { Model, model, Schema } from 'mongoose';
import {
    ICartProduct,
    INew_Message,
    INew_Product,
    INew_User,
} from '../../../interfaces/interfaces';
import * as dotenv from 'dotenv';
import moment from 'moment';
import { Utils } from '../../../common/utils';


dotenv.config();

export const atlasURI = `mongodb+srv://${process.env.DB_ATLAS_USER}:${process.env.DB_ATLAS_PASS}@project.lofof.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

export const mongoURI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:27018/${process.env.DB_NAME}`;



const productSchema = new Schema({
    timestamp: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    img: { type: String, required: true },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
});

const cartProductSchema = new Schema({
    product_id: { type: String, required: true },
    timestamp: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    img: { type: String, required: true },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
});

const usersSchema = new Schema({
    timestamp: { type: String, required: true },
    username: { type: String },
    password: { type: String },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    alias: { type: String },
    age: { type: String },
    avatar: { type: String, required: true },
    photos : [{
        type: String,
    }],
    facebookID: { type: String }
});

const messagesSchema = new Schema({
    timestamp: { type: String, required: true },
    author: usersSchema,
    message: { type: String, required: true },
});

export const models = {
    products: model<INew_Product, Model<INew_Product>>(
        'products',
        productSchema
    ),
    cart: model<ICartProduct, Model<ICartProduct>>('cart', cartProductSchema),
    messages: model<INew_Message, Model<INew_Message>>(
        'messages',
        messagesSchema
    ),
    users: model<INew_User, Model<INew_User>>('users', usersSchema),
};

const botData: INew_User = {
    timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    username: `test@gmail.com`,
    password: Utils.createHash('test123'),
    name: `Manson`,
    surname: `Bot`,
    alias: `Welcome Bot`,
    age: "27/12/2000",
    avatar: `https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png`,
    facebookID: '',
    photos: [],
};

export const WelcomeBot = new models.users(botData);

export const bot = Utils.extractMongoUsers([WelcomeBot])[0];

export const WelcomeMessage = new models.messages({
    timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    author: bot,
    message: `Welcome everyone to my first very simple app.`,
});
