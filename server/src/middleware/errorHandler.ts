import { ErrorRequestHandler } from "express";
import { logger } from "../services/logger";
// eslint-disable-next-line no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error(
    `Error: ${err.error}. Message: ${err.message}. Stack: ${err.stack}`
  );
  res.status(err.error).json({
    error: err.error,
    message: err.message,
  });
};
