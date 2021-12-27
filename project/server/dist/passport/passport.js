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
exports.validPassword = exports.createHash = exports.passportSignUp = exports.passportLogin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const users_1 = require("../api/users");
const errorApi_1 = require("../utils/errorApi");
const checkType_1 = require("../interfaces/checkType");
/**
 *
 *
 * Login & SignUp Passport Functions
 *
 *
 */
const passportLogin = (req, username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Inside passportLogin');
    const result = yield users_1.usersApi.getUserByUsername(username);
    if ((0, checkType_1.isUser)(result)) {
        if ((0, exports.validPassword)(result, password)) {
            return done(null, {
                data: result,
                message: "Successfully logged in!"
            });
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
            password: (0, exports.createHash)(password),
            name: req.body.name,
            surname: req.body.surname,
            age: req.body.age,
            alias: req.body.alias,
            avatar: req.body.avatar,
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
/**
 * Function for encrypting user password
 * @param password to encrypt
 * @returns password encrypted
 */
const createHash = (password) => {
    return bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10));
};
exports.createHash = createHash;
/**
 *
 * @param user IUser object which contains encripted password
 * @param password password submitted from frontend
 * @returns true if matches, false if it doesn't matches
 */
const validPassword = (user, password) => {
    return bcrypt_1.default.compareSync(password, user.password);
};
exports.validPassword = validPassword;
/**
 *
 * PASSPORT CONFIGS
 *
 */
const LocalStrategy = passport_local_1.default.Strategy;
const strategyOptions = {
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
};
passport_1.default.use('login', new LocalStrategy(strategyOptions, exports.passportLogin));
passport_1.default.use('signup', new LocalStrategy(strategyOptions, exports.passportSignUp));
passport_1.default.serializeUser((user, done) => {
    console.log("Serializing");
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Deserializing");
    const result = yield users_1.usersApi.getUser(id);
    if ((0, checkType_1.isUser)(result)) {
        done(null, result);
    }
    else {
        done(result, null);
    }
}));
exports.default = passport_1.default;
