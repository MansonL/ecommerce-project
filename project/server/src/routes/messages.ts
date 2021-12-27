import e, { Router } from 'express';
import { messagesController } from '../controller/messages';

export const messagesRouter: e.Router = Router();

messagesRouter.get('/list', messagesController.get);
messagesRouter.post('/save', messagesController.save);
