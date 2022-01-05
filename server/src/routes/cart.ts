import express, { Router } from 'express';
import { authController } from '../controller/auth';
import { cart_controller } from '../controller/cart';

export const cartRouter: Router = express.Router();

cartRouter.get('/list', authController.isAdmin, cart_controller.getCarts);
cartRouter.get('/list/:id', authController.isAuthorized, cart_controller.getOneCart);
cartRouter.post('/add/:id', authController.isAuthorized, cart_controller.addToCart);
cartRouter.delete('/delete/:id', authController.isAuthorized, cart_controller.deleteFromCart);
