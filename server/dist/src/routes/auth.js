"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const auth_1 = require("../controller/auth");
const users_1 = require("../controller/users");
exports.authRouter = (0, express_1.Router)();
/**
 *
 * JWT AUTH ROUTES
 *
 */
exports.authRouter.get('/login', auth_1.authController.login);
exports.authRouter.get('/signup', auth_1.authController.signup);
exports.authRouter.post('/login', auth_1.authController.loginPost);
exports.authRouter.post('/signup', auth_1.authController.signupPost, users_1.usersController.save);
/**
 *
 * PASSPORT-FACEBOOK ROUTES
 *
 */
exports.authRouter.get('/facebook', passport_1.default.authenticate('facebook'));
exports.authRouter.get('/index', passport_1.default.authenticate('facebook', {
    successRedirect: 'http://localhost:3000/profile',
    failureRedirect: 'http://localhost:3000/login'
}));
