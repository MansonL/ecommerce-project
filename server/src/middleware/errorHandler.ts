import { ErrorRequestHandler } from "express";
import { logger } from "../services/logger";

export const errorHandler: ErrorRequestHandler = (err, req, res) => {
  logger.error(
    `Error: ${err.error}. Message: ${err.message}. Stack: ${err.stack}`
  );
  res.status(err.error).send(err.message);
};
