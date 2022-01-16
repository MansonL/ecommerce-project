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
exports.authController = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const errorApi_1 = require("../api/errorApi");
const users_1 = require("../api/users");
const EErrors_1 = require("../common/EErrors");
const config_1 = require("../config/config");
class AuthController {
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers.authorization;
            if (authHeader) {
                const bearerJWToken = authHeader.split(' ')[1];
                (0, jsonwebtoken_1.verify)(bearerJWToken, config_1.Config.JWT_SECRET, (err, token) => {
                    if (err)
                        next(errorApi_1.ApiError.badRequest(EErrors_1.EAuthErrors.NotLoggedIn));
                    else
                        res.send({
                            message: 'Already logged in.',
                            data: token
                        });
                });
            }
            else
                next(errorApi_1.ApiError.badRequest(EErrors_1.EAuthErrors.NotLoggedIn));
        });
    }
    loginPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            const result = yield users_1.usersApi.getUserByUsername(username);
            if (result instanceof errorApi_1.ApiError)
                next(result);
            else {
                result.isValidPassword(password)
                    .then(() => {
                    const userData = { user: Object.assign({ user_id: result._id }, result.data) };
                    (0, jsonwebtoken_1.sign)(Object.assign({}, userData), config_1.Config.JWT_SECRET, { expiresIn: config_1.Config.JWT_EXPIRATION_TIME }, (err, token) => {
                        if (err)
                            next(errorApi_1.ApiError.internalError(err.message));
                        else
                            res.send({
                                message: 'Successfully logged in.',
                                data: token
                            });
                    });
                })
                    .catch(() => {
                    next(errorApi_1.ApiError.badRequest(EErrors_1.EUsersErrors.WrongCredentials));
                });
            }
        });
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers.authorization;
            if (authHeader) {
                const bearerJWToken = authHeader.split(' ')[1];
                (0, jsonwebtoken_1.verify)(bearerJWToken, config_1.Config.JWT_SECRET, (err, token) => {
                    if (err)
                        res.send({
                            message: 'You can sign up.',
                            data: {}
                        });
                    else
                        res.send({
                            message: 'Already logged in.',
                            data: token
                        });
                });
            }
            else
                res.send({
                    message: 'You can sign up.',
                    data: {}
                });
        });
    }
    signupPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = req.body;
            const result = yield users_1.usersApi.getUserByUsername(newUser.data.username);
            if (result instanceof errorApi_1.ApiError) {
                next();
            }
            else
                res.status(400).send(`Username has been already taken.`);
        });
    }
    isAuthorized(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers.authorization;
            if (authHeader) {
                const bearerJWToken = authHeader.split(' ')[1];
                (0, jsonwebtoken_1.verify)(bearerJWToken, config_1.Config.JWT_SECRET, (err, token) => {
                    if (err)
                        next(errorApi_1.ApiError.badRequest(EErrors_1.EAuthErrors.NotLoggedIn)); // For going directly to the error handler adn refusing the main routing
                    else if (token) {
                        req.user = token.user; // Passing user logged in data to the next function in req.user
                        next();
                    }
                });
            }
            else
                next(errorApi_1.ApiError.badRequest(EErrors_1.EAuthErrors.NotLoggedIn)); // For going directly to the error handler and refusing the main routing
        });
    }
    isAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers.authorization;
            if (authHeader) {
                const bearerJWToken = authHeader.split(' ')[1];
                (0, jsonwebtoken_1.verify)(bearerJWToken, config_1.Config.JWT_SECRET, (err, token) => {
                    if (err)
                        next(errorApi_1.ApiError.badRequest(EErrors_1.EAuthErrors.NotAuthorizedUser));
                    else if (token && token.user.isAdmin) {
                        req.user = token.user;
                        next();
                    }
                });
            }
            else
                next(errorApi_1.ApiError.badRequest(EErrors_1.EAuthErrors.NotLoggedIn));
        });
    }
}
exports.authController = new AuthController();
