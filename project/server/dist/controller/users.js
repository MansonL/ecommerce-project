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
const errorApi_1 = require("../utils/errorApi");
const joiSchemas_1 = require("../utils/joiSchemas");
const users_1 = require("../api/users");
const checkType_1 = require("../interfaces/checkType");
/**
 *
 * Users Controller Class
 *
 */
class UsersController {
    getOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            console.log(`[PATH] Inside controller.`);
            const { error } = yield joiSchemas_1.validator.id.validateAsync(id);
            if (error) {
                next(errorApi_1.ApiError.badRequest(EErrors_1.EProductsErrors.IdIncorrect));
            }
            else {
                const result = yield users_1.usersApi.getUser(id);
                if ((0, checkType_1.isUser)(result)) {
                    res.status(200).send(result);
                }
                else if (result instanceof errorApi_1.ApiError) {
                    res.status(result.error).send(result);
                }
                else {
                    res.status(500).send(result); // Internal Error sent.
                }
            }
        });
    }
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[PATH] Inside controller.`);
            const result = yield users_1.usersApi.getUsers();
            if ((0, checkType_1.isUser)(result)) {
                res.status(200).send(result);
            }
            else if (result instanceof errorApi_1.ApiError) {
                res.status(result.error).send(result);
            }
            else {
                res.status(500).send(result); // Internal Error sent.
            }
        });
    }
    save(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body;
            const { error } = joiSchemas_1.validator.user.validate(user);
            if (error) {
                next(errorApi_1.ApiError.badRequest(EErrors_1.EUsersErrors.IncorrectProperties));
            }
            else {
                console.log(`[PATH] Inside controller.`);
                const result = yield users_1.usersApi.addUser(user);
                if ((0, checkType_1.isCUDResponse)(result)) {
                    res.status(201).send(result);
                }
                else {
                    res.status(500).send(result); // Internal Error sent.
                }
            }
        });
    }
}
exports.usersController = new UsersController();
