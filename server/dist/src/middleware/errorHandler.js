"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../services/logger");
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error(`Error: ${err.error}. Message: ${err.message}. Stack: ${err.stack}`);
    res.status(err.error).send(err.message);
};
exports.errorHandler = errorHandler;
