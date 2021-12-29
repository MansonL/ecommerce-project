import { ApiError } from '../api/errorApi';
import { ErrorRequestHandler } from 'express';
import { logger } from '../services/logger';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    logger.error(`Error: ${err.error}. Message: ${err.message}`);
    if (err instanceof ApiError) {
        res.status(err.error).send(err.message);
    } else {
        res.status(500).send(`Something went wrong.`);
    }
};
