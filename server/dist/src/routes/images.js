"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imagesRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../controller/auth");
const images_1 = require("../controller/images");
exports.imagesRouter = (0, express_1.Router)();
exports.imagesRouter.post('/upload', auth_1.authController.isAdmin, images_1.images_controller.save);
exports.imagesRouter.delete('/delete', auth_1.authController.isAdmin, images_1.images_controller.delete);
