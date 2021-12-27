"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../controller/auth");
const index_1 = __importDefault(require("../passport/index"));
exports.authRouter = (0, express_1.Router)();
/**
 *
 * PASSPORT-LOCAL ROUTES
 *
 */
exports.authRouter.post('/signup', (req, res, next) => {
    index_1.default.authenticate('signup', function (err, user, info) {
        if (err) {
            return res.status(500).send(err);
        }
        if (user) {
            return res.status(201).send(user);
        }
        return res.send(info);
    })(req, res, next);
});
exports.authRouter.post('/login', index_1.default.authenticate('login'), (req, res) => {
    res.status(200).send({ data: req.user, message: "Successfully logged in!" });
});
exports.authRouter.get('/login', auth_1.authController.login);
exports.authRouter.get('/logout', auth_1.authController.logout);
exports.authRouter.get('/signup', auth_1.authController.signup);
/**
 *
 * PASSPORT-FACEBOOK ROUTES
 *
 */
exports.authRouter.get('/facebook', index_1.default.authenticate('facebook'));
exports.authRouter.get('/index', index_1.default.authenticate('facebook', {
    successRedirect: 'http://localhost:3000/profile',
    failureRedirect: 'http://localhost:3000/login'
}));
