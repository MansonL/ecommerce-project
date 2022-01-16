"use strict";
/**
 *
 * Error Api to define differents errors
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(error, message) {
        super();
        this.error = error;
        this.message = message;
        Error.captureStackTrace(this);
    }
}
exports.ApiError = ApiError;
/**
 *
 * @param msg: message to send with the error code to the client
 * @returns: new Error {error: xxx, message: '...'}
 */
ApiError.badRequest = (msg) => {
    return new ApiError(400, msg);
};
ApiError.notFound = (msg) => {
    return new ApiError(404, msg);
};
ApiError.internalError = (msg) => {
    return new ApiError(500, msg);
};
