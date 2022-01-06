import e, { Router } from 'express';
import { authController } from '../controller/auth';
import { usersController } from '../controller/users';


export const usersRouter: e.Router = Router();

usersRouter.get('/list', authController.isAdmin, usersController.getAll);
usersRouter.get('/list/?:id', authController.isAdmin, usersController.getOne);
usersRouter.post('/save', usersController.save);
usersRouter.post('/address', authController.isAuthorized , usersController.addAddress);