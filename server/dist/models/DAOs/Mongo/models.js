"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomeMessage = exports.bot = exports.WelcomeBot = exports.models = exports.mongoURI = exports.atlasURI = void 0;
const mongoose_1 = require("mongoose");
const dotenv = __importStar(require("dotenv"));
const moment_1 = __importDefault(require("moment"));
const utils_1 = require("../../../common/utils");
dotenv.config();
exports.atlasURI = `mongodb+srv://${process.env.DB_ATLAS_USER}:${process.env.DB_ATLAS_PASS}@project.lofof.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
exports.mongoURI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:27018/${process.env.DB_NAME}`;
const productSchema = new mongoose_1.Schema({
    timestamp: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    img: { type: String, required: true },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
});
const cartProductSchema = new mongoose_1.Schema({
    product_id: { type: String, required: true },
    timestamp: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    img: { type: String, required: true },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
});
const usersSchema = new mongoose_1.Schema({
    timestamp: { type: String, required: true },
    username: { type: String },
    password: { type: String },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    alias: { type: String },
    age: { type: String },
    avatar: { type: String, required: true },
    photos: [{
            type: String,
        }],
    facebookID: { type: String }
});
const messagesSchema = new mongoose_1.Schema({
    timestamp: { type: String, required: true },
    author: usersSchema,
    message: { type: String, required: true },
});
exports.models = {
    products: (0, mongoose_1.model)('products', productSchema),
    cart: (0, mongoose_1.model)('cart', cartProductSchema),
    messages: (0, mongoose_1.model)('messages', messagesSchema),
    users: (0, mongoose_1.model)('users', usersSchema),
};
const botData = {
    timestamp: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
    username: `test@gmail.com`,
    password: utils_1.Utils.createHash('test123'),
    name: `Manson`,
    surname: `Bot`,
    alias: `Welcome Bot`,
    age: "27/12/2000",
    avatar: `https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png`,
    facebookID: '',
    photos: [],
};
exports.WelcomeBot = new exports.models.users(botData);
exports.bot = utils_1.Utils.extractMongoUsers([exports.WelcomeBot])[0];
exports.WelcomeMessage = new exports.models.messages({
    timestamp: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
    author: exports.bot,
    message: `Welcome everyone to my first very simple app.`,
});
