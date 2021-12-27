import e, { Router } from 'express';
import { products_controller } from '../controller/products';

export const productsRouter: e.Router = Router();

productsRouter.get('/list', products_controller.getAll);
productsRouter.get('/list/?:id', products_controller.getOne);
productsRouter.get('/test-view/', products_controller.getTest);
productsRouter.get('/query', products_controller.query)
productsRouter.post('/save', products_controller.save);
productsRouter.put('/update/?:id', products_controller.update);
productsRouter.delete('/delete/?:id', products_controller.delete);
