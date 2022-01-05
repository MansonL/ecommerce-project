import e, { Router } from 'express';
import { authController } from '../controller/auth';
import { products_controller } from '../controller/products';

export const productsRouter: e.Router = Router();

productsRouter.get('/list', products_controller.getAll);
productsRouter.get('/list/?:id', products_controller.getOne);
productsRouter.get('/list/?:category', products_controller.getByCategory)
productsRouter.get('/query', products_controller.query)
productsRouter.post('/save', authController.isAdmin, products_controller.save);
productsRouter.patch('/update/?:id', authController.isAdmin, products_controller.update);
productsRouter.delete('/delete/?:id', authController.isAdmin, products_controller.delete);
