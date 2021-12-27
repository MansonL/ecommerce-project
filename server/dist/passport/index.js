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
const passport_1 = __importDefault(require("passport"));
const users_1 = require("../api/users");
const checkType_1 = require("../interfaces/checkType");
const facebook_1 = require("./facebook");
const local_1 = require("./local");
passport_1.default.use(new facebook_1.FacebookStrategy(facebook_1.passportFBConfig, facebook_1.facebookVerify));
passport_1.default.use('login', new local_1.LocalStrategy(local_1.passportLocalConfig, local_1.passportLogin));
passport_1.default.use('signup', new local_1.LocalStrategy(local_1.passportLocalConfig, local_1.passportSignUp));
passport_1.default.serializeUser((user, done) => {
    console.log("Serializing");
    console.log(user);
    done(null, user._id.toString());
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Deserializing");
    const result = yield users_1.usersApi.getUser(id);
    if ((0, checkType_1.isUser)(result)) {
        const user = result;
        done(null, user[0]);
    }
    else {
        done(result, null);
    }
}));
exports.default = passport_1.default;
