import { ErrorRequestHandler } from "express";
import { logger } from "../services/logger";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error(
    `Error: ${err.error}. Message: ${err.message}. Stack: ${err.stack}`
  );
  res.status(err.error).json({
    error: err.error,
    message: err.message
  });
};
