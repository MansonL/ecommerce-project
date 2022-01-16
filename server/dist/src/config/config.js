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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.Config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 8080,
    MODE: process.env.MODE || "FORK",
    PERSISTANCE: process.env.PERSISTANCE || 'persistance type',
    JWT_SECRET: process.env.JWT_SECRET || 'secret string for jwt signature & verify',
    JWT_EXPIRATION_TIME: Number(process.env.JWT_EXPIRATION_TIME) || 60 * 15,
    SESSION_SECRET: process.env.SESSION_SECRET || 'secret string for express-sessions',
    SESSION_COOKIE_TIMEOUT: process.env.SESSION_COOKIE_TIMEOUT || 'timeour for session cookies',
    DB_NAME: process.env.DB_NAME || 'ecommerce',
    ATLAS_DB_USER: process.env.ATLAS_DB_USER || 'user',
    ATLAS_DB_PASSWORD: process.env.ATLAS_DB_PASSWORD || 'password',
    GOOGLE_EMAIL: process.env.GOOGLE_EMAIL || 'admin gmail',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'admin google api oauth2 client_id',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || 'admin google api oauth2 client_secret',
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN || 'adming google account oauth2 refresh_token',
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID || 'admin facebook app_id',
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET || 'admin facebook app_secret',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'admin cloudinary cloud name',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || 'admin cloudinary api_key',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || 'admin cloudinary api_secret',
};
