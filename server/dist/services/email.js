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
exports.createTransporter = void 0;
const google_auth_library_1 = require("google-auth-library");
const config_1 = require("../config/config");
const nodemailer_1 = require("nodemailer");
const errorApi_1 = require("../api/errorApi");
//                            GMAIL NODEMAILER IMPLEMENTATION
const createTransporter = () => __awaiter(void 0, void 0, void 0, function* () {
    const oauth2Client = new google_auth_library_1.OAuth2Client({
        clientId: config_1.Config.GOOGLE_CLIENT_ID,
        clientSecret: config_1.Config.GOOGLE_CLIENT_SECRET,
        redirectUri: "https://developers.google.com/oauthplayground",
    });
    oauth2Client.setCredentials({
        refresh_token: config_1.Config.GOOGLE_REFRESH_TOKEN,
    });
    const accessToken = yield new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token, res) => {
            if (err)
                reject(new errorApi_1.ApiError(err.code ? Number(err.code) : 400, err.message));
            if (token)
                resolve(token);
        });
    });
    if (typeof accessToken === "string") {
        const transportOptions = {
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: config_1.Config.GOOGLE_EMAIL,
                accessToken: accessToken,
                refreshToken: config_1.Config.GOOGLE_REFRESH_TOKEN,
                clientId: config_1.Config.GOOGLE_CLIENT_ID,
                clientSecret: config_1.Config.GOOGLE_CLIENT_SECRET
            }
        };
        const transport = (0, nodemailer_1.createTransport)(transportOptions);
        return transport;
    }
    else {
        return accessToken;
    }
});
exports.createTransporter = createTransporter;
