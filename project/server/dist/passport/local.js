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
exports.passportLocalConfig = exports.LocalStrategy = exports.passportSignUp = exports.passportLogin = void 0;
const passport_local_1 = __importDefault(require("passport-local"));
const users_1 = require("../api/users");
const utils_1 = require("../common/utils");
const checkType_1 = require("../interfaces/checkType");
const errorApi_1 = require("../utils/errorApi");
const passportLogin = (req, username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Inside passportLogin');
    const result = yield users_1.usersApi.getUserByUsername(username);
    if ((0, checkType_1.isUser)(result)) {
        if (utils_1.Utils.validPassword(result, password)) {
            return done(null, result);
        }
        else {
            return done(null, null, { message: "Wrong credentials." });
        }
    }
    else if (result instanceof errorApi_1.ApiError) {
        return done(null, null, { message: result.message });
    }
    else {
        return done(result);
    }
});
exports.passportLogin = passportLogin;
const passportSignUp = (req, username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Inside passportSignUp');
    console.log('\n----------------- REQ BODY -------------------------\n');
    console.log(req.body);
    const firstResult = yield users_1.usersApi.getUserByUsername(username);
    if ((0, checkType_1.isUser)(firstResult)) {
        return done(null, null, { message: `The email submitted is already in use.` });
    }
    else if (firstResult instanceof errorApi_1.ApiError) {
        const newUser = {
            timestamp: req.body.timestamp,
            username: username,
            password: utils_1.Utils.createHash(password),
            name: req.body.name,
            surname: req.body.surname,
            age: req.body.age,
            alias: req.body.alias,
            avatar: req.body.avatar,
            facebookID: '',
            photos: [req.body.avatar],
        };
        const result = yield users_1.usersApi.addUser(newUser);
        if ((0, checkType_1.isCUDResponse)(result)) {
            return done(null, result);
        }
        else {
            return done(result); // Internal Error sent, generated at the attempt to register a new user.
        }
    }
    else {
        return done(firstResult); // Internal Error sent, generated at the search of an existing user with the submitted username.
    }
});
exports.passportSignUp = passportSignUp;
exports.LocalStrategy = passport_local_1.default.Strategy;
exports.passportLocalConfig = {
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
};
