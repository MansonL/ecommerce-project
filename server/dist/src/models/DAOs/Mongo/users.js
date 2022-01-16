"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoUsers = void 0;
const mongoose_1 = require("mongoose");
const errorApi_1 = require("../../../api/errorApi");
const EErrors_1 = require("../../../common/EErrors");
const moment_1 = __importDefault(require("moment"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger_1 = require("../../../services/logger");
const config_1 = require("../../../config/config");
const cluster_1 = __importDefault(require("cluster"));
const usersSchema = new mongoose_1.Schema({
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
        images: [{
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
        if (returnedDocument.data.password && returnedDocument.data.repeatedPassword) {
            delete returnedDocument.data.password;
            delete returnedDocument.data.repeatedPassword;
            // Cause this function executes on every doc retrieving, so in some populated documents this fields won't be defined, such as cart populated doc...
        }
    }
});
usersSchema.methods.isValidPassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const valid = yield bcrypt_1.default.compare(password, this.data.password);
        return valid;
    });
};
usersSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = yield bcrypt_1.default.hash(this.data.password, 10);
        this.data.password = hash;
        this.data.repeatedPassword = hash;
        if (this.data.images.length === 0)
            this.data.images.push({
                url: 'https://www.pinclipart.com/picdir/middle/169-1692839_default-avatar-transparent-clipart.png',
                photo_id: 'default_avatar_image'
            });
        if (this.data.avatar)
            this.data.avatar = 'https://www.pinclipart.com/picdir/middle/169-1692839_default-avatar-transparent-clipart.png';
        next();
    });
});
const usersModel = (0, mongoose_1.model)('users', usersSchema);
const botData = {
    createdAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
    modifiedAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
    data: {
        username: config_1.Config.GOOGLE_EMAIL,
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
const customerTest = {
    createdAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
    modifiedAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
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
const CustomerTest = new usersModel(customerTest);
class MongoUsers {
    constructor() {
        this.users = usersModel;
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (config_1.Config.MODE === 'CLUSTER') {
                if (cluster_1.default.isMaster) {
                    yield this.users.deleteMany({});
                    yield WelcomeBot.save();
                    yield CustomerTest.save();
                    logger_1.logger.info(`Users initialized`);
                }
            }
            else {
                yield this.users.deleteMany({});
                yield WelcomeBot.save();
                yield CustomerTest.save();
                logger_1.logger.info(`Users initialized`);
            }
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (id != null) {
                    const doc = yield this.users.findOne({ _id: id });
                    if (doc)
                        return [doc];
                    else
                        return errorApi_1.ApiError.badRequest(EErrors_1.EUsersErrors.UserNotFound);
                }
                else {
                    const docs = yield this.users.find({});
                    if (docs.length > 0)
                        return docs;
                    else
                        return errorApi_1.ApiError.notFound(EErrors_1.EUsersErrors.NoUsers);
                }
            }
            catch (error) {
                return errorApi_1.ApiError.internalError(`An error occured.`);
            }
        });
    }
    /* NEW USER CREATION */
    getByUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield this.users.findOne({ "data.username": username });
                if (doc)
                    return doc;
                else
                    return errorApi_1.ApiError.notFound(EErrors_1.EUsersErrors.UserNotFound);
            }
            catch (error) {
                return errorApi_1.ApiError.internalError(`An error occured.`);
            }
        });
    }
    /*  FOR EMAILING TO ALL ADMINS AT A NEW ORDER   */
    getAdmins() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docs = yield this.users.find({ "data.isAdmin": true });
                if (docs.length > 0) {
                    const emails = docs.map(document => document.data.username);
                    return emails;
                }
                else
                    // This line is just for any error at app launching. At launching there should be at least
                    // one user as administrator.
                    return errorApi_1.ApiError.notFound(`No admin users created.`);
            }
            catch (error) {
                return errorApi_1.ApiError.internalError(`An error occured.`);
            }
        });
    }
    /* PASSPORT SIGNUP & LOGIN FACEBOOK */
    getByFacebookID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield this.users.findOne({ "data.facebookID": id });
                if (doc)
                    return doc;
                else
                    return errorApi_1.ApiError.notFound(EErrors_1.EUsersErrors.UserNotFound);
            }
            catch (error) {
                return errorApi_1.ApiError.internalError(`An error occured.`);
            }
        });
    }
    add(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield this.users.create(user);
                return {
                    message: `User successfully created.`,
                    data: doc,
                };
            }
            catch (error) {
                return errorApi_1.ApiError.internalError(`An error occured.`);
            }
        });
    }
    addAddress(user_id, address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield this.users.findOne({ _id: user_id });
                if (doc) {
                    doc.data.addresses ? doc.data.addresses.push(address) : doc.data.addresses = [address];
                    yield doc.save();
                    return {
                        message: `Address added succesfully`,
                        data: doc
                    };
                }
                else
                    return errorApi_1.ApiError.notFound(EErrors_1.EUsersErrors.UserNotFound);
            }
            catch (error) {
                return errorApi_1.ApiError.internalError(`An error occured.`);
            }
        });
    }
}
exports.MongoUsers = MongoUsers;
