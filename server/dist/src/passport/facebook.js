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
exports.passportFBConfig = exports.FacebookStrategy = exports.commandData = exports.facebookVerify = void 0;
const passport_facebook_1 = __importDefault(require("passport-facebook"));
const users_1 = require("../common/interfaces/users");
const errorApi_1 = require("../api/errorApi");
const dotenv = __importStar(require("dotenv"));
const moment_1 = __importDefault(require("moment"));
const users_2 = require("../api/users");
const passport_1 = __importDefault(require("passport"));
dotenv.config();
/**
 *
 *
 * Login & SignUp Passport Facebook Functions
 *
 *
 */
const facebookVerify = (req, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const firstResult = yield users_2.usersApi.getUserByFacebookID(profile.id);
    if ((0, users_1.isUser)(firstResult)) {
        return done(null, firstResult);
    }
    else if (firstResult instanceof errorApi_1.ApiError) {
        const newUser = {
            createdAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
            modifiedAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
            data: {
                username: profile.emails ? profile.emails[0].value : '',
                name: profile.displayName.split(" ")[0],
                surname: profile.displayName.split(" ")[1],
                age: profile.birthday ? profile.birthday : 'none',
                facebookID: profile.id,
                password: '',
                phoneNumber: '',
                repeatedPassword: '',
                avatar: profile.photos ? profile.photos[0].value : 'https://scontent.fmdz5-1.fna.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=12b3be&_nc_eui2=AeGFVppcWlKdc7aGtqBjr_qUik--Qfnh2B6KT75B-eHYHjmg8hXUxKd83x9Quvqm7QJihxiVWmgPNHt_JQZRXFjE&_nc_ohc=lreSzZHG1jMAX8WENYk&_nc_ht=scontent.fmdz5-1.fna&edm=AP4hL3IEAAAA&oh=7ca8884c54739b55368dd37ab5389c49&oe=61DA6438',
                isAdmin: false,
            },
        };
        const result = yield users_2.usersApi.addUser(newUser);
        if (result instanceof errorApi_1.ApiError)
            return done(result);
        else
            return done(null, result.data);
    }
});
exports.facebookVerify = facebookVerify;
/**
 *
 * PASSPORT CONFIGS
 *
 */
exports.commandData = process.argv.slice(2);
const clientID = exports.commandData[1] && exports.commandData[1].length > 4 && !isNaN(Number(exports.commandData[1])) ? exports.commandData[1] : process.env.FACEBOOK_APP_ID;
const clientSecret = exports.commandData[2] && exports.commandData[2].length > 4 && isNaN(Number(exports.commandData[2])) ? exports.commandData[2] : process.env.FACEBOOK_APP_SECRET;
exports.FacebookStrategy = passport_facebook_1.default.Strategy;
exports.passportFBConfig = {
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: "http://localhost:8080/api/auth/index",
    passReqToCallback: true,
    profileFields: ['id', 'displayName', 'emails', 'photos']
};
passport_1.default.use(new exports.FacebookStrategy(exports.passportFBConfig, exports.facebookVerify));
exports.default = passport_1.default;
