"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../controller/auth");
const images_1 = require("../controller/images");
const products_1 = require("../controller/products");
exports.productsRouter = (0, express_1.Router)();
exports.productsRouter.get('/list', products_1.products_controller.getAll);
exports.productsRouter.get('/list/?:id', products_1.products_controller.getOne);
exports.productsRouter.get('/list/?:category', products_1.products_controller.getByCategory);
exports.productsRouter.get('/query', products_1.products_controller.query);
exports.productsRouter.post('/save', auth_1.authController.isAdmin, products_1.products_controller.save, images_1.images_controller.save);
exports.productsRouter.patch('/update/?:id', auth_1.authController.isAdmin, products_1.products_controller.update);
exports.productsRouter.delete('/delete/?:id', auth_1.authController.isAdmin, products_1.products_controller.delete);
