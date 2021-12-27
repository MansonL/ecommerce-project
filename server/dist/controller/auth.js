"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
class AuthController {
    login(req, res) {
        console.log(req.user);
        if (req.isAuthenticated()) {
            res.send({
                message: "Already logged in.",
                data: req.user
            });
        }
        else {
            res.send({
                message: "Need to login.",
                data: {}
            });
        }
    }
    logout(req, res) {
        req.logout();
        res.send({
            message: "Logged out.",
            data: {},
        });
    }
    signup(req, res) {
        if (req.isAuthenticated()) {
            res.send({
                message: "Already logged in.",
                data: req.user
            });
        }
        else {
            res.send({
                message: "Log in or sign up",
                data: {}
            });
        }
    }
}
exports.authController = new AuthController();
