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
exports.usersApi = exports.UsersApi = void 0;
const usersFactory_1 = require("../models/usersFactory");
const usersFactory_2 = require("../models/usersFactory");
class UsersApi {
    constructor() {
        this.users = usersFactory_2.UsersFactory.get(usersFactory_1.storage);
    }
    getUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.users.get(user_id);
            return result;
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.users.get();
            return result;
        });
    }
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.users.getByUser(username);
            return result;
        });
    }
    getUserByFacebookID(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.users.getByFacebookID(user_id);
            return result;
        });
    }
    getAdmins() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.users.getAdmins();
            return result;
        });
    }
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.users.add(user);
            return result;
        });
    }
    addAddress(user_id, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.users.addAddress(user_id, address);
            return result;
        });
    }
}
exports.UsersApi = UsersApi;
exports.usersApi = new UsersApi();
