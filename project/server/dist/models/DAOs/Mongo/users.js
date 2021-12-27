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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoUsers = void 0;
const models_1 = require("./models");
const models_2 = require("./models");
const utils_1 = require("../../../common/utils");
const errorApi_1 = require("../../../utils/errorApi");
const EErrors_1 = require("../../../common/EErrors");
class MongoUsers {
    constructor(type) {
        this.users = models_2.models.users;
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.users.deleteMany({});
            yield models_1.WelcomeBot.save();
            console.log(`Users initialized`);
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (id != null) {
                    const docs = yield this.users.find({ _id: id });
                    if (docs.length > 0) {
                        const user = utils_1.Utils.extractMongoUsers(docs);
                        return user;
                    }
                    else {
                        return errorApi_1.ApiError.badRequest(EErrors_1.EUsersErrors.UserNotFound);
                    }
                }
                else {
                    const docs = yield this.users.find({});
                    if (docs.length > 0) {
                        const users = utils_1.Utils.extractMongoUsers(docs);
                        return users;
                    }
                    else {
                        return errorApi_1.ApiError.notFound(EErrors_1.EUsersErrors.NoUsers);
                    }
                }
            }
            catch (error) {
                return {
                    error: error,
                    message: "An error occured",
                };
            }
        });
    }
    /* PASSPORT SIGNUP LOCAL */
    getByUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield this.users.findOne({ username: username });
                console.log(doc);
                if (doc) {
                    const user = utils_1.Utils.extractMongoUsers([doc])[0];
                    return user;
                }
                else {
                    return errorApi_1.ApiError.notFound(EErrors_1.EUsersErrors.UserNotFound);
                }
            }
            catch (error) {
                return {
                    error: error,
                    message: "An error occured"
                };
            }
        });
    }
    /* PASSPORT SIGNUP & LOGIN FACEBOOK */
    getByFacebookID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield this.users.findOne({ facebookID: id });
                if (doc) {
                    const user = utils_1.Utils.extractMongoUsers([doc])[0];
                    return user;
                }
                else {
                    return errorApi_1.ApiError.notFound(EErrors_1.EUsersErrors.UserNotFound);
                }
            }
            catch (error) {
                return {
                    error: error,
                    message: "An error occured"
                };
            }
        });
    }
    add(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield this.users.create(user);
                const result = utils_1.Utils.extractMongoUsers([doc])[0];
                return {
                    message: `User successfully created.`,
                    data: result,
                };
            }
            catch (error) {
                return {
                    error: error,
                    message: "An error occured",
                };
            }
        });
    }
}
exports.MongoUsers = MongoUsers;
