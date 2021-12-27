import e, { Router } from 'express';
import { usersController } from '../controller/users';


export const usersRouter: e.Router = Router();

usersRouter.get('/list', usersController.getAll);
usersRouter.get('/list/?:id', usersController.getOne);
usersRouter.post('/save', usersController.save);
