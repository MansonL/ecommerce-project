import e, { Router } from 'express';
import { messagesController } from '../controller/messages';

export const messagesRouter: e.Router = Router();

messagesRouter.get('/list', messagesController.getAllMessages); // Need to implement isAdmin middleware
messagesRouter.get('/list/:id', messagesController.getUserMessages)
messagesRouter.post('/save', messagesController.save);
