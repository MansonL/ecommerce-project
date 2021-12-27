import { ApiError } from './errorApi';
import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    console.log(`Inside error handler.`);
    console.log(error)
    if (error instanceof ApiError) {
        res.status(error.error).send(error.message);
    } else {
        res.status(500).send(`Something went wrong.`);
    }
};
