/**
 *
 * Error Api to define differents errors
 *
 */

export class ApiError extends Error {
    error: number;
    message: string;
    constructor(error: number, message: string) {
        super();
        this.error = error;
        this.message = message;
        Error.captureStackTrace(this);
    }

    /**
     *
     * @param msg: message to send with the error code to the client
     * @returns: new Error {error: xxx, message: '...'}
     */
    static badRequest = (msg: string) => {
        return new ApiError(400, msg);
    };
    static notFound = (msg: string) => {
        return new ApiError(404, msg);
    };
    static internalError = (msg: string) => {
        return new ApiError(500, msg);
    }
}
