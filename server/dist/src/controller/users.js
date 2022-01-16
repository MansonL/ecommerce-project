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
exports.usersController = void 0;
const EErrors_1 = require("../common/EErrors");
const errorApi_1 = require("../api/errorApi");
const joiSchemas_1 = require("../common/interfaces/joiSchemas");
const users_1 = require("../api/users");
const logger_1 = require("../services/logger");
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
/**
 *
 * Users Controller Class
 *
 */
class UsersController {
    getOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id } = req.user;
            logger_1.logger.info(`[PATH]: Inside User Controller`);
            if ((0, mongoose_1.isValidObjectId)(user_id)) {
                const result = yield users_1.usersApi.getUser(user_id);
                if (result instanceof errorApi_1.ApiError)
                    next(result);
                else
                    res.status(200).send(result[0]);
            }
            else {
                next(errorApi_1.ApiError.badRequest(EErrors_1.EProductsErrors.IdIncorrect));
            }
        });
    }
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`[PATH]: Inside User Controller`);
            const result = yield users_1.usersApi.getUsers();
            if (result instanceof errorApi_1.ApiError)
                next(result);
            else
                res.status(200).send(result);
        });
    }
    save(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = req.body;
            logger_1.logger.info(`[PATH]: Inside User Controller`);
            const { error } = yield joiSchemas_1.validator.user.validate(userInfo);
            if (error)
                next(errorApi_1.ApiError.badRequest(error.message));
            else {
                if (userInfo.data.addresses)
                    userInfo.data.addresses[0]._id = String(new mongodb_1.ObjectId());
                const result = yield users_1.usersApi.addUser(userInfo);
                if (result instanceof errorApi_1.ApiError)
                    next(result);
                else
                    res.status(201).send(result);
            }
        });
    }
    addAddress(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id } = req.user;
            const { address } = req.body;
            const { error } = joiSchemas_1.validator.address.validate(address);
            if (error)
                next(errorApi_1.ApiError.badRequest(error.message));
            else {
                const result = yield users_1.usersApi.addAddress(user_id, address);
                if (result instanceof errorApi_1.ApiError)
                    next(result);
                else
                    res.status(201).send(result);
            }
        });
    }
}
exports.usersController = new UsersController();
